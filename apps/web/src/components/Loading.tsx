import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDataError } from '../data/health';

/** Après ce délai, un chargement n'est plus « normal » : on explique et on propose de recharger. */
const STUCK_AFTER_MS = 4000;

export function Loading() {
  const { t } = useTranslation();
  const error = useDataError();
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStuck(true), STUCK_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!stuck && !error) return <p>{t('app.loading')}</p>;
  return (
    <div className="card" role="alert">
      <p className="card__label">{t('app.stuckTitle')}</p>
      <p>{t('app.stuckText')}</p>
      <button type="button" className="button" onClick={() => location.reload()}>
        {t('app.stuckReload')}
      </button>
      {error && <p className="muted small">{t('app.stuckDetail', { error })}</p>}
    </div>
  );
}
