import { useEffect, useRef, useState, type CSSProperties } from 'react';
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
  // L'onglet en cours (mêmes règles que NavLink) ; 4 = le bouton Menu, -1 = aucun.
  const found = items.findIndex(({ to, end }) =>
    end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`),
  );
  const current = found >= 0 ? found : inMenu ? items.length : -1;

  // Quand l'onglet change, la pastille s'étire pendant qu'elle glisse, comme une goutte de lumière.
  const pill = useRef<HTMLSpanElement>(null);
  const previous = useRef(current);
  useEffect(() => {
    const from = previous.current;
    previous.current = current;
    if (from === current || from < 0 || current < 0) return;
    if (document.documentElement.dataset.motion !== 'full') return;
    pill.current?.animate(
      [
        { transform: 'translateX(-50%) scale(1, 1)' },
        { transform: 'translateX(-50%) scale(1.7, 0.78)', offset: 0.35 },
        { transform: 'translateX(-50%) scale(0.92, 1.08)', offset: 0.75 },
        { transform: 'translateX(-50%) scale(1, 1)' },
      ],
      { duration: 520, easing: 'ease-out' },
    );
  }, [current]);

  return (
    <>
      <nav className="bottom-nav" aria-label={t('app.nav')}>
        <ul style={{ '--nav-i': Math.max(current, 0) } as CSSProperties}>
          {/* Décor : la lueur derrière l'onglet en cours (les lecteurs d'écran ont aria-current). */}
          <li
            className={`bottom-nav__glow${current < 0 ? ' bottom-nav__glow--off' : ''}`}
            aria-hidden="true"
          >
            <span ref={pill} className="bottom-nav__pill" />
          </li>
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
