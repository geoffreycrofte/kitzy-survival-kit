/**
 * Format des traductions de contenu (catalogue, guide, gestes, recettes, quiz, simulation, produits).
 * Le français reste la source : chaque langue reprend les mêmes identifiants,
 * et tout ce qui manque retombe sur le français.
 */
import type { CategoryId } from '../catalog';
import type { GuidePage } from '../guide';
import type { Messages } from '../i18n/fr';

export interface ContentTranslation {
  catalog: {
    /** Par identifiant d'article du catalogue. */
    items: Record<string, { name: string; hint?: string; safety?: string }>;
    categories: Record<CategoryId, string>;
  };
  /** Mêmes pages (slug, chapitre, pose) et mêmes adresses de liens que le guide français. */
  guide: GuidePage[];
  /** Par identifiant de geste. */
  tasks: Record<string, { title: string; hint: string }>;
  /** Par identifiant de recette ; autant d'ingrédients et d'étapes, dans le même ordre. */
  recipes: Record<
    string,
    { title: string; summary: string; ingredients: string[]; steps: string[]; tip?: string }
  >;
  /** Par identifiant de question ; options par identifiant (a, b, c). */
  quiz: Record<string, { prompt: string; options: Record<string, string>; explanation: string }>;
  simulation: {
    /** Par identifiant d'étape ; options par identifiant. */
    steps: Record<
      string,
      {
        when: string;
        story: string[];
        question: string;
        options: Record<string, { text: string; feedback: string }>;
      }
    >;
    /** Par identifiant de vérification (`task-lu-alert`, `item-crank-radio`…). */
    checks: Record<string, string>;
  };
  /** Par identifiant de conseil d'achat. */
  products: Record<string, { name: string; why: string }>;
  /** Par identifiant de produit du garde-manger (la contenance reste celle de l'emballage). */
  pantry: Record<string, { name: string }>;
}

export interface Translation {
  messages: Messages;
  content: ContentTranslation;
}
