import assert from 'node:assert/strict';
import { test } from 'node:test';
import { localClock } from '../src/time.ts';
import { MAX_DATES, isPushEndpoint, parseSubscribe, parseUnsubscribe } from '../src/validate.ts';

const endpoint = 'https://fcm.googleapis.com/fcm/send/abc:def';
const body = (patch: Record<string, unknown> = {}) => ({
  subscription: { endpoint, expirationTime: null, keys: { p256dh: 'x', auth: 'y' } },
  schedule: [
    { id: '0a1b2c3d', date: '2026-11-02' },
    { id: '1a1b2c3d', date: '2026-11-01' },
    { id: '2a1b2c3d', date: '2026-11-01' },
  ],
  timezone: 'Europe/Luxembourg',
  ...patch,
});

test('seuls les services push des navigateurs sont acceptés', () => {
  for (const ok of [
    endpoint,
    'https://updates.push.services.mozilla.com/wpush/v2/abc',
    'https://web.push.apple.com/QK2',
    'https://wns2-par02p.notify.windows.com/w/?token=abc',
  ]) {
    assert.ok(isPushEndpoint(ok), ok);
  }
  for (const bad of [
    'http://fcm.googleapis.com/x',
    'https://fcm.googleapis.com:8443/x',
    'https://evil.example/fcm.googleapis.com',
    'https://fcm.googleapis.com.evil.example/x',
    'https://notpush.apple.com.evil.example/x',
    'https://user:pw@fcm.googleapis.com/x',
    'https://127.0.0.1/x',
    `https://fcm.googleapis.com/${'a'.repeat(1100)}`,
    42,
  ]) {
    assert.equal(isPushEndpoint(bad), false, String(bad).slice(0, 60));
  }
});

test('un abonnement valide garde l’adresse, le fuseau et les dates (triées, sans doublon)', () => {
  assert.deepEqual(parseSubscribe(body()), {
    endpoint,
    timezone: 'Europe/Luxembourg',
    dates: ['2026-11-01', '2026-11-02'],
  });
});

test('le reste est refusé', () => {
  assert.equal(parseSubscribe(null), null);
  assert.equal(parseSubscribe(body({ timezone: 'Mars/Olympus' })), null);
  assert.equal(parseSubscribe(body({ schedule: [{ id: 'nope', date: '2026-11-01' }] })), null);
  assert.equal(parseSubscribe(body({ schedule: [{ id: '0a1b2c3d', date: '2026-02-30' }] })), null);
  assert.equal(parseSubscribe(body({ schedule: 'demain' })), null);
  const many = Array.from({ length: MAX_DATES + 1 }, () => ({
    id: '0a1b2c3d',
    date: '2026-11-01',
  }));
  assert.equal(parseSubscribe(body({ schedule: many })), null);
  assert.equal(parseSubscribe(body({ subscription: { endpoint: 'https://evil.example' } })), null);
});

test('désabonnement', () => {
  assert.equal(parseUnsubscribe({ endpoint }), endpoint);
  assert.equal(parseUnsubscribe({ endpoint: 'https://evil.example' }), null);
});

test('heure locale selon le fuseau, changement d’heure compris', () => {
  // 28 octobre 2026, 7 h 30 UTC : 8 h 30 à Luxembourg (heure d'hiver), 3 h 30 à New York.
  const now = new Date(Date.UTC(2026, 9, 28, 7, 30));
  assert.deepEqual(localClock('Europe/Luxembourg', now), { date: '2026-10-28', hour: 8 });
  assert.deepEqual(localClock('America/New_York', now), { date: '2026-10-28', hour: 3 });
  // En été, Luxembourg est à UTC+2.
  assert.deepEqual(localClock('Europe/Luxembourg', new Date(Date.UTC(2026, 6, 1, 22, 30))), {
    date: '2026-07-02',
    hour: 0,
  });
});
