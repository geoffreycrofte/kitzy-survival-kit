import i18n from 'i18next';
import type { Unit } from '@kitzy/core';
import { currentIntl } from './locale';

const NBSP = ' ';
const numberFormats = new Map<string, Intl.NumberFormat>();

function formatNumber(n: number): string {
  const locale = currentIntl();
  let format = numberFormats.get(locale);
  if (!format) {
    format = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
    numberFormats.set(locale, format);
  }
  return format.format(n);
}

export function unitLabel(unit: Unit, quantity: number): string {
  // Pluriel selon la langue (en français, singulier en dessous de 2 : « 1,5 portion »).
  return i18n.t(`units.${unit}`, { count: quantity });
}

/** « 4,5 L », « 27 portions », « 1 pièce » */
export function formatQuantity(quantity: number, unit?: Unit): string {
  const n = formatNumber(quantity);
  return unit ? `${n}${NBSP}${unitLabel(unit, quantity)}` : n;
}

/** « 4,5 sur 30 L » */
export function formatProgress(have: number, target: number, unit: Unit): string {
  return i18n.t('units.progress', {
    have: formatNumber(have),
    target: formatQuantity(target, unit),
  });
}

function toDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  return new Date(y, m - 1, d);
}

/** « lundi 26 octobre », avec l'année si ce n'est pas l'année en cours */
export function formatDay(iso: string, today?: string): string {
  const sameYear = today ? iso.slice(0, 4) === today.slice(0, 4) : false;
  return new Intl.DateTimeFormat(currentIntl(), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...(sameYear ? {} : { year: 'numeric' }),
  }).format(toDate(iso));
}

/** « 26 octobre 2026 » */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(currentIntl(), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(toDate(iso));
}
