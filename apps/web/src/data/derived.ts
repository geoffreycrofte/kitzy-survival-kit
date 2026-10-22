import { useMemo } from 'react';
import {
  CATALOG,
  dashboard,
  foodToRotate,
  kitRows,
  essentialsProgress,
  essentialsState,
  nextAction,
  todayLocal,
  type Context,
  type Dashboard,
  type KitRow,
  type EssentialProgress,
  type EssentialsState,
  type Kit,
  type NextAction,
  type Reminder,
} from '@kitzy/core';
import { COUNTRY, remindersFor } from './load';
import { useAppData, type AppData } from './store';

export interface Kitzy extends AppData {
  ctx: Context;
  homeKit?: Kit;
  progress: EssentialProgress[];
  essentials: EssentialsState;
  next: NextAction | null;
  reminders: Reminder[];
  today: string;
  dashboard: Dashboard;
  /** Modèles du catalogue présents en quantité dans au moins un kit. */
  owned: Set<string>;
  /** Aliments qui approchent de leur date, tous kits confondus. */
  rotate: KitRow[];
}

export { COUNTRY };

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
    const rows = data.kits.flatMap((kit) => kitRows(kit, ctx));
    const owned = new Set(
      rows.filter((r) => r.template && r.status.quantity > 0).map((r) => r.template!.id),
    );
    return {
      ...data,
      ctx,
      homeKit,
      progress,
      essentials: essentialsState(progress),
      next: nextAction(progress),
      reminders: remindersFor(data, today),
      today,
      dashboard: dashboard(data.kits, ctx, data.plan, data.tasks),
      owned,
      rotate: foodToRotate(rows, today),
    };
  }, [data, today]);
}
