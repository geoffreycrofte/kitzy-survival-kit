/**
 * État de la base locale : si la lecture échoue ou reste bloquée,
 * l'interface l'explique au lieu d'afficher « Chargement » sans fin.
 */
import { useSyncExternalStore } from 'react';

let lastError: string | null = null;
const listeners = new Set<() => void>();

export function reportDataError(error: unknown): void {
  lastError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  console.error('Kitzy, données locales :', error);
  listeners.forEach((l) => l());
}

export function useDataError(): string | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => lastError,
    () => null,
  );
}
