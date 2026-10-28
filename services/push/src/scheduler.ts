/**
 * Le tour d'horloge (tous les quarts d'heure) : pour chaque alerte arrivée à sa date dans le fuseau
 * de l'appareil, un push à partir de l'heure d'envoi. Une alerte manquée (service arrêté toute la
 * journée) est abandonnée : l'app la montrera à l'ouverture.
 */
import type { Store } from './db.ts';
import type { Sender, SendResult } from './send.ts';
import { localClock, utcDate } from './time.ts';

export interface TickReport {
  sent: number;
  gone: number;
  retry: number;
  failed: number;
  skipped: number;
}

/** Quelques envois à la fois : assez pour avancer, sans inonder les services push. */
const CONCURRENCY = 8;

export async function runTick(
  store: Store,
  send: Sender,
  options: { now: Date; sendHour: number },
): Promise<TickReport> {
  const report: TickReport = { sent: 0, gone: 0, retry: 0, failed: 0, skipped: 0 };
  // Le fuseau le plus en avance (UTC+14) a au plus un jour d'avance sur UTC.
  const candidates = store.dueUpTo(utcDate(options.now, 1));
  const toSend: { endpoint: string; date: string }[] = [];
  for (const alert of candidates) {
    const local = localClock(alert.timezone, options.now);
    if (alert.date < local.date) {
      store.removeAlert(alert.endpoint, alert.date);
      report.skipped++;
    } else if (alert.date === local.date && local.hour >= options.sendHour) {
      toSend.push(alert);
    }
  }

  let next = 0;
  const worker = async () => {
    while (next < toSend.length) {
      const alert = toSend[next++];
      if (!alert || !store.has(alert.endpoint)) continue;
      const result: SendResult = await send(alert.endpoint);
      report[result]++;
      if (result === 'gone') store.remove(alert.endpoint);
      else if (result !== 'retry') store.removeAlert(alert.endpoint, alert.date);
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, toSend.length) }, worker));
  return report;
}

/** Six mois sans nouvelles et plus rien à venir : l'abonnement est oublié. */
export const RETENTION_DAYS = 183;

export function purge(store: Store, now: Date): number {
  return store.purge(now.getTime() - RETENTION_DAYS * 86_400_000, utcDate(now, -1));
}
