import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, setUpHousehold } from './helpers';

test.describe('Partager Kitzy avec ses proches et ses voisins', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // Sans feuille de partage (navigateur de test), le lien est copié.
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  });

  test('l’accueil invite à partager, une fois le foyer présenté', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('region', { name: 'Préparés ensemble' })).toHaveCount(0);
    await setUpHousehold(page);
    await page.goto('./');
    const card = page.getByRole('region', { name: 'Préparés ensemble' });
    await expect(
      card.getByText('Quand la famille et le quartier sont prêts, on s’entraide plus facilement.'),
    ).toBeVisible();

    await card.getByRole('button', { name: 'Partager Kitzy' }).click();
    await expect(
      page.getByRole('status').filter({ hasText: 'Lien copié : colle-le dans un message.' }),
    ).toBeVisible();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain('Kitzy');
    expect(copied).toContain('https://kitzy.lu/');

    const toggle = card.getByRole('button', { name: 'Afficher le QR code' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(card.getByRole('img', { name: /QR code vers kitzy\.lu/ })).toBeVisible();
    await expect(card.getByRole('button', { name: 'Masquer le QR code' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expectNoAxeViolations(page);
  });

  test('l’étape « Le quartier » du plan et le menu proposent aussi le partage', async ({
    page,
  }) => {
    await setUpHousehold(page);
    await page.goto('./plan/quartier');
    await expect(
      page.getByRole('region', { name: 'Préparés ensemble' }).getByText(/étape 3 officielle/),
    ).toBeVisible();

    await page.goto('./');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const menu = page.getByRole('dialog');
    await menu.getByRole('button', { name: /Partager Kitzy/ }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Lien copié' })).toBeVisible();
  });

  test('la page d’accueil du site a sa section de partage et son QR code', async ({ page }) => {
    await page.goto('/');
    const section = page.getByRole('region', {
      name: 'Quand la famille et le quartier sont prêts, on s’entraide plus facilement.',
    });
    await expect(section.getByRole('img', { name: /QR code vers kitzy\.lu/ })).toBeVisible();
    await section.getByRole('button', { name: 'Partager Kitzy' }).click();
    await expect(section.getByRole('status')).toHaveText('Lien copié : colle-le dans un message.');
  });
});
