/**
 * Vérifie les liens sortants de Kitzy (§ 9 du plan) :
 * offres d'achat, liens du guide, gestes et dons.
 *
 * - User-Agent honnête, robots.txt respecté, une requête à la fois par site ;
 * - un lien n'est déclaré cassé ou indisponible qu'après deux passages ;
 * - met à jour `packages/core/src/data/link-status.json` et écrit `link-report.md`
 *   (vide si tout va bien) pour l'issue récapitulative.
 *
 * Usage : pnpm check-links
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  DONATION_LINKS,
  GUIDE,
  LINK_CHECK_AGENT,
  MERCHANTS,
  PRODUCTS,
  ROBOTS_DETAIL,
  TASKS,
  classify,
  linkReport,
  nextStatus,
  offerBaseUrl,
  parseRobots,
  robotsAllows,
  sortStatus,
  todayLocal,
  type CheckOutcome,
  type LinkStatusMap,
  type ReportLine,
} from '../packages/core/src/index';

const ROOT = resolve(import.meta.dirname, '..');
const STATUS_FILE = resolve(ROOT, 'packages/core/src/data/link-status.json');
const REPORT_FILE = resolve(ROOT, 'link-report.md');
const TIMEOUT_MS = 15_000;
const DELAY_PER_HOST_MS = 1_500;

interface Target {
  url: string;
  label: string;
  /** Page produit précise : on y cherche aussi la disponibilité. */
  productPage: boolean;
}

function targets(): Target[] {
  const list: Target[] = [];
  for (const product of PRODUCTS) {
    for (const offer of product.offers) {
      list.push({
        url: offerBaseUrl(offer),
        label: `${product.name} (${MERCHANTS[offer.merchant].name})`,
        productPage: Boolean(offer.url),
      });
    }
  }
  for (const page of GUIDE) {
    for (const link of page.links ?? []) {
      list.push({
        url: link.url,
        label: `Guide « ${page.title} » : ${link.label}`,
        productPage: false,
      });
    }
  }
  for (const task of TASKS) {
    if (task.url)
      list.push({ url: task.url, label: `Geste « ${task.title} »`, productPage: false });
  }
  list.push({ url: DONATION_LINKS.paypal, label: 'Don PayPal', productPage: false });
  list.push({ url: DONATION_LINKS.revolut, label: 'Don Revolut', productPage: false });
  const seen = new Set<string>();
  return list.filter((t) => !seen.has(t.url) && seen.add(t.url));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithTimeout(url: string): Promise<Response> {
  return fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': LINK_CHECK_AGENT, Accept: 'text/html,*/*;q=0.8' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

const robotsCache = new Map<string, ReturnType<typeof parseRobots>>();

async function robotsFor(origin: string) {
  const cached = robotsCache.get(origin);
  if (cached) return cached;
  let rules: ReturnType<typeof parseRobots> = [];
  try {
    const response = await fetchWithTimeout(`${origin}/robots.txt`);
    if (response.ok) rules = parseRobots(await response.text());
  } catch {
    // robots.txt injoignable : on considère que rien n'est interdit, comme le prévoit la RFC 9309.
  }
  robotsCache.set(origin, rules);
  return rules;
}

async function check(target: Target): Promise<CheckOutcome> {
  const url = new URL(target.url);
  const rules = await robotsFor(url.origin);
  if (!robotsAllows(rules, url.pathname + url.search)) {
    return { verdict: 'unknown', detail: ROBOTS_DETAIL };
  }
  try {
    const response = await fetchWithTimeout(target.url);
    const body = target.productPage ? await response.text() : undefined;
    if (!target.productPage) await response.body?.cancel();
    return classify({
      status: response.status,
      requestedPath: url.pathname,
      finalPath: new URL(response.url).pathname,
      body,
      isProductPage: target.productPage,
    });
  } catch (error) {
    // `fetch failed` cache la vraie raison dans `cause` (DNS, TLS, délai…).
    const cause = (error as { cause?: { code?: string } }).cause?.code;
    const detail = cause ?? (error instanceof Error ? error.message : 'Erreur réseau');
    return { verdict: 'unknown', detail };
  }
}

async function main() {
  const previous = JSON.parse(await readFile(STATUS_FILE, 'utf8')) as LinkStatusMap;
  const today = todayLocal();
  const list = targets();

  // Une file par site : jamais deux requêtes en même temps chez le même marchand.
  const byHost = new Map<string, Target[]>();
  for (const target of list) {
    const host = new URL(target.url).host;
    byHost.set(host, [...(byHost.get(host) ?? []), target]);
  }

  const next: LinkStatusMap = {};
  const lines: ReportLine[] = [];
  await Promise.all(
    [...byHost.values()].map(async (queue) => {
      for (const [i, target] of queue.entries()) {
        if (i > 0) await sleep(DELAY_PER_HOST_MS);
        const outcome = await check(target);
        const status = nextStatus(previous[target.url], outcome, today);
        next[target.url] = status;
        lines.push({
          url: target.url,
          label: target.label,
          status: status.status,
          detail: outcome.detail,
        });
        console.log(`${status.status.padEnd(11)} ${outcome.detail.padEnd(24)} ${target.url}`);
      }
    }),
  );

  await writeFile(STATUS_FILE, JSON.stringify(sortStatus(next), null, 2) + '\n');
  lines.sort((a, b) => a.label.localeCompare(b.label, 'fr'));
  await writeFile(REPORT_FILE, linkReport(lines, today));
  const count = (s: string) => lines.filter((l) => l.status === s).length;
  console.log(
    `\n${list.length} liens : ${count('ok')} ok, ${count('broken')} cassés, ${count('unavailable')} indisponibles, ${count('unknown')} inconnus.`,
  );
}

await main();
