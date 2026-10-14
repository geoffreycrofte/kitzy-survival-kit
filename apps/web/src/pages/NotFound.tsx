import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '../lib/usePageTitle';

export function NotFound() {
  const { t } = useTranslation();
  usePageTitle(t('pages.notFound'));

  return (
    <div className="page soon">
      <h1 tabIndex={-1}>{t('pages.notFound')}</h1>
      <p>{t('notFound.body')}</p>
      <Link to="/" className="button button--ghost">
        {t('soon.back')}
      </Link>
    </div>
  );
}
