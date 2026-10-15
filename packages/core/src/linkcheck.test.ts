import { describe, expect, it } from 'vitest';
import {
  ROBOTS_DETAIL,
  classify,
  linkReport,
  nextStatus,
  parseRobots,
  robotsAllows,
} from './linkcheck';

describe('robots.txt', () => {
  const robots = `
# commentaire
User-agent: Googlebot
Disallow: /

User-agent: *
Disallow: /s?
Disallow: /gp/cart
Allow: /s?k=autorise$
Disallow: /*.pdf$
`;
  it('applies the * group with longest-match precedence', () => {
    const rules = parseRobots(robots);
    expect(robotsAllows(rules, '/s?k=lampe')).toBe(false);
    expect(robotsAllows(rules, '/s?k=autorise')).toBe(true);
    expect(robotsAllows(rules, '/dp/B000')).toBe(true);
    expect(robotsAllows(rules, '/doc/notice.pdf')).toBe(false);
    expect(robotsAllows(rules, '/doc/notice.pdf?x')).toBe(true);
  });

  it('prefers a group naming our robot, and allows everything without rules', () => {
    const own = parseRobots(
      'User-agent: *\nDisallow: /\n\nUser-agent: KitzyLinkCheck\nDisallow: /prive',
    );
    expect(robotsAllows(own, '/public')).toBe(true);
    expect(robotsAllows(own, '/prive/x')).toBe(false);
    expect(robotsAllows(parseRobots(''), '/tout')).toBe(true);
  });
});

describe('classify', () => {
  const base = { requestedPath: '/produit/123', finalPath: '/produit/123' };
  it('reads HTTP codes, redirects and availability', () => {
    expect(classify({ ...base, status: 200 }).verdict).toBe('ok');
    expect(classify({ ...base, status: 404 }).verdict).toBe('broken');
    expect(classify({ ...base, status: 410 }).verdict).toBe('broken');
    expect(classify({ ...base, status: 503 }).verdict).toBe('unknown');
    expect(classify({ ...base, status: 403 }).verdict).toBe('unknown');
    expect(classify({ ...base, error: 'timeout' }).verdict).toBe('unknown');
    expect(classify({ ...base, status: 200, finalPath: '/', isProductPage: true }).verdict).toBe(
      'broken',
    );
    expect(
      classify({
        ...base,
        status: 200,
        isProductPage: true,
        body: '{"@type":"Offer","availability":"https://schema.org/OutOfStock"}',
      }).verdict,
    ).toBe('unavailable');
    // Une page de recherche n'est jamais jugée sur sa disponibilité.
    expect(classify({ ...base, status: 200, body: '"availability":"OutOfStock"' }).verdict).toBe(
      'ok',
    );
  });
});

describe('nextStatus', () => {
  const today = '2026-10-19';
  it('needs two consecutive failures before hiding a link', () => {
    const first = nextStatus(undefined, { verdict: 'broken', detail: 'HTTP 404' }, today);
    expect(first).toEqual({ status: 'unknown', lastChecked: today, failures: 1 });
    const second = nextStatus(first, { verdict: 'broken', detail: 'HTTP 404' }, today);
    expect(second.status).toBe('broken');
    expect(nextStatus(second, { verdict: 'ok', detail: 'HTTP 200' }, today)).toEqual({
      status: 'ok',
      lastChecked: today,
      failures: 0,
    });
  });

  it('keeps the previous state when nothing can be concluded', () => {
    const ok = { status: 'ok' as const, lastChecked: '2026-10-12', failures: 0 };
    expect(nextStatus(ok, { verdict: 'unknown', detail: 'HTTP 503' }, today).status).toBe('ok');
  });
});

describe('linkReport', () => {
  it('lists problems, hides robots-only skips in a summary, and is empty when all is fine', () => {
    expect(linkReport([{ url: 'u', label: 'l', status: 'ok', detail: 'HTTP 200' }], 'd')).toBe('');
    const report = linkReport(
      [
        { url: 'https://a', label: 'Lampe', status: 'broken', detail: 'HTTP 404' },
        { url: 'https://b', label: 'Radio', status: 'unknown', detail: 'HTTP 503' },
        { url: 'https://c', label: 'Pile', status: 'unknown', detail: ROBOTS_DETAIL },
      ],
      '2026-10-19',
    );
    expect(report).toContain('## À corriger');
    expect(report).toContain('Lampe');
    expect(report).toContain('## À vérifier à la main');
    expect(report).toContain('<details><summary>1 lien non visité');
  });
});
