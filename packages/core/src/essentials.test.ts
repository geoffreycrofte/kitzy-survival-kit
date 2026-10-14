import { describe, expect, it } from 'vitest';
import { emptyEssentials, litCount, nextEssential, stageFor } from './essentials';

describe('essentials', () => {
  it('starts with no firefly lit', () => {
    const state = emptyEssentials();
    expect(litCount(state)).toBe(0);
    expect(nextEssential(state)).toBe('water');
    expect(stageFor(0)).toBe('start');
  });

  it('reaches the weekend stage at 4 and ready at 6', () => {
    expect(stageFor(3)).toBe('growing');
    expect(stageFor(4)).toBe('weekend');
    expect(stageFor(6)).toBe('ready');
  });

  it('has nothing left once everything is lit', () => {
    const state = { water: true, food: true, light: true, warmth: true, care: true, plan: true };
    expect(nextEssential(state)).toBeNull();
  });
});
