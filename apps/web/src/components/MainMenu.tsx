import { useEffect, useRef, type ComponentType, type CSSProperties, type SVGProps } from 'react';
import { Link, NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ACHIEVEMENTS } from '@kitzy/core';
import { useKitzy } from '../data/derived';
import { useShareApp } from './ShareKitzy';
import { setThemePref, usePreferences, type ThemePref } from '../lib/preferences';
import {
  AutoThemeIcon,
  BackupIcon,
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
  '/sauvegarde',
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

  /* Ambiance : la pastille jaune glisse vers l'option choisie. Elle s'étire en route, dépasse de
     4 px (toujours dans le cadre, quelle que soit la distance) et revient en place. */
  const themeIndex = Math.max(
    0,
    themes.findIndex(([value]) => value === themePref),
  );
  const thumb = useRef<HTMLSpanElement>(null);
  const previousTheme = useRef(themeIndex);
  useEffect(() => {
    const from = previousTheme.current;
    previousTheme.current = themeIndex;
    if (from === themeIndex || document.documentElement.dataset.motion !== 'full') return;
    const at = (i: number, shift = 0) => `translateX(calc(${i} * (100% + 4px) + ${shift}px))`;
    const way = Math.sign(themeIndex - from);
    thumb.current?.animate(
      [
        { transform: `${at(from)} scaleX(1)` },
        { transform: `${at(from + (themeIndex - from) * 0.75)} scaleX(1.14)`, offset: 0.45 },
        { transform: `${at(themeIndex, 4 * way)} scaleX(0.97)`, offset: 0.75 },
        { transform: `${at(themeIndex)} scaleX(1)` },
      ],
      { duration: 480, easing: 'ease-out' },
    );
  }, [themeIndex]);
  const data = useKitzy();
  const unlocked = data ? ACHIEVEMENTS.filter((a) => data.achievements[a.id]).length : 0;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      // La lumière part du bouton Menu (celui qui a le focus au moment du clic). Son rayon est
      // juste ce qu'il faut pour couvrir l'écran : toute l'animation se voit, rien ne se perd hors champ.
      const from = document.activeElement?.getBoundingClientRect();
      const x = from ? from.left + from.width / 2 : window.innerWidth / 2;
      const y = from ? from.top + from.height / 2 : window.innerHeight;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      dialog.style.setProperty('--menu-x', `${x}px`);
      dialog.style.setProperty('--menu-y', `${y}px`);
      dialog.style.setProperty('--menu-r', `${Math.ceil(r)}px`);
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  /* Fermer : les entrées s'effacent, puis la lumière se resserre vers le bouton Menu et la fenêtre
     se ferme. Tout passe par `transform` et `opacity`, animés par la carte graphique : fluide.
     Sans animations, elle se ferme tout de suite. */
  const closing = useRef(false);
  const close = () => {
    const dialog = ref.current;
    const light = dialog?.querySelector<HTMLElement>('.menu__light');
    const inner = dialog?.querySelector<HTMLElement>('.menu__inner');
    if (!dialog?.open || closing.current) return;
    if (document.documentElement.dataset.motion !== 'full' || !light || !inner) {
      return dialog.close();
    }
    closing.current = true;
    // `forwards` : tout reste éteint jusqu'à la fermeture, sinon l'animation d'ouverture
    // reprendrait la main une image (clignement).
    const fade = inner.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 160,
      easing: 'ease-out',
      fill: 'forwards',
    });
    const shrink = light.animate([{ transform: 'scale(1)' }, { transform: 'scale(0)' }], {
      duration: 400,
      delay: 60,
      easing: 'cubic-bezier(0.45, 0, 0.7, 0.3)',
      fill: 'forwards',
    });
    const done = () => {
      closing.current = false;
      dialog.close();
      fade.cancel();
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
  ];

  return (
    <dialog ref={ref} className="menu" aria-labelledby="menu-title" onClose={onClose}>
      {/* Le disque de lumière qui grandit depuis le bouton Menu (décor, animé seulement). */}
      <span className="menu__light" aria-hidden="true" />
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
            <span
              ref={thumb}
              className="segmented__thumb"
              aria-hidden="true"
              style={{ '--seg-i': themeIndex } as CSSProperties}
            />
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
          {/* Réglages, partage et sauvegarde : des icônes sur une ligne, le nom pour les lecteurs
              d'écran. Moins d'entrées dans la liste, sans rien retirer. */}
          <ul
            className="menu__quick menu__item"
            style={{ '--i': links.length + 1 } as CSSProperties}
          >
            <li>
              <NavLink to="/reglages" className="menu__quick-link" onClick={close}>
                <SettingsIcon />
                <span className="visually-hidden">{t('nav.settings')}</span>
              </NavLink>
            </li>
            <li>
              <button type="button" className="menu__quick-link" onClick={() => void share()}>
                <ShareIcon />
                <span className="visually-hidden">{t('share.button')}</span>
              </button>
            </li>
            <li>
              <NavLink to="/sauvegarde" className="menu__quick-link" onClick={close}>
                <BackupIcon />
                <span className="visually-hidden">{t('nav.backup')}</span>
              </NavLink>
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
