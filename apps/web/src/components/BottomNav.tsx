import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BurrowIcon, JarIcon, MenuIcon, PlanIcon, TagIcon } from './Icons';
import { MENU_ROUTES, MainMenu } from './MainMenu';

const items = [
  { to: '/', key: 'nav.home', Icon: BurrowIcon, end: true },
  { to: '/kits', key: 'nav.kits', Icon: JarIcon, end: false },
  { to: '/courses', key: 'nav.shopping', Icon: TagIcon, end: false },
  { to: '/plan', key: 'nav.plan', Icon: PlanIcon, end: false },
] as const;

export function BottomNav() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  // Le bouton Menu s'allume quand la page affichée vient du menu (guide, succès, réglages…).
  const inMenu = MENU_ROUTES.some((route) => pathname.startsWith(route));

  return (
    <>
      <nav className="bottom-nav" aria-label={t('app.nav')}>
        <ul>
          {items.map(({ to, key, Icon, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className="bottom-nav__link">
                <Icon />
                {t(key)}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              className={`bottom-nav__link${inMenu ? ' bottom-nav__link--active' : ''}`}
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
              {t('nav.menu')}
            </button>
          </li>
        </ul>
      </nav>
      <MainMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
