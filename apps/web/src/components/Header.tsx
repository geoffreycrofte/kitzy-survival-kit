import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

/** Le thème et les réglages sont dans le menu (barre du bas, ou colonne sur bureau). */
export function Header() {
  const { t } = useTranslation();

  return (
    <header className="header">
      <Link to="/" className="header__brand" aria-label={t('app.homeLink')}>
        Kitzy
      </Link>
    </header>
  );
}
