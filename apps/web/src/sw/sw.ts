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
import { digest, dueOn, shouldNotify, todayLocal } from '@kitzy/core';
import { getNotifySettings, loadAll, remindersFor, updateNotifySettings } from '../data/load';
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
const BADGE = 'icons/favicon-64.png';

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
  const message = digest(dueOn(remindersFor(data, today), today), today);
  // On note la vérification même sans rappel : une seule par jour.
  await updateNotifySettings({ lastNotified: today });
  if (!message) return;
  await self.registration.showNotification(message.title, {
    body: message.body,
    tag: message.tag,
    icon: ICON,
    badge: BADGE,
    lang: 'fr',
    data: { url: './' },
  });
}

self.addEventListener('periodicsync', (event) => {
  const sync = event as PeriodicSyncEvent;
  if (sync.tag === PERIODIC_TAG) sync.waitUntil(checkReminders());
});

self.addEventListener('push', (event) => {
  // Le serveur ne connaît pas le contenu du kit : il réveille seulement Kitzy.
  event.waitUntil(
    (async () => {
      const today = todayLocal();
      const data = await loadAll();
      const message = data.household
        ? digest(dueOn(remindersFor(data, today), today), today)
        : null;
      await self.registration.showNotification(message?.title ?? 'Kitzy', {
        body: message?.body ?? 'Tu as des rappels pour ton kit.',
        tag: 'kitzy-rappels',
        icon: ICON,
        badge: BADGE,
        lang: 'fr',
        data: { url: './' },
      });
    })(),
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
