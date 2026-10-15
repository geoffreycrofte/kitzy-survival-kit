import { describe, expect, it } from 'vitest';
import type { ItemTemplate } from './catalog';
import { addDays, daysBetween, isIsoDate, nextMonthly, nthWeekdayOfMonth } from './dates';
import type { Household } from './household';
import type { InventoryItem, Kit } from './inventory';
import {
  essentialsProgress,
  essentialsState,
  kitRows,
  nextAction,
  shoppingList,
  type Context,
} from './overview';
import { buildReminders, nextReview } from './reminders';
import { consumeFifo, itemStatus, lotState, targetFor } from './status';
import { buildIcs, utf8Length } from './ics';
import { decodeShare, encodeShare } from './share';
import { createBackup, parseBackup } from './backup';
import { emptyPlan } from './plan';

const TODAY = '2026-10-14';

const household: Household = {
  durationDays: 3,
  members: [
    { id: 'a', type: 'adult' },
    { id: 'b', type: 'adult' },
    { id: 'c', type: 'child' },
    { id: 'd', type: 'pet', petSpecies: 'dog' },
  ],
};

const catalog: ItemTemplate[] = [
  {
    id: 'drinking-water',
    category: 'water',
    name: { fr: 'Eau en bouteille' },
    source: 'official',
    home: { unit: 'L', per: 'water', amount: 1 },
    bag: { unit: 'L', per: 'household', amount: 1.5 },
    tracking: { expiry: 'ddm' },
  },
  {
    id: 'canned-meals',
    category: 'food',
    name: { fr: 'Plats en conserve' },
    source: 'official',
    home: { unit: 'portion', per: 'meal', amount: 3 },
    tracking: { expiry: 'ddm' },
  },
  {
    id: 'pet-food',
    category: 'food',
    name: { fr: 'Nourriture pour animaux' },
    source: 'official',
    home: { unit: 'portion', per: 'petDay', amount: 2 },
    tracking: { expiry: 'ddm' },
  },
  {
    id: 'baby-formula',
    category: 'food',
    name: { fr: 'Lait infantile' },
    source: 'optional',
    home: { unit: 'portion', per: 'infant', amount: 6 },
    tracking: { expiry: 'dlc' },
  },
  {
    id: 'headlamp',
    category: 'light',
    name: { fr: 'Lampe frontale' },
    source: 'official',
    home: { unit: 'piece', per: 'household', amount: 1 },
    tracking: { expiry: 'none', batteryIntervalDays: 90 },
  },
  {
    id: 'whistle',
    category: 'tools',
    name: { fr: 'Sifflet' },
    source: 'recommended',
    bag: { unit: 'piece', per: 'household', amount: 1 },
    tracking: { expiry: 'none' },
  },
];

const home: Kit = { id: 'home', type: 'home', name: 'Réserve maison' };
const bag: Kit = { id: 'bag-1', type: 'go-bag', name: 'Sac 1' };

function item(
  partial: Partial<InventoryItem> & { id: string; templateId?: string },
): InventoryItem {
  return { kitId: 'home', unit: 'piece', lots: [], updatedAt: TODAY, ...partial };
}

function ctx(items: InventoryItem[], level: Context['level'] = 'essential'): Context {
  return { catalog, household, items, level, today: TODAY };
}

describe('dates', () => {
  it('validates and shifts ISO dates', () => {
    expect(isIsoDate('2026-02-30')).toBe(false);
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
    expect(daysBetween('2026-10-14', '2026-10-26')).toBe(12);
  });

  it('finds the first Monday and the last Sunday of a month', () => {
    expect(nthWeekdayOfMonth(2026, 11, 1, 1)).toBe('2026-11-02');
    expect(nthWeekdayOfMonth(2026, 10, 7, -1)).toBe('2026-10-25');
    expect(nthWeekdayOfMonth(2027, 3, 7, -1)).toBe('2027-03-28');
    expect(nextMonthly('2026-10-14', (y, m) => nthWeekdayOfMonth(y, m, 1, 1))).toBe('2026-11-02');
  });
});

describe('targets', () => {
  it('computes water, meals and pet food for the household', () => {
    expect(targetFor({ unit: 'L', per: 'water', amount: 1 }, household)).toBe(30);
    expect(targetFor({ unit: 'portion', per: 'meal', amount: 3 }, household)).toBe(27);
    expect(targetFor({ unit: 'portion', per: 'petDay', amount: 2 }, household)).toBe(6);
    expect(targetFor({ unit: 'portion', per: 'infant', amount: 6 }, household)).toBe(0);
  });
});

describe('lots', () => {
  it('distinguishes DLC and DDM once the date has passed', () => {
    expect(
      lotState(
        { id: '1', quantity: 1, addedAt: TODAY, expiry: '2026-10-01', expiryType: 'dlc' },
        TODAY,
      ),
    ).toBe('expired');
    expect(
      lotState(
        { id: '1', quantity: 1, addedAt: TODAY, expiry: '2026-10-01', expiryType: 'ddm' },
        TODAY,
      ),
    ).toBe('past-best-before');
    expect(
      lotState(
        { id: '1', quantity: 1, addedAt: TODAY, expiry: '2026-11-01', expiryType: 'ddm' },
        TODAY,
      ),
    ).toBe('soon');
  });

  it('consumes the lot that expires first', () => {
    const lots = [
      { id: 'late', quantity: 3, addedAt: TODAY, expiry: '2027-06-01' },
      { id: 'early', quantity: 2, addedAt: TODAY, expiry: '2026-12-01' },
    ];
    expect(consumeFifo(lots, 3)).toEqual([
      { id: 'late', quantity: 2, addedAt: TODAY, expiry: '2027-06-01' },
    ]);
  });

  it('ignores expired DLC lots in the usable quantity', () => {
    const status = itemStatus(
      item({
        id: 'x',
        lots: [
          { id: '1', quantity: 4, addedAt: TODAY, expiry: '2026-09-01', expiryType: 'dlc' },
          { id: '2', quantity: 6, addedAt: TODAY, expiry: '2027-09-01', expiryType: 'dlc' },
        ],
      }),
      12,
      TODAY,
    );
    expect(status.usable).toBe(6);
    expect(status.expiredQuantity).toBe(4);
    expect(status.state).toBe('partial');
    expect(status.needsAttention).toBe(true);
  });

  it('flags a battery that needs recharging', () => {
    const status = itemStatus(
      item({
        id: 'l',
        lots: [{ id: '1', quantity: 1, addedAt: TODAY }],
        battery: { lastChargedAt: '2026-07-01', intervalDays: 90 },
      }),
      1,
      TODAY,
    );
    expect(status.battery).toEqual({ state: 'due', dueOn: '2026-09-29' });
  });
});

describe('overview', () => {
  const items = [
    item({
      id: 'w',
      templateId: 'drinking-water',
      unit: 'L',
      lots: [{ id: '1', quantity: 30, addedAt: TODAY, expiry: '2028-01-01', expiryType: 'ddm' }],
    }),
    item({
      id: 'f',
      templateId: 'canned-meals',
      unit: 'portion',
      lots: [{ id: '1', quantity: 12, addedAt: TODAY, expiry: '2028-01-01', expiryType: 'ddm' }],
    }),
  ];

  it('lists only relevant templates for the level and kit', () => {
    const keys = kitRows(home, ctx(items)).map((r) => r.key);
    expect(keys).toEqual(['drinking-water', 'canned-meals', 'pet-food', 'headlamp']);
    expect(kitRows(bag, ctx(items, 'recommended')).map((r) => r.key)).toEqual([
      'drinking-water',
      'whistle',
    ]);
  });

  it('lights the water firefly and suggests the next action', () => {
    const progress = essentialsProgress(home, ctx(items));
    const state = essentialsState(progress);
    expect(state.water).toBe(true);
    expect(state.food).toBe(false);
    const next = nextAction(progress);
    expect(next?.essential).toBe('food');
    expect(next?.row.key).toBe('pet-food');
    expect(next?.missing).toBe(6);
  });

  it('builds a merged shopping list', () => {
    const list = shoppingList([home, bag], ctx(items), [{ id: 'e', label: 'Piles AA' }]);
    const food = list.find((e) => e.key === 'canned-meals');
    expect(food?.quantity).toBe(15);
    expect(list.find((e) => e.key === 'drinking-water')?.kitNames).toEqual(['Sac 1']);
    expect(list.at(-1)?.label).toBe('Piles AA');
  });
});

describe('reminders and calendar', () => {
  const items = [
    item({
      id: 'f',
      templateId: 'canned-meals',
      lots: [
        { id: '1', quantity: 2, addedAt: TODAY, expiry: '2026-10-26', expiryType: 'ddm' },
        { id: '2', quantity: 1, addedAt: TODAY, expiry: '2026-10-26', expiryType: 'ddm' },
      ],
    }),
    item({
      id: 'l',
      templateId: 'headlamp',
      lots: [{ id: '1', quantity: 1, addedAt: TODAY }],
      battery: { lastChargedAt: '2026-10-01', intervalDays: 90 },
    }),
  ];
  const country = {
    code: 'lu',
    name: 'Luxembourg',
    source: { name: 'x', publisher: 'x', url: 'https://x' },
    emergencyNumbers: [],
    alertSystem: { name: 'LU-Alert', url: 'https://lu-alert.lu' },
    sirenTest: { weekday: 1, nth: 1, time: '12:00', description: 'x' },
    crisisRadios: [],
    usefulSites: [],
  };

  it('groups lots by date and adds the monthly and seasonal checks', () => {
    const reminders = buildReminders({ catalog, kits: [home], items, country, today: TODAY });
    expect(reminders.map((r) => [r.kind, r.date])).toEqual([
      ['review', '2026-10-25'],
      ['expiry', '2026-10-26'],
      ['monthly-check', '2026-11-02'],
      ['battery', '2026-12-30'],
    ]);
    expect(reminders[1]?.quantity).toBe(3);
    expect(nextReview('2026-10-26')).toBe('2027-03-28');
  });

  it('writes a valid calendar file', () => {
    const reminders = buildReminders({ catalog, kits: [home], items, country, today: TODAY });
    const ics = buildIcs(reminders, { country, now: new Date('2026-10-14T10:00:00Z') });
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics).toContain('RRULE:FREQ=MONTHLY;BYDAY=1MO');
    expect(ics).toContain('DTSTART;VALUE=DATE:20261026');
    expect(ics).toContain('TRIGGER:-P29DT15H');
    expect(ics.split('\r\n').every((l) => utf8Length(l) <= 75)).toBe(true);
  });
});

describe('share and backup', () => {
  it('round-trips a shared shopping list', () => {
    const payload = {
      v: 1 as const,
      type: 'shopping' as const,
      items: [
        { label: 'Eau en bouteille', quantity: 4.5, unit: 'L' as const },
        { label: 'Piles AA' },
      ],
    };
    const encoded = encodeShare(payload);
    expect(encoded).toMatch(/^k1\.[A-Za-z0-9_-]+$/);
    expect(decodeShare('#' + encoded)).toEqual({ ok: true, data: payload });
    expect(decodeShare('#k1.abc').ok).toBe(false);
    expect(decodeShare('#nope').ok).toBe(false);
  });

  it('round-trips a backup and rejects garbage', () => {
    const backup = createBackup({
      household,
      kits: [home],
      items: [],
      extras: [],
      bought: [],
      level: 'recommended',
      plan: emptyPlan(),
      tasks: { 'lu-alert': TODAY },
      barcodes: [{ code: '5410000000000', kitId: 'home', key: 'drinking-water' }],
    });
    const result = parseBackup(JSON.stringify(backup));
    expect(result.ok && result.data.kits).toEqual([home]);
    expect(result.ok && result.data.plan).toEqual(emptyPlan());
    expect(result.ok && result.data.tasks).toEqual({ 'lu-alert': TODAY });
    expect(result.ok && result.data.barcodes).toHaveLength(1);
    expect(parseBackup('{"app":"autre"}').ok).toBe(false);
    expect(parseBackup('pas du json').ok).toBe(false);
  });

  it('still reads a phase 1 backup (schema version 1)', () => {
    const v1 = {
      app: 'kitzy',
      schemaVersion: 1,
      exportedAt: '2026-10-01T10:00:00.000Z',
      household,
      kits: [home],
      items: [],
      extras: [],
      bought: [],
      level: 'essential',
    };
    const result = parseBackup(JSON.stringify(v1));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.plan).toBeNull();
      expect(result.data.tasks).toEqual({});
      expect(result.data.barcodes).toEqual([]);
    }
  });
});
