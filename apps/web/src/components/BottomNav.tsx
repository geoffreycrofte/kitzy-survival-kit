import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BookIcon, BurrowIcon, JarIcon, PlanIcon, TagIcon } from './Icons';

const items = [
  { to: '/', key: 'nav.home', Icon: BurrowIcon, end: true },
  { to: '/kits', key: 'nav.kits', Icon: JarIcon, end: false },
  { to: '/courses', key: 'nav.shopping', Icon: TagIcon, end: false },
  { to: '/plan', key: 'nav.plan', Icon: PlanIcon, end: false },
  { to: '/guide', key: 'nav.guide', Icon: BookIcon, end: false },
] as const;

export function BottomNav() {
  const { t } = useTranslation();
  return (
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
      </ul>
    </nav>
  );
}
