import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { protectBackup } from '@kitzy/core';
import { exportData } from '../data/store';
import { announce } from '../lib/announce';
import { canShareFile, downloadFile, shareFile } from '../lib/download';
import { CloseIcon } from './Icons';
import { CodeField, codeError } from './PlanLock';

const TYPE = 'application/json';

interface BackupFile {
  name: string;
  content: string;
}

/**
 * Où en est la sauvegarde :
 * - `form` : on choisit le code ;
 * - `ready` : le fichier est protégé mais le partage n'a pas pu s'ouvrir (annulé, ou geste trop
 *   ancien après le chiffrement) : un bouton « Envoyer » le rouvre ;
 * - `sent` / `downloaded` : c'est fait, on explique la suite.
 */
type Step =
  | { kind: 'form' }
  | { kind: 'ready'; file: BackupFile }
  | { kind: 'sent' }
  | { kind: 'downloaded'; name: string };

/**
 * Faire une sauvegarde, en une action : on choisit un code, puis « Protéger et envoyer » ouvre
 * la feuille de partage du téléphone avec le fichier (e-mail, Drive, iCloud…). Sans partage de
 * fichiers (la plupart des ordinateurs), le bouton devient « Protéger et télécharger » et le
 * tiroir explique où se trouve le fichier et quoi en faire.
 */
export function BackupDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDialogElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState<Step>({ kind: 'form' });
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ code?: string; confirm?: string }>({});
  const [busy, setBusy] = useState(false);
  // Détecté à l'ouverture : le texte du bouton dit ce qui va vraiment se passer.
  const [share, setShare] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setShare(canShareFile());
      dialog.showModal();
      // Le focus va sur la fenêtre : le lecteur d'écran annonce « Faire une sauvegarde, dialogue ».
      dialog.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Un clic sur le voile ferme aussi ; au clavier, c'est Échap.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClick = (e: MouseEvent) => {
      if (e.target === dialog) dialog.close();
    };
    dialog.addEventListener('click', onClick);
    return () => dialog.removeEventListener('click', onClick);
  }, []);

  // Chaque nouvelle étape prend le focus sur son titre : on entend ce qui vient de se passer.
  useLayoutEffect(() => {
    if (step.kind !== 'form') resultRef.current?.focus();
  }, [step.kind]);

  const send = async (file: BackupFile) => {
    const outcome = await shareFile(file.name, file.content, TYPE);
    if (outcome === 'shared') {
      setStep({ kind: 'sent' });
      announce(t('backup.sentTitle'));
    } else if (outcome === 'downloaded') {
      setStep({ kind: 'downloaded', name: file.name });
      announce(t('backup.downloadedTitle'));
    } else {
      setStep({ kind: 'ready', file });
    }
  };

  const download = (file: BackupFile) => {
    downloadFile(file.name, file.content, TYPE);
    setStep({ kind: 'downloaded', name: file.name });
    announce(t('backup.downloadedTitle'));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    const problems = codeError(code, confirm, t);
    setErrors(problems);
    if (problems.code || problems.confirm) return;
    setBusy(true);
    announce(t('backup.working'));
    const content = await protectBackup(await exportData(), code);
    setBusy(false);
    setCode('');
    setConfirm('');
    const date = new Date().toISOString().slice(0, 10);
    const file = { name: `kitzy-sauvegarde-${date}-protegee.json`, content };
    // Le partage s'ouvre dans la foulée du geste ; si le navigateur le juge trop ancien,
    // l'étape « prête » propose de toucher « Envoyer ».
    if (share) await send(file);
    else download(file);
  };

  const close = () => ref.current?.close();

  const reset = () => {
    setStep({ kind: 'form' });
    setCode('');
    setConfirm('');
    setErrors({});
    setBusy(false);
  };

  const keepCode = <p>{t('backup.keepCode')}</p>;
  const restoreHow = (
    <p className="choice__help">
      {t('backup.restoreHow', {
        settings: t('nav.backup'),
        data: t('settings.data'),
        choose: t('backup.choose'),
      })}
    </p>
  );
  const done = (
    <button type="button" className="button" onClick={close}>
      {t('backup.done')}
    </button>
  );

  return (
    <dialog
      ref={ref}
      className="drawer"
      aria-labelledby="backup-title"
      tabIndex={-1}
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <div className="drawer__inner">
        <div className="drawer__bar">
          <div className="drawer__head">
            <h2 id="backup-title" className="drawer__title">
              {t('backup.make')}
            </h2>
            <button
              type="button"
              className="icon-button"
              aria-label={t('drawer.close')}
              onClick={close}
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {step.kind === 'form' && (
          <form className="lock__form backup__form" onSubmit={submit} noValidate>
            <p>{t('backup.intro')}</p>
            <CodeField
              label={t('backup.code')}
              hint={t('backup.codeHint')}
              value={code}
              onChange={setCode}
              error={errors.code}
              autoComplete="new-password"
              revealable
            />
            <CodeField
              label={t('lock.codeConfirm')}
              value={confirm}
              onChange={setConfirm}
              error={errors.confirm}
              autoComplete="new-password"
              revealable
            />
            <div className="backup__action">
              <button
                type="submit"
                className="button"
                aria-disabled={busy || undefined}
                aria-describedby="backup-action-hint"
              >
                {busy
                  ? t('backup.working')
                  : t(share ? 'backup.protectShare' : 'backup.protectDownload')}
              </button>
              <p id="backup-action-hint" className="choice__help">
                {t(share ? 'backup.protectShareHint' : 'backup.protectDownloadHint')}
              </p>
            </div>
          </form>
        )}

        {step.kind === 'ready' && (
          <div className="backup__result">
            <h3 ref={resultRef} tabIndex={-1} className="backup__result-title">
              {t('backup.readyTitle')}
            </h3>
            <p>{t('backup.readyText')}</p>
            <div className="button-row">
              <button type="button" className="button" onClick={() => void send(step.file)}>
                {t('backup.send')}
              </button>
              <button
                type="button"
                className="button button--ghost"
                onClick={() => download(step.file)}
              >
                {t('backup.downloadInstead')}
              </button>
            </div>
          </div>
        )}

        {step.kind === 'sent' && (
          <div className="backup__result">
            <h3 ref={resultRef} tabIndex={-1} className="backup__result-title">
              {t('backup.sentTitle')}
            </h3>
            <p>{t('backup.sentText')}</p>
            {keepCode}
            {restoreHow}
            {done}
          </div>
        )}

        {step.kind === 'downloaded' && (
          <div className="backup__result">
            <h3 ref={resultRef} tabIndex={-1} className="backup__result-title">
              {t('backup.downloadedTitle')}
            </h3>
            <h4 className="backup__step">{t('backup.whereTitle')}</h4>
            <p>{t('backup.where', { name: step.name })}</p>
            <h4 className="backup__step">{t('backup.nextTitle')}</h4>
            <p>{t('backup.next')}</p>
            {keepCode}
            {restoreHow}
            {done}
          </div>
        )}
      </div>
    </dialog>
  );
}
