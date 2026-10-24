/**
 * Partage sans serveur (§ 3.9 du plan) : les données voyagent dans le fragment
 * de l'URL (après `#`), jamais envoyé au serveur.
 */
import { Inflate, deflateSync, strFromU8, strToU8 } from 'fflate';
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

/**
 * Une liste pleine (300 articles) tient bien en dessous de ces limites.
 * Elles empêchent un lien piégé de saturer la mémoire du téléphone à la décompression.
 */
const MAX_FRAGMENT = 64 * 1024;
const MAX_JSON_BYTES = 256 * 1024;

/** Décompresse en s'arrêtant dès que le résultat dépasse `limit` octets. */
function inflateBounded(data: Uint8Array, limit: number): Uint8Array {
  const chunks: Uint8Array[] = [];
  let size = 0;
  const stream = new Inflate((chunk) => {
    size += chunk.length;
    if (size > limit) throw new Error('Contenu trop grand');
    chunks.push(chunk);
  });
  stream.push(data, true);
  const out = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

export function encodeShare(payload: SharedShopping): string {
  const json = JSON.stringify(SharedShoppingSchema.parse(payload));
  return PREFIX + toBase64Url(deflateSync(strToU8(json), { level: 9 }));
}

export type DecodeResult =
  | { ok: true; data: SharedShopping }
  | { ok: false; code: 'notKitzy' | 'incomplete' | 'damaged'; error: string };

export function decodeShare(fragment: string): DecodeResult {
  const value = fragment.replace(/^#/, '');
  if (!value.startsWith(PREFIX)) {
    return { ok: false, code: 'notKitzy', error: 'Ce lien de partage n’est pas un lien Kitzy.' };
  }
  if (value.length > MAX_FRAGMENT) {
    return { ok: false, code: 'damaged', error: 'Ce lien de partage est trop long.' };
  }
  try {
    const json = strFromU8(
      inflateBounded(fromBase64Url(value.slice(PREFIX.length)), MAX_JSON_BYTES),
    );
    const parsed = SharedShoppingSchema.safeParse(JSON.parse(json));
    if (!parsed.success)
      return { ok: false, code: 'incomplete', error: 'Le contenu de ce lien est incomplet.' };
    return { ok: true, data: parsed.data };
  } catch {
    return {
      ok: false,
      code: 'damaged',
      error: 'Ce lien de partage est abîmé : il a peut-être été coupé en route.',
    };
  }
}
