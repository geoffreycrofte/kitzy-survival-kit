/** Periodic Background Sync n'est pas encore dans les types standard de TypeScript. */

export const PERIODIC_TAG = 'kitzy-rappels';

export interface PeriodicSyncManager {
  register(tag: string, options?: { minInterval: number }): Promise<void>;
  unregister(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}
