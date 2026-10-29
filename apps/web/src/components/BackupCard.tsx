import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { MAX_BACKUP_BYTES, isProtectedBackup, parseBackup, unprotectBackup } from '@kitzy/core';
import { useKitzy } from '../data/derived';
import { importData } from '../data/store';
import { announce } from '../lib/announce';
import { BackupDrawer } from './BackupDrawer';
import { CodeField } from './PlanLock';
import { UnlockDrawer } from './UnlockDrawer';

/** Sauvegarde (dans un tiroir, voir BackupDrawer) et restauration. */
export function BackupCard() {
  const { t } = useTranslation();
  const data = useKitzy();
  const fileRef = useRef<HTMLInputElement>(null);
  const [making, setMaking] = useState(false);
  // Plan verrouillé : les boutons restent les mêmes ; le tiroir d'ouverture vient sous le doigt.
  const [unlockFor, setUnlockFor] = useState<'backup' | 'restore' | null>(null);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [importCode, setImportCode] = useState('');
  const [importError, setImportError] = useState('');

  if (!data) return null;
  const locked = data.planState === 'locked';

  const restore = async (text: string) => {
    const result = parseBackup(text);
    if (!result.ok) {
      setImportError(t(`system.errors.backup.${result.code}`));
      return;
    }
    if (!window.confirm(t('settings.importConfirm'))) return;
    await importData(result.data);
    setPending(null);
    setImportCode('');
    announce(t('settings.imported'));
  };

  const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    setImportError('');
    setPending(null);
    if (!file) return;
    if (file.size > MAX_BACKUP_BYTES) {
      setImportError(t('system.errors.backup.unreadable'));
      return;
    }
    const text = await file.text();
    if (isProtectedBackup(text)) setPending(text);
    else await restore(text);
  };

  const openProtected = async (event: FormEvent) => {
    event.preventDefault();
    if (!pending) return;
    setBusy(true);
    const text = await unprotectBackup(pending, importCode);
    setBusy(false);
    if (text === null) setImportError(t('backup.wrongCode'));
    else await restore(text);
  };

  return (
    <section className="card" aria-labelledby="data-title">
      <h3 id="data-title" className="choice__legend">
        {t('settings.data')}
      </h3>
      <p className="choice__help">{t('settings.dataHelp')}</p>

      <button
        type="button"
        className="button"
        onClick={() => (locked ? setUnlockFor('backup') : setMaking(true))}
      >
        {t('backup.make')}
      </button>
      <BackupDrawer open={making} onClose={() => setMaking(false)} />
      <UnlockDrawer
        open={unlockFor !== null}
        intro={t(unlockFor === 'restore' ? 'backup.unlockForRestore' : 'backup.unlockForBackup')}
        next={
          unlockFor === 'restore' ? (
            <>
              <p tabIndex={-1}>{t('backup.unlockedRestore')}</p>
              <button
                type="button"
                className="button"
                onClick={() => {
                  // Un nouveau geste : le sélecteur de fichiers l'exige.
                  fileRef.current?.click();
                  setUnlockFor(null);
                }}
              >
                {t('backup.choose')}
              </button>
            </>
          ) : undefined
        }
        onUnlocked={() => setMaking(true)}
        onClose={() => setUnlockFor(null)}
      />

      <h4 className="backup__restore">{t('settings.import')}</h4>
      <p id="import-help" className="choice__help">
        {t('settings.importHelp')}
      </p>
      <button
        type="button"
        className="button button--ghost"
        aria-describedby="import-help"
        onClick={() => (locked ? setUnlockFor('restore') : fileRef.current?.click())}
      >
        {t('backup.choose')}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="visually-hidden"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => void onFile(e)}
      />
      {pending && (
        <form className="lock__form" onSubmit={openProtected}>
          <p>{t('backup.protectedFile')}</p>
          <CodeField
            label={t('backup.importCode')}
            value={importCode}
            onChange={(value) => {
              setImportCode(value);
              setImportError('');
            }}
            error={importError}
          />
          <button type="submit" className="button" disabled={busy || importCode.length === 0}>
            {t('backup.open')}
          </button>
        </form>
      )}
      {!pending && importError && (
        <p className="field__error" role="alert">
          {importError}
        </p>
      )}
    </section>
  );
}
