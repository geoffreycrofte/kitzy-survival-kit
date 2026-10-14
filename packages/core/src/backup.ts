/**
 * Sauvegarde et restauration (export / import JSON).
 */
import { z } from 'zod';
import { isIsoDate } from './dates';
import type { Household } from './household';
import type { BarcodeLink, InventoryItem, Kit, ShoppingExtra } from './inventory';
import { PlanSchema, type EmergencyPlan } from './plan';
import type { TaskDone } from './tasks';
import type { KitLevel } from './catalog';

const isoDate = z.string().refine(isIsoDate, 'Date invalide');
const unit = z.enum(['L', 'portion', 'piece', 'pack', 'set']);

const HouseholdSchema = z.object({
  members: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(['adult', 'child', 'infant', 'senior', 'pet']),
        petSpecies: z.enum(['dog', 'cat', 'other']).optional(),
      }),
    )
    .max(50),
  durationDays: z.number().int().min(1).max(30),
});

const KitSchema = z.object({
  id: z.string(),
  type: z.enum(['home', 'go-bag', 'car']),
  name: z.string().max(80),
});

const LotSchema = z.object({
  id: z.string(),
  quantity: z.number().nonnegative().max(100_000),
  expiry: isoDate.optional(),
  expiryType: z.enum(['dlc', 'ddm']).optional(),
  addedAt: isoDate,
});

const ItemSchema = z.object({
  id: z.string(),
  kitId: z.string(),
  templateId: z.string().optional(),
  customName: z.string().max(120).optional(),
  unit,
  lots: z.array(LotSchema).max(500),
  battery: z
    .object({ lastChargedAt: isoDate, intervalDays: z.number().int().positive() })
    .optional(),
  targetOverride: z.number().nonnegative().optional(),
  notes: z.string().max(1000).optional(),
  updatedAt: z.string(),
});

const ExtraSchema = z.object({
  id: z.string(),
  label: z.string().max(120),
  quantity: z.number().positive().optional(),
  unit: unit.optional(),
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
  exportedAt: z.string(),
  household: HouseholdSchema.nullable(),
  kits: z.array(KitSchema).max(50),
  items: z.array(ItemSchema).max(5000),
  extras: z.array(ExtraSchema).max(500),
  bought: z.array(z.string()).max(5000),
  level: z.enum(['essential', 'recommended', 'complete']),
  plan: PlanSchema.nullable().default(null),
  tasks: z.record(z.string().max(64), isoDate).default({}),
  barcodes: z.array(BarcodeSchema).max(2000).default([]),
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
}

export type Backup = BackupData & { app: 'kitzy'; schemaVersion: 2; exportedAt: string };

export function createBackup(data: BackupData, now: Date = new Date()): Backup {
  return { app: 'kitzy', schemaVersion: 2, exportedAt: now.toISOString(), ...data };
}

export type ParseResult = { ok: true; data: BackupData } | { ok: false; error: string };

export function parseBackup(text: string): ParseResult {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, error: 'Ce fichier n’est pas une sauvegarde Kitzy lisible.' };
  }
  const parsed = BackupSchema.safeParse(json);
  if (!parsed.success) {
    return {
      ok: false,
      error:
        'Ce fichier ne ressemble pas à une sauvegarde Kitzy, ou vient d’une version plus récente.',
    };
  }
  const { household, kits, items, extras, bought, level, plan, tasks, barcodes } = parsed.data;
  return {
    ok: true,
    data: { household, kits, items, extras, bought, level, plan, tasks, barcodes },
  };
}
