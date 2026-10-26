/**
 * Partager Kitzy : la feuille de partage du téléphone (WhatsApp, SMS, e-mail…) quand elle
 * existe, sinon le lien copié dans le presse-papiers, prêt à coller dans un message.
 */
import { SITE_URL } from '@kitzy/core';

export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed';

export async function shareApp(title: string, text: string): Promise<ShareOutcome> {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text, url: SITE_URL });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
      // Partage refusé (pas de geste récent, ordinateur sans cible) : on copie à la place.
    }
  }
  try {
    await navigator.clipboard.writeText(`${text} ${SITE_URL}`);
    return 'copied';
  } catch {
    return 'failed';
  }
}
