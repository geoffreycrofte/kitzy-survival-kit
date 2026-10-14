/**
 * Les six lucioles : un essentiel chacune.
 */

export const ESSENTIALS = ['water', 'food', 'light', 'warmth', 'care', 'plan'] as const;
export type Essential = (typeof ESSENTIALS)[number];

export type EssentialsState = Record<Essential, boolean>;

export function emptyEssentials(): EssentialsState {
  return { water: false, food: false, light: false, warmth: false, care: false, plan: false };
}

export function litCount(state: EssentialsState): number {
  return ESSENTIALS.filter((e) => state[e]).length;
}

export function nextEssential(state: EssentialsState): Essential | null {
  return ESSENTIALS.find((e) => !state[e]) ?? null;
}

/** Palier atteint, pour le titre de l'accueil. */
export type Stage = 'start' | 'growing' | 'weekend' | 'ready';

export function stageFor(count: number): Stage {
  if (count >= ESSENTIALS.length) return 'ready';
  if (count >= 4) return 'weekend';
  if (count >= 1) return 'growing';
  return 'start';
}
