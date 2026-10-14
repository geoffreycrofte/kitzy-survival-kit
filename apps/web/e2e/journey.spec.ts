import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, setUpHousehold } from './helpers';

test.describe('Parcours principal', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('du foyer à la première luciole', async ({ page }) => {
    await setUpHousehold(page);

    // L'accueil propose l'eau en premier : 3 personnes × 9 L + 0,9 L pour le chat.
    const mission = page.getByRole('region', { name: /Ta prochaine luciole/ });
    await expect(mission).toContainText(/Ajoute 27,9\sL de «\sEau potable en bouteille\s»/);
    await mission.getByRole('link', { name: 'Ranger dans ma réserve' }).click();

    // Ajout d'un lot d'eau avec une date
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
    await page
      .getByLabel(/Quantité/)
      .first()
      .fill('30');
    await page.getByLabel('Date sur l’emballage').fill('2028-06-30');
    await page.getByRole('button', { name: 'Ajouter à ma réserve' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'ajouté' })).toBeVisible();
    await expect(
      page.getByText(/30\sL, à consommer de préférence avant le 30 juin 2028/),
    ).toBeVisible();

    // L'accueil passe aux récipients vides, puis la luciole de l'eau s'allume.
    const nav = page.getByRole('navigation', { name: 'Navigation principale' });
    await nav.getByRole('link', { name: 'Terrier' }).click();
    await expect(mission).toContainText('Récipients vides');
    await mission.getByRole('link', { name: 'Ranger dans ma réserve' }).click();
    await page
      .getByLabel(/Quantité/)
      .first()
      .fill('2');
    await page.getByRole('button', { name: 'Ajouter à ma réserve' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'ajouté' })).toBeVisible();
    await nav.getByRole('link', { name: 'Terrier' }).click();
    await expect(page.getByRole('img', { name: '1 luciole allumée sur 6' })).toBeVisible();
    await expect(mission).toContainText('Repas');
  });

  test('erreurs de formulaire annoncées et liées aux champs', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./kits/home/drinking-water');
    await page.getByRole('button', { name: 'Ajouter à ma réserve' }).click();
    const quantity = page.getByLabel(/Quantité/).first();
    await expect(quantity).toBeFocused();
    await expect(quantity).toHaveAttribute('aria-invalid', 'true');
    await expect(quantity).toHaveAccessibleDescription('Indique une quantité supérieure à 0.');
  });

  test('liste de courses, partage par lien et import', async ({ page, context }) => {
    await setUpHousehold(page);
    await page.goto('./courses');
    await expect(page.getByRole('heading', { level: 1, name: 'Courses' })).toBeVisible();
    const water = page.getByRole('checkbox', { name: /Eau potable en bouteille/ });
    await water.check();
    await expect(water).toBeChecked();

    await page.getByLabel('Article').fill('Piles AA');
    await page.getByRole('button', { name: 'Ajouter', exact: true }).click();
    await expect(page.getByRole('checkbox', { name: /Piles AA/ })).toBeVisible();

    await page.getByRole('button', { name: 'Créer le lien de partage' }).click();
    await expect(page.getByRole('img', { name: /QR code/ })).toBeVisible();
    const url = await page.getByLabel('Lien de partage', { exact: true }).inputValue();
    expect(url).toMatch(/\/partage#k1\./);

    // Une autre personne ouvre le lien (contexte de navigation neuf)
    const other = await context.browser()!.newContext();
    const page2 = await other.newPage();
    await page2.goto(url);
    await expect(page2.getByRole('heading', { level: 1, name: 'Liste partagée' })).toBeVisible();
    await expect(page2.getByText('Piles AA')).toBeVisible();
    await page2.getByRole('button', { name: 'Ajouter à ma liste de courses' }).click();
    await expect(page2.getByRole('heading', { level: 1, name: 'Courses' })).toBeVisible();
    await other.close();
  });

  test('aucune erreur axe sur les écrans principaux, dans les deux thèmes', async ({ page }) => {
    await setUpHousehold(page);
    for (const scheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      for (const path of [
        './',
        './foyer',
        './kits',
        './kits/home',
        './kits/home/drinking-water',
        './courses',
        './guide',
        './guide/sirenes',
        './reglages',
      ]) {
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expectNoAxeViolations(page);
      }
    }
  });

  test('export du fichier agenda', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./reglages');
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Télécharger le fichier agenda (.ics)' }).click();
    const file = await download;
    expect(file.suggestedFilename()).toBe('kitzy-rappels.ics');
  });
});
