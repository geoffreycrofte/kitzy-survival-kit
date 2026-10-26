/**
 * Surveillance des liens (§ 9 du plan) : la logique pure, testée.
 * Le script `scripts/check-links.ts` s'occupe des requêtes réseau.
 */
import type { LinkState, LinkStatus, LinkStatusMap } from './products';

export const LINK_CHECK_AGENT =
  'KitzyLinkCheck/1.0 (+https://github.com/geoffreycrofte/kitzy-survival-kit)';

/* ---------- robots.txt ---------- */

interface RobotsRule {
  allow: boolean;
  path: string;
}

/**
 * Règles qui s'appliquent à notre robot : le groupe qui le nomme,
 * sinon le groupe `*`. La règle la plus longue l'emporte (RFC 9309).
 */
export function parseRobots(text: string, agent = 'KitzyLinkCheck'): RobotsRule[] {
  const groups: Array<{ agents: string[]; rules: RobotsRule[] }> = [];
  let current: { agents: string[]; rules: RobotsRule[] } | null = null;
  let lastWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    const match = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(line);
    if (!match) continue;
    const key = match[1]!.toLowerCase();
    const value = match[2]!.trim();
    if (key === 'user-agent') {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!current) continue;
    if (key === 'allow' || key === 'disallow') {
      if (value === '') continue;
      current.rules.push({ allow: key === 'allow', path: value });
    }
  }
  const own = groups.filter((g) =>
    g.agents.some((a) => agent.toLowerCase().includes(a) && a !== '*'),
  );
  const chosen = own.length ? own : groups.filter((g) => g.agents.includes('*'));
  return chosen.flatMap((g) => g.rules);
}

function ruleMatches(rulePath: string, path: string): boolean {
  const anchored = rulePath.endsWith('$');
  const pattern = (anchored ? rulePath.slice(0, -1) : rulePath)
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${pattern}${anchored ? '$' : ''}`).test(path);
}

/** Vrai si le chemin (avec sa requête) peut être visité. */
export function robotsAllows(rules: readonly RobotsRule[], pathWithQuery: string): boolean {
  let best: RobotsRule | null = null;
  for (const rule of rules) {
    if (!ruleMatches(rule.path, pathWithQuery)) continue;
    if (
      !best ||
      rule.path.length > best.path.length ||
      (rule.path.length === best.path.length && rule.allow)
    ) {
      best = rule;
    }
  }
  return best ? best.allow : true;
}

/** Détail d'un lien que robots.txt interdit de visiter : jamais une alerte à lui seul. */
export const ROBOTS_DETAIL = 'robots.txt';

/* ---------- Classement d'une réponse ---------- */

export interface CheckOutcome {
  /** Ce que la réponse laisse penser, avant la règle des deux passages. */
  verdict: LinkState;
  detail: string;
}

/**
 * - 2xx : ok (ou indisponible si la page produit le dit en JSON-LD) ;
 * - 404 et 410 : cassé ;
 * - redirection d'une page produit vers l'accueil : produit retiré ;
 * - le reste (403, 429, 5xx, réseau) : inconnu, on ne conclut rien.
 */
export function classify(input: {
  status?: number;
  error?: string;
  requestedPath: string;
  finalPath?: string;
  body?: string;
  isProductPage?: boolean;
}): CheckOutcome {
  if (input.error) return { verdict: 'unknown', detail: input.error };
  const status = input.status ?? 0;
  if (status === 404 || status === 410) return { verdict: 'broken', detail: `HTTP ${status}` };
  if (status < 200 || status >= 300) return { verdict: 'unknown', detail: `HTTP ${status}` };
  if (input.isProductPage && input.finalPath === '/' && input.requestedPath !== '/') {
    return { verdict: 'broken', detail: 'Redirigé vers l’accueil' };
  }
  if (
    input.isProductPage &&
    input.body &&
    /"availability"\s*:\s*"(https?:\/\/schema\.org\/)?(OutOfStock|Discontinued|SoldOut)"/.test(
      input.body,
    )
  ) {
    return { verdict: 'unavailable', detail: 'Indisponible (données de la page)' };
  }
  return { verdict: 'ok', detail: `HTTP ${status}` };
}

/** Un échec isolé reste « inconnu » : il faut deux passages consécutifs pour conclure. */
export function nextStatus(
  previous: LinkStatus | undefined,
  outcome: CheckOutcome,
  today: string,
): LinkStatus {
  if (outcome.verdict === 'ok') return { status: 'ok', lastChecked: today, failures: 0 };
  if (outcome.verdict === 'unknown') {
    return {
      status: previous?.status ?? 'unknown',
      lastChecked: today,
      failures: previous?.failures ?? 0,
    };
  }
  const failures = (previous?.failures ?? 0) + 1;
  return { status: failures >= 2 ? outcome.verdict : 'unknown', lastChecked: today, failures };
}

export interface ReportLine {
  url: string;
  label: string;
  status: LinkState;
  detail: string;
}

/** Rapport en Markdown pour l'issue récapitulative. Vide si tout va bien. */
export function linkReport(lines: readonly ReportLine[], today: string): string {
  const problems = lines.filter((l) => l.status === 'broken' || l.status === 'unavailable');
  const skipped = lines.filter((l) => l.status === 'unknown' && l.detail === ROBOTS_DETAIL);
  const unsure = lines.filter((l) => l.status === 'unknown' && l.detail !== ROBOTS_DETAIL);
  if (problems.length === 0 && unsure.length === 0) return '';
  const row = (l: ReportLine) => `- [ ] ${l.label} : ${l.url} (${l.detail})`;
  const parts = [`Vérification du ${today}.`, ''];
  if (problems.length) {
    parts.push(
      '## À corriger',
      '',
      'Ces liens sont masqués dans l’app (offres) ou à remplacer (guide).',
      '',
      ...problems.map(row),
      '',
    );
  }
  if (unsure.length) {
    parts.push(
      '## À vérifier à la main',
      '',
      'Pas de conclusion possible automatiquement (robots.txt, blocage ou erreur passagère).',
      '',
      ...unsure.map(row),
      '',
    );
  }
  if (skipped.length) {
    parts.push(
      `<details><summary>${skipped.length === 1 ? '1 lien non visité' : `${skipped.length} liens non visités`} (robots.txt du marchand) : revue manuelle trimestrielle</summary>`,
      '',
      ...skipped.map(row),
      '',
      '</details>',
      '',
    );
  }
  return parts.join('\n');
}

export function sortStatus(map: LinkStatusMap): LinkStatusMap {
  return Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
}
