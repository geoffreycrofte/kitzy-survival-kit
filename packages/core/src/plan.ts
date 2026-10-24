/**
 * Plan personnel d'urgence (§ 3.6 du plan), fidèle au formulaire officiel
 * « Mon plan personnel d'urgence » du guide Lëtz prepare! (p. 43 à 50).
 *
 * Tous les champs sont des textes libres : la personne écrit comme elle veut,
 * Kitzy ne valide que la longueur. Les données de santé ne sont gardées
 * qu'avec un consentement explicite.
 */
import { z } from 'zod';
import { countMembers, type Household } from './household';
import { addDays, isIsoDate, type IsoDate } from './dates';

export const PLAN_STEPS = ['foyer', 'maison', 'quartier', 'urgence', 'numeros'] as const;
export type PlanStep = (typeof PLAN_STEPS)[number];

export interface PlanPerson {
  id: string;
  lastName: string;
  firstName: string;
  phone: string;
  languages: string;
  /** Champs de santé : vides tant que le consentement n'est pas donné. */
  bloodType: string;
  matricule: string;
  disability: string;
  allergies: string;
  medication: string;
  remarks: string;
}

export interface PlanPet {
  id: string;
  species: string;
  name: string;
  info: string;
}

export const HOME_SPOTS = [
  'extinguisher',
  'water',
  'gas',
  'meter',
  'breaker',
  'boiler',
  'solar',
  'documents',
  'kit',
] as const;
export type HomeSpot = (typeof HOME_SPOTS)[number];

export interface PlanSpot {
  where: string;
  comment: string;
}

export interface PlanHome {
  spots: Record<HomeSpot, PlanSpot>;
  altExit: string;
  garageDoor: string;
  extraKey: string;
  other: string;
}

export interface PlanNeighbor {
  id: string;
  name: string;
  help: string;
  phone: string;
  address: string;
}

export interface PlanContact {
  name: string;
  phone: string;
}

export interface PlanPlace {
  name: string;
  phone: string;
  address: string;
}

export interface PlanEmergency {
  cis: string;
  meeting1: string;
  meeting2: string;
  inform1: string;
  inform2: string;
  contact1: PlanContact;
  contact2: PlanContact;
  school1: PlanContact;
  school2: PlanContact;
  commute: string;
  otherSituation: string;
  shelter1: PlanPlace;
  shelter2: PlanPlace;
}

export const PROVIDERS = [
  'telecom',
  'electricity',
  'gas',
  'water',
  'insurance',
  'doctor',
  'specialist',
  'school',
  'work',
  'bank',
] as const;
export type ProviderKind = (typeof PROVIDERS)[number];

export interface PlanProvider {
  name: string;
  customerNo: string;
  phone: string;
}

export interface EmergencyPlan {
  owner: { name: string; address: string; city: string };
  /** Accord explicite pour garder les informations de santé et le matricule. */
  healthConsent: boolean;
  adults: number;
  children: number;
  people: PlanPerson[];
  pets: PlanPet[];
  home: PlanHome;
  helpers: PlanNeighbor[];
  toHelp: PlanNeighbor[];
  emergency: PlanEmergency;
  providers: Record<ProviderKind, PlanProvider>;
  providersComment: string;
  createdAt?: IsoDate;
  updatedAt?: IsoDate;
}

const contact = (): PlanContact => ({ name: '', phone: '' });
const place = (): PlanPlace => ({ name: '', phone: '', address: '' });

export function emptyPerson(id: string): PlanPerson {
  return {
    id,
    lastName: '',
    firstName: '',
    phone: '',
    languages: '',
    bloodType: '',
    matricule: '',
    disability: '',
    allergies: '',
    medication: '',
    remarks: '',
  };
}

export function emptyPet(id: string, species = ''): PlanPet {
  return { id, species, name: '', info: '' };
}

export function emptyNeighbor(id: string): PlanNeighbor {
  return { id, name: '', help: '', phone: '', address: '' };
}

export function emptyPlan(): EmergencyPlan {
  return {
    owner: { name: '', address: '', city: '' },
    healthConsent: false,
    adults: 0,
    children: 0,
    people: [],
    pets: [],
    home: {
      spots: Object.fromEntries(HOME_SPOTS.map((s) => [s, { where: '', comment: '' }])) as Record<
        HomeSpot,
        PlanSpot
      >,
      altExit: '',
      garageDoor: '',
      extraKey: '',
      other: '',
    },
    helpers: [],
    toHelp: [],
    emergency: {
      cis: '',
      meeting1: '',
      meeting2: '',
      inform1: '',
      inform2: '',
      contact1: contact(),
      contact2: contact(),
      school1: contact(),
      school2: contact(),
      commute: '',
      otherSituation: '',
      shelter1: place(),
      shelter2: place(),
    },
    providers: Object.fromEntries(
      PROVIDERS.map((p) => [p, { name: '', customerNo: '', phone: '' }]),
    ) as Record<ProviderKind, PlanProvider>,
    providersComment: '',
  };
}

const PET_LABEL = { dog: 'Chien', cat: 'Chat', other: '' } as const;

/**
 * Pré-remplit un plan vide depuis le foyer : nombre d'adultes et d'enfants,
 * une fiche par personne et par animal. On ne saisit rien deux fois.
 */
export function prefillPlan(
  plan: EmergencyPlan,
  household: Household | null,
  newId: () => string,
): EmergencyPlan {
  if (!household) return plan;
  const counts = countMembers(household);
  const humans = household.members.filter((m) => m.type !== 'pet').length;
  const next = { ...plan };
  if (plan.adults === 0 && plan.children === 0) {
    next.adults = counts.adults + counts.seniors;
    next.children = counts.children + counts.infants;
  }
  if (plan.people.length === 0) {
    next.people = Array.from({ length: humans }, () => emptyPerson(newId()));
  }
  if (plan.pets.length === 0) {
    next.pets = household.members
      .filter((m) => m.type === 'pet')
      .map((m) => emptyPet(newId(), PET_LABEL[m.petSpecies ?? 'other']));
  }
  return next;
}

/** Les champs que chaque étape modifie : une étape n'écrase jamais les autres. */
export const PLAN_STEP_FIELDS = {
  foyer: ['owner', 'healthConsent', 'adults', 'children', 'people', 'pets'],
  maison: ['home'],
  quartier: ['helpers', 'toHelp'],
  urgence: ['emergency'],
  numeros: ['providers', 'providersComment'],
} as const satisfies Record<PlanStep, readonly (keyof EmergencyPlan)[]>;

/** Applique les champs d'une étape, édités sur `edited`, au plan enregistré `stored`. */
export function mergePlanStep(
  stored: EmergencyPlan,
  edited: EmergencyPlan,
  step: PlanStep,
): EmergencyPlan {
  const next: EmergencyPlan = { ...stored };
  for (const field of PLAN_STEP_FIELDS[step]) {
    (next as unknown as Record<string, unknown>)[field] = edited[field];
  }
  return next;
}

/** Retire toutes les informations de santé et le matricule (retrait du consentement). */
export function withoutHealthData(plan: EmergencyPlan): EmergencyPlan {
  return {
    ...plan,
    healthConsent: false,
    people: plan.people.map((p) => ({
      ...p,
      bloodType: '',
      matricule: '',
      disability: '',
      allergies: '',
      medication: '',
      remarks: '',
    })),
  };
}

/** Vrai si le plan contient des données sensibles (santé, matricule). */
export function hasSensitiveData(plan: EmergencyPlan): boolean {
  return plan.people.some(
    (p) => p.bloodType || p.matricule || p.disability || p.allergies || p.medication || p.remarks,
  );
}

export type StepState = 'empty' | 'started' | 'done';

const filled = (value: string | undefined) => Boolean(value?.trim());

/**
 * Avancement d'une étape. « Fait » signifie que l'essentiel est noté,
 * pas que chaque case est remplie : beaucoup de champs ne concernent pas tout le monde.
 */
export function stepState(plan: EmergencyPlan, step: PlanStep): StepState {
  const { done, any } = stepChecks(plan, step);
  if (done) return 'done';
  return any ? 'started' : 'empty';
}

function stepChecks(plan: EmergencyPlan, step: PlanStep): { done: boolean; any: boolean } {
  switch (step) {
    case 'foyer': {
      const named = plan.people.filter((p) => filled(p.firstName) || filled(p.lastName));
      return {
        done:
          filled(plan.owner.name) && plan.people.length > 0 && named.length === plan.people.length,
        any: filled(plan.owner.name) || filled(plan.owner.address) || named.length > 0,
      };
    }
    case 'maison': {
      const spots = HOME_SPOTS.filter((s) => filled(plan.home.spots[s].where)).length;
      return {
        done:
          filled(plan.home.spots.water.where) &&
          filled(plan.home.spots.breaker.where) &&
          filled(plan.home.altExit),
        any: spots > 0 || filled(plan.home.altExit) || filled(plan.home.garageDoor),
      };
    }
    case 'quartier': {
      const count =
        plan.helpers.filter((n) => filled(n.name)).length +
        plan.toHelp.filter((n) => filled(n.name)).length;
      return { done: count > 0, any: count > 0 };
    }
    case 'urgence': {
      const e = plan.emergency;
      return {
        done: filled(e.meeting1) && filled(e.contact1.name) && filled(e.contact1.phone),
        any:
          filled(e.cis) ||
          filled(e.meeting1) ||
          filled(e.contact1.name) ||
          filled(e.inform1) ||
          filled(e.shelter1.name),
      };
    }
    case 'numeros': {
      const count = PROVIDERS.filter(
        (p) => filled(plan.providers[p].name) || filled(plan.providers[p].phone),
      ).length;
      return { done: count >= 3, any: count > 0 };
    }
  }
}

export function planProgress(plan: EmergencyPlan | null): Record<PlanStep, StepState> {
  const p = plan ?? emptyPlan();
  return Object.fromEntries(PLAN_STEPS.map((s) => [s, stepState(p, s)])) as Record<
    PlanStep,
    StepState
  >;
}

/**
 * Ce qu'on sait du plan sans l'ouvrir : l'avancement et les dates, rien de personnel.
 * Gardé en clair quand le plan est verrouillé, pour l'accueil, les succès et les rappels.
 */
export interface PlanInfo {
  steps: Record<PlanStep, StepState>;
  meetingPoint: boolean;
  createdAt?: IsoDate;
  updatedAt?: IsoDate;
}

export function planInfo(plan: EmergencyPlan | PlanInfo | null): PlanInfo {
  if (plan && 'steps' in plan) return plan;
  return {
    steps: planProgress(plan),
    meetingPoint: filled(plan?.emergency.meeting1),
    ...(plan?.createdAt ? { createdAt: plan.createdAt } : {}),
    ...(plan?.updatedAt ? { updatedAt: plan.updatedAt } : {}),
  };
}

/** Revue annuelle du plan, un an après la dernière mise à jour. */
export function planReviewDate(plan: { updatedAt?: IsoDate } | null): IsoDate | null {
  if (!plan?.updatedAt) return null;
  return addDays(plan.updatedAt, 365);
}

/* ---------- Validation (import d'une sauvegarde) ---------- */

const text = (max = 300) => z.string().max(max).default('');
const isoDate = z.string().refine(isIsoDate, 'Date invalide');

const ContactSchema = z.object({ name: text(120), phone: text(40) });
const PlaceSchema = z.object({ name: text(120), phone: text(40), address: text(300) });
const NeighborSchema = z.object({
  id: z.string().max(64),
  name: text(120),
  help: text(300),
  phone: text(40),
  address: text(300),
});

export const PlanSchema = z.object({
  owner: z.object({ name: text(120), address: text(300), city: text(120) }),
  healthConsent: z.boolean(),
  adults: z.number().int().min(0).max(50),
  children: z.number().int().min(0).max(50),
  people: z
    .array(
      z.object({
        id: z.string().max(64),
        lastName: text(120),
        firstName: text(120),
        phone: text(40),
        languages: text(120),
        bloodType: text(10),
        matricule: text(20),
        disability: text(500),
        allergies: text(500),
        medication: text(1000),
        remarks: text(1000),
      }),
    )
    .max(50),
  pets: z
    .array(z.object({ id: z.string().max(64), species: text(60), name: text(60), info: text(500) }))
    .max(50),
  home: z.object({
    spots: z.record(z.enum(HOME_SPOTS), z.object({ where: text(300), comment: text(500) })),
    altExit: text(500),
    garageDoor: text(500),
    extraKey: text(300),
    other: text(1000),
  }),
  helpers: z.array(NeighborSchema).max(50),
  toHelp: z.array(NeighborSchema).max(50),
  emergency: z.object({
    cis: text(300),
    meeting1: text(300),
    meeting2: text(300),
    inform1: text(300),
    inform2: text(300),
    contact1: ContactSchema,
    contact2: ContactSchema,
    school1: ContactSchema,
    school2: ContactSchema,
    commute: text(500),
    otherSituation: text(500),
    shelter1: PlaceSchema,
    shelter2: PlaceSchema,
  }),
  providers: z.record(
    z.enum(PROVIDERS),
    z.object({ name: text(120), customerNo: text(60), phone: text(40) }),
  ),
  providersComment: text(1000),
  createdAt: isoDate.optional(),
  updatedAt: isoDate.optional(),
});
