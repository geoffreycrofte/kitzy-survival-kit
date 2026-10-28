import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pushSender } from '../src/send.ts';

const endpoint = 'https://fcm.googleapis.com/fcm/send/abc';

test('un push vide, signé, avec une durée de vie', async () => {
  let seen: { url: string; init: RequestInit } | null = null;
  const fake = (async (url: string, init: RequestInit) => {
    seen = { url, init };
    return new Response(null, { status: 201 });
  }) as unknown as typeof fetch;
  assert.equal(await pushSender(() => 'vapid t=x, k=y', fake)(endpoint), 'sent');
  assert.ok(seen);
  const { url, init } = seen as { url: string; init: RequestInit };
  assert.equal(url, endpoint);
  assert.equal(init.method, 'POST');
  assert.equal(init.body, undefined);
  assert.deepEqual(init.headers, {
    Authorization: 'vapid t=x, k=y',
    TTL: '43200',
    Urgency: 'normal',
  });
});

test('les réponses des services push', async () => {
  const answer = (status: number) =>
    (async () => new Response(null, { status })) as unknown as typeof fetch;
  const result = (status: number) => pushSender(() => 'a', answer(status))(endpoint);
  assert.equal(await result(410), 'gone');
  assert.equal(await result(404), 'gone');
  assert.equal(await result(429), 'retry');
  assert.equal(await result(503), 'retry');
  assert.equal(await result(403), 'failed');
  const broken = (async () => {
    throw new TypeError('réseau');
  }) as unknown as typeof fetch;
  assert.equal(await pushSender(() => 'a', broken)(endpoint), 'retry');
});
