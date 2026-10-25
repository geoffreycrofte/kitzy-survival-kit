import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, setUpHousehold } from './helpers';

test.describe('Garde-manger : des recettes aux courses, des courses à la réserve', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('une recette remplit la liste, et l’achat coché remplit la réserve', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./recettes/chili-express');
    const reserve = page.getByRole('region', { name: 'Pour ta réserve' });
    await expect(
      reserve.getByText(/environ 12 repas à ta réserve, dont 2 pour la recette/),
    ).toBeVisible();
    await reserve.getByRole('button', { name: 'Une fois de plus' }).click();
    await expect(
      reserve.getByText(/environ 14 repas à ta réserve, dont 4 pour la recette/),
    ).toBeVisible();
    // Une seule boutique Amazon, celle de la langue de l'app.
    await expect(reserve.getByRole('link', { name: /Amazon\.fr/ }).first()).toBeVisible();
    await expect(reserve.getByRole('link', { name: /Amazon\.de/ })).toHaveCount(0);
    await reserve.getByRole('button', { name: 'Ajouter à ma liste de courses' }).click();
    await expect(reserve.getByText('C’est sur ta liste de courses.')).toBeVisible();

    await page.goto('./courses');
    const beans = page.getByRole('checkbox', { name: /Haricots rouges en boîte \(400 g\)/ });
    await expect(page.getByText('Pour : Chili express du terrier').first()).toBeVisible();
    await beans.check();
    await expect(page.getByText(/Rangé dans ta réserve : ≈ 2 repas/)).toBeVisible();

    // Les deux boîtes sont dans la réserve, sans date : l'article invite à l'ajouter.
    await page.goto('./kits/home/non-perishable-food');
    await expect(page.getByText('2 portions, sans date')).toBeVisible();
    await page.getByRole('button', { name: 'Ajouter la date' }).click();
    await page.getByLabel('Date sur l’emballage').last().fill('2029-03-01');
    await page.getByRole('button', { name: 'Enregistrer la date' }).click();
    await expect(page.locator('.lot')).toHaveText(/2\sportions, à consommer de préférence avant/);

    // Décocher l'achat le retire de la réserve.
    await page.goto('./courses');
    await page.getByRole('checkbox', { name: /Haricots rouges en boîte/ }).uncheck();
    await page.goto('./kits/home/non-perishable-food');
    await expect(page.locator('.lot')).toHaveCount(0);
  });

  test('l’article « Nourriture non périssable » propose son garde-manger', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./kits/home/non-perishable-food');
    const shelf = page.getByRole('region', { name: 'Au garde-manger' });
    await expect(shelf.getByText('Lentilles cuites en boîte')).toBeVisible();
    await shelf
      .getByRole('button', { name: 'Ajouter Lentilles cuites en boîte à ma liste de courses' })
      .click();
    await page.goto('./courses');
    await expect(page.getByRole('checkbox', { name: /Lentilles cuites en boîte/ })).toBeVisible();
  });

  test('en anglais, les liens mènent vers Amazon.de', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./reglages');
    await page
      .getByRole('group', { name: 'Langue' })
      .getByRole('radio', { name: 'English' })
      .check();
    await page.goto('./recettes/chili-express');
    const reserve = page.getByRole('region', { name: 'For your reserve' });
    await expect(reserve.getByRole('link', { name: /Amazon\.de/ }).first()).toBeVisible();
    await expect(reserve.getByRole('link', { name: /Amazon\.fr/ })).toHaveCount(0);
  });

  test('aucune erreur axe sur la recette et le garde-manger', async ({ page }) => {
    await setUpHousehold(page);
    for (const path of ['./recettes/chili-express', './kits/home/non-perishable-food']) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expectNoAxeViolations(page);
    }
  });
});
