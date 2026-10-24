import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MAX_BACKUP_BYTES,
  isProtectedBackup,
  parseBackup,
  protectBackup,
  unprotectBackup,
} from '@kitzy/core';
import { useKitzy } from '../data/derived';
import { exportData, importData } from '../data/store';
import { announce } from '../lib/announce';
import { canShareFile, downloadFile, shareFile } from '../lib/download';
import { CodeField, codeError } from './PlanLock';

interface Ready {
  name: string;
  content: string;
}

/**
 * Sauvegarde et restauration. La sauvegarde est préparée d'abord (le chiffrement prend
 * un instant), puis enregistrée : la feuille de partage du téléphone exige un geste récent.
 */
export function BackupCard() {
  const { t } = useTranslation();
  const data = useKitzy();
  const fileRef = useRef<HTMLInputElement>(null);
  const [protect, setProtect] = useState(true);
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ code?: string; confirm?: string }>({});
  const [ready, setReady] = useState<Ready | null>(null);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [importCode, setImportCode] = useState('');
  const [importError, setImportError] = useState('');

  if (!data) return null;
  const locked = data.planState === 'locked';

  const prepare = async (event: FormEvent) => {
    event.preventDefault();
    if (protect) {
      const problems = codeError(code, confirm, t);
      setErrors(problems);
      if (problems.code || problems.confirm) return;
    }
    setBusy(true);
    const text = await exportData();
    const content = protect ? await protectBackup(text, code) : text;
    setBusy(false);
    const date = new Date().toISOString().slice(0, 10);
    setReady({
      name: `kitzy-sauvegarde-${date}${protect ? '-protegee' : ''}.json`,
      content,
    });
    setCode('');
    setConfirm('');
    announce(t('backup.ready'));
  };

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

      {locked ? (
        <p className="note">{t('backup.needsUnlock')}</p>
      ) : ready ? (
        <div className="backup__ready">
          <p>
            <strong>{t('backup.ready')}</strong>{' '}
            {t(
              ready.name.endsWith('-protegee.json') ? 'backup.readyProtected' : 'backup.readyPlain',
            )}
          </p>
          {canShareFile() && <p className="choice__help">{t('backup.saveToHint')}</p>}
          <div className="button-row">
            {canShareFile() && (
              <button
                type="button"
                className="button"
                onClick={async () => {
                  if (await shareFile(ready.name, ready.content, 'application/json')) {
                    announce(t('settings.exported'));
                  }
                }}
              >
                {t('backup.saveTo')}
              </button>
            )}
            <button
              type="button"
              className={canShareFile() ? 'button button--ghost' : 'button'}
              onClick={() => {
                downloadFile(ready.name, ready.content, 'application/json');
                announce(t('settings.exported'));
              }}
            >
              {t('backup.download')}
            </button>
            <button type="button" className="button button--ghost" onClick={() => setReady(null)}>
              {t('backup.done')}
            </button>
          </div>
        </div>
      ) : (
        <form className="lock__form" onSubmit={prepare} noValidate>
          <div className="switch-row">
            <input
              id="backup-protect"
              type="checkbox"
              className="checkbox"
              checked={protect}
              onChange={(e) => {
                setProtect(e.target.checked);
                setErrors({});
              }}
              aria-describedby="backup-protect-help"
            />
            <label htmlFor="backup-protect">{t('backup.protect')}</label>
          </div>
          <p id="backup-protect-help" className="choice__help">
            {t(protect ? 'backup.protectHelp' : 'backup.plainHelp')}
          </p>
          {protect && (
            <>
              <CodeField
                label={t('backup.code')}
                hint={t('backup.codeHint')}
                value={code}
                onChange={setCode}
                error={errors.code}
                autoComplete="new-password"
              />
              <CodeField
                label={t('lock.codeConfirm')}
                value={confirm}
                onChange={setConfirm}
                error={errors.confirm}
                autoComplete="new-password"
              />
            </>
          )}
          <button type="submit" className="button" disabled={busy}>
            {t('backup.prepare')}
          </button>
        </form>
      )}

      <h4 className="backup__restore">{t('settings.import')}</h4>
      <p id="import-help" className="choice__help">
        {t('settings.importHelp')}
      </p>
      {locked ? (
        <p className="note">{t('backup.importNeedsUnlock')}</p>
      ) : (
        <button
          type="button"
          className="button button--ghost"
          aria-describedby="import-help"
          onClick={() => fileRef.current?.click()}
        >
          {t('backup.choose')}
        </button>
      )}
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
