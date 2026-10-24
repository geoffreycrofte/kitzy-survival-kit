/**
 * Sauvegarde et restauration (export / import JSON).
 */
import { z } from 'zod';
import { isIsoDate } from './dates';
import type { Household } from './household';
import type { BarcodeLink, InventoryItem, Kit, ShoppingExtra } from './inventory';
import { PlanSchema, type EmergencyPlan } from './plan';
import type { TaskDone } from './tasks';
import type { AchievementsDone } from './progress';
import type { ActivitiesDone } from './activities';
import type { KitLevel } from './catalog';

const isoDate = z.string().refine(isIsoDate, 'Date invalide');
const unit = z.enum(['L', 'portion', 'piece', 'pack', 'set']);
/** Identifiants générés par l'app (UUID, identifiants du catalogue) : jamais très longs. */
const id = z.string().max(120);
const stamp = z.string().max(40);

const HouseholdSchema = z.object({
  members: z
    .array(
      z.object({
        id,
        type: z.enum(['adult', 'child', 'infant', 'senior', 'pet']),
        petSpecies: z.enum(['dog', 'cat', 'other']).optional(),
      }),
    )
    .max(50),
  durationDays: z.number().int().min(1).max(30),
});

const KitSchema = z.object({
  id,
  type: z.enum(['home', 'go-bag', 'car']),
  name: z.string().max(80),
});

const LotSchema = z.object({
  id,
  quantity: z.number().nonnegative().max(100_000),
  expiry: isoDate.optional(),
  expiryType: z.enum(['dlc', 'ddm']).optional(),
  addedAt: isoDate,
});

const ItemSchema = z.object({
  id,
  kitId: id,
  templateId: id.optional(),
  customName: z.string().max(120).optional(),
  unit,
  lots: z.array(LotSchema).max(500),
  battery: z
    // Borné : un intervalle démesuré ferait sortir les dates calculées du calendrier.
    .object({ lastChargedAt: isoDate, intervalDays: z.number().int().positive().max(3650) })
    .optional(),
  targetOverride: z.number().nonnegative().max(100_000).optional(),
  notes: z.string().max(1000).optional(),
  updatedAt: stamp,
});

const ExtraSchema = z.object({
  id,
  label: z.string().max(120),
  quantity: z.number().positive().max(100_000).optional(),
  unit: unit.optional(),
  pantryId: id.optional(),
  recipeIds: z.array(id).max(50).optional(),
  stored: z.object({ itemId: id, lotId: id }).optional(),
});

const BarcodeSchema = z.object({
  code: z.string().max(64),
  kitId: z.string().max(64),
  key: z.string().max(120),
});

/** Version 1 (phase 1) acceptée : les nouveautés prennent leur valeur vide. */
const BackupSchema = z.object({
  app: z.literal('kitzy'),
  schemaVersion: z.union([z.literal(1), z.literal(2)]),
  exportedAt: stamp,
  household: HouseholdSchema.nullable(),
  kits: z.array(KitSchema).max(50),
  items: z.array(ItemSchema).max(5000),
  extras: z.array(ExtraSchema).max(500),
  bought: z.array(id).max(5000),
  level: z.enum(['essential', 'recommended', 'complete']),
  plan: PlanSchema.nullable().default(null),
  tasks: z.record(z.string().max(64), isoDate).default({}),
  barcodes: z.array(BarcodeSchema).max(2000).default([]),
  achievements: z.record(z.string().max(64), isoDate).default({}),
  activities: z.record(z.string().max(64), isoDate).default({}),
});

export interface BackupData {
  household: Household | null;
  kits: Kit[];
  items: InventoryItem[];
  extras: ShoppingExtra[];
  bought: string[];
  level: KitLevel;
  plan: EmergencyPlan | null;
  tasks: TaskDone;
  barcodes: BarcodeLink[];
  achievements: AchievementsDone;
  activities: ActivitiesDone;
}

export type Backup = BackupData & { app: 'kitzy'; schemaVersion: 2; exportedAt: string };

export function createBackup(data: BackupData, now: Date = new Date()): Backup {
  return { app: 'kitzy', schemaVersion: 2, exportedAt: now.toISOString(), ...data };
}

/** Au-delà, ce n'est pas une sauvegarde Kitzy : on ne lit même pas le fichier. */
export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;

export type ParseResult =
  { ok: true; data: BackupData } | { ok: false; code: 'unreadable' | 'notKitzy'; error: string };

export function parseBackup(text: string): ParseResult {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return {
      ok: false,
      code: 'unreadable',
      error: 'Ce fichier n’est pas une sauvegarde Kitzy lisible.',
    };
  }
  const parsed = BackupSchema.safeParse(json);
  if (!parsed.success) {
    return {
      ok: false,
      code: 'notKitzy',
      error:
        'Ce fichier ne ressemble pas à une sauvegarde Kitzy, ou vient d’une version plus récente.',
    };
  }
  const {
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
  } = parsed.data;
  return {
    ok: true,
    data: {
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
      activities: activities as ActivitiesDone,
    },
  };
}
