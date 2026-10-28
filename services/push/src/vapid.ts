/**
 * VAPID (RFC 8292) : le service prouve aux services push (Google, Apple, Mozilla, Microsoft)
 * qu'il est bien celui à qui l'appareil s'est abonné. Un jeton ES256 signé avec la clé privée,
 * accompagné de la clé publique que l'app a donnée au navigateur.
 *
 * Le push envoyé est vide : il n'y a rien à chiffrer (RFC 8291), seulement à signer.
 */
import { createPrivateKey, generateKeyPairSync, sign, type KeyObject } from 'node:crypto';

const b64url = (data: Buffer | string) => Buffer.from(data).toString('base64url');

/** Une paire de clés neuve, au format attendu par les navigateurs (clé publique brute, 65 octets). */
export function generateVapidKeys(): { publicKey: string; privateKey: string } {
  const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
  const jwk = privateKey.export({ format: 'jwk' });
  if (!jwk.x || !jwk.y || !jwk.d) throw new Error('Clé EC incomplète');
  const raw = Buffer.concat([
    Buffer.from([4]),
    Buffer.from(jwk.x, 'base64url'),
    Buffer.from(jwk.y, 'base64url'),
  ]);
  return { publicKey: b64url(raw), privateKey: jwk.d };
}

function privateKeyObject(publicKey: string, privateKey: string): KeyObject {
  const raw = Buffer.from(publicKey, 'base64url');
  if (raw.length !== 65 || raw[0] !== 4) throw new Error('VAPID_PUBLIC_KEY invalide');
  if (Buffer.from(privateKey, 'base64url').length !== 32) {
    throw new Error('VAPID_PRIVATE_KEY invalide');
  }
  return createPrivateKey({
    format: 'jwk',
    key: {
      kty: 'EC',
      crv: 'P-256',
      x: b64url(raw.subarray(1, 33)),
      y: b64url(raw.subarray(33, 65)),
      d: privateKey,
    },
  });
}

/** Durée de vie d'un jeton (le maximum autorisé est 24 h). */
const TOKEN_SECONDS = 12 * 60 * 60;

/**
 * Renvoie une fonction qui donne l'en-tête `Authorization` pour une adresse d'abonnement.
 * Un jeton par service push (son origine), réutilisé tant qu'il lui reste au moins une heure.
 */
export function vapidAuthorizer(
  keys: { publicKey: string; privateKey: string; subject: string },
  now: () => number = Date.now,
): (endpoint: string) => string {
  const key = privateKeyObject(keys.publicKey, keys.privateKey);
  const cache = new Map<string, { header: string; expires: number }>();
  return (endpoint) => {
    const audience = new URL(endpoint).origin;
    const seconds = Math.floor(now() / 1000);
    const cached = cache.get(audience);
    if (cached && cached.expires - seconds > 3600) return cached.header;
    const expires = seconds + TOKEN_SECONDS;
    const unsigned = `${b64url(JSON.stringify({ typ: 'JWT', alg: 'ES256' }))}.${b64url(
      JSON.stringify({ aud: audience, exp: expires, sub: keys.subject }),
    )}`;
    const signature = sign('sha256', Buffer.from(unsigned), { key, dsaEncoding: 'ieee-p1363' });
    const header = `vapid t=${unsigned}.${b64url(signature)}, k=${keys.publicKey}`;
    cache.set(audience, { header, expires });
    return header;
  };
}
