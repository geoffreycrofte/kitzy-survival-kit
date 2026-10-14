import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useTranslation } from 'react-i18next';

/**
 * Annonce la disponibilité hors-ligne et les mises à jour.
 * Jamais de rechargement forcé : c'est la personne qui décide.
 */
export function UpdateBanner() {
  const { t } = useTranslation();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW();

  // L'information « disponible hors-ligne » s'efface seule ; la mise à jour attend un choix.
  useEffect(() => {
    if (!offlineReady || needRefresh) return;
    const timer = setTimeout(() => setOfflineReady(false), 6000);
    return () => clearTimeout(timer);
  }, [offlineReady, needRefresh, setOfflineReady]);

  const close = () => {
    setNeedRefresh(false);
    setOfflineReady(false);
  };

  return (
    <div role="status" className="update-banner-region">
      {(needRefresh || offlineReady) && (
        <div className="update-banner">
          <p>{needRefresh ? t('app.update') : t('app.offlineReady')}</p>
          <div className="update-banner__actions">
            {needRefresh && (
              <button
                type="button"
                className="button"
                onClick={() => void updateServiceWorker(true)}
              >
                {t('app.updateAction')}
              </button>
            )}
            <button type="button" className="button button--ghost" onClick={close}>
              {t('app.dismiss')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
