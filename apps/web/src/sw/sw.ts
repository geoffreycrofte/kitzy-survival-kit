/// <reference lib="webworker" />
/**
 * Service worker de Kitzy.
 * - Hors-ligne : tout est précaché (Workbox).
 * - Rappels : vérification quotidienne en arrière-plan (Periodic Background Sync,
 *   Chrome et Edge, app installée). Aucune donnée ne quitte l'appareil.
 * - Web Push : prêt pour le service du VPS ; le message reçu est toujours générique.
 */
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import {
  digest,
  dueOn,
  isLocale,
  messagesFor,
  shouldNotify,
  todayLocal,
  type Locale,
} from '@kitzy/core';
import {
  getMeta,
  getNotifySettings,
  loadAll,
  remindersFor,
  setMeta,
  updateNotifySettings,
} from '../data/load';
import {
  applicationServerKey,
  forgetEndpoint,
  sendSchedule,
  webPushConfigured,
} from '../lib/webpush';
import { PERIODIC_TAG } from './types';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string; revision: string | null } | string>;
};

interface PeriodicSyncEvent extends ExtendableEvent {
  readonly tag: string;
}

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));

// Mise à jour : c'est la personne qui décide (bouton « Recharger »).
self.addEventListener('message', (event) => {
  if ((event.data as { type?: string } | null)?.type === 'SKIP_WAITING') void self.skipWaiting();
});

const ICON = 'icons/icon-192.png';
/**
 * Barre d'état Android : seule la transparence compte, d'où une silhouette blanche de profil
 * (source : assets/notification-badge.svg).
 */
const BADGE = 'icons/badge-96.png';

/** Jamais la nuit : la vérification suivante prendra le relais le matin. */
const QUIET_BEFORE = 8;
const QUIET_FROM = 21;

async function checkReminders(): Promise<void> {
  const settings = await getNotifySettings();
  if (!settings.enabled || Notification.permission !== 'granted') return;
  const hour = new Date().getHours();
  if (hour < QUIET_BEFORE || hour >= QUIET_FROM) return;
  const today = todayLocal();
  if (!shouldNotify(settings.lastNotified, today)) return;
  const data = await loadAll();
  if (!data.household) return;
  const locale = await storedLocale();
  const message = digest(
    dueOn(remindersFor(data, today, locale), today),
    today,
    messagesFor(locale).system.notify,
  );
  // On note la vérification même sans rappel : une seule par jour.
  await updateNotifySettings({ lastNotified: today });
  if (!message) return;
  await self.registration.showNotification(message.title, {
    body: message.body,
    tag: message.tag,
    icon: ICON,
    badge: BADGE,
    lang: locale,
    data: { url: './' },
  });
}

self.addEventListener('periodicsync', (event) => {
  const sync = event as PeriodicSyncEvent;
  if (sync.tag !== PERIODIC_TAG) return;
  // Une erreur ici serait silencieuse : on la consigne pour le débogage.
  sync.waitUntil(
    checkReminders().catch((error: unknown) => console.error('Kitzy, rappels :', error)),
  );
});

/** La langue choisie dans l'app (copiée dans la base locale), sinon le français. */
async function storedLocale(): Promise<Locale> {
  const stored = await getMeta<string>('locale', 'fr');
  return isLocale(stored) ? stored : 'fr';
}

self.addEventListener('push', (event) => {
  // Le serveur ne connaît pas le contenu du kit : il réveille seulement Kitzy, qui calcule le
  // détail ici. Une notification s'affiche toujours, même si la base ne s'ouvre pas : les
  // navigateurs coupent l'abonnement d'une app qui reçoit des push sans rien montrer.
  event.waitUntil(
    (async () => {
      let locale: Locale = 'fr';
      let message: { title: string; body: string } | null = null;
      let tag = 'kitzy-rappels';
      try {
        locale = await storedLocale();
        // Essai demandé depuis les réglages il y a moins de deux minutes.
        const test = await getMeta<number>('pushTest', 0);
        if (Date.now() - test < 2 * 60 * 1000) {
          await setMeta('pushTest', 0);
          message = { title: 'Kitzy', body: messagesFor(locale).notify.testBody };
          tag = 'kitzy-essai';
        }
        const today = todayLocal();
        const data = await loadAll();
        if (!message && data.household) {
          message = digest(
            dueOn(remindersFor(data, today, locale), today),
            today,
            messagesFor(locale).system.notify,
          );
        }
      } catch (error) {
        console.error('Kitzy, push :', error);
      }
      const notify = messagesFor(locale).system.notify;
      await self.registration.showNotification(message?.title ?? 'Kitzy', {
        body: message?.body ?? notify.pushFallback,
        tag,
        icon: ICON,
        badge: BADGE,
        lang: locale,
        data: { url: './' },
      });
    })(),
  );
});

// Le navigateur a renouvelé l'abonnement (expiration, changement de clés côté service push) :
// on prévient le service, sinon les rappels s'arrêteraient sans que personne ne le sache.
self.addEventListener('pushsubscriptionchange', (event) => {
  const change = event as PushSubscriptionChangeEvent;
  change.waitUntil(
    (async () => {
      if (!webPushConfigured || !(await getNotifySettings()).push) return;
      if (change.oldSubscription) await forgetEndpoint(change.oldSubscription.endpoint);
      const subscription =
        change.newSubscription ??
        (await self.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey(),
        }));
      const today = todayLocal();
      const data = await loadAll();
      const reminders = data.household ? remindersFor(data, today, await storedLocale()) : [];
      await sendSchedule(subscription, reminders);
    })().catch((error: unknown) => console.error('Kitzy, abonnement push :', error)),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(
    (event.notification.data as { url?: string } | null)?.url ?? './',
    self.registration.scope,
  ).href;
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const open = windows.find((w) => w.url.startsWith(self.registration.scope));
      if (open) {
        await open.focus();
        return;
      }
      await self.clients.openWindow(target);
    })(),
  );
});
