import { describe, expect, it } from 'vitest';
import { CATEGORIES } from '../catalog';
import { CATALOG } from './catalog';
import { GUIDE } from './guide';
import { LU } from './countries/lu';

describe('catalogue', () => {
  it('has unique ids', () => {
    const ids = CATALOG.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives each firefly at least one official item for the home kit', () => {
    for (const category of CATEGORIES.filter((c) => c.essential)) {
      const official = CATALOG.filter(
        (t) => t.category === category.id && t.source === 'official' && t.home,
      );
      expect(official.length, category.id).toBeGreaterThan(0);
    }
  });

  it('only links to existing guide pages', () => {
    const slugs = new Set(GUIDE.map((p) => p.slug));
    for (const t of CATALOG) if (t.guide) expect(slugs.has(t.guide), t.id).toBe(true);
  });

  it('puts every item in at least one kit', () => {
    for (const t of CATALOG) expect(Boolean(t.home || t.bag), t.id).toBe(true);
  });
});

describe('guide', () => {
  it('has unique slugs and links back to the official source', () => {
    const slugs = GUIDE.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const page of GUIDE) {
      expect(
        page.links?.some((l) => l.url.startsWith('https://letzprepare')),
        page.slug,
      ).toBe(true);
    }
  });
});

describe('Luxembourg profile', () => {
  it('knows the monthly siren test', () => {
    expect(LU.sirenTest).toMatchObject({ weekday: 1, nth: 1, time: '12:00' });
    expect(LU.emergencyNumbers.map((n) => n.number)).toEqual(
      expect.arrayContaining(['112', '113']),
    );
  });
});
