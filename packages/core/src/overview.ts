/**
 * Vue d'ensemble : lignes d'un kit, lucioles, prochaine action, liste de courses.
 */
import {
  CATEGORIES,
  categoryById,
  sourcesForLevel,
  type CategoryId,
  type ItemTemplate,
  type KitLevel,
  type Unit,
} from './catalog';
import type { IsoDate } from './dates';
import { ESSENTIALS, type Essential, type EssentialsState } from './essentials';
import type { Household } from './household';
import type { InventoryItem, Kit, ShoppingExtra } from './inventory';
import { itemStatus, ruleFor, targetFor, type ItemStatus } from './status';

export interface KitRow {
  /** Clé stable : modèle du catalogue, ou identifiant de l'article personnel */
  key: string;
  kit: Kit;
  template?: ItemTemplate;
  item?: InventoryItem;
  name: string;
  unit: Unit;
  category: CategoryId;
  status: ItemStatus;
}

export interface Context {
  catalog: readonly ItemTemplate[];
  household: Household;
  items: readonly InventoryItem[];
  level: KitLevel;
  today: IsoDate;
}

/** Clé d'un article de kit, utilisée dans les URL. */
export function rowKey(templateId: string | undefined, itemId: string | undefined): string {
  return templateId ?? `perso-${itemId ?? ''}`;
}

/** Lignes d'un kit : modèles pertinents pour le niveau choisi, plus les articles déjà saisis. */
export function kitRows(kit: Kit, ctx: Context, levelOverride?: KitLevel): KitRow[] {
  const sources = sourcesForLevel(levelOverride ?? ctx.level);
  const kitItems = ctx.items.filter((i) => i.kitId === kit.id);
  const rows: KitRow[] = [];

  for (const template of ctx.catalog) {
    const rule = ruleFor(template, kit.type);
    const item = kitItems.find((i) => i.templateId === template.id);
    const target = rule ? targetFor(rule, ctx.household) : 0;
    const relevant = rule && target > 0 && sources.includes(template.source);
    if (!relevant && !item) continue;
    rows.push({
      key: template.id,
      kit,
      template,
      item,
      name: template.name.fr,
      unit: item?.unit ?? rule?.unit ?? 'piece',
      category: template.category,
      status: itemStatus(item, target, ctx.today),
    });
  }

  for (const item of kitItems) {
    if (item.templateId) continue;
    rows.push({
      key: rowKey(undefined, item.id),
      kit,
      item,
      name: item.customName ?? '',
      unit: item.unit,
      category: 'morale',
      status: itemStatus(item, item.targetOverride ?? 1, ctx.today),
    });
  }

  const order = CATEGORIES.map((c) => c.id);
  return rows.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
}

export interface EssentialProgress {
  essential: Essential;
  lit: boolean;
  /** Moyenne de couverture des articles officiels, entre 0 et 1 */
  progress: number;
  rows: KitRow[];
}

/**
 * Une luciole s'allume quand tous les articles officiels de la réserve maison
 * liés à cet essentiel couvrent leur quantité cible.
 */
export function essentialsProgress(homeKit: Kit | undefined, ctx: Context): EssentialProgress[] {
  const rows = homeKit ? kitRows(homeKit, ctx, 'essential') : [];
  const official = rows.filter((r) => r.template?.source === 'official');
  return ESSENTIALS.map((essential) => {
    const mine = official.filter((r) => categoryById(r.category).essential === essential);
    const progress = mine.length
      ? mine.reduce((sum, r) => sum + r.status.coverage, 0) / mine.length
      : 0;
    return {
      essential,
      lit: mine.length > 0 && mine.every((r) => r.status.coverage >= 1),
      progress,
      rows: mine,
    };
  });
}

export function essentialsState(progress: readonly EssentialProgress[]): EssentialsState {
  const state = {} as EssentialsState;
  for (const p of progress) state[p.essential] = p.lit;
  return state;
}

export interface NextAction {
  essential: Essential;
  row: KitRow;
  missing: number;
}

/** La prochaine petite chose à faire : l'article le moins couvert de la première luciole éteinte. */
export function nextAction(progress: readonly EssentialProgress[]): NextAction | null {
  for (const p of progress) {
    if (p.lit) continue;
    const row = [...p.rows].sort((a, b) => a.status.coverage - b.status.coverage)[0];
    if (!row) continue;
    return {
      essential: p.essential,
      row,
      missing: Math.max(0, Math.round((row.status.target - row.status.usable) * 10) / 10),
    };
  }
  return null;
}

/** Où ranger un achat : un kit, et la quantité qui lui manque. */
export interface ShoppingDestination {
  kitId: string;
  kitName: string;
  kitType: Kit['type'];
  /** Clé de l'article dans ce kit, pour ouvrir sa page. */
  key: string;
  quantity: number;
}

export interface ShoppingEntry {
  key: string;
  label: string;
  quantity: number;
  unit?: Unit;
  category: CategoryId | 'extra';
  /** Répartition de la quantité entre les kits (vide pour un ajout manuel). */
  destinations: ShoppingDestination[];
  /** Dont quantité périmée à remplacer */
  replaces: number;
}

/** Ce qu'il manque dans tous les kits, regroupé par modèle, plus les ajouts manuels. */
export function shoppingList(
  kits: readonly Kit[],
  ctx: Context,
  extras: readonly ShoppingExtra[] = [],
): ShoppingEntry[] {
  const byKey = new Map<string, ShoppingEntry>();
  for (const kit of kits) {
    for (const row of kitRows(kit, ctx)) {
      const missing = Math.round((row.status.target - row.status.usable) * 10) / 10;
      if (missing <= 0) continue;
      const destination: ShoppingDestination = {
        kitId: kit.id,
        kitName: kit.name,
        kitType: kit.type,
        key: row.key,
        quantity: missing,
      };
      const existing = byKey.get(row.key);
      if (existing) {
        existing.quantity = Math.round((existing.quantity + missing) * 10) / 10;
        existing.replaces += row.status.expiredQuantity;
        existing.destinations.push(destination);
        continue;
      }
      byKey.set(row.key, {
        key: row.key,
        label: row.name,
        quantity: missing,
        unit: row.unit,
        category: row.category,
        destinations: [destination],
        replaces: row.status.expiredQuantity,
      });
    }
  }
  const order = CATEGORIES.map((c) => c.id);
  const entries = [...byKey.values()].sort(
    (a, b) => order.indexOf(a.category as CategoryId) - order.indexOf(b.category as CategoryId),
  );
  for (const extra of extras) {
    entries.push({
      key: `extra-${extra.id}`,
      label: extra.label,
      quantity: extra.quantity ?? 1,
      unit: extra.unit,
      category: 'extra',
      destinations: [],
      replaces: 0,
    });
  }
  return entries;
}
