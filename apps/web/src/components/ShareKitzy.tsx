import { useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { renderSVG } from 'uqr';
import { SITE_URL } from '@kitzy/core';
import { announce } from '../lib/announce';
import { shareApp } from '../lib/shareApp';

/** Le bouton « Partager Kitzy » : feuille de partage, ou lien copié (annoncé). */
export function useShareApp() {
  const { t } = useTranslation();
  return async () => {
    const outcome = await shareApp(t('share.shareTitle'), t('share.message'));
    if (outcome === 'copied') announce(t('share.copied'));
  };
}

/**
 * Inviter ses proches et ses voisins : le texte qui dit pourquoi, le partage,
 * et un QR code à montrer à quelqu'un qui est juste là.
 * `context` choisit la phrase d'introduction (accueil, étape du quartier, palier atteint).
 */
export function ShareKitzy({ context }: { context: 'home' | 'plan' | 'tier' }) {
  const { t } = useTranslation();
  const share = useShareApp();
  const [qr, setQr] = useState(false);
  const id = useId();
  const svg = useMemo(
    () =>
      qr
        ? renderSVG(SITE_URL, { ecc: 'M', border: 2, whiteColor: '#FFFFFF', blackColor: '#12302B' })
        : '',
    [qr],
  );

  return (
    <section className="card share-app" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="section-title">
        {t('share.title')}
      </h2>
      <p className="share-app__lead">{t('share.lead')}</p>
      <p className="muted">{t(`share.${context}Intro`)}</p>
      <div className="button-row">
        <button type="button" className="button" onClick={() => void share()}>
          {t('share.button')}
        </button>
        <button
          type="button"
          className="button button--ghost"
          aria-expanded={qr}
          aria-controls={`${id}-qr`}
          onClick={() => setQr(!qr)}
        >
          {t(qr ? 'share.qrHide' : 'share.qrShow')}
        </button>
      </div>
      <div id={`${id}-qr`} className="share-app__qr-zone" hidden={!qr}>
        {qr && (
          <>
            <div
              className="share-app__qr"
              role="img"
              aria-label={t('share.qrLabel')}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
            <p className="muted small">{t('share.qrHelp')}</p>
          </>
        )}
      </div>
    </section>
  );
}
