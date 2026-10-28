/**
 * L'API HTTP : trois routes, rien d'autre.
 *   GET    /health     le service tourne
 *   POST   /subscribe  abonner cet appareil ou mettre à jour ses dates
 *   DELETE /subscribe  désabonner
 *   POST   /test       envoyer tout de suite un push d'essai à cet appareil, et à lui seul
 *
 * Seules les pages de Kitzy (CORS, en-tête Origin) peuvent écrire. Les corps sont petits et
 * validés, le débit est limité par adresse, et aucune adresse IP n'est enregistrée.
 */
import type { IncomingMessage, RequestListener, ServerResponse } from 'node:http';
import type { Config } from './config.ts';
import type { Store } from './db.ts';
import type { Sender } from './send.ts';
import { parseSubscribe, parseUnsubscribe } from './validate.ts';

/** Un calendrier de 500 dates tient en moins de 20 Ko. */
const MAX_BODY = 32 * 1024;
/** Par adresse : de quoi ouvrir l'app souvent, pas de quoi remplir la base. */
const RATE_LIMIT = 30;
const RATE_WINDOW = 10 * 60 * 1000;
/** Un essai par appareil et par minute. */
const TEST_COOLDOWN = 60 * 1000;

class HttpError extends Error {
  status: number;
  constructor(status: number) {
    super(String(status));
    this.status = status;
  }
}

function readJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const type = req.headers['content-type'] ?? '';
    if (!type.startsWith('application/json')) return reject(new HttpError(415));
    const declared = Number(req.headers['content-length'] ?? 0);
    if (declared > MAX_BODY) return reject(new HttpError(413));
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new HttpError(413));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(new HttpError(400));
      }
    });
    req.on('error', reject);
  });
}

function reply(res: ServerResponse, status: number, body?: unknown) {
  res.statusCode = status;
  if (body === undefined) return res.end();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

export function createApp(
  store: Store,
  config: Pick<Config, 'allowedOrigins' | 'trustProxy' | 'maxSubscriptions'>,
  send: Sender | null = null,
  now: () => number = Date.now,
): RequestListener {
  const hits = new Map<string, { count: number; reset: number }>();
  const tested = new Map<string, number>();

  const limited = (req: IncomingMessage): boolean => {
    const forwarded = config.trustProxy ? req.headers['x-real-ip'] : undefined;
    const ip = (typeof forwarded === 'string' && forwarded) || req.socket.remoteAddress || '?';
    const t = now();
    if (hits.size > 10_000) {
      for (const [key, value] of hits) if (value.reset <= t) hits.delete(key);
    }
    const entry = hits.get(ip);
    if (!entry || entry.reset <= t) {
      hits.set(ip, { count: 1, reset: t + RATE_WINDOW });
      return false;
    }
    entry.count++;
    return entry.count > RATE_LIMIT;
  };

  return (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    const path = (req.url ?? '/').split('?')[0];

    if (path === '/health' && req.method === 'GET') return reply(res, 200, { ok: true });
    if (path !== '/subscribe' && path !== '/test') return reply(res, 404);

    // Seules les pages de Kitzy écrivent : un navigateur envoie toujours Origin en CORS.
    const origin = req.headers.origin;
    if (!origin || !config.allowedOrigins.includes(origin)) return reply(res, 403);
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', path === '/test' ? 'POST' : 'POST, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Max-Age', '86400');
      return reply(res, 204);
    }
    if (req.method !== 'POST' && (req.method !== 'DELETE' || path === '/test')) {
      res.setHeader('Allow', path === '/test' ? 'POST, OPTIONS' : 'POST, DELETE, OPTIONS');
      return reply(res, 405);
    }
    if (limited(req)) {
      res.setHeader('Retry-After', String(RATE_WINDOW / 1000));
      return reply(res, 429);
    }

    readJson(req)
      .then(async (body) => {
        if (path === '/test') {
          // L'adresse d'abonnement n'est connue que du navigateur qui l'a créée :
          // seul cet appareil peut demander un essai pour lui-même.
          const endpoint = parseUnsubscribe(body);
          if (!endpoint || !send) return reply(res, 400);
          if (!store.has(endpoint)) return reply(res, 404);
          const last = tested.get(endpoint) ?? 0;
          if (now() - last < TEST_COOLDOWN) return reply(res, 429);
          tested.set(endpoint, now());
          if (tested.size > 10_000) {
            for (const [key, at] of tested) if (now() - at >= TEST_COOLDOWN) tested.delete(key);
          }
          const result = await send(endpoint);
          if (result === 'gone') store.remove(endpoint);
          return reply(res, result === 'sent' ? 204 : result === 'gone' ? 410 : 502);
        }
        if (req.method === 'DELETE') {
          const endpoint = parseUnsubscribe(body);
          if (!endpoint) return reply(res, 400);
          store.remove(endpoint);
          return reply(res, 204);
        }
        const request = parseSubscribe(body);
        if (!request) return reply(res, 400);
        if (!store.has(request.endpoint) && store.count() >= config.maxSubscriptions) {
          return reply(res, 503);
        }
        store.upsert(request.endpoint, request.timezone, request.dates, now());
        return reply(res, 204);
      })
      .catch((error: unknown) => {
        if (res.headersSent) return;
        if (error instanceof HttpError) return reply(res, error.status);
        console.error('Erreur interne :', error instanceof Error ? error.message : error);
        reply(res, 500);
      });
  };
}
