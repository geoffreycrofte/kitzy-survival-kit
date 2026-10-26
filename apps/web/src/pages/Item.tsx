import { Link, useLocation, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { tx } from '@kitzy/core';
import { useLocale } from '../lib/locale';
import { AddLotForm } from '../components/AddLotForm';
import { ItemDetails } from '../components/ItemDetails';
import { useKitRow } from '../data/kitRow';
import { usePageTitle } from '../lib/usePageTitle';
import { NotFound } from './NotFound';
import { Loading } from '../components/Loading';

export function Item() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { kitId, key } = useParams();
  const scanned = (useLocation().state as { scanned?: string } | null)?.scanned;
  const { data, kit, row } = useKitRow(kitId, key);
  usePageTitle(row?.name ?? t('kits.title'));

  if (!data) return <Loading />;
  if (!kit || !row) return <NotFound />;

  const { template } = row;
  const sourceLabel = template ? t(`item.${template.source}`) : t('item.custom');

  return (
    <div className="page item-page">
      <p className="breadcrumb">
        <Link to={`/kits/${kit.id}`}>{kit.name}</Link>
      </p>
      <h1 tabIndex={-1}>{row.name}</h1>
      {scanned && <p className="note">{t('scan.recognized', { code: scanned })}</p>}
      <p className="tag">{sourceLabel}</p>
      {template?.hint && <p className="lead">{tx(template.hint, locale)}</p>}
      {template?.safety && (
        <p className="note">
          <strong>{t('item.warning')}</strong> {tx(template.safety, locale)}
        </p>
      )}

      <AddLotForm row={row} kitId={kit.id} bag={kit.type !== 'home'} />

      <ItemDetails row={row} kitId={kit.id} today={data.today} />
    </div>
  );
}
