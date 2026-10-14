import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { cleanManualCode, getDetector } from '../lib/barcode';

type CameraState = 'starting' | 'scanning' | 'denied' | 'unavailable';

interface Props {
  open: boolean;
  onClose: () => void;
  onCode: (code: string) => void;
}

/**
 * Fenêtre de scan (dialog modale native : focus piégé, Échap pour fermer).
 * La saisie manuelle du code reste toujours possible, sans caméra.
 */
export function BarcodeScanner({ open, onClose, onCode }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      className="scanner"
      aria-labelledby="scanner-title"
      onClose={onClose}
      onCancel={onClose}
    >
      {open && <ScannerBody onClose={onClose} onCode={onCode} />}
    </dialog>
  );
}

function ScannerBody({ onClose, onCode }: Omit<Props, 'open'>) {
  const { t } = useTranslation();
  const video = useRef<HTMLVideoElement>(null);
  const [camera, setCamera] = useState<CameraState>('starting');
  const [manual, setManual] = useState('');
  const [error, setError] = useState('');
  const inputId = useId();
  const done = useRef(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer = 0;
    let stopped = false;

    const found = (code: string) => {
      if (done.current) return;
      done.current = true;
      navigator.vibrate?.(60);
      onCode(code);
    };

    (async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCamera('unavailable');
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
      } catch (e) {
        setCamera((e as DOMException).name === 'NotAllowedError' ? 'denied' : 'unavailable');
        return;
      }
      if (stopped || !video.current) return;
      video.current.srcObject = stream;
      await video.current.play().catch(() => undefined);
      setCamera('scanning');
      const detector = await getDetector().catch(() => null);
      if (!detector) {
        setCamera('unavailable');
        return;
      }
      const tick = async () => {
        if (stopped || done.current || !video.current) return;
        if (video.current.readyState >= 2) {
          const codes = await detector.detect(video.current).catch(() => []);
          const code = codes[0]?.rawValue;
          if (code) return found(code);
        }
        timer = window.setTimeout(() => void tick(), 250);
      };
      void tick();
    })();

    return () => {
      stopped = true;
      clearTimeout(timer);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [onCode]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const code = cleanManualCode(manual);
    if (!code) {
      setError(t('scan.manualError'));
      return;
    }
    onCode(code);
  };

  return (
    <div className="scanner__body">
      <h2 id="scanner-title" className="section-title">
        {t('scan.title')}
      </h2>
      <div className="scanner__viewport">
        {/* Flux de la caméra, purement visuel : l'état est donné en texte juste dessous. */}
        <video ref={video} className="scanner__video" muted playsInline aria-hidden="true" />
        <span className="scanner__frame" aria-hidden="true" />
      </div>
      <p role="status" className="scanner__status">
        {t(`scan.camera.${camera}`)}
      </p>

      <form className="form" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor={inputId} className="field__label">
            {t('scan.manual')}
          </label>
          <p id={`${inputId}-hint`} className="field__hint">
            {t('scan.manualHint')}
          </p>
          {error && (
            <p id={`${inputId}-error`} className="field__error">
              {error}
            </p>
          )}
          <input
            id={inputId}
            className="input"
            inputMode="numeric"
            autoComplete="off"
            value={manual}
            aria-invalid={error ? true : undefined}
            aria-describedby={`${inputId}-hint${error ? ` ${inputId}-error` : ''}`}
            onChange={(e) => setManual(e.target.value)}
          />
        </div>
        <div className="button-row">
          <button type="submit" className="button">
            {t('scan.manualSubmit')}
          </button>
          <button type="button" className="button button--ghost" onClick={onClose}>
            {t('scan.close')}
          </button>
        </div>
      </form>
    </div>
  );
}
