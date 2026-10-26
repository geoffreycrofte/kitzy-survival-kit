import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Link, type LinkProps } from 'react-router';
import { useTranslation } from 'react-i18next';
import { tx } from '@kitzy/core';
import { useKitRow } from '../data/kitRow';
import { useLocale } from '../lib/locale';
import { AddLotForm } from './AddLotForm';
import { BuyingAdvice } from './BuyingAdvice';
import { CloseIcon } from './Icons';

interface Target {
  kitId: string;
  key: string;
  quantity?: number;
  /** Change à chaque ouverture : le formulaire repart de zéro. */
  n: number;
}

type OpenItem = (kitId: string, key: string, quantity?: number) => void;

const DrawerContext = createContext<OpenItem | null>(null);

/**
 * Le tiroir d'ajout : depuis la liste d'un kit ou les courses, on range un lot
 * sans quitter la liste. La page complète de l'article reste à un lien.
 */
export function ItemDrawerProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<Target | null>(null);
  const count = useRef(0);
  const open = useCallback<OpenItem>((kitId, key, quantity) => {
    count.current += 1;
    setTarget({ kitId, key, quantity, n: count.current });
  }, []);
  return (
    <DrawerContext.Provider value={open}>
      {children}
      <ItemDrawer target={target} onClose={() => setTarget(null)} />
    </DrawerContext.Provider>
  );
}

/**
 * Un lien vers la page d'un article qui, d'un simple clic, ouvre le tiroir.
 * Ctrl/Cmd-clic, clic milieu ou « ouvrir dans un nouvel onglet » mènent toujours à la page.
 */
export function ItemLink({
  kitId,
  itemKey,
  quantity,
  ...props
}: Omit<LinkProps, 'to'> & { kitId: string; itemKey: string; quantity?: number }) {
  const open = useContext(DrawerContext);
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    props.onClick?.(e);
    if (!open || e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    open(kitId, itemKey, quantity);
  };
  return <Link {...props} to={`/kits/${kitId}/${itemKey}`} onClick={onClick} />;
}

function ItemDrawer({ target, onClose }: { target: Target | null; onClose: () => void }) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const ref = useRef<HTMLDialogElement>(null);
  const { kit, row } = useKitRow(target?.kitId, target?.key);
  const shown = Boolean(target && kit && row);
  // « Voir plus » sur les suggestions : le tiroir passe en plein écran, la croix le ferme.
  const [full, setFull] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (shown && !dialog.open) {
      dialog.showModal();
      // On arrive sur la quantité : c'est la seule chose à faire ici.
      dialog.querySelector<HTMLInputElement>('input')?.focus();
    }
    if (!shown && dialog.open) dialog.close();
  }, [shown]);

  const close = () => ref.current?.close();

  // Un clic sur le voile (hors du panneau) ferme aussi ; au clavier, c'est Échap.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClick = (e: globalThis.MouseEvent) => {
      if (e.target === dialog) dialog.close();
    };
    dialog.addEventListener('click', onClick);
    return () => dialog.removeEventListener('click', onClick);
  }, []);
  const formKey = useMemo(
    () => (target ? `${target.kitId}/${target.key}/${target.n}` : ''),
    [target],
  );

  return (
    <dialog
      ref={ref}
      className={`drawer${row?.template ? ' drawer--shop' : ''}${full ? ' drawer--full' : ''}`}
      aria-labelledby="drawer-title"
      onClose={() => {
        setFull(false);
        onClose();
      }}
    >
      {target && kit && row && (
        <div className="drawer__inner">
          <div className="drawer__head">
            <div>
              <p className="drawer__kit">{kit.name}</p>
              <h2 id="drawer-title" className="drawer__title">
                {row.name}
              </h2>
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label={t('drawer.close')}
              onClick={close}
            >
              <CloseIcon />
            </button>
          </div>
          {row.template?.safety && (
            <p className="note">
              <strong>{t('item.warning')}</strong> {tx(row.template.safety, locale)}
            </p>
          )}
          <AddLotForm
            key={formKey}
            row={row}
            kitId={kit.id}
            bag={kit.type !== 'home'}
            initialQuantity={target.quantity}
            bare
            onAdded={close}
          />
          {row.template && (
            <BuyingAdvice
              templateId={row.template.id}
              level={3}
              preview={!full}
              onMore={() => setFull(true)}
            />
          )}
          <Link
            to={`/kits/${kit.id}/${row.key}`}
            className="text-link drawer__more"
            onClick={close}
          >
            {t('drawer.more')}
          </Link>
        </div>
      )}
    </dialog>
  );
}
