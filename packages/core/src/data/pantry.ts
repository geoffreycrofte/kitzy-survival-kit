/**
 * Le garde-manger : des produits courants, sans marque, qui se gardent sans frigo.
 *
 * « Repas » = une portion pour un adulte, comme dans l'article « Nourriture non périssable »
 * (3 par jour et par personne). Les valeurs sont des repères pour estimer sa réserve :
 * une boîte de légumineuses fait un repas, une boîte de tomates en fait la moitié,
 * 500 g de pâtes en font cinq (100 g par personne).
 */
import type { PantryItem } from '../pantry';

interface Queries {
  /** Recherche Amazon.fr. */
  fr: string;
  /** Recherche Amazon.de. */
  de: string;
}

function item(
  id: string,
  name: string,
  pack: string,
  fills: PantryItem['fills'],
  keepsMonths: number,
  readyToEat: boolean,
  q: Queries,
): PantryItem {
  return {
    id,
    name,
    pack,
    fills,
    keepsMonths,
    readyToEat,
    offers: [
      { merchant: 'amazon-fr', query: q.fr },
      { merchant: 'amazon-de', query: q.de },
    ],
  };
}

const meals = (amount: number) => ({ templateId: 'non-perishable-food', amount });

export const PANTRY: readonly PantryItem[] = [
  /* ---------- Plats et légumineuses : la base des repas ---------- */
  item('red-beans', 'Haricots rouges en boîte', '400 g', meals(1), 36, true, {
    fr: 'haricots rouges conserve 400 g',
    de: 'Kidneybohnen Dose 400 g',
  }),
  item('lentils', 'Lentilles cuites en boîte', '400 g', meals(1), 36, true, {
    fr: 'lentilles cuites conserve 400 g',
    de: 'Linsen gekocht Dose 400 g',
  }),
  item('chickpeas', 'Pois chiches en boîte', '400 g', meals(1), 36, true, {
    fr: 'pois chiches conserve 400 g',
    de: 'Kichererbsen Dose 400 g',
  }),
  item(
    'ready-meal',
    'Plat cuisiné en conserve (raviolis, cassoulet…)',
    '800 g',
    meals(2),
    36,
    true,
    {
      fr: 'plat cuisiné conserve 800 g',
      de: 'Fertiggericht Dose 800 g',
    },
  ),
  item('soup', 'Soupe de légumes en brique', '1 L', meals(2), 12, true, {
    fr: 'soupe légumes brique 1 L',
    de: 'Gemüsesuppe Tetrapack 1 l',
  }),

  /* ---------- Poisson ---------- */
  item('tuna', 'Thon ou maquereau en boîte', '140 g', meals(0.5), 48, true, {
    fr: 'thon au naturel boîte 140 g',
    de: 'Thunfisch Dose naturell 140 g',
  }),
  item('sardines', 'Sardines à l’huile', '115 g', meals(0.5), 48, true, {
    fr: 'sardines à l’huile boîte',
    de: 'Sardinen in Öl Dose',
  }),

  /* ---------- Légumes ---------- */
  item('crushed-tomatoes', 'Tomates concassées en boîte', '400 g', meals(0.5), 24, true, {
    fr: 'tomates concassées conserve 400 g',
    de: 'gehackte Tomaten Dose 400 g',
  }),
  item('sweetcorn', 'Maïs doux en boîte', '300 g', meals(0.5), 36, true, {
    fr: 'maïs doux conserve',
    de: 'Mais Dose',
  }),
  item(
    'canned-vegetables',
    'Légumes en boîte (petits pois-carottes, ratatouille)',
    '400 g',
    meals(0.5),
    36,
    true,
    {
      fr: 'petits pois carottes conserve 400 g',
      de: 'Erbsen und Möhren Dose 400 g',
    },
  ),

  /* ---------- Féculents secs (il faut de l'eau et un réchaud) ---------- */
  item('pasta', 'Pâtes courtes', '500 g', meals(5), 24, false, {
    fr: 'pâtes courtes 500 g',
    de: 'Nudeln 500 g',
  }),
  item('rice', 'Riz', '1 kg', meals(10), 24, false, {
    fr: 'riz 1 kg',
    de: 'Reis 1 kg',
  }),
  item('semolina', 'Semoule de couscous', '500 g', meals(5), 18, false, {
    fr: 'semoule couscous moyenne 500 g',
    de: 'Couscous 500 g',
  }),
  item('oats', 'Flocons d’avoine', '500 g', meals(10), 12, false, {
    fr: 'flocons d’avoine 500 g',
    de: 'Haferflocken 500 g',
  }),
  item('crackers', 'Crackers ou biscottes', '300 g', meals(3), 12, true, {
    fr: 'biscottes crackers',
    de: 'Knäckebrot',
  }),

  /* ---------- Les autres articles de la réserve ---------- */
  item('uht-milk', 'Lait UHT', '1 L', { templateId: 'long-life-milk', amount: 1 }, 6, true, {
    fr: 'lait UHT demi-écrémé 1 L',
    de: 'H-Milch 1 l',
  }),
  item(
    'fruit-pouches',
    'Compotes en gourde',
    '4 × 90 g',
    { templateId: 'fruit-pouches', amount: 4 },
    12,
    true,
    {
      fr: 'compote gourde lot de 4',
      de: 'Quetschie Apfelmus 4er',
    },
  ),
  item(
    'dried-fruit',
    'Fruits secs et noix',
    '200 g',
    { templateId: 'snacks-energy-bars', amount: 4 },
    12,
    true,
    {
      fr: 'mélange fruits secs noix 200 g',
      de: 'Studentenfutter 200 g',
    },
  ),
  item(
    'energy-bars',
    'Barres de céréales',
    '6 × 25 g',
    { templateId: 'snacks-energy-bars', amount: 6 },
    9,
    true,
    {
      fr: 'barres de céréales lot',
      de: 'Müsliriegel Packung',
    },
  ),
];
