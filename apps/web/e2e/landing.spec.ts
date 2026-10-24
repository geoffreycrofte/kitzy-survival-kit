import { expect, test } from '@playwright/test';
import { expectNoAxeViolations } from './helpers';

test.describe('Page de présentation (racine du site)', () => {
  test('présente Kitzy et mène à l’app', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Kitzy/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Trois jours d’avance sur l’imprévu.' }),
    ).toBeVisible();
    for (const name of [
      'Calculé pour ta maisonnée',
      'La maison, et les sacs à dos',
      'Quoi acheter, à ton budget',
      'Les dates, sans y penser',
      'Se préparer, en s’amusant',
      'Tout reste chez toi',
      'Installer Kitzy',
    ]) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
    }
    // Pas de lucioles sur la page de présentation.
    await expect(page.getByText(/luciole/i)).toHaveCount(0);
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('link', { name: 'Crofte Studio' })).toHaveAttribute(
      'href',
      'https://geoffreycrofte.com',
    );
    await expect(footer.getByRole('link', { name: 'CheckFox.eu' })).toHaveAttribute(
      'href',
      'https://checkfox.eu',
    );
    await page.getByRole('link', { name: 'Ouvrir Kitzy', exact: true }).click();
    await expect(page).toHaveURL(/\/app\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Prépare ton terrier.');
  });

  test('la maisonnée : les quantités suivent la composition du foyer', async ({ page }) => {
    await page.goto('/');
    const board = page.getByRole('group', { name: 'Chez moi, il y a' });
    const water = page.locator('[data-result="water"]');
    await expect(water).toHaveText('27,9');
    await expect(page.locator('[data-result="bags"]')).toHaveText('3');
    await board.getByRole('button', { name: /^Chiens\s: un de plus$/ }).click();
    // Un chien boit environ 1 L par jour : 3 L de plus pour 72 h.
    await expect(water).toHaveText('30,9');
    await expect(page.locator('[data-result="pets"]')).toHaveText('12');
    const lessAdults = board.getByRole('button', { name: /^Adultes\s: un de moins$/ });
    await lessAdults.click();
    await lessAdults.click();
    await expect(lessAdults).toBeDisabled();
    await expect(page.locator('[data-result="bags"]')).toHaveText('1');
    await expect(page.locator('[data-result-label="bags"]')).toHaveText('sac à dos prêt à partir');
  });

  test('met en avant les étapes de l’appareil (Android ici)', async ({ page }) => {
    await page.goto('/');
    const first = page.locator('.platform').first();
    await expect(first).toHaveAttribute('data-platform', 'android');
    await expect(first).toContainText('Ton appareil');
    // Le bouton n'apparaît que si le navigateur propose l'installation.
    const button = page.getByRole('button', { name: 'Installer maintenant' });
    await expect(button).toBeHidden();
    await page.evaluate(() => {
      const event = new Event('beforeinstallprompt', { cancelable: true }) as Event & {
        prompt: () => Promise<void>;
        userChoice: Promise<{ outcome: string }>;
      };
      event.prompt = async () => undefined;
      event.userChoice = Promise.resolve({ outcome: 'accepted' });
      window.dispatchEvent(event);
    });
    await expect(button).toBeVisible();
  });

  test('la langue choisie ici suit dans l’app', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Langue').selectOption('en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Three days ahead of the unexpected.' }),
    ).toBeVisible();
    await page.goto('./reglages');
    await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();
  });

  test('l’app installée s’ouvre directement dans app/', async ({ page }) => {
    await page.addInitScript(() => {
      const original = window.matchMedia.bind(window);
      window.matchMedia = (query: string) =>
        query === '(display-mode: standalone)'
          ? ({ matches: true, media: query } as MediaQueryList)
          : original(query);
    });
    await page.goto('/');
    await expect(page).toHaveURL(/\/app\/$/);
  });

  test('les anciennes adresses mènent à la même page dans app/', async ({ page }) => {
    await page.goto('/guide/sirenes');
    await expect(page).toHaveURL(/\/app\/guide\/sirenes$/);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Les signaux des sirènes' }),
    ).toBeVisible();
  });

  test('l’ancien service worker de la racine se retire', async ({ request }) => {
    const sw = await (await request.get('/sw.js')).text();
    expect(sw).toContain('unregister');
  });

  for (const scheme of ['dark', 'light'] as const) {
    test(`aucune erreur axe (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      await page.goto('/');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expectNoAxeViolations(page);
    });
  }

  test.describe('au format bureau', () => {
    test.use({
      viewport: { width: 1366, height: 860 },
      isMobile: false,
      hasTouch: false,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36',
    });

    test('aucune erreur axe, ordinateur en premier', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      await expect(page.locator('.platform').first()).toHaveAttribute('data-platform', 'desktop');
      await expectNoAxeViolations(page);
    });
  });
});
