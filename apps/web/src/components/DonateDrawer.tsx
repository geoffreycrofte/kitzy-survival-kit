import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DONATION_LINKS } from '@kitzy/core';
import { CloseIcon } from './Icons';

/** Faire un don : une phrase sur ce qu'il finance, puis PayPal ou Revolut (nouvelle fenêtre). */
export function DonateDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDialogElement>(null);

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

  return (
    <dialog
      ref={ref}
      className="drawer"
      aria-labelledby="donate-title"
      tabIndex={-1}
      onClose={onClose}
    >
      <div className="drawer__inner">
        <div className="drawer__bar">
          <div className="drawer__head">
            <h2 id="donate-title" className="drawer__title">
              {t('menu.donate')}
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
        <p>{t('menu.donateIntro')}</p>
        <div className="donate__options">
          <a
            className="button"
            href={DONATION_LINKS.paypal}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('settings.paypal')}
            <span className="visually-hidden"> {t('guide.newWindow')}</span>
          </a>
          <a
            className="button button--ghost"
            href={DONATION_LINKS.revolut}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('settings.revolut')}
            <span className="visually-hidden"> {t('guide.newWindow')}</span>
          </a>
        </div>
      </div>
    </dialog>
  );
}
