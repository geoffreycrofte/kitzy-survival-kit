/**
 * Clé d'accès de l'appareil (WebAuthn) : empreinte, visage ou code de l'appareil.
 * Aucun serveur : on n'authentifie personne, on demande seulement à l'authentificateur
 * un secret (extension PRF) qu'il ne donne qu'après vérification de la personne.
 */
import { fromBase64Url, randomBytes, toBase64Url } from '@kitzy/core';

interface PrfOutputs {
  enabled?: boolean;
  results?: { first?: BufferSource };
}

const toBytes = (value: BufferSource): Uint8Array =>
  value instanceof ArrayBuffer
    ? new Uint8Array(value)
    : new Uint8Array(value.buffer, value.byteOffset, value.byteLength);

/** Copie dans un ArrayBuffer neuf, comme l'attendent les types de WebAuthn. */
const buffer = (bytes: Uint8Array): ArrayBuffer => new Uint8Array(bytes).buffer;

function prfOf(credential: Credential | null): PrfOutputs | undefined {
  const extensions = (credential as PublicKeyCredential | null)?.getClientExtensionResults() as
    { prf?: PrfOutputs } | undefined;
  return extensions?.prf;
}

/** L'appareil sait-il fournir ce secret ? (sinon, seul le code Kitzy est proposé) */
export async function passkeySupported(): Promise<boolean> {
  if (!window.PublicKeyCredential || !window.isSecureContext) return false;
  const withCapabilities = PublicKeyCredential as typeof PublicKeyCredential & {
    getClientCapabilities?: () => Promise<Record<string, boolean>>;
  };
  const capabilities = await withCapabilities.getClientCapabilities?.().catch(() => undefined);
  if (capabilities && 'extension:prf' in capabilities) {
    return Boolean(capabilities['extension:prf']);
  }
  // Navigateur plus ancien : on essaiera, et on saura à la création.
  return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().catch(() => false);
}

/** Le secret PRF d'une clé d'accès existante, après vérification de la personne. */
export async function passkeySecret(
  credentialId: string,
  prfSalt: string,
): Promise<Uint8Array | null> {
  const credential = await navigator.credentials.get({
    publicKey: {
      challenge: buffer(randomBytes(32)),
      rpId: location.hostname,
      allowCredentials: [{ type: 'public-key', id: buffer(fromBase64Url(credentialId)) }],
      userVerification: 'required',
      timeout: 60_000,
      extensions: { prf: { eval: { first: buffer(fromBase64Url(prfSalt)) } } } as never,
    },
  });
  const first = prfOf(credential)?.results?.first;
  return first ? toBytes(first) : null;
}

/**
 * Crée une clé d'accès « Kitzy » sur cet appareil et renvoie son secret.
 * `null` si l'authentificateur ne sait pas fournir de secret (PRF absent).
 */
export async function createPasskey(
  name: string,
): Promise<{ credentialId: string; prfSalt: string; secret: Uint8Array } | null> {
  const salt = randomBytes(32);
  const credential = (await navigator.credentials.create({
    publicKey: {
      challenge: buffer(randomBytes(32)),
      rp: { name: 'Kitzy', id: location.hostname },
      user: { id: buffer(randomBytes(16)), name, displayName: name },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        residentKey: 'preferred',
        userVerification: 'required',
      },
      timeout: 60_000,
      extensions: { prf: { eval: { first: buffer(salt) } } } as never,
    },
  })) as PublicKeyCredential | null;
  if (!credential) return null;
  const credentialId = toBase64Url(new Uint8Array(credential.rawId));
  const prfSalt = toBase64Url(salt);
  const prf = prfOf(credential);
  // Certains navigateurs donnent le secret dès la création, d'autres seulement à l'usage.
  if (prf?.results?.first) return { credentialId, prfSalt, secret: toBytes(prf.results.first) };
  if (prf?.enabled === false) return null;
  const secret = await passkeySecret(credentialId, prfSalt);
  return secret ? { credentialId, prfSalt, secret } : null;
}
