/**
 * La clé du plan déverrouillé, gardée en mémoire seulement : elle disparaît quand l'app
 * se ferme, et après quelques minutes en arrière-plan.
 */
import { useSyncExternalStore } from 'react';

const AUTO_LOCK_MS = 5 * 60 * 1000;

let key: Uint8Array | null = null;
let timer = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function getPlanKey(): Uint8Array | null {
  return key;
}

export function setPlanKey(value: Uint8Array): void {
  key = value;
  emit();
}

export function lockPlan(): void {
  if (!key) return;
  key.fill(0);
  key = null;
  emit();
}

export function usePlanKey(): Uint8Array | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => key,
  );
}

document.addEventListener('visibilitychange', () => {
  clearTimeout(timer);
  if (document.visibilityState === 'hidden') timer = window.setTimeout(lockPlan, AUTO_LOCK_MS);
});
