/**
 * Chiffrement (WebCrypto) : sauvegardes protégées par un code, et plan d'urgence verrouillé
 * sur l'appareil. AES-GCM 256 bits ; clés dérivées d'un code (PBKDF2-SHA-256) ou d'un secret
 * fourni par une clé d'accès (extension WebAuthn PRF, via HKDF-SHA-256).
 *
 * Verrou du plan : une clé de données aléatoire chiffre le plan. Elle est elle-même chiffrée
 * une fois par moyen de déverrouillage (le code, et éventuellement la clé d'accès) :
 * changer ou ajouter un moyen ne demande pas de rechiffrer le plan.
 */
import { strFromU8, strToU8 } from 'fflate';
import { z } from 'zod';
import { fromBase64Url, toBase64Url } from './base64url';

/* ---------- WebCrypto, juste ce qu'il faut (le cœur n'a pas les types du navigateur) ---------- */

type Key = object;
type Algorithm = Record<string, unknown> | string;
interface Subtle {
  importKey(
    format: 'raw',
    data: Uint8Array,
    algorithm: Algorithm,
    extractable: boolean,
    usages: string[],
  ): Promise<Key>;
  deriveKey(
    algorithm: Algorithm,
    base: Key,
    derived: Algorithm,
    extractable: boolean,
    usages: string[],
  ): Promise<Key>;
  encrypt(algorithm: Algorithm, key: Key, data: Uint8Array): Promise<ArrayBuffer>;
  decrypt(algorithm: Algorithm, key: Key, data: Uint8Array): Promise<ArrayBuffer>;
}
interface WebCrypto {
  subtle: Subtle;
  getRandomValues<T extends Uint8Array>(array: T): T;
}
const webCrypto = (): WebCrypto => (globalThis as unknown as { crypto: WebCrypto }).crypto;

export function randomBytes(length: number): Uint8Array {
  return webCrypto().getRandomValues(new Uint8Array(length));
}

/* ---------- Clés ---------- */

/** Un code trop court se devine en quelques heures si le fichier est volé : 8 caractères minimum. */
export const CODE_MIN_LENGTH = 8;
/** Recommandation OWASP pour PBKDF2-SHA-256. */
const ITERATIONS = 600_000;
/** Bornes acceptées à la lecture : un fichier piégé ne doit pas bloquer le téléphone des heures. */
const MIN_ITERATIONS = 100_000;
const MAX_ITERATIONS = 2_000_000;

const AES = { name: 'AES-GCM', length: 256 };

async function codeKey(code: string, salt: Uint8Array, iterations: number): Promise<Key> {
  const subtle = webCrypto().subtle;
  const base = await subtle.importKey('raw', strToU8(code.normalize('NFC')), 'PBKDF2', false, [
    'deriveKey',
  ]);
  return subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, base, AES, false, [
    'encrypt',
    'decrypt',
  ]);
}

async function secretKey(secret: Uint8Array, info: string): Promise<Key> {
  const subtle = webCrypto().subtle;
  const base = await subtle.importKey('raw', secret, 'HKDF', false, ['deriveKey']);
  return subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: strToU8(info) },
    base,
    AES,
    false,
    ['encrypt', 'decrypt'],
  );
}

function dataKey(raw: Uint8Array): Promise<Key> {
  return webCrypto().subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

/* ---------- Boîte chiffrée ---------- */

const b64 = z
  .string()
  .max(8_000_000)
  .regex(/^[A-Za-z0-9_-]*$/);

const SealedSchema = z.object({ iv: b64, data: b64 });
export type Sealed = z.infer<typeof SealedSchema>;

async function seal(key: Key, bytes: Uint8Array, context: string): Promise<Sealed> {
  const iv = randomBytes(12);
  const data = await webCrypto().subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: strToU8(context) },
    key,
    bytes,
  );
  return { iv: toBase64Url(iv), data: toBase64Url(new Uint8Array(data)) };
}

/** `null` si la clé est fausse ou le contenu modifié (AES-GCM authentifie tout). */
async function open(key: Key, sealed: Sealed, context: string): Promise<Uint8Array | null> {
  try {
    const data = await webCrypto().subtle.decrypt(
      { name: 'AES-GCM', iv: fromBase64Url(sealed.iv), additionalData: strToU8(context) },
      key,
      fromBase64Url(sealed.data),
    );
    return new Uint8Array(data);
  } catch {
    return null;
  }
}

/* ---------- Sauvegarde protégée par un code ---------- */

const BACKUP_CONTEXT = 'kitzy backup v1';

const ProtectedBackupSchema = z.object({
  app: z.literal('kitzy'),
  protected: z.literal(1),
  kdf: z.object({
    name: z.literal('PBKDF2-SHA-256'),
    iterations: z.number().int().min(MIN_ITERATIONS).max(MAX_ITERATIONS),
    salt: b64.max(64),
  }),
  iv: b64.max(32),
  data: b64,
});

/** Chiffre le texte d'une sauvegarde avec un code : n'importe qui ayant le code peut l'ouvrir. */
export async function protectBackup(text: string, code: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await codeKey(code, salt, ITERATIONS);
  const sealed = await seal(key, strToU8(text), BACKUP_CONTEXT);
  return JSON.stringify({
    app: 'kitzy',
    protected: 1,
    kdf: { name: 'PBKDF2-SHA-256', iterations: ITERATIONS, salt: toBase64Url(salt) },
    ...sealed,
  });
}

/** Le fichier est-il une sauvegarde protégée (il faut alors demander le code) ? */
export function isProtectedBackup(text: string): boolean {
  try {
    return ProtectedBackupSchema.safeParse(JSON.parse(text)).success;
  } catch {
    return false;
  }
}

/** Le texte de la sauvegarde, ou `null` si le code est faux (ou le fichier abîmé). */
export async function unprotectBackup(text: string, code: string): Promise<string | null> {
  let parsed;
  try {
    parsed = ProtectedBackupSchema.safeParse(JSON.parse(text));
  } catch {
    return null;
  }
  if (!parsed.success) return null;
  const { kdf, iv, data } = parsed.data;
  const key = await codeKey(code, fromBase64Url(kdf.salt), kdf.iterations);
  const bytes = await open(key, { iv, data }, BACKUP_CONTEXT);
  return bytes ? strFromU8(bytes) : null;
}

/* ---------- Verrou du plan d'urgence sur l'appareil ---------- */

const PLAN_CONTEXT = 'kitzy plan v1';
const WRAP_CONTEXT = 'kitzy plan key v1';
const PRF_INFO = 'kitzy plan passkey v1';

const PlanLockSchema = z.object({
  v: z.literal(1),
  code: z.object({ salt: b64, iterations: z.number().int(), key: SealedSchema }),
  /** Clé d'accès de l'appareil (empreinte, visage, code de l'appareil). */
  passkey: z.object({ credentialId: b64, prfSalt: b64, key: SealedSchema }).optional(),
});
export type PlanLock = z.infer<typeof PlanLockSchema>;

export function isPlanLock(value: unknown): value is PlanLock {
  return PlanLockSchema.safeParse(value).success;
}

/** Nouveau verrou : une clé de données aléatoire, chiffrée avec le code. */
export async function createPlanLock(code: string): Promise<{ lock: PlanLock; key: Uint8Array }> {
  const key = randomBytes(32);
  const salt = randomBytes(16);
  const wrapped = await seal(await codeKey(code, salt, ITERATIONS), key, WRAP_CONTEXT);
  return {
    lock: { v: 1, code: { salt: toBase64Url(salt), iterations: ITERATIONS, key: wrapped } },
    key,
  };
}

/** Ajoute (ou remplace) la clé d'accès : `secret` est la sortie PRF de l'authentificateur. */
export async function addPasskeyToLock(
  lock: PlanLock,
  key: Uint8Array,
  passkey: { credentialId: string; prfSalt: string; secret: Uint8Array },
): Promise<PlanLock> {
  const wrapped = await seal(await secretKey(passkey.secret, PRF_INFO), key, WRAP_CONTEXT);
  return {
    ...lock,
    passkey: { credentialId: passkey.credentialId, prfSalt: passkey.prfSalt, key: wrapped },
  };
}

export function removePasskeyFromLock(lock: PlanLock): PlanLock {
  return { v: lock.v, code: lock.code };
}

/** La clé de données, ou `null` si le code est faux. */
export async function unlockWithCode(lock: PlanLock, code: string): Promise<Uint8Array | null> {
  const iterations = Math.min(Math.max(lock.code.iterations, MIN_ITERATIONS), MAX_ITERATIONS);
  const wrapping = await codeKey(code, fromBase64Url(lock.code.salt), iterations);
  return open(wrapping, lock.code.key, WRAP_CONTEXT);
}

export async function unlockWithPasskey(
  lock: PlanLock,
  secret: Uint8Array,
): Promise<Uint8Array | null> {
  if (!lock.passkey) return null;
  return open(await secretKey(secret, PRF_INFO), lock.passkey.key, WRAP_CONTEXT);
}

/** Chiffre n'importe quelle donnée JSON (le plan) avec la clé de données. */
export async function sealJson(key: Uint8Array, value: unknown): Promise<Sealed> {
  return seal(await dataKey(key), strToU8(JSON.stringify(value)), PLAN_CONTEXT);
}

export async function openJson(key: Uint8Array, sealed: Sealed): Promise<unknown> {
  const bytes = await open(await dataKey(key), sealed, PLAN_CONTEXT);
  return bytes ? (JSON.parse(strFromU8(bytes)) as unknown) : null;
}
