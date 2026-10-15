import { useTranslation } from 'react-i18next';
import { announce } from '../lib/announce';
import { promptInstall, useInstallState } from '../lib/install';

/** « Installer Kitzy » : dit clairement si l'app est déjà là, et comment l'installer sinon. */
export function InstallSettings() {
  const { t } = useTranslation();
  const state = useInstallState();

  return (
    <section className="card" aria-labelledby="install-title">
      <h2 id="install-title" className="choice__legend">
        {t('install.title')}
      </h2>
      <p className="choice__help">{t(`install.state.${state}`)}</p>
      {state === 'available' && (
        <button
          type="button"
          className="button"
          onClick={async () => {
            const accepted = await promptInstall();
            announce(t(accepted ? 'install.accepted' : 'install.dismissed'));
          }}
        >
          {t('install.button')}
        </button>
      )}
    </section>
  );
}
