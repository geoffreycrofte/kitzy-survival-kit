import { describe, expect, it } from 'vitest';
import { CATALOG } from './data/catalog';
import { PANTRY } from './data/pantry';
import { PRODUCTS } from './data/products';
import { RECIPES } from './data/recipes';
import { MEALS_TEMPLATE, pantryFor, pantryNeeds, pantryValue } from './pantry';
import { preferredOffers, productsFor, type Offer } from './products';

describe('pantry', () => {
  it('only fills catalog items that exist, with positive amounts', () => {
    const ids = new Set(CATALOG.map((t) => t.id));
    for (const p of PANTRY) {
      expect(ids.has(p.fills.templateId), p.id).toBe(true);
      expect(p.fills.amount, p.id).toBeGreaterThan(0);
    }
    expect(pantryFor(MEALS_TEMPLATE, PANTRY).length).toBeGreaterThan(10);
  });

  it('links every recipe ingredient to a real pantry product', () => {
    const ids = new Set(PANTRY.map((p) => p.id));
    for (const r of RECIPES) {
      for (const ing of r.ingredients) {
        if (ing.pantryId) expect(ids.has(ing.pantryId), `${r.id}: ${ing.pantryId}`).toBe(true);
      }
    }
  });

  it('turns recipes into whole packs, shared between recipes', () => {
    const chili = RECIPES.find((r) => r.id === 'chili-express')!;
    const pasta = RECIPES.find((r) => r.id === 'pates-sardines')!;
    const needs = pantryNeeds([
      { recipe: chili, times: 2 },
      { recipe: pasta, times: 1 },
    ]);
    const packs = Object.fromEntries(needs.map((n) => [n.pantryId, n.packs]));
    expect(packs['red-beans']).toBe(2);
    // Deux chilis et une assiette de pâtes : trois boîtes de tomates.
    expect(packs['crushed-tomatoes']).toBe(3);
    // 0,15 × 2 de riz : un seul paquet.
    expect(packs['rice']).toBe(1);
    expect(needs.find((n) => n.pantryId === 'crushed-tomatoes')?.recipeIds).toEqual([
      'chili-express',
      'pates-sardines',
    ]);
  });

  it('says what the purchases add to the reserve, in meals', () => {
    const value = pantryValue(
      [
        { pantryId: 'red-beans', packs: 2 },
        { pantryId: 'pasta', packs: 1 },
        { pantryId: 'uht-milk', packs: 2 },
      ],
      PANTRY,
    );
    expect(value.meals).toBe(7);
    expect(value.others).toEqual({ 'long-life-milk': 2 });
  });
});

describe('Amazon by language', () => {
  const offers: Offer[] = [
    { merchant: 'amazon-fr', query: 'a' },
    { merchant: 'amazon-de', query: 'b' },
    { merchant: 'decathlon-fr', query: 'c' },
  ];

  it('shows Amazon.de by default and Amazon.fr in French, other shops alike', () => {
    expect(preferredOffers(offers, 'de').map((o) => o.merchant)).toEqual([
      'amazon-de',
      'decathlon-fr',
    ]);
    expect(preferredOffers(offers, 'en').map((o) => o.merchant)).toEqual([
      'amazon-de',
      'decathlon-fr',
    ]);
    expect(preferredOffers(offers, 'fr').map((o) => o.merchant)).toEqual([
      'amazon-fr',
      'decathlon-fr',
    ]);
  });

  it('falls back to the other Amazon when the preferred one is missing', () => {
    expect(preferredOffers([offers[0]!], 'de').map((o) => o.merchant)).toEqual(['amazon-fr']);
  });

  it('gives buying advice for far more of the catalog', () => {
    const covered = new Set(PRODUCTS.flatMap((p) => p.templateIds));
    expect(covered.size).toBeGreaterThan(60);
    const groups = productsFor('wet-wipes', PRODUCTS, {}, {}, 'fr');
    expect(groups[0]?.products[0]?.offers.map((o) => o.merchant.id)).toEqual(['amazon-fr']);
  });
});
