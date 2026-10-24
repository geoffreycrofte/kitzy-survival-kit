/**
 * Lecture des données locales, sans React : partagée par l'app et le service worker.
 */
import {
  CATALOG,
  LU,
  buildReminders,
  isPlanLock,
  planInfo,
  planReviewDate,
  type AchievementsDone,
  type ActivitiesDone,
  type BarcodeLink,
  type EmergencyPlan,
  type Household,
  type InventoryItem,
  type IsoDate,
  type Kit,
  type KitLevel,
  type Locale,
  type PlanInfo,
  type PlanLock,
  type Reminder,
  type Sealed,
  type ShoppingExtra,
  type TaskDone,
} from '@kitzy/core';
import { db } from './db';

export const COUNTRY = LU;

export interface AppData {
  household: Household | null;
  kits: Kit[];
  items: InventoryItem[];
  extras: ShoppingExtra[];
  bought: string[];
  level: KitLevel;
  /** Le plan en clair : `null` s'il n'existe pas, ou s'il est verrouillé et pas encore ouvert. */
  plan: EmergencyPlan | null;
  /** Avancement et dates du plan, lisibles même verrouillé. */
  planInfo: PlanInfo;
  /** Verrou du plan sur cet appareil, et le plan chiffré qu'il protège. */
  planLock: PlanLock | null;
  planSealed: Sealed | null;
  /** `locked` : verrouillé, à déverrouiller ; `opening` : en cours de déchiffrement. */
  planState: 'open' | 'locked' | 'opening';
  tasks: TaskDone;
  barcodes: BarcodeLink[];
  achievements: AchievementsDone;
  activities: ActivitiesDone;
}

const EMPTY: AppData = {
  household: null,
  kits: [],
  items: [],
  extras: [],
  bought: [],
  level: 'essential',
  plan: null,
  planInfo: planInfo(null),
  planLock: null,
  planSealed: null,
  planState: 'open',
  tasks: {},
  barcodes: [],
  achievements: {},
  activities: {},
};

export async function getMeta<T>(key: string, fallback: T): Promise<T> {
  const row = await db.meta.get(key);
  return row ? (row.value as T) : fallback;
}

export async function setMeta(key: string, value: unknown): Promise<void> {
  await db.meta.put({ key, value });
}

export async function loadAll(): Promise<AppData> {
  const [
    household,
    kits,
    items,
    extras,
    bought,
    level,
    plan,
    tasks,
    barcodes,
    achievements,
    activities,
    lock,
    sealed,
    info,
  ] = await Promise.all([
    getMeta<Household | null>('household', null),
    db.kits.toArray(),
    db.items.toArray(),
    db.extras.toArray(),
    getMeta<string[]>('bought', []),
    getMeta<KitLevel>('level', 'essential'),
    getMeta<EmergencyPlan | null>('plan', null),
    getMeta<TaskDone>('tasks', {}),
    db.barcodes.toArray(),
    getMeta<AchievementsDone>('achievements', {}),
    getMeta<ActivitiesDone>('activities', {}),
    getMeta<unknown>('planLock', null),
    getMeta<Sealed | null>('planSealed', null),
    getMeta<PlanInfo | null>('planInfo', null),
  ]);
  const planLock = isPlanLock(lock) ? lock : null;
  const planSealed = planLock ? sealed : null;
  const order = (k: Kit) => (k.type === 'home' ? '0' : '1' + k.id);
  kits.sort((a, b) => order(a).localeCompare(order(b), 'fr', { numeric: true }));
  return {
    household,
    kits,
    items,
    extras,
    bought,
    level,
    plan: planLock ? null : plan,
    planInfo: planLock ? (info ?? planInfo(null)) : planInfo(plan),
    planLock,
    planSealed,
    planState: planLock ? 'locked' : 'open',
    tasks,
    barcodes,
    achievements,
    activities,
  };
}

export function emptyData(): AppData {
  return EMPTY;
}

/** Tous les rappels du foyer (péremptions, recharges, check-ups, revue du plan). */
export function remindersFor(data: AppData, today: IsoDate, locale: Locale = 'fr'): Reminder[] {
  return buildReminders({
    catalog: CATALOG,
    kits: data.kits,
    items: data.items,
    country: COUNTRY,
    today,
    planReview: planReviewDate(data.planInfo),
    locale,
  });
}

/** Réglages de notification propres à cet appareil (jamais exportés). */
export interface NotifySettings {
  enabled: boolean;
  lastNotified?: IsoDate;
  push?: boolean;
}

export function getNotifySettings(): Promise<NotifySettings> {
  return getMeta<NotifySettings>('notify', { enabled: false });
}

export async function updateNotifySettings(patch: Partial<NotifySettings>): Promise<void> {
  const current = await getNotifySettings();
  await setMeta('notify', { ...current, ...patch });
}
