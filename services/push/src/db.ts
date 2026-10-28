/**
 * La base SQLite du service : des adresses d'abonnement, un fuseau horaire et des dates.
 * Rien sur le contenu du kit, rien sur la personne.
 */
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export interface Due {
  endpoint: string;
  timezone: string;
  date: string;
}

export interface Store {
  /** Remplace le calendrier de cet appareil (nouvel abonnement ou mise à jour). */
  upsert(endpoint: string, timezone: string, dates: readonly string[], now: number): void;
  remove(endpoint: string): void;
  has(endpoint: string): boolean;
  count(): number;
  /** Les alertes datées au plus tard de `maxDate` (le service affine ensuite selon le fuseau). */
  dueUpTo(maxDate: string): Due[];
  removeAlert(endpoint: string, date: string): void;
  /** Le dernier appareil abonné ou mis à jour (pour l'envoi d'essai). */
  latest(): string | null;
  all(): string[];
  /**
   * Ménage : abonnements sans alerte à venir et sans nouvelles depuis `before`.
   * Renvoie le nombre d'abonnements supprimés.
   */
  purge(before: number, today: string): number;
  close(): void;
}

export function openStore(path: string): Store {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS subscriptions (
      endpoint   TEXT PRIMARY KEY,
      timezone   TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS alerts (
      endpoint TEXT NOT NULL REFERENCES subscriptions(endpoint) ON DELETE CASCADE,
      date     TEXT NOT NULL,
      PRIMARY KEY (endpoint, date)
    ) WITHOUT ROWID;
    CREATE INDEX IF NOT EXISTS alerts_by_date ON alerts (date);
  `);

  const upsertSub = db.prepare(`
    INSERT INTO subscriptions (endpoint, timezone, updated_at) VALUES (?, ?, ?)
    ON CONFLICT (endpoint) DO UPDATE SET timezone = excluded.timezone, updated_at = excluded.updated_at
  `);
  const clearAlerts = db.prepare('DELETE FROM alerts WHERE endpoint = ?');
  const addAlert = db.prepare('INSERT OR IGNORE INTO alerts (endpoint, date) VALUES (?, ?)');
  const removeSub = db.prepare('DELETE FROM subscriptions WHERE endpoint = ?');
  const hasSub = db.prepare('SELECT 1 FROM subscriptions WHERE endpoint = ?');
  const countSubs = db.prepare('SELECT COUNT(*) AS n FROM subscriptions');
  const due = db.prepare(`
    SELECT a.endpoint, s.timezone, a.date FROM alerts a
    JOIN subscriptions s ON s.endpoint = a.endpoint
    WHERE a.date <= ? ORDER BY a.date
  `);
  const removeAlertStmt = db.prepare('DELETE FROM alerts WHERE endpoint = ? AND date = ?');
  const latestSub = db.prepare(
    'SELECT endpoint FROM subscriptions ORDER BY updated_at DESC, rowid DESC LIMIT 1',
  );
  const allSubs = db.prepare('SELECT endpoint FROM subscriptions');
  const purgeStmt = db.prepare(`
    DELETE FROM subscriptions WHERE updated_at < ?
    AND NOT EXISTS (SELECT 1 FROM alerts a WHERE a.endpoint = subscriptions.endpoint AND a.date >= ?)
  `);

  return {
    upsert(endpoint, timezone, dates, now) {
      db.exec('BEGIN');
      try {
        upsertSub.run(endpoint, timezone, now);
        clearAlerts.run(endpoint);
        for (const date of dates) addAlert.run(endpoint, date);
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
    remove(endpoint) {
      removeSub.run(endpoint);
    },
    has(endpoint) {
      return hasSub.get(endpoint) !== undefined;
    },
    count() {
      return Number((countSubs.get() as { n: number }).n);
    },
    dueUpTo(maxDate) {
      return (due.all(maxDate) as unknown as Due[]).map(({ endpoint, timezone, date }) => ({
        endpoint,
        timezone,
        date,
      }));
    },
    removeAlert(endpoint, date) {
      removeAlertStmt.run(endpoint, date);
    },
    latest() {
      const row = latestSub.get() as { endpoint: string } | undefined;
      return row?.endpoint ?? null;
    },
    all() {
      return (allSubs.all() as { endpoint: string }[]).map((row) => row.endpoint);
    },
    purge(before, today) {
      return Number(purgeStmt.run(before, today).changes);
    },
    close() {
      db.close();
    },
  };
}
