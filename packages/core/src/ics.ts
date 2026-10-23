/**
 * Export calendrier (.ics, RFC 5545) : fonctionne hors-ligne, sans serveur,
 * sur iOS comme sur Android (§ 6.2 du plan).
 */
import type { CountryProfile } from './country';
import type { IsoDate } from './dates';
import { addDays } from './dates';
import { fill } from './i18n/fill';
import { fr, type Messages } from './i18n/fr';
import type { Reminder } from './reminders';

export interface IcsOptions {
  country?: CountryProfile;
  /** Instant de génération, pour DTSTAMP */
  now?: Date;
  /** Heure de la notification pour les événements d'une journée (0–23) */
  alertHour?: number;
  /** Textes des événements (français par défaut). */
  texts?: IcsTexts;
}

function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** Taille en octets UTF-8 d'une chaîne. */
export function utf8Length(text: string): number {
  let size = 0;
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    size += code < 0x80 ? 1 : code < 0x800 ? 2 : code < 0x10000 ? 3 : 4;
  }
  return size;
}

/** Plie les lignes à 75 octets (RFC 5545 § 3.1). */
function fold(line: string): string {
  if (utf8Length(line) <= 75) return line;
  const parts: string[] = [];
  let current = '';
  let size = 0;
  for (const char of line) {
    const bytes = utf8Length(char);
    const limit = parts.length === 0 ? 75 : 74;
    if (size + bytes > limit) {
      parts.push(current);
      current = '';
      size = 0;
    }
    current += char;
    size += bytes;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

function compact(date: IsoDate): string {
  return date.replace(/-/g, '');
}

function stamp(now: Date): string {
  return now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

/** Durée ISO 8601 pour une alarme à `hour` heures, `days` jours avant le début de la journée. */
function trigger(daysBefore: number, hour: number): string {
  if (daysBefore === 0) return `PT${hour}H`;
  return `-P${daysBefore - 1}DT${24 - hour}H`;
}

export type IcsTexts = Messages['system']['ics'];

function describe(r: Reminder, texts: IcsTexts): { summary: string; description: string } {
  switch (r.kind) {
    case 'expiry': {
      const values = {
        title: r.title,
        quantity: r.quantity !== undefined ? ` (${r.quantity})` : '',
      };
      return r.expiryType === 'dlc'
        ? { summary: fill(texts.dlcSummary, values), description: texts.dlcDescription }
        : { summary: fill(texts.ddmSummary, values), description: texts.ddmDescription };
    }
    case 'battery':
      return {
        summary: fill(texts.batterySummary, { title: r.title }),
        description: texts.batteryDescription,
      };
    case 'monthly-check':
      return { summary: texts.monthlySummary, description: texts.monthlyDescription };
    case 'review':
      return { summary: texts.reviewSummary, description: texts.reviewDescription };
    case 'plan-review':
      return { summary: texts.planSummary, description: texts.planDescription };
  }
}

export function buildIcs(reminders: readonly Reminder[], options: IcsOptions = {}): string {
  const now = options.now ?? new Date();
  const hour = options.alertHour ?? 9;
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kitzy//Kit 72h//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Kitzy',
  ];

  for (const r of reminders) {
    const { summary, description } = describe(r, options.texts ?? fr.system.ics);
    lines.push('BEGIN:VEVENT', `UID:${r.id}@kitzy.lu`, `DTSTAMP:${stamp(now)}`);
    if (r.kind === 'monthly-check' && options.country?.sirenTest) {
      const t = options.country.sirenTest;
      const time = t.time.replace(':', '') + '00';
      const day = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'][t.weekday - 1];
      lines.push(
        `DTSTART:${compact(r.date)}T${time}`,
        'DURATION:PT15M',
        `RRULE:FREQ=MONTHLY;BYDAY=${t.nth}${day}`,
      );
    } else if (r.kind === 'review') {
      lines.push(
        `DTSTART;VALUE=DATE:${compact(r.date)}`,
        `DTEND;VALUE=DATE:${compact(addDays(r.date, 1))}`,
        'RRULE:FREQ=YEARLY;BYMONTH=3,10;BYDAY=-1SU',
      );
    } else {
      lines.push(
        `DTSTART;VALUE=DATE:${compact(r.date)}`,
        `DTEND;VALUE=DATE:${compact(addDays(r.date, 1))}`,
      );
    }
    lines.push(`SUMMARY:${escapeText(summary)}`, `DESCRIPTION:${escapeText(description)}`);
    const timed = r.kind === 'monthly-check' && options.country?.sirenTest;
    for (const days of r.alertDaysBefore) {
      lines.push(
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:${escapeText(summary)}`,
        `TRIGGER:${timed ? (days === 0 ? 'PT0M' : `-P${days}D`) : trigger(days, hour)}`,
        'END:VALARM',
      );
    }
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}
