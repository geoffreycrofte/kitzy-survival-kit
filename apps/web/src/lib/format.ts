import i18n from 'i18next';
import type { Unit } from '@kitzy/core';

const NBSP = ' ';
const numberFormat = new Intl.NumberFormat('fr-LU', { maximumFractionDigits: 1 });

export function unitLabel(unit: Unit, quantity: number): string {
  // Règles françaises : singulier en dessous de 2 (« 1,5 portion »), pluriel ensuite.
  return i18n.t(`units.${unit}`, { count: quantity });
}

/** « 4,5 L », « 27 portions », « 1 pièce » */
export function formatQuantity(quantity: number, unit?: Unit): string {
  const n = numberFormat.format(quantity);
  return unit ? `${n}${NBSP}${unitLabel(unit, quantity)}` : n;
}

/** « 4,5 sur 30 L » */
export function formatProgress(have: number, target: number, unit: Unit): string {
  return `${numberFormat.format(have)} sur ${formatQuantity(target, unit)}`;
}

function toDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  return new Date(y, m - 1, d);
}

/** « lundi 26 octobre », avec l'année si ce n'est pas l'année en cours */
export function formatDay(iso: string, today?: string): string {
  const sameYear = today ? iso.slice(0, 4) === today.slice(0, 4) : false;
  return new Intl.DateTimeFormat('fr-LU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...(sameYear ? {} : { year: 'numeric' }),
  }).format(toDate(iso));
}

/** « 26 octobre 2026 » */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-LU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(toDate(iso));
}
