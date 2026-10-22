import { describe, expect, it } from 'vitest';
import { CATEGORIES } from '../catalog';
import { TRANSLATIONS, contentFor } from '../content';
import { CATALOG } from '../data/catalog';
import { GUIDE } from '../data/guide';
import { PRODUCTS } from '../data/products';
import { QUIZ } from '../data/quiz';
import { RECIPES } from '../data/recipes';
import { fr } from '../i18n/fr';
import { SIMULATION } from '../simulation';
import { TASKS } from '../tasks';

type Tree = { readonly [key: string]: string | Tree };

/** Toutes les feuilles : chemin → texte. */
function leaves(tree: Tree, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out.set(path, value);
    else for (const [p, v] of leaves(value, path)) out.set(p, v);
  }
  return out;
}

const placeholders = (text: string) =>
  [...text.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1]).sort();

const source = leaves(fr as unknown as Tree);

describe.each(Object.entries(TRANSLATIONS))('traduction %s', (_, translation) => {
  const messages = leaves(translation.messages as unknown as Tree);

  it('has every interface text, with the same placeholders', () => {
    expect([...messages.keys()].sort()).toEqual([...source.keys()].sort());
    for (const [path, text] of source) {
      const translated = messages.get(path) ?? '';
      expect(translated.trim(), path).not.toBe('');
      expect(placeholders(translated), path).toEqual(placeholders(text));
    }
  });

  it('does not use French narrow no-break spaces', () => {
    const all = JSON.stringify(translation);
    expect(all.includes(' ')).toBe(false);
  });

  it('covers the catalog and its categories', () => {
    const { items, categories } = translation.content.catalog;
    for (const t of CATALOG) {
      expect(items[t.id]?.name, t.id).toBeTruthy();
      expect(Boolean(items[t.id]?.hint), `${t.id} hint`).toBe(Boolean(t.hint));
      expect(Boolean(items[t.id]?.safety), `${t.id} safety`).toBe(Boolean(t.safety));
    }
    for (const c of CATEGORIES) expect(categories[c.id], c.id).toBeTruthy();
  });

  it('translates every guide page with the same structure and links', () => {
    expect(translation.content.guide.map((p) => p.slug)).toEqual(GUIDE.map((p) => p.slug));
    for (const page of GUIDE) {
      const t = translation.content.guide.find((p) => p.slug === page.slug)!;
      expect(t.chapter).toBe(page.chapter);
      expect(t.pose).toBe(page.pose);
      expect(
        t.blocks.map((b) => b.type),
        page.slug,
      ).toEqual(page.blocks.map((b) => b.type));
      expect((t.links ?? []).map((l) => l.url)).toEqual((page.links ?? []).map((l) => l.url));
    }
  });

  it('covers gestures, recipes, quiz, simulation and products', () => {
    const c = translation.content;
    for (const task of TASKS) expect(c.tasks[task.id]?.title, task.id).toBeTruthy();
    for (const r of RECIPES) {
      expect(c.recipes[r.id]?.ingredients, r.id).toHaveLength(r.ingredients.length);
      expect(c.recipes[r.id]?.steps, r.id).toHaveLength(r.steps.length);
    }
    for (const q of QUIZ) {
      expect(Object.keys(c.quiz[q.id]?.options ?? {}).sort(), q.id).toEqual(
        q.options.map((o) => o.id).sort(),
      );
    }
    for (const step of SIMULATION) {
      const t = c.simulation.steps[step.id];
      expect(t?.story, step.id).toHaveLength(step.story.length);
      expect(Object.keys(t?.options ?? {}).sort(), step.id).toEqual(
        step.choice.options.map((o) => o.id).sort(),
      );
      for (const check of step.checks) expect(c.simulation.checks[check.id], check.id).toBeTruthy();
    }
    for (const p of PRODUCTS) expect(c.products[p.id]?.name, p.id).toBeTruthy();
  });
});

describe('contentFor', () => {
  it('keeps ids, answers and links from the French source', () => {
    const en = contentFor('en');
    expect(en.quiz.map((q) => q.answer)).toEqual(QUIZ.map((q) => q.answer));
    expect(en.recipes.flatMap((r) => r.ingredients.map((i) => i.templateId))).toEqual(
      RECIPES.flatMap((r) => r.ingredients.map((i) => i.templateId)),
    );
    expect(en.simulation.map((s) => s.choice.options.find((o) => o.good)?.id)).toEqual(
      SIMULATION.map((s) => s.choice.options.find((o) => o.good)?.id),
    );
    expect(contentFor('fr').guide).toBe(GUIDE);
  });
});
