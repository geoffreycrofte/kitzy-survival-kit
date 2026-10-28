/**
 * Réglages du service, lus dans l'environnement (fichier `/etc/kitzy-push.env` sur le VPS,
 * voir `deploy/env.example`). La clé privée VAPID ne vit que là : jamais dans le dépôt.
 */
export interface Config {
  host: string;
  port: number;
  /** Les seules pages autorisées à abonner un appareil (CORS). */
  allowedOrigins: string[];
  dbPath: string;
  vapid: { publicKey: string; privateKey: string; subject: string };
  /** Derrière nginx : l'adresse du visiteur est dans `X-Real-IP`. */
  trustProxy: boolean;
  /** Heure locale (dans le fuseau de l'appareil) à partir de laquelle on envoie. */
  sendHour: number;
  /** Au-delà, les nouveaux abonnements sont refusés : le disque du VPS reste à l'abri. */
  maxSubscriptions: number;
}

function required(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name]?.trim();
  if (!value) throw new Error(`Variable manquante : ${name}`);
  return value;
}

function integer(env: NodeJS.ProcessEnv, name: string, fallback: number): number {
  const raw = env[name]?.trim();
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value)) throw new Error(`${name} doit être un nombre entier`);
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const subject = required(env, 'VAPID_SUBJECT');
  // Les services push (Apple en tête) exigent un contact joignable : e-mail ou adresse web.
  if (!/^mailto:[^@\s]+@[^@\s]+$/.test(subject) && !subject.startsWith('https://')) {
    throw new Error('VAPID_SUBJECT doit commencer par mailto: ou https://');
  }
  const sendHour = integer(env, 'SEND_HOUR', 9);
  if (sendHour < 0 || sendHour > 23) throw new Error('SEND_HOUR doit être entre 0 et 23');
  return {
    host: env.HOST?.trim() || '127.0.0.1',
    port: integer(env, 'PORT', 8787),
    allowedOrigins: required(env, 'ALLOWED_ORIGIN')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    dbPath: env.DB_PATH?.trim() || 'data/push.sqlite',
    vapid: {
      publicKey: required(env, 'VAPID_PUBLIC_KEY'),
      privateKey: required(env, 'VAPID_PRIVATE_KEY'),
      subject,
    },
    trustProxy: env.TRUST_PROXY === '1',
    sendHour,
    maxSubscriptions: integer(env, 'MAX_SUBSCRIPTIONS', 50_000),
  };
}
