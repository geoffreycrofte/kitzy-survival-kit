import { useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  CATALOG,
  consumeFifo,
  countMembers,
  PlanSchema,
  addPasskeyToLock,
  createBackup,
  createPlanLock,
  openJson,
  planInfo,
  removePasskeyFromLock,
  sealJson,
  unlockWithCode,
  unlockWithPasskey,
  type ActivitiesDone,
  type ActivityId,
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
  type PlanLock,
  type Sealed,
  type ShoppingExtra,
  type Unit,
} from '@kitzy/core';
import { db } from './db';
import { reportDataError } from './health';
import { getMeta, loadAll, setMeta, type AppData } from './load';
import { getPlanKey, lockPlan, setPlanKey, usePlanKey } from '../lib/planKey';
import { createPasskey, passkeySecret } from '../lib/passkey';

export { emptyData, type AppData } from './load';

export const HOME_KIT_ID = 'home';

// Android met en pause les onglets en arrière-plan (« freeze ») : un onglet figé qui garde
// la base ouverte peut bloquer l'app installée. On rend la main ; Dexie rouvre au besoin.
document.addEventListener('freeze', () => db.close({ disableAutoOpen: false }));

/** Toutes les données de l'app, mises à jour en direct. `undefined` pendant le chargement. */
export function useAppData(): AppData | undefined {
  const raw = useLiveQuery(
    () =>
      loadAll().catch((error: unknown) => {
        // Une erreur de lecture ne doit pas tout casser : on la signale à l'écran.
        reportDataError(error);
        return undefined;
      }),
    [],
    undefined,
  );
  const key = usePlanKey();
  const sealed = raw?.planSealed ?? null;
  // Le plan déchiffré, et la boîte dont il vient : on garde le précédent pendant qu'on
  // déchiffre une nouvelle version, pour ne pas faire clignoter l'écran à chaque enregistrement.
  const [opened, setOpened] = useState<{ key: Uint8Array; plan: EmergencyPlan | null } | null>(
    null,
  );
  useEffect(() => {
    if (!key || !sealed) return;
    let alive = true;
    void openPlan(key, sealed).then((plan) => {
      if (alive) setOpened({ key, plan });
    });
    return () => {
      alive = false;
    };
  }, [key, sealed]);

  return useMemo(() => {
    if (!raw || !raw.planLock) return raw;
    if (!key) return raw;
    if (!sealed) return { ...raw, planState: 'open' as const };
    if (opened?.key !== key) return { ...raw, planState: 'opening' as const };
    return { ...raw, plan: opened.plan, planState: 'open' as const };
  }, [raw, key, sealed, opened]);
}

async function openPlan(key: Uint8Array, sealed: Sealed): Promise<EmergencyPlan | null> {
  const parsed = PlanSchema.safeParse(await openJson(key, sealed));
  return parsed.success ? parsed.data : null;
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
export function savePlanStep(step: PlanStep, edited: EmergencyPlan): Promise<void> {
  // Plan verrouillé : le chiffrement se fait hors transaction, donc on enchaîne les
  // enregistrements un par un pour qu'aucun n'écrase le précédent.
  const run = saving.then(async () => {
    if (await getMeta<unknown>('planLock', null)) return saveSealedStep(step, edited);
    await db.transaction('rw', db.meta, async () => {
      const stored = await getMeta<EmergencyPlan | null>('plan', null);
      await setMeta('plan', stamp(stored ? mergePlanStep(stored, edited, step) : edited));
    });
  });
  saving = run.catch(() => undefined);
  return run;
}

let saving: Promise<unknown> = Promise.resolve();

function stamp(plan: EmergencyPlan): EmergencyPlan {
  const today = todayLocal();
  return { ...plan, createdAt: plan.createdAt ?? today, updatedAt: today };
}

function requireKey(): Uint8Array {
  const key = getPlanKey();
  if (!key) throw new Error('Plan verrouillé');
  return key;
}

async function saveSealedStep(step: PlanStep, edited: EmergencyPlan): Promise<void> {
  const key = requireKey();
  const sealed = await getMeta<Sealed | null>('planSealed', null);
  const stored = sealed ? await openPlan(key, sealed) : null;
  await writeSealedPlan(key, stamp(stored ? mergePlanStep(stored, edited, step) : edited));
}

async function writeSealedPlan(key: Uint8Array, plan: EmergencyPlan | null): Promise<void> {
  const sealed = plan ? await sealJson(key, plan) : null;
  await db.transaction('rw', db.meta, async () => {
    await db.meta.delete('plan');
    if (sealed && plan) {
      await setMeta('planSealed', sealed);
      await setMeta('planInfo', planInfo(plan));
    } else {
      await db.meta.bulkDelete(['planSealed', 'planInfo']);
    }
  });
}

export async function deletePlan(): Promise<void> {
  await db.meta.bulkDelete(['plan', 'planSealed', 'planInfo']);
}

/* ---------- Verrou du plan sur l'appareil ---------- */

async function getLock(): Promise<PlanLock> {
  const lock = await getMeta<PlanLock | null>('planLock', null);
  if (!lock) throw new Error('Aucun verrou');
  return lock;
}

/** Chiffre le plan avec un code Kitzy (toujours requis : c'est aussi le moyen de secours). */
export async function enablePlanLock(code: string): Promise<void> {
  const { lock, key } = await createPlanLock(code);
  const plan = await getMeta<EmergencyPlan | null>('plan', null);
  const sealed = plan ? await sealJson(key, plan) : null;
  await db.transaction('rw', db.meta, async () => {
    await setMeta('planLock', lock);
    await db.meta.delete('plan');
    if (sealed && plan) {
      await setMeta('planSealed', sealed);
      await setMeta('planInfo', planInfo(plan));
    }
  });
  setPlanKey(key);
}

/** Remet le plan en clair et oublie le verrou (le plan doit être déverrouillé). */
export async function disablePlanLock(): Promise<void> {
  const key = requireKey();
  const sealed = await getMeta<Sealed | null>('planSealed', null);
  const plan = sealed ? await openPlan(key, sealed) : null;
  await db.transaction('rw', db.meta, async () => {
    if (plan) await setMeta('plan', plan);
    await db.meta.bulkDelete(['planLock', 'planSealed', 'planInfo']);
  });
  lockPlan();
}

/** Ajoute l'empreinte, le visage ou le code de l'appareil. `false` si l'appareil ne sait pas. */
export async function addPlanPasskey(name: string): Promise<boolean> {
  const key = requireKey();
  const passkey = await createPasskey(name);
  if (!passkey) return false;
  await setMeta('planLock', await addPasskeyToLock(await getLock(), key, passkey));
  return true;
}

export async function removePlanPasskey(): Promise<void> {
  await setMeta('planLock', removePasskeyFromLock(await getLock()));
}

export async function unlockPlanWithCode(code: string): Promise<boolean> {
  const key = await unlockWithCode(await getLock(), code);
  if (key) setPlanKey(key);
  return Boolean(key);
}

export async function unlockPlanWithPasskey(): Promise<boolean> {
  const lock = await getLock();
  if (!lock.passkey) return false;
  const secret = await passkeySecret(lock.passkey.credentialId, lock.passkey.prfSalt);
  const key = secret ? await unlockWithPasskey(lock, secret) : null;
  if (key) setPlanKey(key);
  return Boolean(key);
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

/* ---------- Activités ---------- */

/** Note une activité faite aujourd'hui (rituel, défi, simulation, quiz, recette). */
export async function recordActivity(id: ActivityId | 'quiz-parfait'): Promise<void> {
  await db.transaction('rw', db.meta, async () => {
    const done = await getMeta<ActivitiesDone>('activities', {});
    await setMeta('activities', { ...done, [id]: todayLocal() });
  });
}

/** Tous les appareils suivis sont notés comme rechargés aujourd'hui. */
export async function chargeAll(): Promise<number> {
  const today = todayLocal();
  const items = (await db.items.toArray()).filter((i) => i.battery);
  await Promise.all(
    items.map((i) =>
      db.items.update(i.id, {
        battery: { ...i.battery!, lastChargedAt: today },
        updatedAt: now(),
      }),
    ),
  );
  return items.length;
}

/** Note les succès qui viennent d'être atteints, avec la date du jour. */
export async function recordAchievements(ids: readonly string[]): Promise<void> {
  if (ids.length === 0) return;
  const today = todayLocal();
  await db.transaction('rw', db.meta, async () => {
    const done = await getMeta<Record<string, string>>('achievements', {});
    for (const id of ids) done[id] ??= today;
    await setMeta('achievements', done);
  });
}

/** La sauvegarde complète, plan compris : un plan verrouillé doit d'abord être ouvert. */
export async function exportData(): Promise<string> {
  const data = await loadAll();
  const plan = data.planSealed ? await openPlan(requireKey(), data.planSealed) : data.plan;
  return JSON.stringify(createBackup({ ...data, plan }), null, 2);
}

async function clearData(keep: readonly string[] = []): Promise<void> {
  await Promise.all([
    db.meta
      .where('key')
      .noneOf([...DEVICE_KEYS, ...keep])
      .delete(),
    db.kits.clear(),
    db.items.clear(),
    db.extras.clear(),
    db.barcodes.clear(),
  ]);
}

/** Remplace tout. Si le plan est verrouillé sur cet appareil, le plan importé l'est aussi. */
export async function importData(data: BackupData): Promise<void> {
  const locked = Boolean(await getMeta<unknown>('planLock', null));
  const key = locked ? requireKey() : null;
  const sealed = key && data.plan ? await sealJson(key, data.plan) : null;
  await db.transaction('rw', DATA_TABLES(), async () => {
    await clearData(locked ? ['planLock'] : []);
    await setMeta('household', data.household);
    await setMeta('bought', data.bought);
    await setMeta('level', data.level);
    if (sealed && data.plan) {
      await setMeta('planSealed', sealed);
      await setMeta('planInfo', planInfo(data.plan));
    } else if (data.plan) {
      await setMeta('plan', data.plan);
    }
    await setMeta('tasks', data.tasks);
    await setMeta('achievements', data.achievements);
    await setMeta('activities', data.activities);
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
  lockPlan();
}
