import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { decodeShare } from '@kitzy/core';
import { addExtras } from '../data/store';
import { announce } from '../lib/announce';
import { formatQuantity } from '../lib/format';
import { usePageTitle } from '../lib/usePageTitle';

export function SharedList() {
  const { t } = useTranslation();
  usePageTitle(t('sharePage.title'));
  const { hash } = useLocation();
  const navigate = useNavigate();
  const result = useMemo(() => decodeShare(hash), [hash]);

  return (
    <div className="page">
      <h1 tabIndex={-1}>{t('sharePage.title')}</h1>
      {!result.ok ? (
        <div className="card">
          <p>
            <strong>{t('sharePage.error')}</strong> {result.error}
          </p>
        </div>
      ) : (
        <>
          <p className="lead">{t('sharePage.intro', { count: result.data.items.length })}</p>
          <ul className="row-list">
            {result.data.items.map((item, i) => (
              <li key={i} className="row">
                {item.quantity !== undefined
                  ? t('shopping.item', {
                      label: item.label,
                      quantity: formatQuantity(item.quantity, item.unit),
                    })
                  : item.label}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="button"
            onClick={async () => {
              await addExtras(result.data.items);
              announce(t('sharePage.imported'));
              navigate('/courses');
            }}
          >
            {t('sharePage.import')}
          </button>
        </>
      )}
    </div>
  );
}
