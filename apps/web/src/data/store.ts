import { useLiveQuery } from 'dexie-react-hooks';
import {
  CATALOG,
  consumeFifo,
  countMembers,
  createBackup,
  mergePlanStep,
  todayLocal,
  type BackupData,
  type BarcodeLink,
  type EmergencyPlan,
  type PlanStep,
  type Household,
  type TaskDone,
  type InventoryItem,
  type KitLevel,
  type Lot,
  type ShoppingExtra,
  type Unit,
} from '@kitzy/core';
import { db } from './db';
import { getMeta, loadAll, setMeta, type AppData } from './load';

export { emptyData, type AppData } from './load';

export const HOME_KIT_ID = 'home';

/** Toutes les données de l'app, mises à jour en direct. `undefined` pendant le chargement. */
export function useAppData(): AppData | undefined {
  return useLiveQuery(loadAll, [], undefined);
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

/* ---------- Plan d'urgence et gestes ---------- */

/**
 * Enregistre une étape du plan sur la dernière version stockée :
 * deux étapes ouvertes l'une après l'autre ne s'écrasent jamais.
 */
export async function savePlanStep(step: PlanStep, edited: EmergencyPlan): Promise<void> {
  await db.transaction('rw', db.meta, async () => {
    const stored = await getMeta<EmergencyPlan | null>('plan', null);
    const merged = stored ? mergePlanStep(stored, edited, step) : edited;
    const today = todayLocal();
    await setMeta('plan', { ...merged, createdAt: merged.createdAt ?? today, updatedAt: today });
  });
}

export async function deletePlan(): Promise<void> {
  await db.meta.delete('plan');
}

export async function toggleTask(id: string): Promise<boolean> {
  const tasks = await getMeta<TaskDone>('tasks', {});
  const done = !tasks[id];
  const next = { ...tasks };
  if (done) next[id] = todayLocal();
  else delete next[id];
  await setMeta('tasks', next);
  return done;
}

/* ---------- Codes-barres ---------- */

export async function linkBarcode(link: BarcodeLink): Promise<void> {
  await db.barcodes.put(link);
}

export async function findBarcode(code: string): Promise<BarcodeLink | undefined> {
  return db.barcodes.get(code);
}

/* ---------- Sauvegarde ---------- */

const DATA_TABLES = () => [db.meta, db.kits, db.items, db.extras, db.barcodes];

/** Réglages propres à l'appareil, conservés lors d'une restauration. */
const DEVICE_KEYS = ['notify', 'pushSalt'];

export async function exportData(): Promise<string> {
  const data = await loadAll();
  return JSON.stringify(createBackup(data), null, 2);
}

async function clearData(): Promise<void> {
  await Promise.all([
    db.meta.where('key').noneOf(DEVICE_KEYS).delete(),
    db.kits.clear(),
    db.items.clear(),
    db.extras.clear(),
    db.barcodes.clear(),
  ]);
}

export async function importData(data: BackupData): Promise<void> {
  await db.transaction('rw', DATA_TABLES(), async () => {
    await clearData();
    await setMeta('household', data.household);
    await setMeta('bought', data.bought);
    await setMeta('level', data.level);
    if (data.plan) await setMeta('plan', data.plan);
    await setMeta('tasks', data.tasks);
    await db.kits.bulkPut(data.kits);
    await db.items.bulkPut(data.items);
    await db.extras.bulkPut(data.extras);
    await db.barcodes.bulkPut(data.barcodes);
  });
}

export async function resetAll(): Promise<void> {
  await db.transaction('rw', DATA_TABLES(), async () => {
    await clearData();
  });
}
