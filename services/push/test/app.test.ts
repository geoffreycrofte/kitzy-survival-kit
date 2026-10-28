import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { after, before, test } from 'node:test';
import { createApp } from '../src/app.ts';
import { openStore } from '../src/db.ts';

const ORIGIN = 'https://kitzy.lu';
const endpoint = 'https://fcm.googleapis.com/fcm/send/abc';
const store = openStore(':memory:');
let server: Server;
let base = '';

before(async () => {
  server = createServer(
    createApp(store, { allowedOrigins: [ORIGIN], trustProxy: true, maxSubscriptions: 2 }),
  );
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
after(() => {
  server.close();
  store.close();
});

const subscribe = (body: unknown, headers: Record<string, string> = {}) =>
  fetch(`${base}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: ORIGIN, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

const valid = (e = endpoint) => ({
  subscription: { endpoint: e, keys: { p256dh: 'x', auth: 'y' } },
  schedule: [{ id: '0a1b2c3d', date: '2026-11-01' }],
  timezone: 'Europe/Luxembourg',
});

test('santé', async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
});

test('préflight CORS pour Kitzy seulement', async () => {
  const ok = await fetch(`${base}/subscribe`, { method: 'OPTIONS', headers: { Origin: ORIGIN } });
  assert.equal(ok.status, 204);
  assert.equal(ok.headers.get('access-control-allow-origin'), ORIGIN);
  const other = await fetch(`${base}/subscribe`, {
    method: 'OPTIONS',
    headers: { Origin: 'https://evil.example' },
  });
  assert.equal(other.status, 403);
});

test('abonner puis désabonner', async () => {
  const res = await subscribe(valid(), { 'X-Real-IP': '10.0.0.1' });
  assert.equal(res.status, 204);
  assert.equal(res.headers.get('access-control-allow-origin'), ORIGIN);
  assert.ok(store.has(endpoint));
  const del = await fetch(`${base}/subscribe`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Origin: ORIGIN, 'X-Real-IP': '10.0.0.1' },
    body: JSON.stringify({ endpoint }),
  });
  assert.equal(del.status, 204);
  assert.equal(store.has(endpoint), false);
});

test('refus : sans Origin, mauvais type, JSON cassé, contenu invalide, trop gros', async () => {
  const ip = { 'X-Real-IP': '10.0.0.2' };
  const noOrigin = await fetch(`${base}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(valid()),
  });
  assert.equal(noOrigin.status, 403);
  assert.equal((await subscribe(valid(), { ...ip, 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await subscribe('{', ip)).status, 400);
  assert.equal((await subscribe({ ...valid(), timezone: 'nope' }, ip)).status, 400);
  assert.equal((await subscribe('x'.repeat(40_000), ip)).status, 413);
  assert.equal((await fetch(`${base}/autre`)).status, 404);
});

test('plafond d’abonnements, mais un appareil déjà connu peut toujours se mettre à jour', async () => {
  const ip = { 'X-Real-IP': '10.0.0.3' };
  assert.equal((await subscribe(valid(`${endpoint}1`), ip)).status, 204);
  assert.equal((await subscribe(valid(`${endpoint}2`), ip)).status, 204);
  assert.equal((await subscribe(valid(`${endpoint}3`), ip)).status, 503);
  assert.equal((await subscribe(valid(`${endpoint}1`), ip)).status, 204);
});

test('débit limité par adresse', async () => {
  const ip = { 'X-Real-IP': '10.0.0.4' };
  const statuses: number[] = [];
  for (let i = 0; i < 31; i++) statuses.push((await subscribe('{', ip)).status);
  assert.equal(statuses.at(-1), 429);
  assert.equal((await subscribe('{', { 'X-Real-IP': '10.0.0.5' })).status, 400);
});
