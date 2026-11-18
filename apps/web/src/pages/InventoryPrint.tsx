import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { kitRows, type Kit, type Lot } from '@kitzy/core';
import { useKitzy } from '../data/derived';
import { formatDate, formatQuantity, formatShortDate } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';
import { Loading } from '../components/Loading';

/** Lignes vides en bas de chaque feuille, pour ce qu'on range en plus, au stylo. */
const BLANK_LINES = 3;

interface Line {
  key: string;
  name: string;
  quantity: string;
  lot: Lot;
}

/**
 * L'inventaire sur papier : une feuille A4 par emplacement (maison, chaque sac), avec ce
 * qu'on a vraiment, lot par lot, et sa date. Sans électricité, on barre ce qu'on utilise.
 * `?kit=<id>` n'imprime qu'un emplacement.
 */
export function InventoryPrint() {
  const { t } = useTranslation();
  usePageTitle(t('inventoryPrint.title'));
  const data = useKitzy();
  const [params] = useSearchParams();
  const only = params.get('kit');
  const [chosen, setChosen] = useState<Set<string> | null>(only ? new Set([only]) : null);

  if (!data) return <Loading />;

  const sheets = data.kits.map((kit) => {
    // Par rubrique, comme dans l'app (kitRows trie déjà).
    const lines: Line[] = kitRows(kit, data.ctx).flatMap((row) =>
      (row.item?.lots ?? [])
        .filter((lot) => lot.quantity > 0)
        // Ce qui périme en premier d'abord, les lots sans date à la fin.
        .sort((a, b) => (a.expiry ?? '9999').localeCompare(b.expiry ?? '9999'))
        .map((lot) => ({
          key: `${row.key}-${lot.id}`,
          name: row.name,
          quantity: formatQuantity(lot.quantity, row.unit),
          lot,
        })),
    );
    return { kit, lines };
  });
  const filled = sheets.filter((s) => s.lines.length > 0);
  const selected = chosen ?? new Set(filled.map((s) => s.kit.id));
  const printed = filled.filter((s) => selected.has(s.kit.id));

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChosen(next);
  };

  return (
    <div className="page inventory-print">
      <div className="no-print plan-print__tools">
        <p className="breadcrumb">
          <Link to="/kits">{t('kits.title')}</Link>
        </p>
        <h1 tabIndex={-1}>{t('inventoryPrint.title')}</h1>
        <p className="lead">{t('inventoryPrint.intro')}</p>
        {filled.length === 0 ? (
          <p className="card">{t('inventoryPrint.empty')}</p>
        ) : (
          <>
            {filled.length > 1 && (
              <fieldset className="choice">
                <legend className="choice__legend">{t('inventoryPrint.choose')}</legend>
                {filled.map(({ kit, lines }) => (
                  <div key={kit.id} className="switch-row">
                    <input
                      id={`print-${kit.id}`}
                      type="checkbox"
                      className="checkbox"
                      checked={selected.has(kit.id)}
                      onChange={() => toggle(kit.id)}
                    />
                    <label htmlFor={`print-${kit.id}`}>
                      {kit.name}{' '}
                      <span className="muted">
                        {t('inventoryPrint.lines', { count: lines.length })}
                      </span>
                    </label>
                  </div>
                ))}
              </fieldset>
            )}
            <button
              type="button"
              className="button"
              aria-disabled={printed.length === 0 || undefined}
              onClick={() => printed.length > 0 && window.print()}
            >
              {t('inventoryPrint.button')}
            </button>
            {printed.length === 0 && <p className="note">{t('inventoryPrint.noneChosen')}</p>}
          </>
        )}
      </div>

      {printed.map(({ kit, lines }) => (
        <Sheet key={kit.id} kit={kit} lines={lines} today={data.today} />
      ))}
    </div>
  );
}

function Sheet({ kit, lines, today }: { kit: Kit; lines: Line[]; today: string }) {
  const { t } = useTranslation();
  const titleId = `sheet-${kit.id}`;
  const date = (lot: Lot) =>
    lot.expiry
      ? t(lot.expiryType === 'dlc' ? 'inventoryPrint.dlc' : 'inventoryPrint.ddm', {
          date: formatShortDate(lot.expiry),
        })
      : t('inventoryPrint.noDate');
  return (
    <article className="doc inventory-sheet" aria-labelledby={titleId}>
      <header className="inventory-sheet__head">
        <p className="doc__brand">Kitzy</p>
        <h2 id={titleId} className="doc__title">
          {t('inventoryPrint.sheetTitle', { kit: kit.name })}
        </h2>
        <p className="inventory-sheet__meta">
          {t('inventoryPrint.printed', { date: formatDate(today) })} {t('inventoryPrint.hint')}
        </p>
      </header>
      <table className="inventory-table">
        <thead>
          <tr>
            <th scope="col" className="inventory-table__used">
              <span aria-hidden="true">✓</span>
              <span className="visually-hidden">{t('inventoryPrint.colUsed')}</span>
            </th>
            <th scope="col">{t('inventoryPrint.colProduct')}</th>
            <th scope="col">{t('inventoryPrint.colQuantity')}</th>
            <th scope="col">{t('inventoryPrint.colDate')}</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.key}>
              <td className="inventory-table__used">
                <span className="inventory-table__box" aria-hidden="true" />
              </td>
              <td>{line.name}</td>
              <td className="inventory-table__qty">{line.quantity}</td>
              <td>{date(line.lot)}</td>
            </tr>
          ))}
          {Array.from({ length: BLANK_LINES }, (_, i) => (
            <tr key={`blank-${i}`} className="inventory-table__blank" aria-hidden="true">
              <td className="inventory-table__used">
                <span className="inventory-table__box" />
              </td>
              <td />
              <td />
              <td />
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
