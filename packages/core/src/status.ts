/**
 * Quantités cibles et état de chaque article.
 */
import type { ItemTemplate, KitType, QuantityRule } from './catalog';
import { addDays, daysBetween, type IsoDate } from './dates';
import { computeTargets, countMembers, type Household } from './household';
import type { InventoryItem, Lot } from './inventory';

/** Jours avant la date à partir desquels un lot est « bientôt » à consommer. */
export const SOON_DAYS = 30;
/** Jours avant l'échéance d'une recharge à partir desquels on prévient. */
export const BATTERY_SOON_DAYS = 7;

export function ruleFor(template: ItemTemplate, kitType: KitType): QuantityRule | undefined {
  if (kitType === 'home') return template.home;
  if (kitType === 'go-bag') return template.bag;
  return undefined;
}

/** Quantité cible d'une règle pour ce foyer. 0 : article non pertinent (ex. pas d'animal). */
export function targetFor(rule: QuantityRule, household: Household): number {
  const c = countMembers(household);
  let value: number;
  switch (rule.per) {
    case 'household':
      value = rule.amount;
      break;
    case 'person':
      value = rule.amount * c.people;
      break;
    case 'personDay':
      value = rule.amount * c.people * c.days;
      break;
    case 'meal':
      value = rule.amount * c.eaters * c.days;
      break;
    case 'water':
      value = rule.amount * computeTargets(household).waterLiters;
      break;
    case 'pet':
      value = rule.amount * c.pets;
      break;
    case 'petDay':
      value = rule.amount * c.pets * c.days;
      break;
    case 'infant':
      value = rule.amount * c.infants * c.days;
      break;
  }
  return Math.round(value * 10) / 10;
}

export type LotState = 'ok' | 'soon' | 'expired' | 'past-best-before';

export function lotState(lot: Lot, today: IsoDate): LotState {
  if (!lot.expiry) return 'ok';
  const left = daysBetween(today, lot.expiry);
  if (left < 0) return lot.expiryType === 'dlc' ? 'expired' : 'past-best-before';
  if (left <= SOON_DAYS) return 'soon';
  return 'ok';
}

/** Lots triés du plus ancien au plus récent (premier périmé, premier consommé). */
export function sortLotsFifo(lots: readonly Lot[]): Lot[] {
  return [...lots].sort((a, b) => {
    if (a.expiry && b.expiry) return a.expiry.localeCompare(b.expiry);
    if (a.expiry) return -1;
    if (b.expiry) return 1;
    return a.addedAt.localeCompare(b.addedAt);
  });
}

/** Retire `quantity` en commençant par le lot qui périme le plus tôt. */
export function consumeFifo(lots: readonly Lot[], quantity: number): Lot[] {
  let left = quantity;
  const result: Lot[] = [];
  for (const lot of sortLotsFifo(lots)) {
    if (left <= 0) {
      result.push(lot);
      continue;
    }
    const used = Math.min(lot.quantity, left);
    left -= used;
    const remaining = Math.round((lot.quantity - used) * 1000) / 1000;
    if (remaining > 0) result.push({ ...lot, quantity: remaining });
  }
  return result;
}

export type BatteryState = 'ok' | 'soon' | 'due';

export interface ItemStatus {
  target: number;
  /** Quantité totale enregistrée */
  quantity: number;
  /** Quantité utilisable (hors lots dont la DLC est passée) */
  usable: number;
  /** Part de la cible couverte, entre 0 et 1 */
  coverage: number;
  expiredQuantity: number;
  soonQuantity: number;
  /** Date la plus proche parmi les lots encore utilisables */
  nextExpiry?: IsoDate;
  battery?: { state: BatteryState; dueOn: IsoDate };
  /** Synthèse pour l'affichage */
  state: 'missing' | 'partial' | 'complete';
  needsAttention: boolean;
}

export function itemStatus(
  item: InventoryItem | undefined,
  target: number,
  today: IsoDate,
): ItemStatus {
  const lots = item?.lots ?? [];
  let quantity = 0;
  let usable = 0;
  let expiredQuantity = 0;
  let soonQuantity = 0;
  let nextExpiry: IsoDate | undefined;
  for (const lot of lots) {
    const state = lotState(lot, today);
    quantity += lot.quantity;
    if (state === 'expired') {
      expiredQuantity += lot.quantity;
      continue;
    }
    usable += lot.quantity;
    if (state === 'soon' || state === 'past-best-before') soonQuantity += lot.quantity;
    if (lot.expiry && (!nextExpiry || lot.expiry < nextExpiry)) nextExpiry = lot.expiry;
  }

  let battery: ItemStatus['battery'];
  if (item?.battery) {
    const dueOn = addDays(item.battery.lastChargedAt, item.battery.intervalDays);
    const left = daysBetween(today, dueOn);
    battery = { dueOn, state: left <= 0 ? 'due' : left <= BATTERY_SOON_DAYS ? 'soon' : 'ok' };
  }

  const effectiveTarget = item?.targetOverride ?? target;
  const coverage = effectiveTarget <= 0 ? 1 : Math.min(1, usable / effectiveTarget);
  const state = usable <= 0 ? 'missing' : coverage >= 1 ? 'complete' : 'partial';
  return {
    target: effectiveTarget,
    quantity: round(quantity),
    usable: round(usable),
    coverage,
    expiredQuantity: round(expiredQuantity),
    soonQuantity: round(soonQuantity),
    nextExpiry,
    battery,
    state,
    needsAttention: expiredQuantity > 0 || soonQuantity > 0 || battery?.state === 'due',
  };
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}
