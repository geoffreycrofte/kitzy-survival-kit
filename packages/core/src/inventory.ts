/**
 * Inventaire du foyer : kits, articles et lots datés.
 * Les dates sont des chaînes locales `YYYY-MM-DD`.
 */
import type { KitType, Unit } from './catalog';

export interface Kit {
  id: string;
  type: KitType;
  /** Nom affiché (ex. « Réserve maison », « Sac de Léa »). */
  name: string;
}

export interface Lot {
  id: string;
  quantity: number;
  expiry?: string;
  expiryType?: 'dlc' | 'ddm';
  addedAt: string;
}

export interface InventoryItem {
  id: string;
  kitId: string;
  /** Modèle du catalogue, ou absent pour un article personnel. */
  templateId?: string;
  customName?: string;
  unit: Unit;
  lots: Lot[];
  battery?: { lastChargedAt: string; intervalDays: number };
  /** Quantité cible choisie par la personne, à la place de la règle. */
  targetOverride?: number;
  notes?: string;
  updatedAt: string;
}

/** Un achat ajouté à la main dans la liste de courses. */
export interface ShoppingExtra {
  id: string;
  label: string;
  quantity?: number;
  unit?: Unit;
}

/** Code-barres scanné une fois, puis reconnu : il mène directement à l'article. */
export interface BarcodeLink {
  code: string;
  kitId: string;
  /** Clé de ligne du kit : identifiant du modèle, ou `perso-<id>` pour un objet personnel. */
  key: string;
}
