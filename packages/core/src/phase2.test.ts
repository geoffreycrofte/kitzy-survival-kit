import { describe, expect, it } from 'vitest';
import type { Household } from './household';
import {
  emptyPlan,
  hasSensitiveData,
  planProgress,
  planReviewDate,
  prefillPlan,
  PlanSchema,
  withoutHealthData,
} from './plan';
import { digest, dueOn, pushSchedule, shouldNotify } from './notify';
import { buildReminders, type Reminder } from './reminders';
import { buildIcs } from './ics';

const TODAY = '2026-10-14';

const household: Household = {
  durationDays: 3,
  members: [
    { id: 'a', type: 'adult' },
    { id: 'b', type: 'senior' },
    { id: 'c', type: 'infant' },
    { id: 'd', type: 'pet', petSpecies: 'cat' },
  ],
};

let n = 0;
const newId = () => `id-${++n}`;

describe('emergency plan', () => {
  it('prefills people and pets from the household, once', () => {
    const plan = prefillPlan(emptyPlan(), household, newId);
    expect(plan.adults).toBe(2);
    expect(plan.children).toBe(1);
    expect(plan.people).toHaveLength(3);
    expect(plan.pets).toEqual([{ id: expect.any(String), species: 'Chat', name: '', info: '' }]);
    // Déjà rempli : on ne touche à rien
    const again = prefillPlan(plan, { ...household, members: [] }, newId);
    expect(again.people).toBe(plan.people);
  });

  it('tracks progress per step', () => {
    const plan = prefillPlan(emptyPlan(), household, newId);
    expect(planProgress(null).foyer).toBe('empty');
    plan.owner.name = 'Famille Muller';
    plan.people[0]!.firstName = 'Léa';
    expect(planProgress(plan).foyer).toBe('started');
    plan.people.forEach((p) => (p.firstName = 'X'));
    expect(planProgress(plan).foyer).toBe('done');

    plan.emergency.meeting1 = 'Devant l’église';
    expect(planProgress(plan).urgence).toBe('started');
    plan.emergency.contact1 = { name: 'Tante Anne', phone: '+352 621 000 000' };
    expect(planProgress(plan).urgence).toBe('done');

    plan.providers.electricity.name = 'Enovos';
    expect(planProgress(plan).numeros).toBe('started');
  });

  it('removes health data when consent is withdrawn', () => {
    const plan = prefillPlan(emptyPlan(), household, newId);
    plan.healthConsent = true;
    plan.people[0]!.allergies = 'Pénicilline';
    plan.people[0]!.firstName = 'Léa';
    expect(hasSensitiveData(plan)).toBe(true);
    const clean = withoutHealthData(plan);
    expect(hasSensitiveData(clean)).toBe(false);
    expect(clean.healthConsent).toBe(false);
    expect(clean.people[0]!.firstName).toBe('Léa');
  });

  it('validates a plan and fills missing text fields', () => {
    expect(PlanSchema.safeParse(emptyPlan()).success).toBe(true);
    const partial = JSON.parse(JSON.stringify(emptyPlan()));
    delete partial.owner.city;
    const parsed = PlanSchema.parse(partial);
    expect(parsed.owner.city).toBe('');
    expect(PlanSchema.safeParse({ ...emptyPlan(), adults: -1 }).success).toBe(false);
  });

  it('schedules a yearly review', () => {
    expect(planReviewDate(null)).toBeNull();
    expect(planReviewDate({ ...emptyPlan(), updatedAt: TODAY })).toBe('2027-10-14');
    const reminders = buildReminders({
      catalog: [],
      kits: [],
      items: [],
      today: TODAY,
      planReview: '2027-10-14',
    });
    expect(reminders.find((r) => r.kind === 'plan-review')?.date).toBe('2027-10-14');
    expect(buildIcs(reminders)).toContain('relire mon plan');
  });
});

const r = (over: Partial<Reminder>): Reminder => ({
  id: 'x',
  kind: 'expiry',
  date: TODAY,
  title: 'Riz',
  expiryType: 'dlc',
  alertDaysBefore: [30, 7, 0],
  ...over,
});

describe('notifications', () => {
  it('picks reminders on their alert days only', () => {
    expect(dueOn([r({ date: '2026-10-21' })], TODAY)).toHaveLength(1); // J-7
    expect(dueOn([r({ date: '2026-10-22' })], TODAY)).toHaveLength(0); // J-8
    expect(dueOn([r({ date: '2026-10-07' })], TODAY)).toHaveLength(1); // 7 jours de retard
    expect(dueOn([r({ date: '2026-10-08' })], TODAY)).toHaveLength(0);
    expect(dueOn([r({ kind: 'review', date: '2026-10-07' })], TODAY)).toHaveLength(0);
  });

  it('groups several reminders into one notification', () => {
    expect(digest([], TODAY)).toBeNull();
    expect(digest([r({})], TODAY)?.body).toBe('Riz\u202f: date limite aujourd’hui');
    const many = digest(
      [
        r({}),
        r({ id: 'b', kind: 'battery', title: 'Lampe' }),
        r({ id: 'c', kind: 'monthly-check' }),
        r({ id: 'd', title: 'Pâtes', expiryType: 'ddm', date: '2026-11-13' }),
      ],
      TODAY,
    );
    expect(many?.title).toBe('Kitzy\u202f: 4 rappels pour ton kit');
    expect(many?.body.split('\n')).toHaveLength(4);
    expect(many?.body).toContain('et 1 de plus');
  });

  it('notifies at most once a day', () => {
    expect(shouldNotify(undefined, TODAY)).toBe(true);
    expect(shouldNotify(TODAY, TODAY)).toBe(false);
    expect(shouldNotify('2026-10-13', TODAY)).toBe(true);
  });

  it('builds an opaque push schedule with dates only', () => {
    const schedule = pushSchedule([r({ date: '2026-11-20' }), r({ id: 'y' })], TODAY, 'sel');
    expect(schedule.map((e) => e.date)).toEqual([
      '2026-10-14',
      '2026-10-21',
      '2026-11-13',
      '2026-11-20',
    ]);
    expect(JSON.stringify(schedule)).not.toContain('Riz');
    expect(schedule[0]!.id).toMatch(/^[0-9a-f]{8}$/);
    expect(pushSchedule([r({})], TODAY, 'autre')[0]!.id).not.toBe(schedule[0]!.id);
  });
});
