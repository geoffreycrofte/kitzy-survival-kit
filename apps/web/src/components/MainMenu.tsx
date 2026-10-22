import { useEffect, useRef, type ComponentType, type CSSProperties, type SVGProps } from 'react';
import { Link, NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ACHIEVEMENTS } from '@kitzy/core';
import { useKitzy } from '../data/derived';
import { setThemePref, usePreferences, type ThemePref } from '../lib/preferences';
import {
  AutoThemeIcon,
  BookIcon,
  CheckListIcon,
  CloseIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  TrophyIcon,
} from './Icons';

/** Pages ouvertes depuis le menu. */
export const MENU_ROUTES = [
  '/succes',
  '/guide',
  '/gestes',
  '/reglages',
  '/transparence',
  '/confidentialite',
];

const themes: ReadonlyArray<[ThemePref, string, ComponentType<SVGProps<SVGSVGElement>>]> = [
  ['system', 'menu.themeAuto', AutoThemeIcon],
  ['sombre', 'menu.themeDark', MoonIcon],
  ['clair', 'menu.themeLight', SunIcon],
];

interface MainMenuProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Menu plein écran. `<dialog>` modal : le reste de la page devient inerte,
 * Échap ferme, et le focus revient au bouton Menu.
 */
export function MainMenu({ open, onClose }: MainMenuProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDialogElement>(null);
  const { themePref } = usePreferences();
  const data = useKitzy();
  const unlocked = data ? ACHIEVEMENTS.filter((a) => data.achievements[a.id]).length : 0;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = () => ref.current?.close();

  const links = [
    {
      to: '/succes',
      Icon: TrophyIcon,
      title: t('nav.achievements'),
      hint: t('menu.achievementsHint', { done: unlocked, total: ACHIEVEMENTS.length }),
    },
    { to: '/guide', Icon: BookIcon, title: t('nav.guide'), hint: t('menu.guideHint') },
    { to: '/gestes', Icon: CheckListIcon, title: t('nav.tasks'), hint: t('menu.tasksHint') },
    { to: '/reglages', Icon: SettingsIcon, title: t('nav.settings'), hint: t('menu.settingsHint') },
  ];

  return (
    <dialog ref={ref} className="menu" aria-labelledby="menu-title" onClose={onClose}>
      <div className="menu__inner">
        <div className="menu__head">
          <h2 id="menu-title" className="menu__title">
            {t('menu.title')}
          </h2>
          <button
            type="button"
            className="icon-button"
            aria-label={t('menu.close')}
            onClick={close}
          >
            <CloseIcon />
          </button>
        </div>

        <fieldset className="menu__theme menu__item" style={{ '--i': 0 } as CSSProperties}>
          <legend className="menu__label">{t('menu.theme')}</legend>
          <div className="segmented">
            {themes.map(([value, key, Icon]) => (
              <label key={value} className="segmented__option">
                <input
                  type="radio"
                  name="menu-theme"
                  value={value}
                  checked={themePref === value}
                  onChange={() => setThemePref(value)}
                />
                <Icon />
                {t(key)}
              </label>
            ))}
          </div>
        </fieldset>

        <nav aria-labelledby="menu-title">
          <ul className="menu__list">
            {links.map(({ to, Icon, title, hint }, i) => (
              <li key={to} className="menu__item" style={{ '--i': i + 1 } as CSSProperties}>
                <NavLink to={to} className="menu__link" onClick={close}>
                  <span className="menu__icon">
                    <Icon />
                  </span>
                  <span className="menu__text">
                    <span className="menu__name">{title}</span>
                    <span className="menu__hint">{hint}</span>
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <p className="menu__item menu__foot" style={{ '--i': links.length + 1 } as CSSProperties}>
          <Link to="/transparence" className="text-link" onClick={close}>
            {t('settings.transparency')}
          </Link>
          <Link to="/confidentialite" className="text-link" onClick={close}>
            {t('settings.privacy')}
          </Link>
        </p>
      </div>
    </dialog>
  );
}
