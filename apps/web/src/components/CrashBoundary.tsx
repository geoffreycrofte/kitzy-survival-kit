import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { exportData, resetAll } from '../data/store';
import { mascotImage } from '../lib/assets';
import { downloadFile } from '../lib/download';

/**
 * Filet de sécurité : si des données abîmées (une sauvegarde modifiée, par exemple)
 * font planter l'affichage, on garde toujours un moyen de les sauver et de repartir.
 */
export class CrashBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    return this.state.failed ? <CrashScreen /> : this.props.children;
  }
}

function CrashScreen() {
  const { t } = useTranslation();
  return (
    <main id="main" className="app__main page">
      <div className="card soon" role="alert">
        <img className="soon__hog" {...mascotImage('curieux')} alt="" />
        <h1>{t('app.crashTitle')}</h1>
        <p>{t('app.crashText')}</p>
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
            }}
          >
            {t('settings.export')}
          </button>
          <button
            type="button"
            className="button button--ghost"
            onClick={async () => {
              if (!window.confirm(t('settings.resetConfirm'))) return;
              await resetAll({ evenIfLocked: true });
              location.reload();
            }}
          >
            {t('app.crashReset')}
          </button>
          <button type="button" className="button button--ghost" onClick={() => location.reload()}>
            {t('app.stuckReload')}
          </button>
        </div>
      </div>
    </main>
  );
}
