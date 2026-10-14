import { describe, expect, it } from 'vitest';
import { contrastRatio, cssVarName, textPairs, themeToCssVars, themes } from './tokens';

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });
});

describe('themes', () => {
  for (const [name, theme] of Object.entries(themes)) {
    for (const [fg, bg] of textPairs) {
      it(`${name}: ${fg} on ${bg} reaches 4.5:1`, () => {
        expect(contrastRatio(theme[fg], theme[bg])).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it('both themes define the same tokens', () => {
    expect(Object.keys(themes.clair).sort()).toEqual(Object.keys(themes.sombre).sort());
  });
});

describe('themeToCssVars', () => {
  it('turns token names into kebab-case CSS variables', () => {
    expect(cssVarName('flyGlow')).toBe('--kz-fly-glow');
    expect(themeToCssVars(themes.sombre)['--kz-bg']).toBe('#12302B');
  });
});
