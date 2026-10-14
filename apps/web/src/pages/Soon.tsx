import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { mascot } from '../lib/assets';
import { usePageTitle } from '../lib/usePageTitle';

/** Page provisoire pour les parties pas encore construites. */
export function Soon({ titleKey }: { titleKey: string }) {
  const { t } = useTranslation();
  const title = t(titleKey);
  usePageTitle(title);

  return (
    <div className="page soon">
      <img className="soon__hog" src={mascot('endormi')} alt="" width={720} height={707} />
      <h1 tabIndex={-1}>{title}</h1>
      <p>{t('soon.body')}</p>
      <Link to="/" className="button button--ghost">
        {t('soon.back')}
      </Link>
    </div>
  );
}
