import { useLiveQuery } from 'dexie-react-hooks';
import {
  CATALOG,
  consumeFifo,
  countMembers,
  createBackup,
  todayLocal,
  type BackupData,
  type Household,
  type InventoryItem,
  type Kit,
  type KitLevel,
  type Lot,
  type ShoppingExtra,
  type Unit,
} from '@kitzy/core';
import { db } from './db';

export const HOME_KIT_ID = 'home';

export interface AppData {
  household: Household | null;
  kits: Kit[];
  items: InventoryItem[];
  extras: ShoppingExtra[];
  bought: string[];
  level: KitLevel;
}

const EMPTY: AppData = {
  household: null,
  kits: [],
  items: [],
  extras: [],
  bought: [],
  level: 'essential',
};

async function getMeta<T>(key: string, fallback: T): Promise<T> {
  const row = await db.meta.get(key);
  return row ? (row.value as T) : fallback;
}

async function setMeta(key: string, value: unknown): Promise<void> {
  await db.meta.put({ key, value });
}

async function loadAll(): Promise<AppData> {
  const [household, kits, items, extras, bought, level] = await Promise.all([
    getMeta<Household | null>('household', null),
    db.kits.toArray(),
    db.items.toArray(),
    db.extras.toArray(),
    getMeta<string[]>('bought', []),
    getMeta<KitLevel>('level', 'essential'),
  ]);
  const order = (k: Kit) => (k.type === 'home' ? '0' : '1' + k.id);
  kits.sort((a, b) => order(a).localeCompare(order(b), 'fr', { numeric: true }));
  return { household, kits, items, extras, bought, level };
}

/** Toutes les données de l'app, mises à jour en direct. `undefined` pendant le chargement. */
export function useAppData(): AppData | undefined {
  return useLiveQuery(loadAll, [], undefined);
}

export function emptyData(): AppData {
  return EMPTY;
}

function uid(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

/* ---------- Foyer et kits ---------- */

/** Nombre de sacs proposé : un par personne capable de porter un sac (hors nourrissons). */
export function suggestedBags(household: Household): number {
  return countMembers(household).eaters;
}

export async function saveHousehold(household: Household, bagCount: number): Promise<void> {
  await db.transaction('rw', db.meta, db.kits, db.items, async () => {
    await setMeta('household', household);
    if (!(await db.kits.get(HOME_KIT_ID))) {
      await db.kits.put({ id: HOME_KIT_ID, type: 'home', name: 'Réserve maison' });
    }
    const bags = (await db.kits.where('type').equals('go-bag').toArray()).sort((a, b) =>
      a.id.localeCompare(b.id, 'fr', { numeric: true }),
    );
    for (let i = bags.length; i < bagCount; i++) {
      await db.kits.put({ id: `bag-${i + 1}`, type: 'go-bag', name: `Sac ${i + 1}` });
    }
    for (const bag of bags.slice(bagCount)) {
      await db.items.where('kitId').equals(bag.id).delete();
      await db.kits.delete(bag.id);
    }
  });
}

export async function renameKit(kitId: string, name: string): Promise<void> {
  await db.kits.update(kitId, { name: name.trim() || 'Sac' });
}

export async function setLevel(level: KitLevel): Promise<void> {
  await setMeta('level', level);
}

/* ---------- Articles et lots ---------- */

async function findItem(kitId: string, templateId: string): Promise<InventoryItem | undefined> {
  return db.items.where('[kitId+templateId]').equals([kitId, templateId]).first();
}

export interface NewLot {
  quantity: number;
  expiry?: string;
  expiryType?: 'dlc' | 'ddm';
}

/** Ajoute un lot à un article du catalogue (crée l'article si besoin). */
export async function addLotToTemplate(
  kitId: string,
  templateId: string,
  unit: Unit,
  lot: NewLot,
): Promise<string> {
  const today = todayLocal();
  const newLot: Lot = { id: uid(), addedAt: today, ...lot };
  const existing = await findItem(kitId, templateId);
  if (existing) {
    await db.items.update(existing.id, { lots: [...existing.lots, newLot], updatedAt: now() });
    return existing.id;
  }
  const template = CATALOG.find((t) => t.id === templateId);
  const interval = template?.tracking.batteryIntervalDays;
  const item: InventoryItem = {
    id: uid(),
    kitId,
    templateId,
    unit,
    lots: [newLot],
    updatedAt: now(),
    ...(interval ? { battery: { lastChargedAt: today, intervalDays: interval } } : {}),
  };
  await db.items.add(item);
  return item.id;
}

export async function addLotToItem(itemId: string, lot: NewLot): Promise<void> {
  const item = await db.items.get(itemId);
  if (!item) return;
  const newLot: Lot = { id: uid(), addedAt: todayLocal(), ...lot };
  await db.items.update(itemId, { lots: [...item.lots, newLot], updatedAt: now() });
}

export async function createCustomItem(
  kitId: string,
  name: string,
  unit: Unit,
  target: number,
): Promise<string> {
  const item: InventoryItem = {
    id: uid(),
    kitId,
    customName: name.trim(),
    unit,
    lots: [],
    targetOverride: target,
    updatedAt: now(),
  };
  await db.items.add(item);
  return item.id;
}

/** Retire une quantité en commençant par le lot qui périme le plus tôt. */
export async function consume(itemId: string, quantity: number): Promise<void> {
  const item = await db.items.get(itemId);
  if (!item) return;
  await db.items.update(itemId, { lots: consumeFifo(item.lots, quantity), updatedAt: now() });
}

export async function removeLot(itemId: string, lotId: string): Promise<void> {
  const item = await db.items.get(itemId);
  if (!item) return;
  await db.items.update(itemId, {
    lots: item.lots.filter((l) => l.id !== lotId),
    updatedAt: now(),
  });
}

export async function markCharged(itemId: string): Promise<void> {
  const item = await db.items.get(itemId);
  if (!item?.battery) return;
  await db.items.update(itemId, {
    battery: { ...item.battery, lastChargedAt: todayLocal() },
    updatedAt: now(),
  });
}

export async function setTarget(itemId: string, target: number | undefined): Promise<void> {
  await db.items.update(itemId, { targetOverride: target, updatedAt: now() });
}

export async function deleteItem(itemId: string): Promise<void> {
  await db.items.delete(itemId);
}

/* ---------- Courses ---------- */

export async function toggleBought(key: string): Promise<void> {
  const bought = await getMeta<string[]>('bought', []);
  await setMeta(
    'bought',
    bought.includes(key) ? bought.filter((k) => k !== key) : [...bought, key],
  );
}

export async function clearBought(): Promise<void> {
  await setMeta('bought', []);
}

export async function addExtras(extras: Omit<ShoppingExtra, 'id'>[]): Promise<void> {
  await db.extras.bulkAdd(extras.map((e) => ({ id: uid(), ...e })));
}

export async function removeExtra(id: string): Promise<void> {
  await db.extras.delete(id);
  const bought = await getMeta<string[]>('bought', []);
  await setMeta(
    'bought',
    bought.filter((k) => k !== `extra-${id}`),
  );
}

/* ---------- Sauvegarde ---------- */

export async function exportData(): Promise<string> {
  const data = await loadAll();
  return JSON.stringify(createBackup(data), null, 2);
}

export async function importData(data: BackupData): Promise<void> {
  await db.transaction('rw', db.meta, db.kits, db.items, db.extras, async () => {
    await Promise.all([db.meta.clear(), db.kits.clear(), db.items.clear(), db.extras.clear()]);
    await setMeta('household', data.household);
    await setMeta('bought', data.bought);
    await setMeta('level', data.level);
    await db.kits.bulkPut(data.kits);
    await db.items.bulkPut(data.items);
    await db.extras.bulkPut(data.extras);
  });
}

export async function resetAll(): Promise<void> {
  await db.transaction('rw', db.meta, db.kits, db.items, db.extras, async () => {
    await Promise.all([db.meta.clear(), db.kits.clear(), db.items.clear(), db.extras.clear()]);
  });
}
