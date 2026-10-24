/**
 * Soirées conserves (§ 4 du plan) : des recettes simples avec ce qu'il y a dans la réserve.
 * La rotation devient un moment sympa plutôt qu'une corvée.
 */
import { addDays, type IsoDate } from './dates';
import type { KitRow } from './overview';

export interface RecipeIngredient {
  text: string;
  /** Article du catalogue concerné, pour relier la recette à la réserve. */
  templateId?: string;
  /** Produit du garde-manger à acheter (absent : sel, épices… qu'on a déjà). */
  pantryId?: string;
  /** Part du paquet utilisée par la recette (1 par défaut : la boîte entière). */
  use?: number;
}

export interface Recipe {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  /** Sans cuisson, ou au réchaud. */
  cooking: 'none' | 'stove';
  /** Pour combien de personnes. */
  serves: number;
  /** Eau de la réserve utilisée, en litres. */
  water: number;
  ingredients: RecipeIngredient[];
  steps: string[];
  tip?: string;
}

/** Articles alimentaires qui approchent de leur date (ou l'ont passée) dans le délai donné. */
export function foodToRotate(rows: readonly KitRow[], today: IsoDate, days = 30): KitRow[] {
  const limit = addDays(today, days);
  return rows.filter(
    (r) =>
      r.category === 'food' &&
      r.status.quantity > 0 &&
      (r.status.expiredQuantity > 0 ||
        (r.status.nextExpiry !== undefined && r.status.nextExpiry <= limit)),
  );
}

/** Les recettes qui utilisent ces articles, celles qui en utilisent le plus d'abord. */
export function recipesFor(recipes: readonly Recipe[], templateIds: readonly string[]): Recipe[] {
  const wanted = new Set(templateIds);
  const score = (r: Recipe) =>
    new Set(
      r.ingredients
        .filter((i) => i.templateId && wanted.has(i.templateId))
        .map((i) => i.templateId),
    ).size;
  return recipes
    .map((recipe) => ({ recipe, score: score(recipe) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.recipe);
}
