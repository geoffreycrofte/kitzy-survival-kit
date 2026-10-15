/**
 * Installation de la PWA : bouton quand le navigateur le permet,
 * et détection d'une installation existante (Chrome Android).
 */
import { useSyncExternalStore } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface RelatedApp {
  platform: string;
  url?: string;
}

export type InstallState =
  /** Kitzy est ouverte depuis l'app installée. */
  | 'running'
  /** Le navigateur sait que Kitzy est installée sur l'appareil. */
  | 'installed'
  /** Le navigateur propose l'installation : bouton disponible. */
  | 'available'
  /** iPhone, iPad : passer par le menu Partager de Safari. */
  | 'ios'
  /** Ailleurs : passer par le menu du navigateur. */
  | 'manual';

let deferred: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/** À appeler au démarrage : l'événement d'installation arrive très tôt. */
export function initInstall(): void {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferred = event as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    installed = true;
    notify();
  });
  const nav = navigator as Navigator & { getInstalledRelatedApps?: () => Promise<RelatedApp[]> };
  void nav
    .getInstalledRelatedApps?.()
    .then((apps) => {
      if (apps.some((app) => app.platform === 'webapp')) {
        installed = true;
        notify();
      }
    })
    .catch(() => undefined);
}

function snapshot(): InstallState {
  if (isStandalone()) return 'running';
  if (installed) return 'installed';
  if (deferred) return 'available';
  return isIos() ? 'ios' : 'manual';
}

export function useInstallState(): InstallState {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    snapshot,
    () => 'manual',
  );
}

/** Ouvre la fenêtre d'installation du navigateur. Vrai si la personne accepte. */
export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  const event = deferred;
  deferred = null;
  await event.prompt();
  const { outcome } = await event.userChoice;
  notify();
  return outcome === 'accepted';
}
