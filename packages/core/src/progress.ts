/**
 * Tableau de bord de l'accueil et succès à débloquer.
 * Tout est calculé à partir des données : rien à saisir en plus.
 */
import type { ActivitiesDone } from './activities';
import type { IsoDate } from './dates';
import { ESSENTIALS, litCount, type EssentialsState } from './essentials';
import type { Kit } from './inventory';
import { kitRows, type Context } from './overview';
import { PLAN_STEPS, planInfo, type EmergencyPlan, type PlanInfo } from './plan';
import { tasksProgress, type TaskDone } from './tasks';

export interface Progress {
  done: number;
  total: number;
  /** Avancement affiché par la jauge, entre 0 et 1 */
  value: number;
}

export interface Dashboard {
  /** Articles réunis dans tous les kits (ce que la liste de courses fait avancer). */
  stock: Progress;
  /** Étapes du plan terminées ; une étape commencée compte pour moitié dans la jauge. */
  plan: Progress & { started: number };
  tasks: Progress;
  /** Sacs dont tous les articles sont réunis. */
  bags: { ready: number; total: number };
}

const ratio = (part: number, total: number) => (total > 0 ? Math.min(1, part / total) : 0);

export function dashboard(
  kits: readonly Kit[],
  ctx: Context,
  plan: EmergencyPlan | PlanInfo | null,
  tasks: TaskDone,
): Dashboard {
  let rowsTotal = 0;
  let rowsDone = 0;
  let coverage = 0;
  let bagsReady = 0;
  let bagsTotal = 0;
  for (const kit of kits) {
    const rows = kitRows(kit, ctx);
    const complete = rows.filter((r) => r.status.state === 'complete').length;
    rowsTotal += rows.length;
    rowsDone += complete;
    coverage += rows.reduce((sum, r) => sum + r.status.coverage, 0);
    if (kit.type === 'go-bag') {
      bagsTotal += 1;
      if (rows.length > 0 && complete === rows.length) bagsReady += 1;
    }
  }

  const steps = planInfo(plan).steps;
  const planDone = PLAN_STEPS.filter((s) => steps[s] === 'done').length;
  const planStarted = PLAN_STEPS.filter((s) => steps[s] === 'started').length;
  const gestures = tasksProgress(tasks);

  return {
    stock: { done: rowsDone, total: rowsTotal, value: ratio(coverage, rowsTotal) },
    plan: {
      done: planDone,
      started: planStarted,
      total: PLAN_STEPS.length,
      value: ratio(planDone + planStarted / 2, PLAN_STEPS.length),
    },
    tasks: { ...gestures, value: ratio(gestures.done, gestures.total) },
    bags: { ready: bagsReady, total: bagsTotal },
  };
}

/* ---------- Succès ---------- */

export interface AchievementInput {
  hasHousehold: boolean;
  /** Au moins un article noté dans un kit. */
  hasItems: boolean;
  essentials: EssentialsState;
  dashboard: Dashboard;
  activities: ActivitiesDone;
}

export interface Achievement {
  id: string;
  /** Regroupement à l'écran. */
  group: 'reserves' | 'plan' | 'gestes' | 'activites';
  test: (input: AchievementInput) => boolean;
}

/** L'ordre est celui du parcours conseillé : du premier pas au tout complet. */
export const ACHIEVEMENTS: readonly Achievement[] = [
  { id: 'terrier', group: 'reserves', test: (i) => i.hasHousehold },
  { id: 'premier-rangement', group: 'reserves', test: (i) => i.hasItems },
  { id: 'premiere-luciole', group: 'reserves', test: (i) => litCount(i.essentials) >= 1 },
  { id: 'source', group: 'reserves', test: (i) => i.essentials.water },
  { id: 'mi-chemin', group: 'reserves', test: (i) => litCount(i.essentials) >= 3 },
  {
    id: 'nuit-etoilee',
    group: 'reserves',
    test: (i) => litCount(i.essentials) === ESSENTIALS.length,
  },
  { id: 'sac-pret', group: 'reserves', test: (i) => i.dashboard.bags.ready >= 1 },
  {
    id: 'garde-manger',
    group: 'reserves',
    test: (i) => i.dashboard.stock.total > 0 && i.dashboard.stock.done === i.dashboard.stock.total,
  },
  {
    id: 'premieres-lignes',
    group: 'plan',
    test: (i) => i.dashboard.plan.done + i.dashboard.plan.started > 0,
  },
  {
    id: 'plan-au-point',
    group: 'plan',
    test: (i) => i.dashboard.plan.done === i.dashboard.plan.total,
  },
  { id: 'premier-geste', group: 'gestes', test: (i) => i.dashboard.tasks.done >= 1 },
  {
    id: 'bons-reflexes',
    group: 'gestes',
    test: (i) => i.dashboard.tasks.total > 0 && i.dashboard.tasks.done === i.dashboard.tasks.total,
  },
  { id: 'premier-lundi', group: 'activites', test: (i) => Boolean(i.activities['mini-check']) },
  { id: 'grand-check-up', group: 'activites', test: (i) => Boolean(i.activities['check-up']) },
  { id: 'soiree-conserves', group: 'activites', test: (i) => Boolean(i.activities.recettes) },
  { id: 'soiree-lanterne', group: 'activites', test: (i) => Boolean(i.activities.defi) },
  { id: 'trois-jours', group: 'activites', test: (i) => Boolean(i.activities.simulation) },
  { id: 'sans-faute', group: 'activites', test: (i) => Boolean(i.activities['quiz-parfait']) },
];

/** Succès débloqués : identifiant → date du premier déblocage. */
export type AchievementsDone = Record<string, IsoDate>;

/** Ce qui vient d'être atteint et n'était pas encore noté. Un succès reste acquis. */
export function newAchievements(input: AchievementInput, done: AchievementsDone): string[] {
  return ACHIEVEMENTS.filter((a) => !done[a.id] && a.test(input)).map((a) => a.id);
}
