/**
 * Composition du foyer et quantités cibles (§ 2.15 du plan).
 */

export type MemberType = 'adult' | 'child' | 'infant' | 'senior' | 'pet';
export type PetSpecies = 'dog' | 'cat' | 'other';

export interface Member {
  id: string;
  type: MemberType;
  petSpecies?: PetSpecies;
}

export interface Household {
  members: Member[];
  /** Durée d'autonomie visée, en jours (3 = 72 h). */
  durationDays: number;
}

export const DEFAULT_DURATION_DAYS = 3;
export const MIN_DURATION_DAYS = 3;
export const MAX_DURATION_DAYS = 14;

/** Litres d'eau par jour (recommandation officielle : 3 L par personne). */
const WATER_PER_DAY: Record<MemberType, number> = {
  adult: 3,
  senior: 3,
  child: 3,
  infant: 1,
  pet: 0,
};

const PET_WATER_PER_DAY: Record<PetSpecies, number> = {
  dog: 1,
  cat: 0.3,
  other: 0.2,
};

/** Kilocalories par jour pour les humains (repères indicatifs). */
const KCAL_PER_DAY: Record<MemberType, number> = {
  adult: 2000,
  senior: 1800,
  child: 1400,
  infant: 0,
  pet: 0,
};

export interface Targets {
  waterLiters: number;
  kcal: number;
  people: number;
  pets: number;
}

export interface HouseholdCounts {
  adults: number;
  seniors: number;
  children: number;
  infants: number;
  pets: number;
  /** Humains, nourrissons compris */
  people: number;
  /** Humains qui mangent des repas (hors nourrissons) */
  eaters: number;
  days: number;
}

export function clampDuration(days: number): number {
  if (!Number.isFinite(days)) return DEFAULT_DURATION_DAYS;
  return Math.min(MAX_DURATION_DAYS, Math.max(MIN_DURATION_DAYS, Math.round(days)));
}

export function countMembers(household: Household): HouseholdCounts {
  const by = (type: MemberType) => household.members.filter((m) => m.type === type).length;
  const adults = by('adult');
  const seniors = by('senior');
  const children = by('child');
  const infants = by('infant');
  const pets = by('pet');
  return {
    adults,
    seniors,
    children,
    infants,
    pets,
    people: adults + seniors + children + infants,
    eaters: adults + seniors + children,
    days: clampDuration(household.durationDays),
  };
}

function waterPerDay(member: Member): number {
  if (member.type === 'pet') return PET_WATER_PER_DAY[member.petSpecies ?? 'other'];
  return WATER_PER_DAY[member.type];
}

export function computeTargets(household: Household): Targets {
  const days = clampDuration(household.durationDays);
  let water = 0;
  let kcal = 0;
  let people = 0;
  let pets = 0;
  for (const member of household.members) {
    water += waterPerDay(member) * days;
    kcal += KCAL_PER_DAY[member.type] * days;
    if (member.type === 'pet') pets += 1;
    else people += 1;
  }
  return {
    waterLiters: Math.round(water * 10) / 10,
    kcal,
    people,
    pets,
  };
}
