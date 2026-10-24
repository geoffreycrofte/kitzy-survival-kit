/**
 * Simulation 72 h (§ 4 du plan) : le scénario du guide officiel, raconté pas à pas.
 * À chaque étape, un choix (avec son explication) et ce que ton foyer a déjà pour y faire face.
 */
import type { Essential, EssentialsState } from './essentials';
import { planInfo, type EmergencyPlan, type PlanInfo } from './plan';
import type { TaskDone } from './tasks';

export interface SimulationInput {
  essentials: EssentialsState;
  /** Modèles du catalogue présents en quantité dans au moins un kit. */
  owned: ReadonlySet<string>;
  /** Le plan, ou seulement ce qu'on en sait quand il est verrouillé. */
  plan: EmergencyPlan | PlanInfo | null;
  tasks: TaskDone;
}

export interface SimulationCheck {
  id: string;
  label: string;
  ok: (input: SimulationInput) => boolean;
  /** Où aller pour y remédier. */
  route: string;
  /** Article à ajouter à la liste de courses s'il manque. */
  shopping?: string;
}

export interface SimulationChoice {
  question: string;
  options: Array<{ id: string; text: string; good: boolean; feedback: string }>;
}

export interface SimulationStep {
  id: string;
  /** Repère : « Jour 1, 10 h ». */
  when: string;
  story: string[];
  choice: SimulationChoice;
  checks: SimulationCheck[];
}

const essential = (id: Essential, label: string, route: string): SimulationCheck => ({
  id: `essential-${id}`,
  label,
  ok: (i) => i.essentials[id],
  route,
});

const owns = (templateId: string, label: string): SimulationCheck => ({
  id: `item-${templateId}`,
  label,
  ok: (i) => i.owned.has(templateId),
  route: `/kits/home/${templateId}`,
  shopping: label,
});

export const SIMULATION: readonly SimulationStep[] = [
  {
    id: 'jour1-travail',
    when: 'Jour 1, 10 h',
    story: [
      'Un lundi de janvier. Tu es au travail quand tout s’éteint : les écrans, la lumière, le chauffage.',
      'Ton téléphone affiche encore du réseau, mais les appels n’aboutissent pas : les lignes sont saturées.',
    ],
    choice: {
      question: 'Comment savoir ce qui se passe ?',
      options: [
        {
          id: 'a',
          text: 'J’appelle le 112 pour demander.',
          good: false,
          feedback:
            'Le 112 doit rester libre pour les urgences. Les informations passent par LU-Alert et la radio.',
        },
        {
          id: 'b',
          text: 'Je regarde LU-Alert et j’écoute la radio.',
          good: true,
          feedback:
            'Bien vu. Un message LU-Alert conseille justement d’écouter RTL ou la radio 100,7.',
        },
        {
          id: 'c',
          text: 'Je fais confiance au premier message transféré sur une messagerie.',
          good: false,
          feedback:
            'Pendant une crise, beaucoup de messages sont faux. On vérifie d’abord auprès des sources officielles.',
        },
      ],
    },
    checks: [
      {
        id: 'task-lu-alert',
        label: 'L’application LU-Alert installée',
        ok: (i) => Boolean(i.tasks['lu-alert']),
        route: '/gestes',
      },
      owns('crank-radio', 'Une radio à piles ou à manivelle'),
    ],
  },
  {
    id: 'jour1-retour',
    when: 'Jour 1, 15 h',
    story: [
      'Il n’y a plus de train. Une collègue propose de te ramener en voiture.',
      'Le reste du foyer est peut-être à l’école ou au travail, sans moyen de te joindre.',
    ],
    choice: {
      question: 'Comment vous retrouver ?',
      options: [
        {
          id: 'a',
          text: 'Chacun rejoint le point de rendez-vous que nous avons choisi ensemble.',
          good: true,
          feedback:
            'C’est exactement le rôle du plan d’urgence : un lieu connu de tous, et quelqu’un pour aller chercher les enfants.',
        },
        {
          id: 'b',
          text: 'J’attends à la gare que les trains repartent.',
          good: false,
          feedback:
            'Personne ne sait combien de temps cela durera. Mieux vaut rentrer et rejoindre le foyer.',
        },
        {
          id: 'c',
          text: 'J’essaie d’appeler tout le monde, en boucle.',
          good: false,
          feedback:
            'Les lignes sont saturées et la batterie s’use. Un point de rendez-vous décidé à l’avance évite ça.',
        },
      ],
    },
    checks: [
      {
        id: 'plan-meeting',
        label: 'Un point de rendez-vous noté dans ton plan',
        ok: (i) => planInfo(i.plan).meetingPoint,
        route: '/plan/urgence',
      },
      {
        id: 'plan-urgence',
        label: 'L’étape « En cas d’urgence » du plan terminée',
        ok: (i) => planInfo(i.plan).steps.urgence === 'done',
        route: '/plan/urgence',
      },
    ],
  },
  {
    id: 'jour1-soir',
    when: 'Jour 1, 18 h',
    story: [
      'La nuit tombe tôt en janvier. À la maison, tout est noir et la cuisinière électrique ne marche plus.',
    ],
    choice: {
      question: 'Pour t’éclairer et manger chaud ?',
      options: [
        {
          id: 'a',
          text: 'Je sors le barbecue dans le salon.',
          good: false,
          feedback:
            'Jamais : un barbecue ou un brasero à l’intérieur produit du monoxyde de carbone, un gaz invisible et mortel.',
        },
        {
          id: 'b',
          text: 'Lampe frontale, et le réchaud dans une pièce bien aérée.',
          good: true,
          feedback:
            'Parfait. Une lampe pour chaque personne, et une conserve qui se mange même froide si le gaz manque.',
        },
        {
          id: 'c',
          text: 'Des bougies dans toutes les pièces.',
          good: false,
          feedback:
            'Les bougies dépannent, mais une lampe est plus sûre. Ne laisse jamais une bougie allumée sans surveillance.',
        },
      ],
    },
    checks: [
      essential('light', 'La lumière (luciole allumée)', '/kits/home'),
      owns('camping-stove', 'Un réchaud de camping'),
      essential('food', 'Les repas pour 72 h (luciole allumée)', '/kits/home'),
    ],
  },
  {
    id: 'jour2-eau',
    when: 'Jour 2',
    story: ['Au réveil, le robinet ne donne plus rien. La maison s’est refroidie pendant la nuit.'],
    choice: {
      question: 'Comment tenir la journée ?',
      options: [
        {
          id: 'a',
          text: 'J’attends que l’eau revienne avant de m’organiser.',
          good: false,
          feedback:
            'Personne ne sait quand elle reviendra. Mieux vaut organiser tout de suite ta réserve.',
        },
        {
          id: 'b',
          text: 'Je bois ma réserve, je ferme les volets et je sors pulls et couvertures.',
          good: true,
          feedback:
            'Oui. Compte environ 3 L par personne et par jour, et garde la chaleur à l’intérieur.',
        },
      ],
    },
    checks: [
      essential('water', 'L’eau pour 72 h (luciole allumée)', '/kits/home'),
      essential('warmth', 'La chaleur (luciole allumée)', '/kits/home'),
      owns('power-bank', 'Une batterie externe chargée'),
    ],
  },
  {
    id: 'jour2-rumeur',
    when: 'Jour 2, 14 h',
    story: [
      'Un message circule : « L’eau du robinet est empoisonnée, faites passer ! » Il n’y a ni source ni date.',
    ],
    choice: {
      question: 'Que fais-tu de ce message ?',
      options: [
        {
          id: 'a',
          text: 'Je le partage pour prévenir mes proches.',
          good: false,
          feedback:
            'Même pour « prévenir », on ne partage pas une alerte qu’aucune source officielle ne confirme.',
        },
        {
          id: 'b',
          text: 'Je vérifie à la radio ou sur LU-Alert, et je ne partage que l’officiel.',
          good: true,
          feedback:
            'Exactement. Qui l’a publié, quand, d’où vient-il ? D’autres sources fiables le disent-elles ?',
        },
      ],
    },
    checks: [],
  },
  {
    id: 'jour3-entraide',
    when: 'Jour 3',
    story: [
      'Le quartier s’organise. La commune ouvre une salle chauffée pour boire chaud, s’informer et recharger les téléphones.',
      'Ta voisine âgée vit seule. Tu ne l’as pas vue depuis le début de la coupure.',
    ],
    choice: {
      question: 'Que fais-tu ?',
      options: [
        {
          id: 'a',
          text: 'Je frappe chez elle pour prendre des nouvelles.',
          good: true,
          feedback: 'C’est le cœur de l’entraide : les personnes seules ou fragiles d’abord.',
        },
        {
          id: 'b',
          text: 'Je ne la dérange pas : quelqu’un d’autre s’en occupera.',
          good: false,
          feedback:
            'Les secours ne peuvent pas être partout. Un voisin attentif fait souvent la différence.',
        },
      ],
    },
    checks: [
      {
        id: 'plan-quartier',
        label: 'Les personnes à aider notées dans ton plan',
        ok: (i) => planInfo(i.plan).steps.quartier === 'done',
        route: '/plan/quartier',
      },
    ],
  },
];

export interface SimulationReport {
  ready: SimulationCheck[];
  missing: SimulationCheck[];
}

/** Le bilan : ce que le foyer avait, et ce qui lui a manqué. */
export function simulationReport(
  input: SimulationInput,
  steps: readonly SimulationStep[] = SIMULATION,
): SimulationReport {
  const checks = steps.flatMap((s) => s.checks);
  return {
    ready: checks.filter((c) => c.ok(input)),
    missing: checks.filter((c) => !c.ok(input)),
  };
}
