/**
 * Contenus dans la langue choisie : catalogue, guide, gestes, recettes, quiz, simulation, produits.
 * Le français est la source ; une traduction manquante retombe toujours sur le français.
 */
import { CATEGORIES, type CategoryId, type ItemTemplate } from './catalog';
import { CATALOG as CATALOG_FR } from './data/catalog';
import { GUIDE as GUIDE_FR } from './data/guide';
import { PANTRY as PANTRY_FR } from './data/pantry';
import { PRODUCTS as PRODUCTS_FR } from './data/products';
import { QUIZ as QUIZ_FR } from './data/quiz';
import { RECIPES as RECIPES_FR } from './data/recipes';
import type { GuidePage } from './guide';
import { fr } from './i18n/fr';
import type { Messages } from './i18n/fr';
import type { Locale } from './i18n/locales';
import type { PantryItem } from './pantry';
import type { Product } from './products';
import type { QuizQuestion } from './quiz';
import type { Recipe } from './recipes';
import { SIMULATION as SIMULATION_FR, type SimulationStep } from './simulation';
import { TASKS as TASKS_FR, type TaskTemplate } from './tasks';
import { de } from './translations/de';
import { en } from './translations/en';
import { lb } from './translations/lb';
import { pt } from './translations/pt';
import type { ContentTranslation, Translation } from './translations/types';

export const TRANSLATIONS: Readonly<Record<Exclude<Locale, 'fr'>, Translation>> = {
  en,
  lb,
  de,
  pt,
};

/** Les textes de l'interface d'une langue. */
export function messagesFor(locale: Locale): Messages {
  return locale === 'fr' ? fr : TRANSLATIONS[locale].messages;
}

function translation(locale: Locale): ContentTranslation | undefined {
  return locale === 'fr' ? undefined : TRANSLATIONS[locale].content;
}

/**
 * Le catalogue, avec les noms, conseils et mises en garde dans toutes les langues traduites.
 * On lit ensuite chaque texte avec `tx(texte, langue)`.
 */
export const CATALOG: readonly ItemTemplate[] = CATALOG_FR.map((template) => {
  const name = { ...template.name };
  const hint = template.hint ? { ...template.hint } : undefined;
  const safety = template.safety ? { ...template.safety } : undefined;
  for (const [locale, t] of Object.entries(TRANSLATIONS) as Array<[Locale, Translation]>) {
    const item = t.content.catalog.items[template.id];
    if (!item) continue;
    name[locale] = item.name;
    if (hint && item.hint) hint[locale] = item.hint;
    if (safety && item.safety) safety[locale] = item.safety;
  }
  return { ...template, name, ...(hint ? { hint } : {}), ...(safety ? { safety } : {}) };
});

export function categoryName(id: CategoryId, locale: Locale = 'fr'): string {
  const translated = translation(locale)?.catalog.categories[id];
  return translated ?? CATEGORIES.find((c) => c.id === id)?.name.fr ?? id;
}

export interface Content {
  guide: readonly GuidePage[];
  tasks: readonly TaskTemplate[];
  recipes: readonly Recipe[];
  quiz: readonly QuizQuestion[];
  simulation: readonly SimulationStep[];
  products: readonly Product[];
  pantry: readonly PantryItem[];
}

function sameLength<T>(a: readonly T[] | undefined, b: readonly unknown[]): a is T[] {
  return Array.isArray(a) && a.length === b.length;
}

function build(t: ContentTranslation | undefined): Content {
  if (!t) {
    return {
      guide: GUIDE_FR,
      tasks: TASKS_FR,
      recipes: RECIPES_FR,
      quiz: QUIZ_FR,
      simulation: SIMULATION_FR,
      products: PRODUCTS_FR,
      pantry: PANTRY_FR,
    };
  }
  return {
    // Page par page : une page non traduite reste en français.
    guide: GUIDE_FR.map((page) => t.guide.find((p) => p.slug === page.slug) ?? page),
    tasks: TASKS_FR.map((task) => ({ ...task, ...t.tasks[task.id] })),
    recipes: RECIPES_FR.map((recipe) => {
      const r = t.recipes[recipe.id];
      if (!r) return recipe;
      return {
        ...recipe,
        title: r.title,
        summary: r.summary,
        tip: r.tip ?? recipe.tip,
        ingredients: sameLength(r.ingredients, recipe.ingredients)
          ? recipe.ingredients.map((ing, i) => ({ ...ing, text: r.ingredients[i]! }))
          : recipe.ingredients,
        steps: sameLength(r.steps, recipe.steps) ? r.steps : recipe.steps,
      };
    }),
    quiz: QUIZ_FR.map((q) => {
      const tq = t.quiz[q.id];
      if (!tq) return q;
      return {
        ...q,
        prompt: tq.prompt,
        explanation: tq.explanation,
        options: q.options.map((o) => ({ ...o, text: tq.options[o.id] ?? o.text })),
      };
    }),
    simulation: SIMULATION_FR.map((step) => {
      const ts = t.simulation.steps[step.id];
      return {
        ...step,
        ...(ts
          ? {
              when: ts.when,
              story: sameLength(ts.story, step.story) ? ts.story : step.story,
            }
          : {}),
        choice: {
          question: ts?.question ?? step.choice.question,
          options: step.choice.options.map((o) => ({ ...o, ...ts?.options[o.id] })),
        },
        checks: step.checks.map((c) => {
          const label = t.simulation.checks[c.id];
          return label ? { ...c, label, ...(c.shopping ? { shopping: label } : {}) } : c;
        }),
      };
    }),
    products: PRODUCTS_FR.map((p) => ({ ...p, ...t.products[p.id] })),
    pantry: PANTRY_FR.map((p) => ({ ...p, ...t.pantry[p.id] })),
  };
}

const cache = new Map<Locale, Content>();

/** Tous les contenus d'une langue (calculés une fois). */
export function contentFor(locale: Locale): Content {
  let content = cache.get(locale);
  if (!content) {
    content = build(translation(locale));
    cache.set(locale, content);
  }
  return content;
}
