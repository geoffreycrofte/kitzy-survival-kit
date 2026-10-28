/**
 * Point d'entrée : l'API (derrière nginx) et le tour d'horloge des envois.
 * Lancé par systemd (voir deploy/kitzy-push.service).
 */
import { createServer } from 'node:http';
import { createApp } from './app.ts';
import { loadConfig } from './config.ts';
import { openStore } from './db.ts';
import { purge, runTick } from './scheduler.ts';
import { pushSender } from './send.ts';
import { vapidAuthorizer } from './vapid.ts';

const TICK_MS = 15 * 60 * 1000;
const PURGE_MS = 24 * 60 * 60 * 1000;

const config = loadConfig();
const store = openStore(config.dbPath);
const send = pushSender(vapidAuthorizer(config.vapid));

let running = false;
let lastPurge = 0;

async function tick() {
  if (running) return;
  running = true;
  try {
    const now = new Date();
    const report = await runTick(store, send, { now, sendHour: config.sendHour });
    if (report.sent || report.gone || report.retry || report.failed) {
      // Des nombres seulement : jamais une adresse d'abonnement dans les journaux.
      console.log(
        `Envois : ${report.sent} faits, ${report.gone} abonnements disparus, ` +
          `${report.retry} à réessayer, ${report.failed} refusés.`,
      );
    }
    if (now.getTime() - lastPurge > PURGE_MS) {
      lastPurge = now.getTime();
      const removed = purge(store, now);
      if (removed) console.log(`Ménage : ${removed} abonnements inactifs supprimés.`);
    }
  } catch (error) {
    console.error('Tour d’horloge en échec :', error instanceof Error ? error.message : error);
  } finally {
    running = false;
  }
}

const server = createServer(createApp(store, config, send));
server.requestTimeout = 10_000;
server.headersTimeout = 10_000;
server.listen(config.port, config.host, () => {
  console.log(`Kitzy push à l’écoute sur ${config.host}:${config.port}`);
});

void tick();
const timer = setInterval(() => void tick(), TICK_MS);

function stop() {
  clearInterval(timer);
  server.close(() => {
    store.close();
    process.exit(0);
  });
  // Ne pas rester bloqué sur une connexion qui traîne.
  setTimeout(() => process.exit(0), 5000).unref();
}
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
