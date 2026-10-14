import { describe, expect, it } from 'vitest';
import { clampDuration, computeTargets } from './household';

describe('computeTargets', () => {
  it('asks 9 L of water per adult for 72 h', () => {
    const t = computeTargets({ durationDays: 3, members: [{ id: 'a', type: 'adult' }] });
    expect(t.waterLiters).toBe(9);
    expect(t.kcal).toBe(6000);
  });

  it('adds children, infants and pets', () => {
    const t = computeTargets({
      durationDays: 3,
      members: [
        { id: 'a', type: 'adult' },
        { id: 'b', type: 'adult' },
        { id: 'c', type: 'child' },
        { id: 'd', type: 'pet', petSpecies: 'cat' },
      ],
    });
    expect(t.waterLiters).toBe(27.9);
    expect(t.people).toBe(3);
    expect(t.pets).toBe(1);
  });

  it('is empty for an empty household', () => {
    expect(computeTargets({ durationDays: 3, members: [] }).waterLiters).toBe(0);
  });
});

describe('clampDuration', () => {
  it('keeps the duration between 3 and 14 days', () => {
    expect(clampDuration(1)).toBe(3);
    expect(clampDuration(7)).toBe(7);
    expect(clampDuration(30)).toBe(14);
    expect(clampDuration(Number.NaN)).toBe(3);
  });
});
