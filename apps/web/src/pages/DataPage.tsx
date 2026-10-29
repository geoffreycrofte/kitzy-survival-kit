import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackupCard } from '../components/BackupCard';
import { PlanProtection } from '../components/PlanLock';
import { UnlockDrawer } from '../components/UnlockDrawer';
import { useKitzy } from '../data/derived';
import { resetAll } from '../data/store';
import { announce } from '../lib/announce';
import { usePageTitle } from '../lib/usePageTitle';

/** Sauvegarde et données : protéger le plan, sauvegarder, restaurer, tout effacer. */
export function DataPage() {
  const { t } = useTranslation();
  usePageTitle(t('nav.backup'));
  return (
    <div className="page settings">
      <h1 tabIndex={-1}>{t('nav.backup')}</h1>
      <p className="lead">{t('settings.dataPageIntro')}</p>
      <div className="settings-group">
        <PlanProtection />
        <BackupCard />
        <ResetCard />
      </div>
    </div>
  );
}

/**
 * « Tout effacer ». Plan protégé : il faut d'abord l'ouvrir (empreinte ou code), dans le tiroir,
 * sinon n'importe qui tenant le téléphone pourrait tout effacer depuis l'app. En cas de code
 * perdu, le tiroir explique comment repartir de zéro depuis le navigateur.
 */
function ResetCard() {
  const { t } = useTranslation();
  const data = useKitzy();
  const [unlocking, setUnlocking] = useState(false);
  const locked = Boolean(data?.planLock) && data?.planState !== 'open';

  const reset = async () => {
    if (!window.confirm(t('settings.resetConfirm'))) return;
    await resetAll();
    announce(t('settings.resetDone'));
  };

  return (
    <section className="card card--danger" aria-labelledby="danger-title">
      <h2 id="danger-title" className="choice__legend">
        {t('settings.danger')}
      </h2>
      <p className="choice__help">{t('settings.dangerHelp')}</p>
      <button
        type="button"
        className="button button--danger"
        onClick={() => (locked ? setUnlocking(true) : void reset())}
      >
        {t('settings.reset')}
      </button>
      <UnlockDrawer
        open={unlocking}
        intro={t('settings.resetLocked')}
        next={
          <>
            <p tabIndex={-1}>{t('lock.unlocked')}</p>
            <button
              type="button"
              className="button button--danger"
              onClick={() => {
                setUnlocking(false);
                void reset();
              }}
            >
              {t('settings.reset')}
            </button>
          </>
        }
        onClose={() => setUnlocking(false)}
      />
    </section>
  );
}
