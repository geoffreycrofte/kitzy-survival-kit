import { useTranslation } from 'react-i18next';
import type { ItemStatus, Unit } from '@kitzy/core';
import { formatQuantity } from '../lib/format';

/** États d'un article : texte + forme, jamais la couleur seule. */
export function StatusChips({ status, unit }: { status: ItemStatus; unit: Unit }) {
  const { t } = useTranslation();
  const chips: { key: string; tone: 'ok' | 'warn' | 'alert' | 'neutral'; label: string }[] = [];

  if (status.state === 'complete')
    chips.push({ key: 's', tone: 'ok', label: t('status.complete') });
  else if (status.state === 'partial')
    chips.push({ key: 's', tone: 'neutral', label: t('status.partial') });
  else chips.push({ key: 's', tone: 'neutral', label: t('status.missing') });

  if (status.expiredQuantity > 0) {
    chips.push({
      key: 'e',
      tone: 'alert',
      label: t('status.expired', {
        count: status.expiredQuantity,
        quantity: formatQuantity(status.expiredQuantity, unit),
      }),
    });
  }
  if (status.soonQuantity > 0) chips.push({ key: 'o', tone: 'warn', label: t('status.soon') });
  if (status.battery?.state === 'due')
    chips.push({ key: 'b', tone: 'alert', label: t('status.batteryDue') });
  else if (status.battery?.state === 'soon')
    chips.push({ key: 'b', tone: 'warn', label: t('status.batterySoon') });

  return (
    <ul className="chips">
      {chips.map((c) => (
        <li key={c.key} className={`chip chip--${c.tone}`}>
          <ChipIcon tone={c.tone} />
          {c.label}
        </li>
      ))}
    </ul>
  );
}

function ChipIcon({ tone }: { tone: 'ok' | 'warn' | 'alert' | 'neutral' }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
  };
  if (tone === 'ok')
    return (
      <svg {...common}>
        <path d="m5 12 5 5 9-10" />
      </svg>
    );
  if (tone === 'warn')
    return (
      <svg {...common} strokeWidth={2.5}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  if (tone === 'alert')
    return (
      <svg {...common}>
        <path d="M12 6v8M12 18v.5" />
      </svg>
    );
  return (
    <svg {...common} strokeWidth={2.5}>
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}
