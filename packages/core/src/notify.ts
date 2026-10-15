/**
 * Notifications (§ 6 du plan) : quels rappels signaler aujourd'hui,
 * et comment les regrouper en une seule notification.
 * Utilisé par le service worker (Periodic Background Sync) et,
 * plus tard, par l'app Expo et le service Web Push.
 */
import { addDays, daysBetween, type IsoDate } from './dates';
import type { Reminder } from './reminders';

/** Une alerte en retard est rappelée une fois par semaine, pas tous les jours. */
const OVERDUE_EVERY_DAYS = 7;

/** Rappels à signaler le jour `today`. */
export function dueOn(reminders: readonly Reminder[], today: IsoDate): Reminder[] {
  return reminders.filter((r) => {
    const before = daysBetween(today, r.date);
    if (before >= 0) return r.alertDaysBefore.includes(before);
    // En retard : seulement ce qui reste à faire (péremption en stock, recharge oubliée).
    if (r.kind !== 'expiry' && r.kind !== 'battery') return false;
    return -before % OVERDUE_EVERY_DAYS === 0;
  });
}

export interface Digest {
  title: string;
  body: string;
  /** Une seule notification Kitzy à la fois : la nouvelle remplace l'ancienne. */
  tag: string;
}

function line(r: Reminder, today: IsoDate): string {
  const days = daysBetween(today, r.date);
  const when =
    days < 0
      ? 'en retard'
      : days === 0
        ? 'aujourd’hui'
        : days === 1
          ? 'demain'
          : `dans ${days} jours`;
  switch (r.kind) {
    case 'expiry':
      return r.expiryType === 'dlc'
        ? `${r.title}\u202f: date limite ${when}`
        : `${r.title}\u202f: à consommer de préférence, ${when}`;
    case 'battery':
      return `Recharger «\u202f${r.title}\u202f», ${when}`;
    case 'monthly-check':
      return 'Mini-check du mois, pendant le test des sirènes';
    case 'review':
      return days === 0 ? 'Grand check-up du kit aujourd’hui' : `Grand check-up du kit ${when}`;
    case 'plan-review':
      return 'Relire et mettre à jour ton plan d’urgence';
  }
}

/** Les rappels du même jour sont regroupés : une notification, pas dix. */
export function digest(due: readonly Reminder[], today: IsoDate): Digest | null {
  if (due.length === 0) return null;
  const tag = 'kitzy-rappels';
  if (due.length === 1) return { title: 'Kitzy', body: line(due[0]!, today), tag };
  const lines = due.slice(0, 3).map((r) => line(r, today));
  const more = due.length - lines.length;
  return {
    title: `Kitzy\u202f: ${due.length} rappels pour ton kit`,
    body: lines.join('\n') + (more > 0 ? `\net ${more} de plus` : ''),
    tag,
  };
}

/** Ne notifier qu'une fois par jour, même si le navigateur relance la vérification. */
export function shouldNotify(lastNotified: IsoDate | undefined, today: IsoDate): boolean {
  return !lastNotified || lastNotified < today;
}

/* ---------- Web Push (service VPS, § 6.4) ---------- */

export interface PushEntry {
  /** Identifiant opaque : ne révèle rien du contenu de l'inventaire. */
  id: string;
  date: IsoDate;
}

/** Empreinte FNV-1a 32 bits, en hexadécimal. Suffit pour rendre l'identifiant opaque. */
function fnv1a(value: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Les dates d'alerte à confier au service Web Push : uniquement des dates
 * et des identifiants opaques (salés par appareil), jamais de noms d'articles.
 */
export function pushSchedule(
  reminders: readonly Reminder[],
  today: IsoDate,
  salt: string,
  horizonDays = 400,
): PushEntry[] {
  const dates = new Set<IsoDate>();
  for (const r of reminders) {
    for (const before of r.alertDaysBefore) {
      const date = addDays(r.date, -before);
      const ahead = daysBetween(today, date);
      if (ahead >= 0 && ahead <= horizonDays) dates.add(date);
    }
  }
  return [...dates].sort().map((date) => ({ id: fnv1a(`${salt}:${date}`), date }));
}
