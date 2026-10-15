/**
 * Gestes et actions qui ne sont pas des objets (§ 2.14 du plan).
 * On les coche une fois faits ; on peut les décocher pour les refaire.
 */
import type { IsoDate } from './dates';

export const TASK_GROUPS = ['alerte', 'maison', 'entourage'] as const;
export type TaskGroup = (typeof TASK_GROUPS)[number];

export interface TaskTemplate {
  id: string;
  /** Regroupement à l'écran : être alerté, chez moi, avec mes proches. */
  group: TaskGroup;
  source: 'official' | 'recommended';
  title: string;
  hint: string;
  /** Page du guide, écran de l'app ou site externe pour passer à l'action. */
  guide?: string;
  route?: string;
  url?: string;
}

export const TASKS: readonly TaskTemplate[] = [
  {
    id: 'lu-alert',
    group: 'alerte',
    source: 'official',
    title: 'Installer LU-Alert',
    hint: 'L’app officielle d’alerte. Choisis les communes qui te concernent : maison, travail, école.',
    guide: 'alerte-lu-alert',
    url: 'https://www.lu-alert.lu',
  },
  {
    id: 'plan',
    group: 'maison',
    source: 'official',
    title: 'Remplir mon plan personnel d’urgence',
    hint: 'Qui appeler, où se retrouver, où sont les robinets. Puis l’imprimer.',
    route: '/plan',
  },
  {
    id: 'sirens',
    group: 'alerte',
    source: 'official',
    title: 'Reconnaître les signaux des sirènes',
    hint: 'Elles sont testées le premier lundi de chaque mois à midi.',
    guide: 'sirenes',
  },
  {
    id: 'shutoffs',
    group: 'maison',
    source: 'recommended',
    title: 'Savoir couper le gaz, l’eau et l’électricité',
    hint: 'Repère les robinets et le disjoncteur, et essaie une fois.',
    route: '/plan/maison',
  },
  {
    id: 'flood-zones',
    group: 'alerte',
    source: 'official',
    title: 'Vérifier si ma maison est en zone inondable',
    hint: 'La carte des zones inondables est sur le géoportail de l’eau.',
    url: 'https://eau.geoportail.lu',
  },
  {
    id: 'meeting-point',
    group: 'entourage',
    source: 'recommended',
    title: 'Choisir deux points de rendez-vous',
    hint: 'Un près de la maison, un autre hors du quartier, si le foyer est séparé.',
    route: '/plan/urgence',
  },
  {
    id: 'nearby-services',
    group: 'entourage',
    source: 'official',
    title: 'Repérer le centre de secours, la police et l’hôpital les plus proches',
    hint: 'Près de la maison et près du travail.',
    route: '/plan/urgence',
  },
  {
    id: 'radio',
    group: 'alerte',
    source: 'official',
    title: 'Noter les fréquences de RTL et de la radio 100,7',
    hint: 'Les radios officielles en cas de crise. Les fréquences changent selon la région.',
    guide: 'bien-s-informer',
  },
  {
    id: 'garage-exit',
    group: 'maison',
    source: 'official',
    title: 'Savoir ouvrir la porte du garage sans électricité',
    hint: 'Et prévoir une autre sortie si la porte principale est bloquée.',
    route: '/plan/maison',
  },
  {
    id: 'neighbors',
    group: 'entourage',
    source: 'official',
    title: 'Noter qui peut aider, et qui aura besoin d’aide',
    hint: 'Une voisine qui bricole, un voisin âgé qui vit seul…',
    route: '/plan/quartier',
  },
  {
    id: 'car-tank',
    group: 'maison',
    source: 'recommended',
    title: 'Garder le réservoir de la voiture au moins à moitié plein',
    hint: 'Les stations-service ne fonctionnent plus sans électricité.',
  },
  {
    id: 'backups',
    group: 'maison',
    source: 'official',
    title: 'Faire des copies de mes documents et photos',
    hint: 'Sur une clé USB dans le kit, et une copie ailleurs.',
    guide: 'a-quoi-se-preparer',
  },
  {
    id: 'passwords',
    group: 'maison',
    source: 'official',
    title: 'Utiliser un gestionnaire de mots de passe et la double authentification',
    hint: 'La meilleure protection contre les attaques informatiques.',
    guide: 'a-quoi-se-preparer',
  },
  {
    id: 'first-aid',
    group: 'entourage',
    source: 'official',
    title: 'Suivre un cours de premiers secours',
    hint: 'La Croix-Rouge et le CGDIS en proposent toute l’année.',
    url: 'https://cours.cgdis.lu',
  },
  {
    id: 'empty-bag',
    group: 'maison',
    source: 'official',
    title: 'Préparer un sac vide, prêt à remplir',
    hint: 'Pour emporter l’essentiel en quelques minutes en cas d’évacuation.',
    route: '/kits',
  },
  {
    id: 'talk',
    group: 'entourage',
    source: 'official',
    title: 'Parler du kit à mes proches',
    hint: 'Surtout aux personnes âgées ou isolées. « Parlez-en autour de vous. »',
    guide: 'entraide',
  },
];

/** Gestes faits : identifiant → date. */
export type TaskDone = Record<string, IsoDate>;

export function tasksProgress(done: TaskDone): { done: number; total: number } {
  return { done: TASKS.filter((t) => done[t.id]).length, total: TASKS.length };
}
