/**
 * Adaptateur Web Push (§ 6.4 du plan), désactivé tant que le service du VPS
 * n'est pas configuré (`VITE_KITZY_PUSH_URL` et `VITE_KITZY_VAPID_KEY` au build).
 *
 * Le service ne reçoit que l'abonnement push et des dates avec des identifiants
 * opaques : jamais le nom d'un article ni le contenu du kit.
 *
 * API attendue :
 *   POST   {url}/subscribe  { subscription, schedule: [{ id, date }], timezone }
 *   DELETE {url}/subscribe  { endpoint }
 */
import { pushSchedule, todayLocal, type Reminder } from '@kitzy/core';
import { getMeta, getNotifySettings, setMeta, updateNotifySettings } from '../data/load';

const PUSH_URL = (import.meta.env.VITE_KITZY_PUSH_URL as string | undefined) ?? '';
const VAPID_KEY = (import.meta.env.VITE_KITZY_VAPID_KEY as string | undefined) ?? '';

export const webPushConfigured = Boolean(PUSH_URL && VAPID_KEY);

function urlBase64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const padded = (base64 + '='.repeat((4 - (base64.length % 4)) % 4))
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const raw = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

async function salt(): Promise<string> {
  const existing = await getMeta<string | null>('pushSalt', null);
  if (existing) return existing;
  const fresh = crypto.randomUUID();
  await setMeta('pushSalt', fresh);
  return fresh;
}

/** La clé publique du service, telle que `pushManager.subscribe()` l'attend. */
export function applicationServerKey(): Uint8Array<ArrayBuffer> {
  return urlBase64ToBytes(VAPID_KEY);
}

/**
 * Envoie au service l'abonnement et le calendrier (dates seulement). Utilisé par l'app et par
 * le service worker quand le navigateur renouvelle l'abonnement.
 */
export async function sendSchedule(
  subscription: PushSubscription,
  reminders: readonly Reminder[],
): Promise<boolean> {
  const response = await fetch(`${PUSH_URL}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subscription,
      schedule: pushSchedule(reminders, todayLocal(), await salt()),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  });
  return response.ok;
}

/** Oublie une ancienne adresse d'abonnement côté service. */
export async function forgetEndpoint(endpoint: string): Promise<void> {
  await fetch(`${PUSH_URL}/subscribe`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint }),
  }).catch(() => undefined);
}

/** Abonne cet appareil et envoie le calendrier des rappels (dates seulement). */
export async function subscribePush(reminders: readonly Reminder[]): Promise<boolean> {
  if (!webPushConfigured || !('PushManager' in globalThis)) return false;
  const reg = await navigator.serviceWorker.ready;
  const subscription =
    (await reg.pushManager.getSubscription()) ??
    (await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey(),
    }));
  const ok = await sendSchedule(subscription, reminders);
  if (ok) await updateNotifySettings({ push: true });
  return ok;
}

export async function unsubscribePush(): Promise<void> {
  await updateNotifySettings({ push: false });
  if (!webPushConfigured || !('serviceWorker' in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  const subscription = await reg.pushManager.getSubscription();
  if (!subscription) return;
  await forgetEndpoint(subscription.endpoint);
  await subscription.unsubscribe();
}

/** Garde le calendrier du service à jour quand les rappels changent. */
export async function syncPush(reminders: readonly Reminder[]): Promise<void> {
  if (!webPushConfigured) return;
  const settings = await getNotifySettings();
  if (settings.push) await subscribePush(reminders).catch(() => false);
}
