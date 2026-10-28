/**
 * Génère la paire de clés VAPID, une seule fois, sur le VPS :
 *   node scripts/generate-keys.ts
 * Les deux lignes vont dans /etc/kitzy-push.env. La clé publique va aussi dans la variable
 * de dépôt KITZY_VAPID_KEY. Changer de clés désabonne tous les appareils.
 */
import { generateVapidKeys } from '../src/vapid.ts';

const keys = generateVapidKeys();
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
