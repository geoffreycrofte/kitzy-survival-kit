import { expect, test, type Page } from '@playwright/test';
import { expectNoAxeViolations, setUpHousehold } from './helpers';

/** Range un lot dans un kit, depuis la page de l'article. */
async function addLot(page: Page, path: string, quantity: string, date?: string) {
  await page.goto(path);
  await page
    .getByLabel(/Quantité/)
    .first()
    .fill(quantity);
  if (date) await page.getByLabel('Date sur l’emballage').fill(date);
  await page.getByRole('button', { name: 'Ajouter à ma réserve' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'ajouté' })).toBeVisible();
}

test.describe('Inventaire à imprimer', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await setUpHousehold(page);
    await addLot(page, './kits/home/drinking-water', '12', '2028-06-30');
    await addLot(page, './kits/home/drinking-water', '6', '2027-01-15');
    await addLot(page, './kits/bag-1/drinking-water', '1.5');
  });

  test('une feuille par emplacement, avec ce qu’on a et ses dates', async ({ page }) => {
    await page.goto('./kits');
    await page.getByRole('link', { name: 'Imprimer l’inventaire' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Inventaire à imprimer');

    const home = page.getByRole('article', { name: 'Réserve maison : ce que j’ai' });
    const rows = home.getByRole('row');
    // L'en-tête, les deux lots (le plus proche d'abord), puis trois lignes vides.
    await expect(rows.nth(1)).toContainText('Eau potable en bouteille');
    await expect(rows.nth(1)).toContainText('6 L');
    await expect(rows.nth(1)).toContainText('de préférence avant le 15/01/2027');
    await expect(rows.nth(2)).toContainText('12 L');
    await expect(page.getByRole('article', { name: 'Sac 1 : ce que j’ai' })).toContainText(
      'sans date',
    );
    // Les sacs vides n'ont pas de feuille.
    await expect(page.getByRole('article')).toHaveCount(2);

    // On choisit ce qu'on imprime.
    await page.getByRole('checkbox', { name: /^Sac 1/ }).uncheck();
    await expect(page.getByRole('article')).toHaveCount(1);
    await expectNoAxeViolations(page);
  });

  test('depuis un kit, seulement ce kit', async ({ page }) => {
    await page.goto('./kits/bag-1');
    await page.getByRole('link', { name: 'Imprimer ce kit' }).click();
    await expect(page.getByRole('article')).toHaveCount(1);
    await expect(page.getByRole('article', { name: 'Sac 1 : ce que j’ai' })).toBeVisible();
  });
});
