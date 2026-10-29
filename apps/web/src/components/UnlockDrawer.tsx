import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseIcon } from './Icons';
import { PlanUnlock } from './PlanLock';

/**
 * Ouvrir le plan sans quitter ce qu'on était en train de faire (sauvegarder, restaurer) :
 * un tiroir demande l'empreinte tout de suite, ou le code. Une fois ouvert, soit l'action
 * continue (`onUnlocked`), soit le tiroir propose la suite (`next`), quand elle demande
 * un nouveau geste (choisir un fichier, par exemple).
 */
export function UnlockDrawer({
  open,
  intro,
  next,
  onUnlocked,
  onClose,
}: {
  open: boolean;
  intro: string;
  /** Ce que propose le tiroir une fois le plan ouvert ; sans, il se ferme et `onUnlocked` suit. */
  next?: ReactNode;
  onUnlocked?: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDialogElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
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

  // Plan ouvert : le focus va sur la suite proposée.
  useLayoutEffect(() => {
    if (unlocked) nextRef.current?.querySelector<HTMLElement>('p, button')?.focus();
  }, [unlocked]);

  const done = () => {
    if (next) setUnlocked(true);
    else {
      ref.current?.close();
      onUnlocked?.();
    }
  };

  return (
    <dialog
      ref={ref}
      className="drawer"
      aria-labelledby="unlock-title"
      tabIndex={-1}
      onClose={() => {
        setUnlocked(false);
        onClose();
      }}
    >
      {open && (
        <div className="drawer__inner">
          <div className="drawer__bar">
            <div className="drawer__head">
              <h2 id="unlock-title" className="drawer__title">
                {t('backup.unlockTitle')}
              </h2>
              <button
                type="button"
                className="icon-button"
                aria-label={t('drawer.close')}
                onClick={() => ref.current?.close()}
              >
                <CloseIcon />
              </button>
            </div>
          </div>
          {unlocked ? (
            <div ref={nextRef} className="backup__result">
              {next}
            </div>
          ) : (
            <>
              <p>{intro}</p>
              <PlanUnlock bare autoPasskey onUnlocked={done} />
            </>
          )}
        </div>
      )}
    </dialog>
  );
}
