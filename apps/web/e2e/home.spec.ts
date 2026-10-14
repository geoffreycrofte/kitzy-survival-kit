import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

test.describe('Accueil', () => {
  test('montre le terrier et la première mission', async ({ page }) => {
    await page.goto('./');
    await expect(page).toHaveTitle('Terrier · Kitzy');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Prépare ton terrier.');
    await expect(page.getByRole('img', { name: /luciole allumée sur 6/ })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Présenter mon foyer' })).toBeVisible();
  });

  for (const theme of ['sombre', 'clair'] as const) {
    test(`n'a aucune erreur axe en thème ${theme}`, async ({ page }) => {
      await page.emulateMedia({
        colorScheme: theme === 'clair' ? 'light' : 'dark',
        reducedMotion: 'reduce',
      });
      await page.goto('./');
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test('le bouton de thème bascule et garde le choix', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('./');
    await page.getByRole('button', { name: 'Passer en thème clair' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'clair');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'clair');
    await expect(page.getByRole('button', { name: 'Passer en thème sombre' })).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('déplace le focus sur le titre et change le titre de la page', async ({ page }) => {
    await page.goto('./');
    await page
      .getByRole('navigation', { name: 'Navigation principale' })
      .getByRole('link', { name: 'Courses' })
      .click();
    await expect(page).toHaveTitle('Courses · Kitzy');
    await expect(page.getByRole('heading', { level: 1, name: 'Courses' })).toBeFocused();
    await expect(page.getByRole('link', { name: 'Courses' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('une adresse inconnue affiche la page introuvable', async ({ page }) => {
    await page.goto('./nulle-part');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable');
  });

  test('le lien d’évitement mène au contenu', async ({ page }) => {
    await page.goto('./');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Aller au contenu' });
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });
});

test.describe('Mouvement', () => {
  test('aucune animation quand le système demande moins de mouvement', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
    const running = await page.evaluate(() => document.getAnimations().length);
    expect(running).toBe(0);
  });

  test('les animations d’ambiance tournent par défaut et se coupent dans les réglages', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
    expect(await page.evaluate(() => document.getAnimations().length)).toBeGreaterThan(0);

    await page.goto('./reglages');
    await page.getByRole('radio', { name: 'Désactivées' }).check();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
    await page.goto('./');
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  });
});
