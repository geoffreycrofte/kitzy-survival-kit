import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

/**
 * Le nom de l'app, sur l'accueil seulement : dans les pages internes, le titre de la page suffit.
 * Le thème et les réglages sont dans le menu (barre du bas, ou colonne sur bureau).
 */
export function Header() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  if (pathname !== '/') return null;

  return (
    <header className="header">
      <Link to="/" className="header__brand" aria-label={t('app.homeLink')}>
        Kitzy
      </Link>
    </header>
  );
}
