import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Reminder } from '@kitzy/core';
import { announce } from '../lib/announce';
import {
  currentNotifyState,
  disableNotifications,
  enableNotifications,
  notifySupport,
  sendTestNotification,
  type EnableResult,
} from '../lib/notifications';
import { getNotifySettings } from '../data/load';
import { subscribePush, unsubscribePush, webPushConfigured } from '../lib/webpush';

/** `push` : abonné au service de rappel, prévenu même app fermée (iPhone compris). */
type State = EnableResult | 'push' | 'off' | 'loading';

/** Réglage « Me prévenir sur cet appareil », avec une explication honnête de ce qui marchera. */
export function NotificationSettings({ reminders }: { reminders: Reminder[] }) {
  const { t } = useTranslation();
  const [state, setState] = useState<State>('loading');
  const [busy, setBusy] = useState(false);
  const support = notifySupport();

  useEffect(() => {
    let alive = true;
    void (async () => {
      const s = await currentNotifyState();
      const push =
        webPushConfigured &&
        (s === 'background' || s === 'open-only') &&
        (await getNotifySettings()).push;
      if (alive) setState(push ? 'push' : s);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const enabled = state === 'background' || state === 'open-only' || state === 'push';

  const toggle = async () => {
    // Pas de `disabled` pendant l'opération : le focus clavier resterait perdu.
    if (busy) return;
    setBusy(true);
    try {
      if (enabled) {
        // La case change tout de suite ; l'appareil suit.
        setState('off');
        await disableNotifications();
        if (webPushConfigured) await unsubscribePush();
        announce(t('notify.disabled'));
      } else {
        setState('open-only');
        const result = await enableNotifications();
        const pushed =
          webPushConfigured &&
          (result === 'background' || result === 'open-only') &&
          (await subscribePush(reminders).catch(() => false));
        const next = pushed ? 'push' : result;
        setState(next);
        announce(t(`notify.state.${next}`));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card" aria-labelledby="notify-title">
      <h3 id="notify-title" className="choice__legend">
        {t('notify.title')}
      </h3>
      {state === 'unsupported' || (support.ios && !support.installed) ? (
        <p className="choice__help">
          {t(
            support.ios
              ? webPushConfigured
                ? 'notify.iosPush'
                : 'notify.ios'
              : 'notify.unsupported',
          )}
        </p>
      ) : (
        <>
          <p className="choice__help">{t(webPushConfigured ? 'notify.helpPush' : 'notify.help')}</p>
          <div className="switch-row">
            <input
              id="notify-toggle"
              type="checkbox"
              className="checkbox"
              checked={enabled}
              disabled={state === 'loading' || state === 'denied'}
              aria-describedby={state !== 'loading' && state !== 'off' ? 'notify-state' : undefined}
              onChange={() => void toggle()}
            />
            <label htmlFor="notify-toggle">{t('notify.toggle')}</label>
          </div>
          {state !== 'loading' && state !== 'off' && (
            <p id="notify-state" className="note">
              {t(`notify.state.${state}`)}
            </p>
          )}
          {enabled && (
            <button
              type="button"
              className="button button--ghost"
              onClick={async () => {
                const ok = await sendTestNotification(t('notify.testBody'));
                announce(t(ok ? 'notify.testSent' : 'notify.testFailed'));
              }}
            >
              {t('notify.test')}
            </button>
          )}
        </>
      )}
    </section>
  );
}
