import assert from 'node:assert/strict';
import { createPublicKey, verify } from 'node:crypto';
import { test } from 'node:test';
import { generateVapidKeys, vapidAuthorizer } from '../src/vapid.ts';

const subject = 'mailto:notifications@kitzy.lu';

test('les clés générées ont le format attendu par les navigateurs', () => {
  const keys = generateVapidKeys();
  const raw = Buffer.from(keys.publicKey, 'base64url');
  assert.equal(raw.length, 65);
  assert.equal(raw[0], 4);
  assert.equal(Buffer.from(keys.privateKey, 'base64url').length, 32);
});

test('le jeton VAPID est signé, vise le service push et contient le contact', () => {
  const keys = generateVapidKeys();
  const now = Date.UTC(2026, 9, 28, 9);
  const authorize = vapidAuthorizer({ ...keys, subject }, () => now);
  const header = authorize('https://fcm.googleapis.com/fcm/send/abc');
  const match = /^vapid t=([^.]+)\.([^.]+)\.([^,]+), k=(.+)$/.exec(header);
  assert.ok(match);
  const [, head, claims, signature, k] = match as unknown as string[];
  assert.equal(k, keys.publicKey);
  assert.deepEqual(JSON.parse(Buffer.from(head!, 'base64url').toString()), {
    typ: 'JWT',
    alg: 'ES256',
  });
  const payload = JSON.parse(Buffer.from(claims!, 'base64url').toString());
  assert.equal(payload.aud, 'https://fcm.googleapis.com');
  assert.equal(payload.sub, subject);
  assert.equal(payload.exp, now / 1000 + 12 * 3600);

  const raw = Buffer.from(keys.publicKey, 'base64url');
  const publicKey = createPublicKey({
    format: 'jwk',
    key: {
      kty: 'EC',
      crv: 'P-256',
      x: raw.subarray(1, 33).toString('base64url'),
      y: raw.subarray(33).toString('base64url'),
    },
  });
  const ok = verify(
    'sha256',
    Buffer.from(`${head}.${claims}`),
    { key: publicKey, dsaEncoding: 'ieee-p1363' },
    Buffer.from(signature!, 'base64url'),
  );
  assert.ok(ok);
});

test('un jeton par service push, réutilisé tant qu’il est frais', () => {
  let now = Date.UTC(2026, 9, 28, 9);
  const authorize = vapidAuthorizer({ ...generateVapidKeys(), subject }, () => now);
  const a = authorize('https://fcm.googleapis.com/fcm/send/1');
  assert.equal(authorize('https://fcm.googleapis.com/fcm/send/2'), a);
  assert.notEqual(authorize('https://web.push.apple.com/xyz'), a);
  now += 11.5 * 3600 * 1000;
  assert.notEqual(authorize('https://fcm.googleapis.com/fcm/send/1'), a);
});

test('une clé abîmée est refusée au démarrage', () => {
  assert.throws(() => vapidAuthorizer({ publicKey: 'abc', privateKey: 'def', subject }));
});
