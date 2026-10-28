/** Date et heure locales d'un appareil, d'après le fuseau qu'il a donné (ex. Europe/Luxembourg). */
export function localClock(timezone: string, now: Date): { date: string; hour: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return { date: `${get('year')}-${get('month')}-${get('day')}`, hour: Number(get('hour')) };
}

export function isTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat('en', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

/** Date UTC décalée de `days` jours, au format AAAA-MM-JJ. */
export function utcDate(now: Date, days = 0): string {
  return new Date(now.getTime() + days * 86_400_000).toISOString().slice(0, 10);
}
