/**
 * Partage sans serveur (§ 3.9 du plan) : les données voyagent dans le fragment
 * de l'URL (après `#`), jamais envoyé au serveur.
 */
import { deflateSync, inflateSync, strFromU8, strToU8 } from 'fflate';
import { z } from 'zod';
import { fromBase64Url, toBase64Url } from './base64url';

const UNITS = ['L', 'portion', 'piece', 'pack', 'set'] as const;

const SharedShoppingSchema = z.object({
  v: z.literal(1),
  type: z.literal('shopping'),
  items: z
    .array(
      z.object({
        label: z.string().min(1).max(120),
        quantity: z.number().positive().max(10_000).optional(),
        unit: z.enum(UNITS).optional(),
      }),
    )
    .max(300),
});

export type SharedShopping = z.infer<typeof SharedShoppingSchema>;

/** Préfixe de version, pour pouvoir changer le format plus tard. */
const PREFIX = 'k1.';

export function encodeShare(payload: SharedShopping): string {
  const json = JSON.stringify(SharedShoppingSchema.parse(payload));
  return PREFIX + toBase64Url(deflateSync(strToU8(json), { level: 9 }));
}

export type DecodeResult = { ok: true; data: SharedShopping } | { ok: false; error: string };

export function decodeShare(fragment: string): DecodeResult {
  const value = fragment.replace(/^#/, '');
  if (!value.startsWith(PREFIX)) {
    return { ok: false, error: 'Ce lien de partage n’est pas un lien Kitzy.' };
  }
  try {
    const json = strFromU8(inflateSync(fromBase64Url(value.slice(PREFIX.length))));
    const parsed = SharedShoppingSchema.safeParse(JSON.parse(json));
    if (!parsed.success) return { ok: false, error: 'Le contenu de ce lien est incomplet.' };
    return { ok: true, data: parsed.data };
  } catch {
    return {
      ok: false,
      error: 'Ce lien de partage est abîmé : il a peut-être été coupé en route.',
    };
  }
}
