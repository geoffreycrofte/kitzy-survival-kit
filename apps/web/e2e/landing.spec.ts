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
      'Ce que Kitzy fait pour toi',
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

  test('référencement : aperçus de partage, données structurées, robots et llms.txt', async ({
    page,
    request,
  }) => {
    await page.goto('/');
    const head = page.locator('head');
    await expect(head.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://kitzy.lu/',
    );
    await expect(head.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://kitzy.lu/og/kitzy-og.png',
    );
    await expect(head.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Kitzy, ta réserve d’urgence de 72 heures',
    );
    await expect(head.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    const jsonLd = await head.locator('script[type="application/ld+json"]').textContent();
    const graph = (JSON.parse(jsonLd!) as { '@graph': Array<{ '@type': string }> })['@graph'];
    expect(graph.map((node) => node['@type'])).toEqual([
      'WebSite',
      'WebPage',
      'WebApplication',
      'Organization',
    ]);

    // L'image servie est bien un PNG de 1200 × 630.
    const image = await request.get('/og/kitzy-og.png');
    expect(image.headers()['content-type']).toContain('image/png');
    const png = await image.body();
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);

    expect(await (await request.get('/robots.txt')).text()).toContain(
      'Sitemap: https://kitzy.lu/sitemap.xml',
    );
    expect(await (await request.get('/sitemap.xml')).text()).toContain(
      '<loc>https://kitzy.lu/</loc>',
    );
    const llms = await (await request.get('/llms.txt')).text();
    expect(llms.startsWith('# Kitzy\n\n> ')).toBe(true);
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

  test('une adresse par langue : le choix suit dans l’app, et la racine s’en souvient', async ({
    page,
  }) => {
    await page.goto('/');
    const menu = page.locator('summary', { hasText: 'Français' });
    // Échap referme le menu et rend le focus.
    await menu.click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('link', { name: 'English' })).toBeHidden();
    await expect(menu).toBeFocused();
    await menu.click();
    const english = page.getByRole('link', { name: 'English' });
    await expect(english).toHaveAttribute('hreflang', 'en');
    await expect(page.getByRole('link', { name: 'Français' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await english.click();
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Three days ahead of the unexpected.' }),
    ).toBeVisible();
    // Les liens de la page traduite mènent toujours à l'app et aux images.
    await expect(page.getByRole('img').first()).toBeVisible();
    await page.getByRole('link', { name: 'Open Kitzy', exact: true }).click();
    await expect(page).toHaveURL(/\/app\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Revenir à la racine : la page anglaise, choisie, s'ouvre.
    await page.goto('/');
    await expect(page).toHaveURL(/\/en\/$/);
  });

  test.describe('appareil en allemand', () => {
    test.use({ locale: 'de-LU' });

    test('la racine reste en français et propose la page allemande', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
      const hint = page.getByRole('link', { name: 'Diese Seite auf Deutsch lesen' });
      await expect(hint).toHaveAttribute('lang', 'de');
      await hint.click();
      await expect(page).toHaveURL(/\/de\/$/);
      // Sur la page allemande, plus de suggestion.
      await expect(page.locator('#lang-hint')).toBeHidden();
    });
  });

  test('chaque langue a sa page, ses balises hreflang et aucune erreur axe', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const [path, lang, title] of [
      ['/de/', 'de', 'Dem Unerwarteten drei Tage voraus.'],
      ['/lb/', 'lb', null],
      ['/pt/', 'pt', null],
    ] as const) {
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      if (title) await expect(page.getByRole('heading', { level: 1 })).toContainText(title);
      const head = page.locator('head');
      await expect(head.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://kitzy.lu${path}`,
      );
      await expect(head.locator('link[rel="alternate"][hreflang]')).toHaveCount(6);
      // L'image de partage est celle de la langue, et elle existe.
      const image = `https://kitzy.lu/og/kitzy-og-${lang}.png`;
      await expect(head.locator('meta[property="og:image"]')).toHaveAttribute('content', image);
      const served = await page.request.get(`/og/kitzy-og-${lang}.png`);
      expect(served.headers()['content-type']).toContain('image/png');
      await expect(head.locator('link[hreflang="x-default"]')).toHaveAttribute(
        'href',
        'https://kitzy.lu/',
      );
      await expectNoAxeViolations(page);
    }
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
    // /guide/… est désormais la version publique du guide (voir site.spec.ts) : on teste une autre page.
    await page.goto('/activites');
    await expect(page).toHaveURL(/\/app\/activites$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
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
