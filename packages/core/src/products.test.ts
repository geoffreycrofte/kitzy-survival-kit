import { describe, expect, it } from 'vitest';
import { CATALOG } from './data/catalog';
import { PRODUCTS } from './data/products';
import {
  isOfferVisible,
  offerBaseUrl,
  productsFor,
  productUrls,
  resolveOffer,
  type LinkStatusMap,
} from './products';

describe('products data', () => {
  it('only targets existing catalog items, with unique ids and at least one offer', () => {
    const templates = new Set(CATALOG.map((t) => t.id));
    const ids = PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of PRODUCTS) {
      for (const id of p.templateIds) expect(templates.has(id), `${p.id} → ${id}`).toBe(true);
      expect(p.offers.length, p.id).toBeGreaterThan(0);
      expect(p.name.length).toBeLessThan(80);
    }
  });

  it('never shows a price', () => {
    for (const p of PRODUCTS) expect(`${p.name} ${p.why}`).not.toMatch(/€|\d+[,.]\d{2}\s?EUR/);
  });
});

describe('affiliate links', () => {
  const offer = { merchant: 'amazon-fr' as const, query: 'lampe frontale AAA' };

  it('adds the Amazon tag only when it is configured', () => {
    expect(resolveOffer(offer, {})).toEqual({
      merchant: expect.objectContaining({ name: 'Amazon.fr' }),
      url: 'https://www.amazon.fr/s?k=lampe%20frontale%20AAA',
      affiliate: false,
    });
    const tagged = resolveOffer(offer, { amazonTagFr: 'kitzy-21' });
    expect(tagged.affiliate).toBe(true);
    expect(tagged.url).toBe('https://www.amazon.fr/s?k=lampe%20frontale%20AAA&tag=kitzy-21');
    // Le tag FR ne s'applique pas à Amazon.de, ni à Decathlon.
    expect(resolveOffer({ ...offer, merchant: 'amazon-de' }, { amazonTagFr: 'x' }).affiliate).toBe(
      false,
    );
    expect(
      resolveOffer({ merchant: 'decathlon-fr', query: 'sac' }, { amazonTagFr: 'x' }).affiliate,
    ).toBe(false);
  });

  it('hides broken or unavailable offers, but keeps the advice', () => {
    const status: LinkStatusMap = {
      [offerBaseUrl(offer)]: { status: 'broken', lastChecked: '2026-10-15', failures: 2 },
    };
    expect(isOfferVisible(offer, status)).toBe(false);
    expect(isOfferVisible(offer, {})).toBe(true);
    const groups = productsFor(
      'headlamp',
      [
        {
          id: 'h',
          templateIds: ['headlamp'],
          tier: 1,
          name: 'Frontale',
          why: '…',
          offers: [offer],
        },
      ],
      {},
      status,
    );
    expect(groups).toHaveLength(1);
    expect(groups[0]!.products[0]!.offers).toEqual([]);
  });

  it('groups advice by tier and lists every URL to watch once', () => {
    const groups = productsFor('headlamp', PRODUCTS, {});
    expect(groups.map((g) => g.tier)).toEqual([1, 2]);
    const urls = productUrls(PRODUCTS);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((u) => u.startsWith('https://'))).toBe(true);
    expect(urls.some((u) => u.includes('tag='))).toBe(false);
  });
});
