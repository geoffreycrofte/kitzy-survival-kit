import { useTranslation } from 'react-i18next';
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

export function Settings() {
  const { t } = useTranslation();
  const { themePref, motionPref } = usePreferences();
  usePageTitle(t('settings.title'));

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

      <section className="card" aria-labelledby="language-title">
        <h2 id="language-title" className="choice__legend">
          {t('settings.language')}
        </h2>
        <p className="choice__help">{t('settings.languageSoon')}</p>
      </section>
    </div>
  );
}
