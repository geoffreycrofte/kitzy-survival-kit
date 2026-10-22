import { describe, expect, it } from 'vitest';
import type { ItemTemplate } from './catalog';
import { emptyEssentials } from './essentials';
import type { Household } from './household';
import type { InventoryItem, Kit } from './inventory';
import type { Context } from './overview';
import { emptyPlan } from './plan';
import { ACHIEVEMENTS, dashboard, newAchievements, type AchievementInput } from './progress';
import { TASKS } from './tasks';

const TODAY = '2026-10-14';
const household: Household = { durationDays: 3, members: [{ id: 'a', type: 'adult' }] };

const catalog: ItemTemplate[] = [
  {
    id: 'drinking-water',
    category: 'water',
    name: { fr: 'Eau en bouteille' },
    source: 'official',
    home: { unit: 'L', per: 'water', amount: 1 },
    bag: { unit: 'L', per: 'household', amount: 1.5 },
    tracking: { expiry: 'none' },
  },
  {
    id: 'headlamp',
    category: 'light',
    name: { fr: 'Lampe frontale' },
    source: 'official',
    home: { unit: 'piece', per: 'household', amount: 1 },
    tracking: { expiry: 'none' },
  },
];

const home: Kit = { id: 'home', type: 'home', name: 'Réserve maison' };
const bag: Kit = { id: 'bag-1', type: 'go-bag', name: 'Sac 1' };

function lot(kitId: string, templateId: string, quantity: number): InventoryItem {
  return {
    id: `${kitId}-${templateId}`,
    kitId,
    templateId,
    unit: 'L',
    lots: [{ id: 'l', quantity, addedAt: TODAY }],
    updatedAt: TODAY,
  };
}

const ctx = (items: InventoryItem[]): Context => ({
  catalog,
  household,
  items,
  level: 'essential',
  today: TODAY,
});

describe('dashboard', () => {
  it('counts gathered items across kits, ready bags, plan steps and gestures', () => {
    const items = [lot('home', 'drinking-water', 9), lot('bag-1', 'drinking-water', 1.5)];
    const plan = emptyPlan();
    plan.owner.name = 'Camille';
    const d = dashboard([home, bag], ctx(items), plan, { 'lu-alert': TODAY });
    expect(d.stock).toMatchObject({ done: 2, total: 3 });
    expect(d.stock.value).toBeCloseTo(2 / 3);
    expect(d.bags).toEqual({ ready: 1, total: 1 });
    expect(d.plan).toMatchObject({ done: 0, started: 1, total: 5, value: 0.1 });
    expect(d.tasks).toMatchObject({ done: 1, total: TASKS.length });
  });

  it('is empty, not broken, without kits', () => {
    const d = dashboard([], ctx([]), null, {});
    expect(d.stock).toEqual({ done: 0, total: 0, value: 0 });
    expect(d.plan.value).toBe(0);
  });
});

describe('achievements', () => {
  const base = (): AchievementInput => ({
    hasHousehold: true,
    hasItems: false,
    essentials: emptyEssentials(),
    dashboard: dashboard([home], ctx([]), null, {}),
  });

  it('unlocks the first step and keeps what was already reached', () => {
    expect(newAchievements(base(), {})).toEqual(['terrier']);
    expect(newAchievements(base(), { terrier: TODAY })).toEqual([]);
  });

  it('lights the water spring and the whole night', () => {
    const input = base();
    input.hasItems = true;
    input.essentials = { ...emptyEssentials(), water: true };
    expect(newAchievements(input, {})).toEqual([
      'terrier',
      'premier-rangement',
      'premiere-luciole',
      'source',
    ]);
    input.essentials = {
      water: true,
      food: true,
      light: true,
      warmth: true,
      care: true,
      plan: true,
    };
    expect(newAchievements(input, {})).toContain('nuit-etoilee');
  });

  it('has unique identifiers', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
