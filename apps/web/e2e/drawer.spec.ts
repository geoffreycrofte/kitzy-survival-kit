import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, setUpHousehold } from './helpers';

test.describe('Tiroir d’ajout : ranger sans quitter la liste', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('depuis la liste d’un kit, on ajoute puis on revient à la liste', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./kits/home');
    await page.getByRole('link', { name: 'Sac de couchage ou couverture' }).click();

    const drawer = page.getByRole('dialog', { name: 'Sac de couchage ou couverture' });
    await expect(drawer).toBeVisible();
    await expect(page).toHaveURL(/\/kits\/home$/);
    // Le focus est sur le tiroir lui-même ; ce qu'il en faut est dit dans le bloc quantité.
    const quantity = drawer.getByLabel(/Quantité/);
    await expect(drawer).toBeFocused();
    await expect(quantity).toHaveAccessibleDescription(/Il en faut 3\spièces pour ton foyer\./);
    await expectNoAxeViolations(page);
    // Tab entre dans le tiroir : la croix d'abord, puis le formulaire.
    await page.keyboard.press('Tab');
    await expect(drawer.getByRole('button', { name: 'Fermer' })).toBeFocused();

    await quantity.fill('2');
    await drawer.getByRole('button', { name: 'Ajouter à ma réserve' }).click();
    await expect(drawer).toBeHidden();
    await expect(page.getByRole('status').filter({ hasText: /2\spièces ajouté/ })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sac de couchage ou couverture' })).toBeFocused();

    // Une seconde fois : ce que tu as déjà s'affiche.
    await page.getByRole('link', { name: 'Sac de couchage ou couverture' }).click();
    await expect(drawer.getByLabel(/Quantité/)).toHaveAccessibleDescription(
      /Il en faut 3\spièces pour ton foyer\. Tu as 2\spièces\./,
    );
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();

    // La page complète reste à un lien.
    await page.getByRole('link', { name: 'Sac de couchage ou couverture' }).click();
    await drawer.getByRole('link', { name: 'Tout voir sur cet article' }).click();
    await expect(page).toHaveURL(/\/kits\/home\/sleeping-bags-blankets$/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Sac de couchage ou couverture' }),
    ).toBeFocused();
  });

  test('depuis les courses, la quantité achetée est déjà saisie', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./courses');
    const water = page.getByRole('listitem').filter({ hasText: 'Eau potable en bouteille' });
    await water
      .getByRole('link', {
        name: /^Ranger 27,9\sL de «\sEau potable en bouteille\s» dans Réserve maison$/,
      })
      .click();
    const drawer = page.getByRole('dialog', { name: 'Eau potable en bouteille' });
    await expect(drawer.getByLabel(/Quantité/)).toHaveValue('27,9');
    await drawer.getByLabel('Date sur l’emballage').fill('2028-06-30');
    await drawer.getByRole('button', { name: 'Ajouter à ma réserve' }).click();
    await expect(drawer).toBeHidden();
    await expect(page).toHaveURL(/\/courses$/);
    await expect(page.getByRole('status').filter({ hasText: 'ajouté' })).toBeVisible();
  });

  test('le tiroir montre une première suggestion, puis toutes en plein écran', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./kits/home');
    await page.getByRole('link', { name: 'Lampe frontale' }).click();
    const drawer = page.getByRole('dialog', { name: 'Lampe frontale' });
    const buy = drawer.getByRole('region', { name: 'Où l’acheter' });
    await expect(buy.getByRole('heading', { level: 4, name: 'Budget essentiel' })).toBeVisible();
    await expect(buy.getByRole('heading', { name: 'Budget équilibré' })).toHaveCount(0);
    // Les mentions d'affiliation restent visibles dès l'aperçu.
    await expect(
      buy.getByRole('link', { name: 'Comment Kitzy choisit ces conseils' }),
    ).toBeVisible();
    await expectNoAxeViolations(page);

    await buy.getByRole('button', { name: /^Voir (les )?\d+ autres? suggestions?$/ }).click();
    await expect(drawer).toHaveClass(/drawer--full/);
    const balanced = buy.getByRole('heading', { level: 4, name: 'Budget équilibré' });
    await expect(balanced).toBeFocused();
    await expectNoAxeViolations(page);

    await drawer.getByRole('button', { name: 'Fermer' }).click();
    await expect(drawer).toBeHidden();
    // À la réouverture, on repart de l'aperçu.
    await page.getByRole('link', { name: 'Lampe frontale' }).click();
    await expect(drawer).not.toHaveClass(/drawer--full/);
  });

  test('la page de l’article est allégée : rien de vide, le guide plus bas', async ({ page }) => {
    await setUpHousehold(page);
    await page.goto('./kits/home/sleeping-bags-blankets');
    await expect(page.getByRole('heading', { name: 'Ce que tu as' })).toHaveCount(0);
    await expect(page.getByLabel(/Quantité/).first()).toHaveAccessibleDescription(
      /^Il en faut 3\spièces pour ton foyer\.$/,
    );
    await page
      .getByLabel(/Quantité/)
      .first()
      .fill('1');
    await page.getByRole('button', { name: 'Ajouter à ma réserve' }).click();
    await expect(page.getByRole('heading', { name: 'Ce que tu as' })).toBeVisible();
    await expectNoAxeViolations(page);
  });
});
