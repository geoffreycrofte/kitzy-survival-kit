/**
 * Le garde-manger : les vrais produits derrière « Nourriture non périssable » et ses voisins.
 * Chaque paquet dit ce qu'il apporte à la réserve (en repas, en litres…), pour qu'on voie
 * ce que valent ses courses. Les recettes s'en servent pour composer la liste de courses.
 */
import type { Offer } from './products';
import type { Recipe } from './recipes';

export interface PantryItem {
  id: string;
  /** Ce qu'il faut acheter, sans marque (« Haricots rouges en boîte »). */
  name: string;
  /** Contenance d'un paquet, telle qu'imprimée (« 400 g »). */
  pack: string;
  /** Ce qu'un paquet ajoute à la réserve : un article du catalogue et une quantité dans son unité. */
  fills: { templateId: string; amount: number };
  /** Durée de conservation habituelle, fermé, en mois. */
  keepsMonths: number;
  /** Se mange sans cuisson. */
  readyToEat: boolean;
  offers: Offer[];
}

/** Une ligne de courses tirée des recettes : un produit et combien de paquets. */
export interface PantryNeed {
  pantryId: string;
  packs: number;
  /** Recettes qui en ont besoin. */
  recipeIds: string[];
}

/** Les produits qui remplissent un article du catalogue. */
export function pantryFor(templateId: string, pantry: readonly PantryItem[]): PantryItem[] {
  return pantry.filter((p) => p.fills.templateId === templateId);
}

/**
 * Ce qu'il faut acheter pour faire ces recettes, chacune `times` fois.
 * Un paquet entamé sert à plusieurs recettes : on arrondit au paquet supérieur une fois tout additionné.
 */
export function pantryNeeds(
  choices: ReadonlyArray<{ recipe: Recipe; times: number }>,
): PantryNeed[] {
  const byId = new Map<string, { use: number; recipeIds: string[] }>();
  for (const { recipe, times } of choices) {
    if (times <= 0) continue;
    for (const ing of recipe.ingredients) {
      if (!ing.pantryId) continue;
      const entry = byId.get(ing.pantryId) ?? { use: 0, recipeIds: [] };
      entry.use += (ing.use ?? 1) * times;
      if (!entry.recipeIds.includes(recipe.id)) entry.recipeIds.push(recipe.id);
      byId.set(ing.pantryId, entry);
    }
  }
  return [...byId.entries()].map(([pantryId, { use, recipeIds }]) => ({
    pantryId,
    // Arrondi tolérant : 0,99999 paquet reste 1 paquet.
    packs: Math.max(1, Math.ceil(use - 1e-9)),
    recipeIds,
  }));
}

export interface PantryValue {
  /** Repas ajoutés à « Nourriture non périssable ». */
  meals: number;
  /** Les autres articles remplis : identifiant du catalogue → quantité. */
  others: Record<string, number>;
}

export const MEALS_TEMPLATE = 'non-perishable-food';

/** Ce que ces achats apportent à la réserve. */
export function pantryValue(
  needs: ReadonlyArray<{ pantryId: string; packs: number }>,
  pantry: readonly PantryItem[],
): PantryValue {
  const value: PantryValue = { meals: 0, others: {} };
  for (const need of needs) {
    const item = pantry.find((p) => p.id === need.pantryId);
    if (!item) continue;
    const amount = item.fills.amount * need.packs;
    if (item.fills.templateId === MEALS_TEMPLATE) value.meals += amount;
    else value.others[item.fills.templateId] = (value.others[item.fills.templateId] ?? 0) + amount;
  }
  value.meals = Math.round(value.meals * 10) / 10;
  return value;
}
