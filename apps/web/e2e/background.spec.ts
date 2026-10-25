import { expect, test } from '@playwright/test';
import { setUpHousehold } from './helpers';

// Fuseau choisi pour qu'il soit midi pendant le test : la vérification ne notifie jamais la nuit.
const offset = 12 - new Date().getUTCHours();
const timezoneId = offset === 0 ? 'UTC' : `Etc/GMT${offset > 0 ? '-' : '+'}${Math.abs(offset)}`;
// Le fuseau de la page ne suffit pas toujours pour le service worker : on règle aussi celui du navigateur.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;
test.use({
  timezoneId,
  launchOptions: {
    env: { ...process.env, TZ: timezoneId },
    ...(executablePath ? { executablePath } : {}),
  },
});

test('la vérification en arrière-plan envoie une seule notification regroupée', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['notifications']);
  await setUpHousehold(page);

  // Un lot d'eau qui atteint sa date aujourd'hui.
  const today = await page.evaluate(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  await page.goto('./kits/home/drinking-water');
  await page
    .getByLabel(/Quantité/)
    .first()
    .fill('6');
  await page.getByLabel('Date sur l’emballage').fill(today);
  await page.getByLabel('À consommer jusqu’au (date limite)').check();
  await page.getByRole('button', { name: 'Ajouter à ma réserve' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'ajouté' })).toBeVisible();

  // Comme une app installée : Chrome accorde la synchronisation périodique.
  const target = await context.newCDPSession(page);
  const { targetInfo } = await target.send('Target.getTargetInfo');
  const browserCdp = await context.browser()!.newBrowserCDPSession();
  await browserCdp.send('Browser.grantPermissions', {
    origin: new URL(page.url()).origin,
    browserContextId: targetInfo.browserContextId,
    permissions: ['notifications', 'periodicBackgroundSync'],
  });

  await page.goto('./reglages');
  await page.evaluate(() => navigator.serviceWorker.ready);
  // Le service worker doit voir l'heure du test (hors des heures calmes).
  const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
  const workerHour = await worker.evaluate(() => new Date().getHours());
  expect(
    workerHour >= 8 && workerHour < 21,
    `heure vue par le service worker : ${workerHour}`,
  ).toBe(true);
  await page.getByRole('checkbox', { name: 'Me prévenir sur cet appareil' }).check();
  // La case change tout de suite ; l'annonce arrive une fois le réglage enregistré.
  await expect(
    page.getByRole('status').filter({ hasText: 'même quand l’app est fermée' }),
  ).toBeVisible();

  // Chrome DevTools déclenche l'événement que le système enverrait une fois par jour.
  const cdp = await context.newCDPSession(page);
  const registrationId = new Promise<string>((resolve) => {
    cdp.on('ServiceWorker.workerRegistrationUpdated', ({ registrations }) => {
      const reg = registrations.find((r: { isDeleted: boolean }) => !r.isDeleted);
      if (reg) resolve(reg.registrationId);
    });
  });
  await cdp.send('ServiceWorker.enable');
  const origin = new URL(page.url()).origin;
  const fire = async () =>
    cdp.send('ServiceWorker.dispatchPeriodicSyncEvent', {
      origin,
      registrationId: await registrationId,
      tag: 'kitzy-rappels',
    });

  const notifications = () =>
    page.evaluate(async () => {
      const reg = await navigator.serviceWorker.ready;
      return (await reg.getNotifications()).map((n) => ({ title: n.title, body: n.body }));
    });

  await fire();
  // Une seule notification, qui regroupe tout. D'autres rappels peuvent tomber le même jour
  // (test des sirènes le premier lundi, check-up au changement d'heure) : le titre compte alors
  // les rappels (« Kitzy : 2 rappels… »), mais l'eau y figure toujours.
  await expect.poll(notifications).toEqual([
    {
      title: expect.stringMatching(/^Kitzy/),
      body: expect.stringMatching(/Eau potable en bouteille.*date limite aujourd’hui/),
    },
  ]);

  // Une seule fois par jour, même si le navigateur relance la vérification.
  await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    (await reg.getNotifications()).forEach((n) => n.close());
  });
  await fire();
  await page.waitForTimeout(500);
  expect(await notifications()).toEqual([]);
});
