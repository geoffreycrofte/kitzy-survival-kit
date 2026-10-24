import { type ReactNode } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { DONATION_LINKS, LOCALES, buildIcs, messagesFor, type KitLevel } from '@kitzy/core';
import { setLocalePref, useLocale, type LocalePref } from '../lib/locale';
import { BackupCard } from '../components/BackupCard';
import { InstallSettings } from '../components/InstallSettings';
import { PlanProtection } from '../components/PlanLock';
import { NotificationSettings } from '../components/NotificationSettings';
import { COUNTRY, useKitzy } from '../data/derived';
import { resetAll, setLevel } from '../data/store';
import { announce } from '../lib/announce';
import { downloadFile } from '../lib/download';
import {
  setMotionPref,
  setThemePref,
  usePreferences,
  type MotionPref,
  type ThemePref,
} from '../lib/preferences';
import { usePageTitle } from '../lib/usePageTitle';

const themeOptions: ReadonlyArray<[ThemePref, string]> = [
  ['system', 'settings.themeSystem'],
  ['sombre', 'settings.themeDark'],
  ['clair', 'settings.themeLight'],
];

const motionOptions: ReadonlyArray<[MotionPref, string]> = [
  ['auto', 'settings.motionAuto'],
  ['on', 'settings.motionOn'],
  ['off', 'settings.motionOff'],
];

const levels: KitLevel[] = ['essential', 'recommended', 'complete'];

const DONATIONS = DONATION_LINKS;

/** Pour demander une langue : le profil LinkedIn de l'auteur. */
const LINKEDIN = 'https://www.linkedin.com/in/geoffreycrofte/';

export function Settings() {
  const { t } = useTranslation();
  const { themePref, motionPref } = usePreferences();
  const { pref: localePref, locale } = useLocale();
  const data = useKitzy();
  usePageTitle(t('settings.title'));

  const groups = [
    { id: 'affichage', title: t('settings.groups.display') },
    { id: 'kits', title: t('settings.groups.kits') },
    { id: 'appareil', title: t('settings.groups.device') },
    { id: 'kitzy', title: t('settings.groups.kitzy') },
  ];

  return (
    <div className="page settings">
      <h1 tabIndex={-1}>{t('settings.title')}</h1>

      <nav className="toc" aria-labelledby="settings-toc">
        <h2 id="settings-toc" className="toc__label">
          {t('settings.toc')}
        </h2>
        <ul className="pill-list">
          {groups.map((g) => (
            <li key={g.id}>
              <a href={`#${g.id}`} className="pill">
                {g.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <SettingsGroup id="affichage" title={groups[0]!.title}>
        <fieldset className="card choice">
          <legend className="choice__legend">{t('settings.theme')}</legend>
          {themeOptions.map(([value, key]) => (
            <label key={value} className="choice__option">
              <input
                type="radio"
                name="theme"
                value={value}
                checked={themePref === value}
                onChange={() => setThemePref(value)}
              />
              {t(key)}
            </label>
          ))}
        </fieldset>

        <fieldset className="card choice" aria-describedby="motion-help">
          <legend className="choice__legend">{t('settings.motion')}</legend>
          <p id="motion-help" className="choice__help">
            {t('settings.motionHelp')}
          </p>
          {motionOptions.map(([value, key]) => (
            <label key={value} className="choice__option">
              <input
                type="radio"
                name="motion"
                value={value}
                checked={motionPref === value}
                onChange={() => setMotionPref(value)}
              />
              {t(key)}
            </label>
          ))}
        </fieldset>

        <fieldset className="card choice" aria-describedby="language-help">
          <legend className="choice__legend">{t('settings.language')}</legend>
          <p id="language-help" className="choice__help">
            {t('settings.languageHelp')}
          </p>
          {(['auto', ...LOCALES.filter((l) => l.enabled).map((l) => l.code)] as LocalePref[]).map(
            (value) => {
              const info = LOCALES.find((l) => l.code === value);
              return (
                <label key={value} className="choice__option">
                  <input
                    type="radio"
                    name="language"
                    value={value}
                    checked={localePref === value}
                    onChange={() => setLocalePref(value)}
                  />
                  {/* Chaque langue est écrite dans sa propre langue, avec son attribut lang. */}
                  {info ? <span lang={info.code}>{info.label}</span> : t('settings.languageAuto')}
                </label>
              );
            },
          )}
          {locale !== 'fr' && <p className="choice__help">{t('settings.languageReview')}</p>}
          <p className="choice__help">{t('settings.requestLanguageHelp')}</p>
          <a className="text-link" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
            {t('settings.requestLanguage')}
            <span className="visually-hidden"> {t('guide.newWindow')}</span>
          </a>
        </fieldset>
      </SettingsGroup>

      <SettingsGroup id="kits" title={groups[1]!.title}>
        {data && (
          <fieldset id="niveau" className="card choice" aria-describedby="level-help">
            <legend className="choice__legend">{t('settings.level')}</legend>
            <p id="level-help" className="choice__help">
              {t('settings.levelHelp')}
            </p>
            {levels.map((level) => (
              <label key={level} className="choice__option choice__option--stacked">
                <input
                  type="radio"
                  name="level"
                  value={level}
                  checked={data.level === level}
                  aria-describedby={`level-${level}-hint`}
                  onChange={() => void setLevel(level)}
                />
                <span>
                  {t(`levels.${level}Label`)}
                  <span id={`level-${level}-hint`} className="choice__hint">
                    {t(`levels.${level}Hint`)}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>
        )}

        {data?.household && <NotificationSettings reminders={data.reminders} />}

        {data?.household && (
          <section className="card" aria-labelledby="calendar-title">
            <h3 id="calendar-title" className="choice__legend">
              {t('settings.calendar')}
            </h3>
            <p className="choice__help">{t('settings.calendarHelp')}</p>
            <button
              type="button"
              className="button"
              onClick={() => {
                downloadFile(
                  'kitzy-rappels.ics',
                  buildIcs(data.reminders, {
                    country: COUNTRY,
                    texts: messagesFor(locale).system.ics,
                  }),
                  'text/calendar;charset=utf-8',
                );
                announce(t('settings.calendarDone'));
              }}
            >
              {t('settings.calendarDownload')}
            </button>
          </section>
        )}
      </SettingsGroup>

      <SettingsGroup id="appareil" title={groups[2]!.title}>
        <InstallSettings />

        <PlanProtection />

        <BackupCard />

        <section className="card card--danger" aria-labelledby="danger-title">
          <h3 id="danger-title" className="choice__legend">
            {t('settings.danger')}
          </h3>
          <p className="choice__help">{t('settings.dangerHelp')}</p>
          <button
            type="button"
            className="button button--danger"
            onClick={async () => {
              if (!window.confirm(t('settings.resetConfirm'))) return;
              await resetAll();
              announce(t('settings.resetDone'));
            }}
          >
            {t('settings.reset')}
          </button>
        </section>
      </SettingsGroup>

      <SettingsGroup id="kitzy" title={groups[3]!.title}>
        <section className="card" aria-labelledby="support-title">
          <h3 id="support-title" className="choice__legend">
            {t('settings.support')}
          </h3>
          <p className="choice__help">{t('settings.supportHelp')}</p>
          <div className="button-row">
            <a className="button" href={DONATIONS.paypal} target="_blank" rel="noopener noreferrer">
              {t('settings.paypal')}
              <span className="visually-hidden"> {t('guide.newWindow')}</span>
            </a>
            <a
              className="button button--ghost"
              href={DONATIONS.revolut}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('settings.revolut')}
              <span className="visually-hidden"> {t('guide.newWindow')}</span>
            </a>
          </div>
        </section>

        <section className="card" aria-labelledby="about-title">
          <h3 id="about-title" className="choice__legend">
            {t('settings.about')}
          </h3>
          <p className="choice__help">{t('settings.aboutText')}</p>
          <div className="button-row">
            <Link to="/transparence" className="text-link">
              {t('settings.transparency')}
            </Link>
            <Link to="/confidentialite" className="text-link">
              {t('settings.privacy')}
            </Link>
          </div>
        </section>
      </SettingsGroup>
    </div>
  );
}

/** Un groupe de réglages : un titre jaune, puis ses cartes. */
function SettingsGroup({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="settings-group" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="section-title">
        {title}
      </h2>
      {children}
    </section>
  );
}
