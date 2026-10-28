/**
 * Ce que l'app a le droit d'envoyer, et rien de plus. Tout le reste est refusé (400).
 *
 * Contrat (voir apps/web/src/lib/webpush.ts) :
 *   POST   /subscribe  { subscription: { endpoint, … }, schedule: [{ id, date }], timezone }
 *   DELETE /subscribe  { endpoint }
 *
 * On ne garde que l'adresse d'abonnement, les dates et le fuseau : ni les clés de chiffrement
 * de l'abonnement (le push est vide), ni les identifiants.
 */
import { isTimeZone } from './time.ts';

export const MAX_DATES = 500;

/** Les services push des navigateurs. Une autre adresse ferait de nous un relais de requêtes. */
const EXACT_HOSTS = ['fcm.googleapis.com', 'android.googleapis.com'];
const HOST_SUFFIXES = ['push.services.mozilla.com', 'push.apple.com', 'notify.windows.com'];

export function isPushEndpoint(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 1024) return false;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:' || url.port || url.username || url.password) return false;
  const host = url.hostname;
  return (
    EXACT_HOSTS.includes(host) ||
    HOST_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`))
  );
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export interface Subscribe {
  endpoint: string;
  timezone: string;
  dates: string[];
}

export function parseSubscribe(body: unknown): Subscribe | null {
  if (!isObject(body) || !isObject(body.subscription)) return null;
  const { endpoint } = body.subscription;
  const { schedule, timezone } = body;
  if (!isPushEndpoint(endpoint)) return null;
  if (typeof timezone !== 'string' || timezone.length > 64 || !isTimeZone(timezone)) return null;
  if (!Array.isArray(schedule) || schedule.length > MAX_DATES) return null;
  const dates = new Set<string>();
  for (const entry of schedule) {
    if (!isObject(entry) || typeof entry.id !== 'string' || !/^[0-9a-f]{8}$/.test(entry.id)) {
      return null;
    }
    if (!isIsoDate(entry.date)) return null;
    dates.add(entry.date);
  }
  return { endpoint, timezone, dates: [...dates].sort() };
}

export function parseUnsubscribe(body: unknown): string | null {
  return isObject(body) && isPushEndpoint(body.endpoint) ? body.endpoint : null;
}
