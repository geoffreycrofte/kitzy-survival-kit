import { describe, expect, it } from 'vitest';
import { dueRitual, lastMonthlyCheck, lastReview, prepTierFor } from './activities';
import { emptyEssentials, type EssentialsState } from './essentials';
import { GUIDE } from './data/guide';
import { QUIZ } from './data/quiz';
import { RECIPES } from './data/recipes';
import { CATALOG } from './data/catalog';
import type { KitRow } from './overview';
import { emptyPlan } from './plan';
import { quizScore } from './quiz';
import { foodToRotate, recipesFor } from './recipes';
import { SIMULATION, simulationReport } from './simulation';
import { TASKS } from './tasks';

const allLit: EssentialsState = {
  water: true,
  food: true,
  light: true,
  warmth: true,
  care: true,
  plan: true,
};

describe('rituels', () => {
  it('finds the last siren test and the last change of time', () => {
    expect(lastMonthlyCheck('2026-11-02')).toBe('2026-11-02');
    expect(lastMonthlyCheck('2026-11-01')).toBe('2026-10-05');
    expect(lastMonthlyCheck('2027-01-03')).toBe('2026-12-07');
    expect(lastReview('2026-10-26')).toBe('2026-10-25');
    expect(lastReview('2026-10-24')).toBe('2026-03-29');
    expect(lastReview('2026-02-01')).toBe('2025-10-26');
  });

  it('offers the check-up first, then the monthly mini-check, until it is done', () => {
    expect(dueRitual('2026-11-03', {})).toEqual({ id: 'check-up', since: '2026-10-25' });
    expect(dueRitual('2026-11-03', { 'check-up': '2026-10-30' })).toEqual({
      id: 'mini-check',
      since: '2026-11-02',
    });
    expect(
      dueRitual('2026-11-03', { 'check-up': '2026-10-30', 'mini-check': '2026-11-02' }),
    ).toBeNull();
    // Passé la fenêtre, on ne relance plus.
    expect(dueRitual('2026-12-01', {})).toBeNull();
  });
});

describe('paliers', () => {
  it('climbs from beginner to resourceful neighbour', () => {
    const base = { neighbourhood: 'empty' as const, tasks: {} };
    expect(prepTierFor({ ...base, essentials: emptyEssentials() })).toBe('debut');
    expect(prepTierFor({ ...base, essentials: { ...emptyEssentials(), water: true } })).toBe(
      'en-route',
    );
    expect(prepTierFor({ ...base, essentials: { ...allLit, care: false, plan: false } })).toBe(
      'week-end',
    );
    expect(prepTierFor({ ...base, essentials: allLit })).toBe('pret');
    const tasks = Object.fromEntries(
      TASKS.filter((t) => t.group === 'entourage').map((t) => [t.id, '2026-10-01']),
    );
    expect(prepTierFor({ essentials: allLit, neighbourhood: 'done', tasks })).toBe('voisin');
  });
});

describe('recettes', () => {
  const row = (templateId: string, nextExpiry?: string): KitRow =>
    ({
      key: templateId,
      category: 'food',
      status: { quantity: 2, expiredQuantity: 0, nextExpiry },
    }) as unknown as KitRow;

  it('suggests recipes for food that is about to expire', () => {
    const rows = [row('canned-meals', '2026-11-01'), row('pasta-rice', '2027-06-01')];
    const soon = foodToRotate(rows, '2026-10-22');
    expect(soon.map((r) => r.key)).toEqual(['canned-meals']);
    const recipes = recipesFor(RECIPES, ['canned-meals', 'long-life-milk']);
    expect(recipes.length).toBeGreaterThan(0);
    expect(
      recipes.every((r) =>
        r.ingredients.some(
          (i) => i.templateId === 'canned-meals' || i.templateId === 'long-life-milk',
        ),
      ),
    ).toBe(true);
  });

  it('only links recipes to real catalog items', () => {
    const ids = new Set(CATALOG.map((t) => t.id));
    for (const recipe of RECIPES) {
      for (const i of recipe.ingredients)
        if (i.templateId) expect(ids.has(i.templateId)).toBe(true);
    }
    expect(new Set(RECIPES.map((r) => r.id)).size).toBe(RECIPES.length);
  });
});

describe('quiz', () => {
  it('has valid answers and guide pages', () => {
    const slugs = new Set(GUIDE.map((p) => p.slug));
    for (const q of QUIZ) {
      expect(q.options.map((o) => o.id)).toContain(q.answer);
      expect(slugs.has(q.guide)).toBe(true);
    }
    const perfect = Object.fromEntries(QUIZ.map((q) => [q.id, q.answer]));
    expect(quizScore(QUIZ, perfect)).toBe(QUIZ.length);
    expect(quizScore(QUIZ, {})).toBe(0);
  });
});

describe('simulation', () => {
  it('has exactly one good choice per step and reports what was missing', () => {
    for (const step of SIMULATION) {
      expect(step.choice.options.filter((o) => o.good)).toHaveLength(1);
    }
    const plan = emptyPlan();
    plan.emergency.meeting1 = 'Le parc';
    const report = simulationReport({
      essentials: { ...emptyEssentials(), water: true },
      owned: new Set(['crank-radio']),
      plan,
      tasks: {},
    });
    const ready = report.ready.map((c) => c.id);
    expect(ready).toEqual(
      expect.arrayContaining(['item-crank-radio', 'plan-meeting', 'essential-water']),
    );
    expect(report.missing.map((c) => c.id)).toContain('task-lu-alert');
    expect(report.ready.length + report.missing.length).toBe(
      SIMULATION.flatMap((s) => s.checks).length,
    );
  });

  it('only links to real catalog items', () => {
    const ids = new Set(CATALOG.map((t) => t.id));
    for (const c of SIMULATION.flatMap((s) => s.checks)) {
      if (c.id.startsWith('item-')) expect(ids.has(c.id.slice(5))).toBe(true);
    }
  });
});
