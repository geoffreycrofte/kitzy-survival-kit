import Dexie, { type EntityTable } from 'dexie';
import type { InventoryItem, Kit, ShoppingExtra } from '@kitzy/core';

export interface MetaRow {
  key: string;
  value: unknown;
}

/**
 * Base locale (IndexedDB). Toutes les données restent sur l'appareil.
 * Chaque changement de schéma passe par une nouvelle `version()`.
 */
export class KitzyDb extends Dexie {
  meta!: EntityTable<MetaRow, 'key'>;
  kits!: EntityTable<Kit, 'id'>;
  items!: EntityTable<InventoryItem, 'id'>;
  extras!: EntityTable<ShoppingExtra, 'id'>;

  constructor(name = 'kitzy') {
    super(name);
    this.version(1).stores({
      meta: '&key',
      kits: '&id, type',
      items: '&id, kitId, [kitId+templateId]',
      extras: '&id',
    });
  }
}

export const db = new KitzyDb();
