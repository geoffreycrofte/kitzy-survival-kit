import assert from 'node:assert/strict';
import { test } from 'node:test';
import { openStore } from '../src/db.ts';
import { RETENTION_DAYS, purge, runTick } from '../src/scheduler.ts';
import type { SendResult } from '../src/send.ts';

const A = 'https://fcm.googleapis.com/fcm/send/a';
const B = 'https://web.push.apple.com/b';
const C = 'https://updates.push.services.mozilla.com/wpush/v2/c';

function recorder(results: Record<string, SendResult> = {}) {
  const calls: string[] = [];
  return {
    calls,
    send: async (endpoint: string) => {
      calls.push(endpoint);
      return results[endpoint] ?? 'sent';
    },
  };
}

test('envoie le jour J, à partir de 9 h dans le fuseau de l’appareil, une seule fois', async () => {
  const store = openStore(':memory:');
  store.upsert(A, 'Europe/Luxembourg', ['2026-10-28', '2026-11-05'], 0);
  store.upsert(B, 'America/New_York', ['2026-10-28'], 0);
  const { calls, send } = recorder();

  // 7 h 30 UTC : 8 h 30 à Luxembourg, trop tôt.
  let report = await runTick(store, send, {
    now: new Date(Date.UTC(2026, 9, 28, 7, 30)),
    sendHour: 9,
  });
  assert.equal(report.sent, 0);
  // 8 h 15 UTC : 9 h 15 à Luxembourg, mais 4 h 15 à New York.
  report = await runTick(store, send, { now: new Date(Date.UTC(2026, 9, 28, 8, 15)), sendHour: 9 });
  assert.deepEqual(calls, [A]);
  // Le tour suivant n'envoie plus rien à A.
  await runTick(store, send, { now: new Date(Date.UTC(2026, 9, 28, 8, 30)), sendHour: 9 });
  assert.deepEqual(calls, [A]);
  // 13 h 30 UTC : 9 h 30 à New York.
  await runTick(store, send, { now: new Date(Date.UTC(2026, 9, 28, 13, 30)), sendHour: 9 });
  assert.deepEqual(calls, [A, B]);
  // L'alerte du 5 novembre reste en attente.
  assert.equal(store.dueUpTo('2026-12-31').length, 1);
  store.close();
});

test('abonnement disparu oublié, panne passagère réessayée, alerte manquée abandonnée', async () => {
  const store = openStore(':memory:');
  store.upsert(A, 'UTC', ['2026-10-28'], 0);
  store.upsert(B, 'UTC', ['2026-10-28'], 0);
  store.upsert(C, 'UTC', ['2026-10-27'], 0);
  const { send } = recorder({ [A]: 'gone', [B]: 'retry' });
  const report = await runTick(store, send, {
    now: new Date(Date.UTC(2026, 9, 28, 10)),
    sendHour: 9,
  });
  assert.deepEqual(report, { sent: 0, gone: 1, retry: 1, failed: 0, skipped: 1 });
  assert.equal(store.has(A), false);
  assert.deepEqual(store.dueUpTo('2026-12-31'), [
    { endpoint: B, timezone: 'UTC', date: '2026-10-28' },
  ]);
  store.close();
});

test('une mise à jour remplace le calendrier de l’appareil', () => {
  const store = openStore(':memory:');
  store.upsert(A, 'UTC', ['2026-11-01', '2026-11-02'], 1);
  store.upsert(A, 'Europe/Luxembourg', ['2026-12-01'], 2);
  assert.deepEqual(store.dueUpTo('2027-01-01'), [
    { endpoint: A, timezone: 'Europe/Luxembourg', date: '2026-12-01' },
  ]);
  assert.equal(store.count(), 1);
  store.close();
});

test('ménage : six mois sans nouvelles et rien à venir', () => {
  const store = openStore(':memory:');
  const now = new Date(Date.UTC(2026, 9, 28));
  const old = now.getTime() - (RETENTION_DAYS + 1) * 86_400_000;
  store.upsert(A, 'UTC', [], old);
  store.upsert(B, 'UTC', ['2027-03-01'], old);
  store.upsert(C, 'UTC', [], now.getTime());
  assert.equal(purge(store, now), 1);
  assert.deepEqual(store.all().sort(), [C, B].sort());
  store.close();
});
