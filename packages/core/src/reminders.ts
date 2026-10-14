/**
 * Moteur de rappels (§ 6 du plan). Pur et testable : les adaptateurs
 * (affichage, calendrier, notifications) consomment sa sortie.
 */
import type { ItemTemplate } from './catalog';
import type { CountryProfile } from './country';
import { addDays, daysBetween, nextMonthly, nthWeekdayOfMonth, type IsoDate } from './dates';
import type { InventoryItem, Kit } from './inventory';

export type ReminderKind = 'expiry' | 'battery' | 'monthly-check' | 'review';

export interface Reminder {
  id: string;
  kind: ReminderKind;
  date: IsoDate;
  title: string;
  /** DLC (stricte) ou DDM (indicative), pour les péremptions */
  expiryType?: 'dlc' | 'ddm';
  quantity?: number;
  kitId?: string;
  itemId?: string;
  /** Jours avant la date où prévenir (calendrier, notifications) */
  alertDaysBefore: number[];
}

export interface ReminderInput {
  catalog: readonly ItemTemplate[];
  kits: readonly Kit[];
  items: readonly InventoryItem[];
  country?: CountryProfile;
  today: IsoDate;
}

function itemName(item: InventoryItem, catalog: readonly ItemTemplate[]): string {
  if (item.templateId)
    return catalog.find((t) => t.id === item.templateId)?.name.fr ?? item.templateId;
  return item.customName ?? '';
}

/** Les deux revues annuelles, calées sur les changements d'heure européens. */
export function nextReview(today: IsoDate): IsoDate {
  const year = Number(today.slice(0, 4));
  const candidates = [
    nthWeekdayOfMonth(year, 3, 7, -1),
    nthWeekdayOfMonth(year, 10, 7, -1),
    nthWeekdayOfMonth(year + 1, 3, 7, -1),
  ];
  return candidates.find((d) => d >= today) ?? candidates[2]!;
}

export function nextMonthlyCheck(today: IsoDate, country?: CountryProfile): IsoDate {
  const test = country?.sirenTest;
  const weekday = test?.weekday ?? 1;
  const nth = test?.nth ?? 1;
  return nextMonthly(today, (y, m) => nthWeekdayOfMonth(y, m, weekday, nth));
}

/**
 * Tous les rappels à venir (et les péremptions déjà passées encore en stock),
 * triés par date.
 */
export function buildReminders(input: ReminderInput): Reminder[] {
  const reminders: Reminder[] = [];

  for (const item of input.items) {
    const name = itemName(item, input.catalog);
    // Lots regroupés par date et type
    const groups = new Map<string, { date: IsoDate; type: 'dlc' | 'ddm'; quantity: number }>();
    for (const lot of item.lots) {
      if (!lot.expiry) continue;
      const type = lot.expiryType ?? 'ddm';
      const key = `${lot.expiry}-${type}`;
      const group = groups.get(key) ?? { date: lot.expiry, type, quantity: 0 };
      group.quantity += lot.quantity;
      groups.set(key, group);
    }
    for (const g of groups.values()) {
      reminders.push({
        id: `expiry-${item.id}-${g.date}-${g.type}`,
        kind: 'expiry',
        date: g.date,
        title: name,
        expiryType: g.type,
        quantity: Math.round(g.quantity * 1000) / 1000,
        kitId: item.kitId,
        itemId: item.id,
        alertDaysBefore: g.type === 'dlc' ? [30, 7, 0] : [30, 0],
      });
    }
    if (item.battery) {
      reminders.push({
        id: `battery-${item.id}`,
        kind: 'battery',
        date: addDays(item.battery.lastChargedAt, item.battery.intervalDays),
        title: name,
        kitId: item.kitId,
        itemId: item.id,
        alertDaysBefore: [0],
      });
    }
  }

  reminders.push({
    id: 'monthly-check',
    kind: 'monthly-check',
    date: nextMonthlyCheck(input.today, input.country),
    title: 'Mini-check du mois',
    alertDaysBefore: [0],
  });
  reminders.push({
    id: 'review',
    kind: 'review',
    date: nextReview(input.today),
    title: 'Grand check-up du kit',
    alertDaysBefore: [7, 0],
  });

  return reminders.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
}

/** Rappels à afficher maintenant : en retard ou dans les `horizonDays` jours. */
export function upcoming(
  reminders: readonly Reminder[],
  today: IsoDate,
  horizonDays = 45,
): Reminder[] {
  return reminders.filter((r) => daysBetween(today, r.date) <= horizonDays);
}

/** Vrai si la date du rappel est passée. */
export function isOverdue(reminder: Reminder, today: IsoDate): boolean {
  return reminder.date < today;
}
