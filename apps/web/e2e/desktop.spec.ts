import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, setUpHousehold } from './helpers';

test.describe('Accueil : l’histoire des lucioles', () => {
  test('explique les lucioles tant que le foyer n’est pas présenté', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('img', { name: '0 luciole allumée sur 6' })).toBeVisible();
    await expect(page.getByText('Tant qu’elles brillent toutes, tout va bien.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Présenter mon foyer' })).toBeVisible();
    await setUpHousehold(page);
    await page.goto('./');
    await expect(page.getByText('Tant qu’elles brillent toutes, tout va bien.')).toHaveCount(0);
  });

  test('ne s’anime pas quand l’appareil demande moins de mouvement', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
    await expect(page.locator('.fly__light').first()).toBeHidden();
    // Le texte est là d'emblée, sans attendre la fin d'une animation.
    await expect(page.locator('.home__story')).toHaveCSS('opacity', '1');
  });
});

test.describe('Version bureau', () => {
  test.use({ viewport: { width: 1366, height: 860 }, isMobile: false, hasTouch: false });

  test('navigation latérale, avant le contenu au clavier', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./guide');
    const nav = page.getByRole('navigation', { name: 'Navigation principale' });
    const navBox = await nav.boundingBox();
    const mainBox = await page.locator('main').boundingBox();
    expect(navBox && mainBox && navBox.x + navBox.width <= mainBox.x).toBe(true);
    await expect(nav.getByRole('link', { name: 'Guide' })).toHaveAttribute('aria-current', 'page');
    // Les cartes du guide passent sur deux colonnes.
    const cards = page.locator('.guide-card');
    const [a, b] = await Promise.all([cards.nth(0).boundingBox(), cards.nth(1).boundingBox()]);
    expect(a && b && Math.abs(a.y - b.y) < 2 && b.x > a.x).toBe(true);
  });

  test('aucune erreur axe au format bureau, dans les deux thèmes', async ({ page }) => {
    test.slow();
    await setUpHousehold(page);
    for (const scheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      for (const path of [
        './',
        './kits',
        './kits/home/headlamp',
        './courses',
        './gestes',
        './guide',
        './plan',
      ]) {
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expectNoAxeViolations(page);
      }
    }
  });
});
