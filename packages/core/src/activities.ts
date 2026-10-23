/**
 * Le côté fun (§ 4 du plan) : rituels, défi, simulation, quiz, recettes.
 * On garde la date de la dernière fois, rien de plus.
 */
import type { CountryProfile } from './country';
import { addDays, nthWeekdayOfMonth, type IsoDate } from './dates';
import { ESSENTIALS, litCount, type EssentialsState } from './essentials';
import type { StepState } from './plan';
import { TASKS, type TaskDone } from './tasks';

export const ACTIVITIES = [
  'mini-check',
  'check-up',
  'recettes',
  'defi',
  'simulation',
  'quiz',
] as const;
export type ActivityId = (typeof ACTIVITIES)[number];

/** Activités faites : identifiant → dernière date. `quiz-parfait` note un sans-faute. */
export type ActivitiesDone = Partial<Record<ActivityId | 'quiz-parfait', IsoDate>>;

/** Le dernier test des sirènes passé (aujourd'hui compris). */
export function lastMonthlyCheck(today: IsoDate, country?: CountryProfile): IsoDate {
  const weekday = country?.sirenTest?.weekday ?? 1;
  const nth = country?.sirenTest?.nth ?? 1;
  const [y, m] = today.split('-').map(Number) as [number, number];
  const thisMonth = nthWeekdayOfMonth(y, m, weekday, nth);
  if (thisMonth <= today) return thisMonth;
  return m === 1
    ? nthWeekdayOfMonth(y - 1, 12, weekday, nth)
    : nthWeekdayOfMonth(y, m - 1, weekday, nth);
}

/** Le dernier changement d'heure passé (derniers dimanches de mars et d'octobre). */
export function lastReview(today: IsoDate): IsoDate {
  const year = Number(today.slice(0, 4));
  const candidates = [
    nthWeekdayOfMonth(year, 10, 7, -1),
    nthWeekdayOfMonth(year, 3, 7, -1),
    nthWeekdayOfMonth(year - 1, 10, 7, -1),
  ];
  return candidates.find((d) => d <= today) ?? candidates[2]!;
}

/** Combien de jours le rituel reste proposé à l'accueil après sa date. */
const MINI_CHECK_WINDOW = 7;
const CHECK_UP_WINDOW = 21;

export type DueRitual = { id: 'mini-check' | 'check-up'; since: IsoDate };

/**
 * Le rituel à proposer maintenant, s'il y en a un : le check-up passe avant le mini-check.
 * Un rituel déjà fait depuis sa date n'est plus proposé.
 */
export function dueRitual(
  today: IsoDate,
  done: ActivitiesDone,
  country?: CountryProfile,
): DueRitual | null {
  const review = lastReview(today);
  if (today <= addDays(review, CHECK_UP_WINDOW) && (done['check-up'] ?? '') < review) {
    return { id: 'check-up', since: review };
  }
  const monthly = lastMonthlyCheck(today, country);
  if (today <= addDays(monthly, MINI_CHECK_WINDOW) && (done['mini-check'] ?? '') < monthly) {
    return { id: 'mini-check', since: monthly };
  }
  return null;
}

/* ---------- Paliers de progression ---------- */

export const PREP_TIERS = ['debut', 'en-route', 'week-end', 'pret', 'voisin'] as const;
export type PrepTier = (typeof PREP_TIERS)[number];

export interface PrepTierInput {
  essentials: EssentialsState;
  /** État de l'étape « Le quartier » du plan. */
  neighbourhood: StepState;
  tasks: TaskDone;
}

/**
 * Débutant → En route → Prêt pour un week-end → Prêt pour 72 h → Voisin ressource.
 * Le dernier palier demande, en plus des six lucioles, d'avoir pensé aux autres :
 * le quartier noté dans le plan et tous les gestes « avec mes proches ».
 */
export function prepTierFor(input: PrepTierInput): PrepTier {
  const lit = litCount(input.essentials);
  if (lit >= ESSENTIALS.length) {
    const entourage = TASKS.filter((t) => t.group === 'entourage');
    const caring =
      input.neighbourhood === 'done' && entourage.every((t) => Boolean(input.tasks[t.id]));
    return caring ? 'voisin' : 'pret';
  }
  if (lit >= 4) return 'week-end';
  if (lit >= 1) return 'en-route';
  return 'debut';
}
