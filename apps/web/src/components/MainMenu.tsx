import { useEffect, useRef, type ComponentType, type CSSProperties, type SVGProps } from 'react';
import { Link, NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ACHIEVEMENTS } from '@kitzy/core';
import { useKitzy } from '../data/derived';
import { useShareApp } from './ShareKitzy';
import { setThemePref, usePreferences, type ThemePref } from '../lib/preferences';
import {
  AutoThemeIcon,
  BookIcon,
  CheckListIcon,
  CloseIcon,
  MoonIcon,
  SettingsIcon,
  ShareIcon,
  SparkIcon,
  SunIcon,
  TrophyIcon,
} from './Icons';

/** Pages ouvertes depuis le menu. */
export const MENU_ROUTES = [
  '/activites',
  '/mini-check',
  '/check-up',
  '/recettes',
  '/defi',
  '/simulation',
  '/quiz',
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
    if (open && !dialog.open) {
      // La lumière part du bouton Menu (celui qui a le focus au moment du clic).
      const from = document.activeElement?.getBoundingClientRect();
      const x = from ? from.left + from.width / 2 : window.innerWidth / 2;
      const y = from ? from.top + from.height / 2 : window.innerHeight;
      dialog.style.setProperty('--menu-x', `${x}px`);
      dialog.style.setProperty('--menu-y', `${y}px`);
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  /* Fermer : la lumière se resserre vers le bouton Menu, puis la fenêtre se ferme.
     Sans animations, elle se ferme tout de suite. */
  const closing = useRef(false);
  const close = () => {
    const dialog = ref.current;
    if (!dialog?.open || closing.current) return;
    if (document.documentElement.dataset.motion !== 'full') return dialog.close();
    closing.current = true;
    const at = `at ${dialog.style.getPropertyValue('--menu-x') || '50%'} ${dialog.style.getPropertyValue('--menu-y') || '100%'}`;
    const shrink = dialog.animate(
      [{ clipPath: `circle(150vmax ${at})` }, { clipPath: `circle(0 ${at})` }],
      // `forwards` : le cercle reste fermé jusqu'à la fermeture, sinon l'animation d'ouverture
      // reprendrait la main une image et le menu réapparaîtrait en entier (clignement).
      { duration: 320, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' },
    );
    const done = () => {
      closing.current = false;
      dialog.close();
      shrink.cancel();
    };
    shrink.onfinish = done;
    shrink.oncancel = () => {
      if (closing.current) done();
    };
  };

  // Échap passe par la même fermeture animée.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      if (document.documentElement.dataset.motion !== 'full') return;
      event.preventDefault();
      close();
    };
    dialog.addEventListener('cancel', onCancel);
    return () => dialog.removeEventListener('cancel', onCancel);
  });
  const share = useShareApp();

  const links = [
    {
      to: '/activites',
      Icon: SparkIcon,
      title: t('nav.activities'),
      hint: t('menu.activitiesHint'),
    },
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
            <li className="menu__item" style={{ '--i': links.length + 1 } as CSSProperties}>
              <button type="button" className="menu__link" onClick={() => void share()}>
                <span className="menu__icon">
                  <ShareIcon />
                </span>
                <span className="menu__text">
                  <span className="menu__name">{t('share.button')}</span>
                  <span className="menu__hint">{t('share.menuHint')}</span>
                </span>
              </button>
            </li>
          </ul>
        </nav>

        <p className="menu__item menu__foot" style={{ '--i': links.length + 2 } as CSSProperties}>
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
