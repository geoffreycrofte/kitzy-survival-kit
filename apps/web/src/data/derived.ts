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
import { messagesFor, type Locale } from '@kitzy/core';
import { useLocale } from '../lib/locale';
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

/**
 * Les noms par défaut des kits (« Réserve maison », « Sac 2 ») sont enregistrés en français :
 * on les affiche dans la langue choisie. Un nom changé à la main reste tel quel.
 */
export function displayKits(kits: readonly Kit[], locale: Locale): Kit[] {
  if (locale === 'fr') return [...kits];
  const names = messagesFor(locale).system.kits;
  return kits.map((kit) => {
    if (kit.type === 'home' && kit.name === 'Réserve maison') return { ...kit, name: names.home };
    const bag = /^Sac (\d+)$/.exec(kit.name);
    if (kit.type === 'go-bag' && bag) return { ...kit, name: names.bag.replace('{{n}}', bag[1]!) };
    return kit;
  });
}

/** Données et calculs dérivés. `undefined` pendant le premier chargement. */
export function useKitzy(): Kitzy | undefined {
  const raw = useAppData();
  const { locale } = useLocale();
  const today = todayLocal();
  return useMemo(() => {
    if (!raw) return undefined;
    const data = { ...raw, kits: displayKits(raw.kits, locale) };
    const household = data.household ?? { members: [], durationDays: 3 };
    const ctx: Context = {
      catalog: CATALOG,
      household,
      items: data.items,
      level: data.level,
      today,
      locale,
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
      reminders: remindersFor(data, today, locale),
      today,
      dashboard: dashboard(data.kits, ctx, data.plan, data.tasks),
      owned,
      rotate: foodToRotate(rows, today),
    };
  }, [raw, today, locale]);
}
