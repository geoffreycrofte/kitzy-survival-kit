import { useMemo } from 'react';
import {
  CATALOG,
  LU,
  buildReminders,
  essentialsProgress,
  essentialsState,
  nextAction,
  todayLocal,
  type Context,
  type EssentialProgress,
  type EssentialsState,
  type Kit,
  type NextAction,
  type Reminder,
} from '@kitzy/core';
import { useAppData, type AppData } from './store';

export interface Kitzy extends AppData {
  ctx: Context;
  homeKit?: Kit;
  progress: EssentialProgress[];
  essentials: EssentialsState;
  next: NextAction | null;
  reminders: Reminder[];
  today: string;
}

export const COUNTRY = LU;

/** Données et calculs dérivés. `undefined` pendant le premier chargement. */
export function useKitzy(): Kitzy | undefined {
  const data = useAppData();
  const today = todayLocal();
  return useMemo(() => {
    if (!data) return undefined;
    const household = data.household ?? { members: [], durationDays: 3 };
    const ctx: Context = {
      catalog: CATALOG,
      household,
      items: data.items,
      level: data.level,
      today,
    };
    const homeKit = data.kits.find((k) => k.type === 'home');
    const progress = essentialsProgress(homeKit, ctx);
    return {
      ...data,
      ctx,
      homeKit,
      progress,
      essentials: essentialsState(progress),
      next: nextAction(progress),
      reminders: buildReminders({
        catalog: CATALOG,
        kits: data.kits,
        items: data.items,
        country: COUNTRY,
        today,
      }),
      today,
    };
  }, [data, today]);
}
