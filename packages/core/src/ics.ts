/**
 * Export calendrier (.ics, RFC 5545) : fonctionne hors-ligne, sans serveur,
 * sur iOS comme sur Android (§ 6.2 du plan).
 */
import type { CountryProfile } from './country';
import type { IsoDate } from './dates';
import { addDays } from './dates';
import type { Reminder } from './reminders';

export interface IcsOptions {
  country?: CountryProfile;
  /** Instant de génération, pour DTSTAMP */
  now?: Date;
  /** Heure de la notification pour les événements d'une journée (0–23) */
  alertHour?: number;
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

function describe(r: Reminder): { summary: string; description: string } {
  switch (r.kind) {
    case 'expiry': {
      const q = r.quantity !== undefined ? ` (${r.quantity})` : '';
      return r.expiryType === 'dlc'
        ? {
            summary: `Kitzy : ${r.title}${q}, date limite de consommation`,
            description:
              'Date limite de consommation. À consommer avant, puis à remplacer dans ta réserve.',
          }
        : {
            summary: `Kitzy : ${r.title}${q}, à consommer de préférence avant ce jour`,
            description:
              'Date de durabilité minimale. Mange-le bientôt et rachète-en pour ta réserve.',
          };
    }
    case 'battery':
      return {
        summary: `Kitzy : recharger ${r.title}`,
        description:
          'Recharge ou teste cet appareil pour qu’il soit prêt le jour où tu en as besoin.',
      };
    case 'monthly-check':
      return {
        summary: 'Kitzy : mini-check du mois',
        description: 'Deux minutes pour vérifier ta réserve, pendant le test des sirènes.',
      };
    case 'review':
      return {
        summary: 'Kitzy : grand check-up du kit',
        description:
          'Contrôle les dates, recharge les appareils et remplace les piles des détecteurs.',
      };
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
    const { summary, description } = describe(r);
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
