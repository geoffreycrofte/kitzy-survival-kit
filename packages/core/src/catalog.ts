/**
 * Catalogue : les modèles d'articles du kit (§ 2 du plan).
 */
import type { Essential } from './essentials';

export type CategoryId =
  | 'water'
  | 'food'
  | 'cooking'
  | 'tools'
  | 'light'
  | 'info'
  | 'documents'
  | 'warmth'
  | 'care'
  | 'hygiene'
  | 'morale'
  | 'bag';

export type KitType = 'home' | 'go-bag' | 'car';

/** official : checklist officielle du pays · recommended : listes expertes · optional : confort. */
export type Source = 'official' | 'recommended' | 'optional';

/** Niveau de kit choisi par la personne (réglage). */
export type KitLevel = 'essential' | 'recommended' | 'complete';

export type Unit = 'L' | 'portion' | 'piece' | 'pack' | 'set';

/**
 * Règle de quantité cible.
 * - household : `amount` pour tout le foyer
 * - person : `amount` par personne (humains)
 * - personDay : `amount` par personne et par jour
 * - meal : `amount` repas par personne et par jour (unité : portion)
 * - water : besoin en eau calculé du foyer, animaux compris (unité : L)
 * - pet : `amount` par animal (0 animal : article non proposé)
 * - petDay : `amount` par animal et par jour
 * - infant : `amount` par nourrisson et par jour (0 nourrisson : article non proposé)
 */
export type QuantityPer =
  'household' | 'person' | 'personDay' | 'meal' | 'water' | 'pet' | 'petDay' | 'infant';

export interface QuantityRule {
  unit: Unit;
  per: QuantityPer;
  amount: number;
}

export interface Tracking {
  /** Type de date : DLC (stricte), DDM (indicative), ou aucune. */
  expiry: 'dlc' | 'ddm' | 'none';
  /** Recharge ou test conseillé tous les N jours. */
  batteryIntervalDays?: number;
}

/** Texte localisé. Le français est la langue source, les autres langues viendront. */
import type { Locale } from './i18n/locales';

/** Le texte dans la langue demandée, sinon en français. */
export function tx(text: LocalizedText, locale: Locale = 'fr'): string {
  return text[locale] ?? text.fr;
}

export interface LocalizedText {
  fr: string;
  en?: string;
  lb?: string;
  de?: string;
  pt?: string;
}

export interface ItemTemplate {
  /** Identifiant stable, en kebab-case anglais (ex. `drinking-water`). */
  id: string;
  category: CategoryId;
  name: LocalizedText;
  /** Une phrase : pourquoi c'est utile ou comment le choisir. */
  hint?: LocalizedText;
  /** Mise en garde de sécurité (monoxyde de carbone, iode…). */
  safety?: LocalizedText;
  source: Source;
  /** Quantité cible dans la réserve maison (absent : pas dans la réserve maison). */
  home?: QuantityRule;
  /** Quantité cible par sac d'évacuation (absent : pas dans le sac). */
  bag?: QuantityRule;
  tracking: Tracking;
  /** Page du guide qui explique pourquoi. */
  guide?: string;
}

export interface Category {
  id: CategoryId;
  name: LocalizedText;
  /** La luciole que cette catégorie fait avancer, s'il y en a une. */
  essential?: Essential;
}

export const CATEGORIES: readonly Category[] = [
  { id: 'water', name: { fr: 'Eau' }, essential: 'water' },
  { id: 'food', name: { fr: 'Repas' }, essential: 'food' },
  { id: 'cooking', name: { fr: 'Cuisiner' }, essential: 'food' },
  { id: 'light', name: { fr: 'Lumière et énergie' }, essential: 'light' },
  { id: 'warmth', name: { fr: 'Chaleur et vêtements' }, essential: 'warmth' },
  { id: 'care', name: { fr: 'Soins' }, essential: 'care' },
  { id: 'hygiene', name: { fr: 'Hygiène' }, essential: 'care' },
  { id: 'documents', name: { fr: 'Documents et argent' }, essential: 'plan' },
  { id: 'info', name: { fr: 'S’informer' }, essential: 'plan' },
  { id: 'tools', name: { fr: 'Outils' } },
  { id: 'morale', name: { fr: 'Moral et famille' } },
  { id: 'bag', name: { fr: 'Le sac' } },
];

export function categoryById(id: CategoryId): Category {
  const found = CATEGORIES.find((c) => c.id === id);
  if (!found) throw new Error(`Catégorie inconnue : ${id}`);
  return found;
}

/** Sources incluses pour un niveau de kit. */
export function sourcesForLevel(level: KitLevel): Source[] {
  if (level === 'essential') return ['official'];
  if (level === 'recommended') return ['official', 'recommended'];
  return ['official', 'recommended', 'optional'];
}
