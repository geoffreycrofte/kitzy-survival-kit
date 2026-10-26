import { kitRows, type Kit, type KitRow } from '@kitzy/core';
import { useKitzy, type Kitzy } from './derived';

/**
 * Un article d'un kit, par sa clé : modèle du catalogue, ou `article-<id>` pour un ajout libre.
 * Toutes les lignes du catalogue sont prises en compte (niveau « complet »), pour qu'un lien
 * vers un article mène toujours quelque part.
 */
export function findKitRow(data: Kitzy, kitId: string, key: string): KitRow | undefined {
  const kit = data.kits.find((k) => k.id === kitId);
  if (!kit) return undefined;
  const rows = kitRows(kit, data.ctx, 'complete');
  const row = rows.find((r) => r.key === key);
  if (row || !key.startsWith('article-')) return row;
  const itemId = key.slice('article-'.length);
  return rows.find((r) => r.item?.id === itemId);
}

export function useKitRow(
  kitId: string | undefined,
  key: string | undefined,
): { data: Kitzy | undefined; kit?: Kit; row?: KitRow } {
  const data = useKitzy();
  if (!data || !kitId || !key) return { data };
  return {
    data,
    kit: data.kits.find((k) => k.id === kitId),
    row: findKitRow(data, kitId, key),
  };
}
