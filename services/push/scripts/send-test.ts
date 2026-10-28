/**
 * Envoi d'essai, à lancer sur le VPS (jamais exposé sur Internet) :
 *   node scripts/send-test.ts          le dernier appareil abonné (celui qu'on vient d'activer)
 *   node scripts/send-test.ts --all    tous les appareils abonnés
 * Les variables de /etc/kitzy-push.env doivent être chargées (voir docs/maintaining.md).
 */
import { loadConfig } from '../src/config.ts';
import { openStore } from '../src/db.ts';
import { pushSender } from '../src/send.ts';
import { vapidAuthorizer } from '../src/vapid.ts';

const config = loadConfig();
const store = openStore(config.dbPath);
const send = pushSender(vapidAuthorizer(config.vapid));

const latest = store.latest();
const targets = process.argv.includes('--all') ? store.all() : latest ? [latest] : [];
if (targets.length === 0) {
  console.log('Aucun appareil abonné.');
} else {
  const results: Record<string, number> = {};
  for (const endpoint of targets) {
    const result = await send(endpoint);
    results[result] = (results[result] ?? 0) + 1;
    if (result === 'gone') store.remove(endpoint);
  }
  console.log(`Envoi d’essai à ${targets.length} appareil(s) :`, results);
}
store.close();
