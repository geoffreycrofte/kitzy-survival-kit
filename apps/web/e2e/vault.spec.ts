import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { setUpHousehold } from './helpers';

const CODE = 'tilleul-482';

async function fillOwner(page: Page, name: string) {
  await page.goto('./plan/foyer');
  await page
    .getByRole('group', { name: 'Ce plan appartient à' })
    .getByLabel('Nom et prénom')
    .fill(name);
  // Comme dans les autres tests : on laisse l'étape s'enregistrer avant de quitter la page.
  await page.waitForTimeout(800);
  await page.goto('./plan');
}

async function protectPlan(page: Page) {
  await page.goto('./reglages');
  const card = page.getByRole('region', { name: 'Protéger mon plan' });
  await card.getByLabel('Code Kitzy', { exact: true }).fill(CODE);
  await card.getByLabel('Confirme le code').fill(CODE);
  await card.getByRole('button', { name: 'Protéger mon plan' }).click();
  await expect(card.getByText('Ton plan est chiffré sur cet appareil.')).toBeVisible();
  return card;
}

/** Tout le contenu de la base locale, tel qu'il est écrit sur le disque. */
function rawDatabase(page: Page): Promise<string> {
  return page.evaluate(
    () =>
      new Promise<string>((resolve, reject) => {
        const open = indexedDB.open('kitzy');
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const db = open.result;
          const names = [...db.objectStoreNames];
          const tx = db.transaction(names, 'readonly');
          const out: unknown[] = [];
          for (const name of names) {
            const req = tx.objectStore(name).getAll();
            req.onsuccess = () => out.push(req.result);
          }
          tx.oncomplete = () => {
            db.close();
            resolve(JSON.stringify(out));
          };
        };
      }),
  );
}

test.describe('Plan protégé et sauvegardes chiffrées', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('le plan se chiffre, se verrouille et s’ouvre avec le code', async ({ page }) => {
    await setUpHousehold(page);
    await fillOwner(page, 'Famille Muller');
    expect(await rawDatabase(page)).toContain('Famille Muller');

    await protectPlan(page);
    // Plus rien de lisible sur le disque, mais l'avancement reste connu.
    expect(await rawDatabase(page)).not.toContain('Famille Muller');
    await page.goto('./plan');
    await expect(page.getByText('Commencé').first()).toBeVisible();

    // Au rechargement, la clé est oubliée : le plan est verrouillé.
    await page.reload();
    await page.goto('./plan/foyer');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Ton plan est verrouillé' }),
    ).toBeVisible();
    await page.getByLabel('Code Kitzy').fill('mauvais-code');
    await page.getByRole('button', { name: 'Ouvrir avec le code' }).click();
    await expect(page.getByText('Ce code ne correspond pas.')).toBeVisible();
    await page.getByLabel('Code Kitzy').fill(CODE);
    await page.getByRole('button', { name: 'Ouvrir avec le code' }).click();
    const owner = page
      .getByRole('group', { name: 'Ce plan appartient à' })
      .getByLabel('Nom et prénom');
    await expect(owner).toHaveValue('Famille Muller');

    // Une modification reste chiffrée.
    await owner.fill('Famille Muller-Weber');
    await page.waitForTimeout(800);
    // Navigation dans l'app (un rechargement verrouillerait le plan).
    await page.getByRole('link', { name: 'Mon plan d’urgence' }).first().click();
    await page.getByRole('link', { name: 'Voir et imprimer mon plan' }).click();
    await expect(page.getByText('Famille Muller-Weber')).toBeVisible();
    expect(await rawDatabase(page)).not.toContain('Muller-Weber');
  });

  test('l’empreinte (clé d’accès) ouvre le plan', async ({ page, context }) => {
    const cdp = await context.newCDPSession(page);
    await cdp.send('WebAuthn.enable');
    await cdp.send('WebAuthn.addVirtualAuthenticator', {
      options: {
        protocol: 'ctap2',
        transport: 'internal',
        hasResidentKey: true,
        hasUserVerification: true,
        isUserVerified: true,
        hasPrf: true,
        automaticPresenceSimulation: true,
      },
    });
    await setUpHousehold(page);
    await fillOwner(page, 'Famille Schmit');
    const card = await protectPlan(page);
    await card.getByRole('button', { name: 'Ouvrir aussi avec l’empreinte ou le visage' }).click();
    await expect(card.getByText(/Il s’ouvre avec ton empreinte/)).toBeVisible();

    await card.getByRole('button', { name: 'Verrouiller maintenant' }).click();
    await page.goto('./plan/imprimer');
    await page.getByRole('button', { name: 'Ouvrir avec l’empreinte ou le visage' }).click();
    await expect(page.getByText('Famille Schmit')).toBeVisible();
  });

  test('une sauvegarde protégée se restaure ailleurs avec son code seulement', async ({
    page,
    browser,
  }) => {
    await setUpHousehold(page);
    await fillOwner(page, 'Famille Hoffmann');
    await protectPlan(page);
    await page.reload();
    await page.goto('./reglages');

    // Plan verrouillé : il faut l'ouvrir pour l'inclure dans la sauvegarde.
    const data = page.getByRole('region', { name: 'Mes données', exact: true });
    await expect(data.getByText(/pour l’inclure dans la sauvegarde/)).toBeVisible();
    const lock = page.getByRole('region', { name: 'Protéger mon plan' });
    await lock.getByLabel('Code Kitzy').fill(CODE);
    await lock.getByRole('button', { name: 'Ouvrir avec le code' }).click();

    await expect(data.getByLabel('Protéger la sauvegarde par un code')).toBeChecked();
    await data.getByRole('button', { name: 'Préparer la sauvegarde' }).click();
    await expect(data.getByText('Le code doit faire au moins 8 caractères.')).toBeVisible();
    await data.getByLabel('Code de la sauvegarde').fill('48291375');
    await data.getByLabel('Confirme le code').fill('48291375');
    await data.getByRole('button', { name: 'Préparer la sauvegarde' }).click();
    await expect(data.getByText('Elle est protégée par ton code.')).toBeVisible();
    const download = page.waitForEvent('download');
    await data.getByRole('button', { name: 'Télécharger', exact: true }).click();
    const file = await download;
    const text = await (
      await file.createReadStream()
    )
      .toArray()
      .then((c) => Buffer.concat(c).toString());
    expect(text).not.toContain('Hoffmann');
    expect(JSON.parse(text)).toMatchObject({ app: 'kitzy', protected: 1 });

    // Un autre appareil, sans empreinte ni verrou : le code suffit.
    const other = await browser.newContext({ baseURL: 'http://localhost:4173/app/' });
    const fresh = await other.newPage();
    await fresh.goto('./reglages');
    await fresh.locator('input[type=file]').setInputFiles({
      name: 'kitzy-sauvegarde-protegee.json',
      mimeType: 'application/json',
      buffer: Buffer.from(text),
    });
    await expect(fresh.getByText('Cette sauvegarde est protégée par un code.')).toBeVisible();
    await fresh.getByLabel('Code de la sauvegarde à ouvrir').fill('00000000');
    await fresh.getByRole('button', { name: 'Ouvrir la sauvegarde' }).click();
    await expect(fresh.getByText('Ce code n’ouvre pas cette sauvegarde.')).toBeVisible();
    fresh.on('dialog', (dialog) => void dialog.accept());
    await fresh.getByLabel('Code de la sauvegarde à ouvrir').fill('48291375');
    await fresh.getByRole('button', { name: 'Ouvrir la sauvegarde' }).click();
    await expect(
      fresh.getByRole('status').filter({ hasText: 'Sauvegarde restaurée.' }),
    ).toBeVisible();
    await fresh.goto('./plan/imprimer');
    await expect(fresh.getByText('Famille Hoffmann')).toBeVisible();
    await other.close();
  });

  test('aucune erreur axe sur les écrans de protection', async ({ page }) => {
    await setUpHousehold(page);
    await fillOwner(page, 'Famille Muller');
    await page.goto('./reglages');
    for (const scheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations, `réglages ${scheme}`).toEqual([]);
    }
    await protectPlan(page);
    await page.reload();
    await page.goto('./plan/foyer');
    for (const scheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations, `plan verrouillé ${scheme}`).toEqual([]);
    }
  });
});
