import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { setThemePref, usePreferences } from '../lib/preferences';
import { MoonIcon, SettingsIcon, SunIcon } from './Icons';

export function Header() {
  const { t } = useTranslation();
  const { theme } = usePreferences();
  const isDark = theme === 'sombre';

  return (
    <header className="header">
      <Link to="/" className="header__brand" aria-label={t('app.homeLink')}>
        Kitzy
      </Link>
      <button
        type="button"
        className="icon-button"
        aria-label={isDark ? t('theme.toLight') : t('theme.toDark')}
        onClick={() => setThemePref(isDark ? 'clair' : 'sombre')}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
      <Link to="/reglages" className="icon-button" aria-label={t('nav.settings')}>
        <SettingsIcon />
      </Link>
    </header>
  );
}
