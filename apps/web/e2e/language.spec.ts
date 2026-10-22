import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, setUpHousehold } from './helpers';

test.describe('Langues', () => {
  test('choisir l’anglais dans les réglages, puis revenir à la langue de l’appareil', async ({
    page,
  }) => {
    await setUpHousehold(page);
    await page.goto('./reglages');
    const language = page.getByRole('group', { name: 'Langue' });
    await language.getByRole('radio', { name: 'English' }).check();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();

    // Les contenus suivent : navigation, guide, noms des kits par défaut.
    const nav = page.getByRole('navigation', { name: /./ }).first();
    await expect(nav.getByRole('link', { name: 'Burrow' })).toBeVisible();
    await page.goto('./guide/pourquoi-72-heures');
    await expect(page.getByRole('heading', { level: 1, name: 'Why 72 hours?' })).toBeVisible();
    await page.goto('./kits');
    await expect(page.getByRole('link', { name: 'Bag 1' })).toBeVisible();

    // Le choix est gardé.
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await page.goto('./reglages');
    await page
      .getByRole('group', { name: 'Language' })
      .getByRole('radio', { name: 'Same as my device' })
      .check();
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.getByRole('heading', { level: 1, name: 'Réglages' })).toBeVisible();
  });

  test('demander une langue mène au profil LinkedIn', async ({ page }) => {
    await page.goto('./reglages');
    const link = page.getByRole('link', { name: /Demander une langue/ });
    await expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/geoffreycrofte/');
    await expect(link).toHaveAttribute('target', '_blank');
    // Chaque langue est annoncée dans sa propre langue.
    await expect(page.getByText('Lëtzebuergesch')).toHaveAttribute('lang', 'lb');
  });

  for (const [code, intl, home] of [
    ['de', 'de-LU', 'Bau'],
    ['pt', 'pt-PT', 'Toca'],
    ['lb', 'lb-LU', null],
  ] as const) {
    test.describe(`appareil en ${code}`, () => {
      test.use({ locale: intl });

      test(`suit la langue de l’appareil (${code}), sans erreur axe`, async ({ page }) => {
        test.slow();
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto('./');
        await expect(page.locator('html')).toHaveAttribute('lang', code);
        if (home) await expect(page).toHaveTitle(`${home} · Kitzy`);
        for (const path of ['./', './guide/sirenes', './reglages', './activites', './gestes']) {
          await page.goto(path);
          await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
          await expectNoAxeViolations(page);
        }
      });
    });
  }
});
