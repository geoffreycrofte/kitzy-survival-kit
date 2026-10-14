import { useSyncExternalStore } from 'react';

/**
 * Messages de statut (« Ajouté », « Enregistré ») annoncés aux lecteurs d'écran
 * et affichés brièvement (RAWeb 7.5).
 */
let message = '';
let counter = 0;
const listeners = new Set<() => void>();

export function announce(text: string): void {
  counter += 1;
  // Le compteur force l'annonce même si le texte est identique au précédent.
  message = text + '​'.repeat(counter % 2);
  listeners.forEach((l) => l());
}

export function clearAnnouncement(): void {
  message = '';
  listeners.forEach((l) => l());
}

export function useAnnouncement(): string {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => message,
  );
}
