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

  test('plan verrouillé avec empreinte : « Faire une sauvegarde » la demande tout de suite', async ({
    page,
    context,
  }) => {
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
    const card = await protectPlan(page);
    await card.getByRole('button', { name: 'Ouvrir aussi avec l’empreinte ou le visage' }).click();
    await expect(card.getByText(/Il s’ouvre avec ton empreinte/)).toBeVisible();
    await card.getByRole('button', { name: 'Verrouiller maintenant' }).click();

    // Un seul geste : l'empreinte est demandée aussitôt, puis la sauvegarde s'ouvre.
    const data = page.getByRole('region', { name: 'Mes données', exact: true });
    await data.getByRole('button', { name: 'Faire une sauvegarde' }).click();
    await expect(page.getByRole('dialog', { name: 'Faire une sauvegarde' })).toBeVisible();
    await expect(page.getByRole('dialog', { name: 'Ton plan est protégé' })).toBeHidden();
  });

  test('un plan protégé ne s’efface qu’après l’avoir ouvert, sans quitter la page', async ({
    page,
  }) => {
    await setUpHousehold(page);
    await fillOwner(page, 'Famille Weber');
    await protectPlan(page);
    await page.reload();
    await page.goto('./plan');

    // Le bouton est là, mais il demande d'abord d'ouvrir le plan, dans un tiroir.
    await page.getByRole('button', { name: 'Effacer mon plan' }).click();
    const unlock = page.getByRole('dialog', { name: 'Ton plan est protégé' });
    await expect(unlock).toBeFocused();
    await expect(unlock.getByText('Ouvre-le pour pouvoir l’effacer.')).toBeVisible();
    await unlock.getByLabel('Code Kitzy', { exact: true }).fill(CODE);
    await unlock.getByRole('button', { name: 'Ouvrir avec le code' }).click();
    await expect(unlock.getByText('Plan ouvert.')).toBeFocused();
    page.once('dialog', (dialog) => void dialog.accept());
    await unlock.getByRole('button', { name: 'Effacer mon plan' }).click();
    await expect(unlock).toBeHidden();
    await expect(page.getByRole('status').filter({ hasText: 'Plan effacé.' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Effacer mon plan' })).toHaveCount(0);
  });

  test('plan verrouillé : restaurer ouvre le plan sur place, puis le sélecteur de fichiers', async ({
    page,
  }) => {
    await setUpHousehold(page);
    await protectPlan(page);
    await page.reload();
    await page.goto('./reglages');
    const data = page.getByRole('region', { name: 'Mes données', exact: true });
    await data.getByRole('button', { name: 'Choisir un fichier' }).click();
    const unlock = page.getByRole('dialog', { name: 'Ton plan est protégé' });
    await expect(unlock.getByText(/la sauvegarde restaurée sera protégée/)).toBeVisible();
    for (const scheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations, `tiroir d’ouverture ${scheme}`).toEqual([]);
    }
    await unlock.getByLabel('Code Kitzy', { exact: true }).fill(CODE);
    await unlock.getByRole('button', { name: 'Ouvrir avec le code' }).click();
    await expect(
      unlock.getByText('Ton plan est ouvert. Choisis maintenant le fichier de sauvegarde.'),
    ).toBeFocused();
    const chooser = page.waitForEvent('filechooser');
    await unlock.getByRole('button', { name: 'Choisir un fichier' }).click();
    await chooser;
    await expect(unlock).toBeHidden();
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

    // Plan verrouillé : le bouton habituel ouvre d'abord le plan, dans un tiroir sous le doigt,
    // puis enchaîne sur la sauvegarde.
    const data = page.getByRole('region', { name: 'Mes données', exact: true });
    await data.getByRole('button', { name: 'Faire une sauvegarde' }).click();
    const unlock = page.getByRole('dialog', { name: 'Ton plan est protégé' });
    await expect(unlock.getByText('Ouvre-le pour l’inclure dans ta sauvegarde.')).toBeVisible();
    await unlock.getByLabel('Code Kitzy', { exact: true }).fill(CODE);
    await unlock.getByRole('button', { name: 'Ouvrir avec le code' }).click();
    const drawer = page.getByRole('dialog', { name: 'Faire une sauvegarde' });
    await expect(drawer).toBeFocused();
    // Ici, pas de partage de fichiers : le bouton dit qu'il va télécharger.
    await drawer.getByRole('button', { name: 'Protéger et télécharger' }).click();
    await expect(drawer.getByText('Le code doit faire au moins 8 caractères.')).toBeVisible();
    const field = drawer.getByRole('textbox', { name: 'Code de la sauvegarde', exact: true });
    await field.fill('48291375');
    await expect(field).toHaveAttribute('type', 'password');
    await drawer.getByRole('button', { name: 'Afficher Code de la sauvegarde' }).click();
    await expect(field).toHaveAttribute('type', 'text');
    await drawer.getByRole('textbox', { name: 'Confirme le code', exact: true }).fill('48291375');
    const download = page.waitForEvent('download');
    await drawer.getByRole('button', { name: 'Protéger et télécharger' }).click();
    const file = await download;
    const text = await (
      await file.createReadStream()
    )
      .toArray()
      .then((c) => Buffer.concat(c).toString());
    expect(text).not.toContain('Hoffmann');
    expect(JSON.parse(text)).toMatchObject({ app: 'kitzy', protected: 1 });
    // Le tiroir dit où est le fichier et quoi en faire.
    await expect(drawer.getByRole('heading', { name: 'Sauvegarde téléchargée' })).toBeFocused();
    await expect(drawer.getByText(file.suggestedFilename())).toBeVisible();
    await drawer.getByRole('button', { name: 'Terminé' }).click();
    await expect(drawer).toBeHidden();

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

  test('avec le partage de fichiers, « Protéger et envoyer » ouvre la feuille de partage', async ({
    page,
  }) => {
    // Un téléphone : le partage accepte les fichiers. La première fois, le navigateur juge le
    // geste trop ancien ; « Envoyer » rouvre alors le partage.
    await page.addInitScript(() => {
      const calls: string[] = [];
      Object.assign(window, { shared: calls });
      Object.defineProperty(navigator, 'canShare', { value: () => true });
      Object.defineProperty(navigator, 'share', {
        value: async (data: { files: File[] }) => {
          calls.push(data.files[0]?.name ?? '');
          if (calls.length === 1) throw new DOMException('trop tard', 'NotAllowedError');
        },
      });
    });
    await setUpHousehold(page);
    await page.goto('./reglages');
    await page.getByRole('button', { name: 'Faire une sauvegarde' }).click();
    const drawer = page.getByRole('dialog', { name: 'Faire une sauvegarde' });
    await drawer
      .getByRole('textbox', { name: 'Code de la sauvegarde', exact: true })
      .fill('48291375');
    await drawer.getByRole('textbox', { name: 'Confirme le code', exact: true }).fill('48291375');
    await drawer.getByRole('button', { name: 'Protéger et envoyer' }).click();
    await expect(drawer.getByRole('heading', { name: 'Ta sauvegarde est prête' })).toBeFocused();
    await drawer.getByRole('button', { name: 'Envoyer', exact: true }).click();
    await expect(drawer.getByRole('heading', { name: 'Sauvegarde envoyée' })).toBeFocused();
    const shared = await page.evaluate(() => (window as unknown as { shared: string[] }).shared);
    expect(shared).toHaveLength(2);
    expect(shared[0]).toMatch(/^kitzy-sauvegarde-.*-protegee\.json$/);
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(page.getByRole('button', { name: 'Faire une sauvegarde' })).toBeFocused();
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
    await page.getByRole('button', { name: 'Faire une sauvegarde' }).click();
    const drawer = page.getByRole('dialog', { name: 'Faire une sauvegarde' });
    await drawer.getByRole('button', { name: 'Protéger et télécharger' }).click();
    for (const scheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations, `tiroir de sauvegarde ${scheme}`).toEqual([]);
    }
    await drawer
      .getByRole('textbox', { name: 'Code de la sauvegarde', exact: true })
      .fill('48291375');
    await drawer.getByRole('textbox', { name: 'Confirme le code', exact: true }).fill('48291375');
    await drawer.getByRole('button', { name: 'Protéger et télécharger' }).click();
    await expect(drawer.getByRole('heading', { name: 'Sauvegarde téléchargée' })).toBeVisible();
    for (const scheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations, `sauvegarde téléchargée ${scheme}`).toEqual([]);
    }
    await drawer.getByRole('button', { name: 'Terminé' }).click();
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
