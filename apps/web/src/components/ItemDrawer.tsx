import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { Link, type LinkProps } from 'react-router';
import { useTranslation } from 'react-i18next';
import { tx } from '@kitzy/core';
import { useKitRow } from '../data/kitRow';
import { useLocale } from '../lib/locale';
import { AddLotForm } from './AddLotForm';
import { BuyingAdvice } from './BuyingAdvice';
import { ItemDetails } from './ItemDetails';
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

type Expanded = false | 'more' | 'buy' | 'drag';

/** Mobile (feuille du bas) : la poignée se glisse. Sur bureau, panneau latéral sans poignée. */
const isSheet = () => !window.matchMedia('(min-width: 60rem)').matches;
const motionOn = () => document.documentElement.dataset.motion === 'full';
const EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

/**
 * Résistance d'élastique, comme les tiroirs natifs : plus on tire, moins ça suit.
 * `x` est la distance tirée, `limit` le déplacement maximal atteignable.
 */
function rubber(x: number, limit: number): number {
  return (1 - 1 / ((x * 0.55) / limit + 1)) * limit;
}

function ItemDrawer({ target, onClose }: { target: Target | null; onClose: () => void }) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const ref = useRef<HTMLDialogElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const { data, kit, row } = useKitRow(target?.kitId, target?.key);
  const shown = Boolean(target && kit && row);
  // Déplié (« Tout voir », « Voir les autres suggestions », poignée tirée vers le haut) :
  // le tiroir monte presque en plein écran et le reste de la vue de l'article arrive par en bas.
  const [expanded, setExpanded] = useState<Expanded>(false);
  const before = useRef<number | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (shown && !dialog.open) {
      dialog.showModal();
      // Le focus va sur la fenêtre elle-même : le lecteur d'écran annonce « dialogue » et son nom
      // (l'article), puis Tab mène à la croix et au formulaire. showModal() l'aurait mis sur la croix.
      dialog.focus();
    }
    if (!shown && dialog.open) dialog.close();
  }, [shown]);

  const close = () => ref.current?.close();

  const expand = (by: Exclude<Expanded, false>) => {
    const dialog = ref.current;
    if (!dialog || expanded) return;
    before.current = dialog.getBoundingClientRect().top;
    dialog.style.height = '';
    setExpanded(by);
  };

  // Le haut du tiroir monte depuis sa position d'avant (FLIP), puis le focus va sur ce qui est apparu.
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog || !expanded) return;
    const from = before.current;
    before.current = null;
    if (from !== null && motionOn() && isSheet()) {
      const delta = from - dialog.getBoundingClientRect().top;
      if (delta > 0) {
        dialog.animate([{ transform: `translateY(${delta}px)` }, { transform: 'none' }], {
          duration: 340,
          easing: EASE,
        });
      }
    }
    if (expanded === 'more') {
      const first = detailsRef.current?.querySelector<HTMLElement>('h3');
      if (first) {
        first.tabIndex = -1;
        first.focus();
      }
    }
  }, [expanded]);

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

  /* Glisser la poignée : vers le bas, le tiroir suit le doigt et se ferme passé un seuil (ou sur un
     geste rapide) ; vers le haut, il résiste comme un élastique et se déplie passé un seuil.
     Le geste a toujours son équivalent : la croix, Échap et « Tout voir sur cet article ». */
  const drag = useRef<{ y: number; h: number; lastY: number; lastT: number; v: number } | null>(
    null,
  );

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const dialog = ref.current;
    if (!dialog || !isSheet() || e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button, a, input')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dialog.getAnimations().forEach((a) => a.cancel());
    dialog.style.transition = 'none';
    const h = dialog.getBoundingClientRect().height;
    drag.current = { y: e.clientY, h, lastY: e.clientY, lastT: e.timeStamp, v: 0 };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const dialog = ref.current;
    const d = drag.current;
    if (!dialog || !d) return;
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.v = 0.8 * ((e.clientY - d.lastY) / dt) + 0.2 * d.v;
    d.lastY = e.clientY;
    d.lastT = e.timeStamp;
    const dy = e.clientY - d.y;
    if (dy >= 0) {
      dialog.style.height = '';
      dialog.style.transform = `translateY(${dy}px)`;
    } else {
      // Vers le haut : le tiroir grandit, de moins en moins (jamais au-delà de l'écran).
      const room = Math.max(0, window.innerHeight - 24 - d.h);
      const grow = expanded ? rubber(-dy, Math.min(room, 24)) : rubber(-dy, Math.max(room, 0));
      dialog.style.transform = '';
      dialog.style.height = `${d.h + grow}px`;
    }
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const dialog = ref.current;
    const d = drag.current;
    drag.current = null;
    if (!dialog || !d) return;
    const dy = e.clientY - d.y;
    const animate = motionOn();
    dialog.style.transition = animate ? `transform 0.28s ${EASE}, height 0.28s ${EASE}` : 'none';
    if (dy > d.h * 0.3 || (dy > 12 && d.v > 0.6)) {
      // Fermer : le tiroir finit sa course vers le bas, puis la fenêtre se ferme.
      dialog.style.transform = 'translateY(100%)';
      const done = () => {
        dialog.style.transition = '';
        dialog.style.transform = '';
        dialog.close();
      };
      if (animate) window.setTimeout(done, 260);
      else done();
      return;
    }
    if (!expanded && (dy < -60 || (dy < -12 && d.v < -0.6))) {
      dialog.style.transition = '';
      expand('drag');
      return;
    }
    // Pas assez loin : retour à la position de départ.
    dialog.style.transform = '';
    dialog.style.height = '';
    const reset = () => (dialog.style.transition = '');
    if (animate) window.setTimeout(reset, 300);
    else reset();
  };

  const formKey = useMemo(
    () => (target ? `${target.kitId}/${target.key}/${target.n}` : ''),
    [target],
  );

  return (
    <dialog
      ref={ref}
      className={`drawer${row?.template ? ' drawer--shop' : ''}${expanded ? ' drawer--full' : ''}`}
      aria-labelledby="drawer-title"
      tabIndex={-1}
      onClose={() => {
        const dialog = ref.current;
        if (dialog) {
          dialog.style.transform = '';
          dialog.style.height = '';
          dialog.style.transition = '';
        }
        setExpanded(false);
        onClose();
      }}
    >
      {target && kit && row && data && (
        <div className="drawer__inner">
          <div
            className="drawer__grab"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <span className="drawer__handle" aria-hidden="true" />
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
          {expanded && (
            <div ref={detailsRef} className="drawer__details">
              <ItemDetails row={row} kitId={kit.id} today={data.today} level={3} buying={false} />
            </div>
          )}
          {row.template && (
            <BuyingAdvice
              templateId={row.template.id}
              level={3}
              preview={!expanded}
              onMore={() => expand('buy')}
              focusReveal={expanded === 'buy'}
            />
          )}
          {!expanded && (
            <button
              type="button"
              className="button button--ghost drawer__more"
              onClick={() => expand('more')}
            >
              {t('drawer.more')}
            </button>
          )}
        </div>
      )}
    </dialog>
  );
}
