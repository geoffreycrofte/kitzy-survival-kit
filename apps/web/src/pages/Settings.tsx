import { useRef, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { buildIcs, parseBackup, type KitLevel } from '@kitzy/core';
import { COUNTRY, useKitzy } from '../data/derived';
import { exportData, importData, resetAll, setLevel } from '../data/store';
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

const DONATIONS = {
  paypal: 'https://paypal.me/Crofte',
  revolut: 'https://revolut.me/crofte?note=Donation%20Kitzy.lu',
};

export function Settings() {
  const { t } = useTranslation();
  const { themePref, motionPref } = usePreferences();
  const data = useKitzy();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState('');
  usePageTitle(t('settings.title'));

  const onImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const result = parseBackup(await file.text());
    if (!result.ok) {
      setImportError(result.error);
      return;
    }
    setImportError('');
    if (!window.confirm(t('settings.importConfirm'))) return;
    await importData(result.data);
    announce(t('settings.imported'));
  };

  return (
    <div className="page settings">
      <h1 tabIndex={-1}>{t('settings.title')}</h1>

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

      {data?.household && (
        <section className="card" aria-labelledby="calendar-title">
          <h2 id="calendar-title" className="choice__legend">
            {t('settings.calendar')}
          </h2>
          <p className="choice__help">{t('settings.calendarHelp')}</p>
          <button
            type="button"
            className="button"
            onClick={() => {
              downloadFile(
                'kitzy-rappels.ics',
                buildIcs(data.reminders, { country: COUNTRY }),
                'text/calendar;charset=utf-8',
              );
              announce(t('settings.calendarDone'));
            }}
          >
            {t('settings.calendarDownload')}
          </button>
        </section>
      )}

      <section className="card" aria-labelledby="data-title">
        <h2 id="data-title" className="choice__legend">
          {t('settings.data')}
        </h2>
        <p className="choice__help">{t('settings.dataHelp')}</p>
        <div className="button-row">
          <button
            type="button"
            className="button"
            onClick={async () => {
              downloadFile(
                `kitzy-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`,
                await exportData(),
                'application/json',
              );
              announce(t('settings.exported'));
            }}
          >
            {t('settings.export')}
          </button>
          <button
            type="button"
            className="button button--ghost"
            aria-describedby="import-help"
            onClick={() => fileRef.current?.click()}
          >
            {t('settings.import')}
          </button>
        </div>
        <p id="import-help" className="choice__help">
          {t('settings.importHelp')}
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="visually-hidden"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => void onImport(e)}
        />
        {importError && (
          <p className="field__error" role="alert">
            {importError}
          </p>
        )}
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

      <section className="card" aria-labelledby="support-title">
        <h2 id="support-title" className="choice__legend">
          {t('settings.support')}
        </h2>
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

      <section className="card" aria-labelledby="language-title">
        <h2 id="language-title" className="choice__legend">
          {t('settings.language')}
        </h2>
        <p className="choice__help">{t('settings.languageSoon')}</p>
      </section>

      <section className="card" aria-labelledby="about-title">
        <h2 id="about-title" className="choice__legend">
          {t('settings.about')}
        </h2>
        <p className="choice__help">{t('settings.aboutText')}</p>
      </section>
    </div>
  );
}
