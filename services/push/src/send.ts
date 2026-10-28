/**
 * Envoi d'un push vide : le service worker de Kitzy se réveille, lit la base de l'appareil
 * et affiche lui-même le détail des rappels. Le service push ne transporte aucun contenu.
 */

/**
 * - `sent` : accepté par le service push ;
 * - `gone` : l'abonnement n'existe plus (404, 410) : on l'oublie ;
 * - `retry` : surcharge ou panne passagère (429, 5xx, réseau) : on réessaiera ;
 * - `failed` : refus définitif pour cette alerte (clé, taille…) : on ne boucle pas dessus.
 */
export type SendResult = 'sent' | 'gone' | 'retry' | 'failed';

/** Le push peut attendre un appareil éteint jusqu'à 12 heures, pas plus : passé, il n'a plus de sens. */
const TTL_SECONDS = 12 * 60 * 60;

export type Sender = (endpoint: string) => Promise<SendResult>;

export function pushSender(
  authorize: (endpoint: string) => string,
  fetchImpl: typeof fetch = fetch,
): Sender {
  return async (endpoint) => {
    try {
      const response = await fetchImpl(endpoint, {
        method: 'POST',
        headers: {
          Authorization: authorize(endpoint),
          TTL: String(TTL_SECONDS),
          Urgency: 'normal',
        },
        signal: AbortSignal.timeout(10_000),
      });
      await response.body?.cancel();
      if (response.status >= 200 && response.status < 300) return 'sent';
      if (response.status === 404 || response.status === 410) return 'gone';
      if (response.status === 429 || response.status >= 500) return 'retry';
      return 'failed';
    } catch {
      return 'retry';
    }
  };
}
