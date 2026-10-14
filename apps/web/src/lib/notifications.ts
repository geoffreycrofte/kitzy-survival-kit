/**
 * Notifications locales (§ 6.3 du plan) : autorisation, vérification
 * quotidienne en arrière-plan (Periodic Background Sync) et notification d'essai.
 */
import { getNotifySettings, updateNotifySettings } from '../data/load';
import { PERIODIC_TAG, type PeriodicSyncManager } from '../sw/types';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface NotifySupport {
  notifications: boolean;
  periodicSync: boolean;
  installed: boolean;
  ios: boolean;
}

export function notifySupport(): NotifySupport {
  const ios =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return {
    notifications: 'Notification' in window && 'serviceWorker' in navigator,
    periodicSync:
      'serviceWorker' in navigator &&
      typeof ServiceWorkerRegistration !== 'undefined' &&
      'periodicSync' in ServiceWorkerRegistration.prototype,
    installed:
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true,
    ios,
  };
}

/** Résultat de l'activation, pour expliquer ce qui fonctionnera vraiment. */
export type EnableResult = 'background' | 'open-only' | 'denied' | 'unsupported';

async function registration(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  // `ready` ne se résout jamais sans service worker (par exemple en développement).
  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
  ]);
}

function periodicSync(reg: ServiceWorkerRegistration): PeriodicSyncManager | undefined {
  return (reg as ServiceWorkerRegistration & { periodicSync?: PeriodicSyncManager }).periodicSync;
}

async function registerBackground(): Promise<boolean> {
  const reg = await registration();
  const sync = reg && periodicSync(reg);
  if (!sync) return false;
  try {
    // Chrome n'accorde cette permission qu'aux apps installées.
    const status = await navigator.permissions
      .query({ name: 'periodic-background-sync' as PermissionName })
      .catch(() => null);
    if (status && status.state !== 'granted') return false;
    await sync.register(PERIODIC_TAG, { minInterval: DAY_MS / 2 });
    return true;
  } catch {
    return false;
  }
}

export async function enableNotifications(): Promise<EnableResult> {
  if (!notifySupport().notifications) return 'unsupported';
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return 'denied';
  await updateNotifySettings({ enabled: true });
  return (await registerBackground()) ? 'background' : 'open-only';
}

export async function disableNotifications(): Promise<void> {
  await updateNotifySettings({ enabled: false });
  const reg = await registration();
  const sync = reg && periodicSync(reg);
  await sync?.unregister(PERIODIC_TAG).catch(() => undefined);
}

/** État actuel, recalculé à chaque visite des réglages. */
export async function currentNotifyState(): Promise<EnableResult | 'off'> {
  if (!notifySupport().notifications) return 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  const settings = await getNotifySettings();
  if (!settings.enabled || Notification.permission !== 'granted') return 'off';
  const reg = await registration();
  const sync = reg && periodicSync(reg);
  const tags = sync ? await sync.getTags().catch(() => []) : [];
  if (tags.includes(PERIODIC_TAG)) return 'background';
  return (await registerBackground()) ? 'background' : 'open-only';
}

export async function sendTestNotification(body: string): Promise<boolean> {
  const reg = await registration();
  if (!reg || Notification.permission !== 'granted') return false;
  await reg.showNotification('Kitzy', {
    body,
    tag: 'kitzy-essai',
    icon: `${import.meta.env.BASE_URL}icons/icon-192.png`,
    lang: 'fr',
    data: { url: './' },
  });
  return true;
}
