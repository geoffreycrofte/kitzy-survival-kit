import { useEffect, useId, useState, type FormEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CODE_MIN_LENGTH } from '@kitzy/core';
import { useKitzy } from '../data/derived';
import {
  addPlanPasskey,
  disablePlanLock,
  enablePlanLock,
  removePlanPasskey,
  unlockPlanWithCode,
  unlockPlanWithPasskey,
} from '../data/store';
import { announce } from '../lib/announce';
import { passkeySupported } from '../lib/passkey';
import { lockPlan } from '../lib/planKey';
import { EyeIcon, EyeOffIcon } from './Icons';
import { Loading } from './Loading';

/** Champ de code : masqué, étiquette visible, aide et erreur liées (RAWeb 11.1, 11.2, 11.10). */
export function CodeField({
  label,
  value,
  onChange,
  hint,
  error,
  autoComplete = 'off',
  revealable = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  autoComplete?: string;
  /** Un bouton « Afficher » laisse relire ce qu'on a tapé. */
  revealable?: boolean;
}) {
  const { t } = useTranslation();
  const id = useId();
  const [shown, setShown] = useState(false);
  const described = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ');
  const input = (
    <input
      id={id}
      className="input"
      type={shown ? 'text' : 'password'}
      value={value}
      maxLength={200}
      autoComplete={autoComplete}
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
      aria-invalid={error ? true : undefined}
      aria-describedby={described || undefined}
      onChange={(e) => onChange(e.target.value)}
    />
  );
  return (
    <div className="field">
      <label id={`${id}-label`} htmlFor={id} className="field__label">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      {revealable ? (
        <div className="code-field">
          {input}
          {/* Nom : « Afficher » suivi du nom du champ ; l'état est porté par aria-pressed. */}
          <button
            type="button"
            id={`${id}-show`}
            className="code-field__show"
            aria-pressed={shown}
            aria-labelledby={`${id}-show ${id}-label`}
            onClick={() => setShown((s) => !s)}
          >
            {shown ? <EyeOffIcon /> : <EyeIcon />}
            <span>{t('backup.show')}</span>
          </button>
        </div>
      ) : (
        input
      )}
      {error && (
        <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
}

/** Vérifie un nouveau code et sa confirmation ; renvoie le message d'erreur, ou rien. */
export function codeError(
  code: string,
  confirm: string,
  t: (key: string) => string,
): { code?: string; confirm?: string } {
  if (code.length < CODE_MIN_LENGTH) return { code: t('lock.codeTooShort') };
  if (code !== confirm) return { confirm: t('lock.codeMismatch') };
  return {};
}

/** Pages qui lisent ou modifient le plan : on attend qu'il soit ouvert. */
export function PlanGate({ children }: { children: ReactNode }) {
  const data = useKitzy();
  if (!data || data.planState === 'opening') return <Loading />;
  if (data.planState === 'locked') return <PlanUnlock />;
  return children;
}

/** Ouvrir le plan : empreinte (si ajoutée), sinon le code Kitzy. */
export function PlanUnlock({ heading = 'h1' }: { heading?: 'h1' | 'h3' }) {
  const { t } = useTranslation();
  const data = useKitzy();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const Heading = heading;
  const titleId = useId();
  const hasPasskey = Boolean(data?.planLock?.passkey);

  const withPasskey = async () => {
    setBusy(true);
    const ok = await unlockPlanWithPasskey().catch(() => false);
    setBusy(false);
    if (ok) announce(t('lock.unlocked'));
    else setError(t('lock.passkeyFailed'));
  };

  const withCode = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const ok = await unlockPlanWithCode(code);
    setBusy(false);
    if (ok) {
      setCode('');
      announce(t('lock.unlocked'));
    } else setError(t('lock.wrongCode'));
  };

  return (
    <div className={heading === 'h1' ? 'page' : undefined}>
      <section className="card lock" aria-labelledby={titleId}>
        <Heading id={titleId} tabIndex={heading === 'h1' ? -1 : undefined}>
          {t('lock.lockedTitle')}
        </Heading>
        <p>{t('lock.lockedText')}</p>
        {hasPasskey && (
          <button type="button" className="button" disabled={busy} onClick={withPasskey}>
            {t('lock.unlockPasskey')}
          </button>
        )}
        <form className="lock__form" onSubmit={withCode}>
          <CodeField
            label={t('lock.code')}
            value={code}
            onChange={(value) => {
              setCode(value);
              setError('');
            }}
            error={error}
            autoComplete="current-password"
          />
          <button
            type="submit"
            className={hasPasskey ? 'button button--ghost' : 'button'}
            disabled={busy || code.length === 0}
          >
            {t('lock.unlockCode')}
          </button>
        </form>
      </section>
    </div>
  );
}

/** Carte des réglages : activer, compléter ou retirer la protection du plan. */
export function PlanProtection() {
  const { t } = useTranslation();
  const data = useKitzy();
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ code?: string; confirm?: string }>({});
  const [canPasskey, setCanPasskey] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void passkeySupported().then(setCanPasskey);
  }, []);

  if (!data) return null;
  const lock = data.planLock;

  const enable = async (event: FormEvent) => {
    event.preventDefault();
    const problems = codeError(code, confirm, t);
    setErrors(problems);
    if (problems.code || problems.confirm) return;
    setBusy(true);
    await enablePlanLock(code);
    setBusy(false);
    setCode('');
    setConfirm('');
    announce(t('lock.enabled'));
  };

  const addPasskey = async () => {
    setBusy(true);
    setMessage('');
    const ok = await addPlanPasskey(t('lock.passkeyName')).catch(() => false);
    setBusy(false);
    if (ok) announce(t('lock.passkeyAdded'));
    else setMessage(t('lock.passkeyUnsupported'));
  };

  return (
    <section className="card" aria-labelledby="lock-settings-title">
      <h3 id="lock-settings-title" className="choice__legend">
        {t('lock.title')}
      </h3>
      <p className="choice__help">{t('lock.intro')}</p>

      {!lock && (
        <form className="lock__form" onSubmit={enable} noValidate>
          <p>{t('lock.offState')}</p>
          <CodeField
            label={t('lock.code')}
            hint={t('lock.codeHint')}
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
          <button type="submit" className="button" disabled={busy}>
            {t('lock.enable')}
          </button>
        </form>
      )}

      {lock && data.planState === 'locked' && <PlanUnlock heading="h3" />}

      {lock && data.planState === 'open' && (
        <>
          <p>
            <strong>{t('lock.onState')}</strong>{' '}
            {t(lock.passkey ? 'lock.passkeyOn' : 'lock.passkeyOff')}
          </p>
          {!lock.passkey && canPasskey && (
            <>
              <p className="choice__help">{t('lock.passkeyHint')}</p>
              <button type="button" className="button" disabled={busy} onClick={addPasskey}>
                {t('lock.passkey')}
              </button>
            </>
          )}
          {message && <p className="note">{message}</p>}
          <div className="button-row">
            <button
              type="button"
              className="button button--ghost"
              onClick={() => {
                lockPlan();
                announce(t('lock.lockedNow'));
              }}
            >
              {t('lock.lockNow')}
            </button>
            {lock.passkey && (
              <button
                type="button"
                className="button button--ghost"
                onClick={async () => {
                  await removePlanPasskey();
                  announce(t('lock.passkeyRemoved'));
                }}
              >
                {t('lock.passkeyRemove')}
              </button>
            )}
            <button
              type="button"
              className="button button--ghost"
              onClick={async () => {
                if (!window.confirm(t('lock.disableConfirm'))) return;
                await disablePlanLock();
                announce(t('lock.disabled'));
              }}
            >
              {t('lock.disable')}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
