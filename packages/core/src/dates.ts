/**
 * Dates locales au format `YYYY-MM-DD`, sans fuseau horaire :
 * une date de péremption est un jour du calendrier, pas un instant.
 */

export type IsoDate = string;

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: string): boolean {
  if (!ISO.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number) as [number, number, number];
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function toUtc(value: IsoDate): Date {
  const [y, m, d] = value.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d));
}

function fromUtc(date: Date): IsoDate {
  return date.toISOString().slice(0, 10);
}

/** Date du jour dans le fuseau de l'appareil. */
export function todayLocal(now: Date = new Date()): IsoDate {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(value: IsoDate, days: number): IsoDate {
  const date = toUtc(value);
  date.setUTCDate(date.getUTCDate() + days);
  return fromUtc(date);
}

/** Nombre de jours de `from` à `to` (positif si `to` est après). */
export function daysBetween(from: IsoDate, to: IsoDate): number {
  return Math.round((toUtc(to).getTime() - toUtc(from).getTime()) / 86_400_000);
}

/** N-ième jour de semaine du mois (weekday : 1 = lundi … 7 = dimanche ; nth : 1 = premier, -1 = dernier). */
export function nthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  nth: number,
): IsoDate {
  const jsWeekday = weekday % 7; // dimanche = 0
  if (nth > 0) {
    const first = new Date(Date.UTC(year, month - 1, 1));
    const offset = (jsWeekday - first.getUTCDay() + 7) % 7;
    return fromUtc(new Date(Date.UTC(year, month - 1, 1 + offset + (nth - 1) * 7)));
  }
  const last = new Date(Date.UTC(year, month, 0));
  const offset = (last.getUTCDay() - jsWeekday + 7) % 7;
  return fromUtc(new Date(Date.UTC(year, month - 1, last.getUTCDate() - offset + (nth + 1) * 7)));
}

/** Prochaine occurrence (aujourd'hui compris) d'un jour défini par mois. */
export function nextMonthly(
  from: IsoDate,
  pick: (year: number, month: number) => IsoDate,
): IsoDate {
  const [y, m] = from.split('-').map(Number) as [number, number];
  const thisMonth = pick(y, m);
  if (thisMonth >= from) return thisMonth;
  return m === 12 ? pick(y + 1, 1) : pick(y, m + 1);
}
