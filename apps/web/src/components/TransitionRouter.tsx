import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import {
  Router,
  UNSAFE_createBrowserHistory,
  type Location,
  type NavigationType,
} from 'react-router';

interface State {
  action: NavigationType;
  location: Location;
}

/**
 * Le `BrowserRouter` de React Router, avec une transition douce entre les pages : chaque
 * changement de page passe par l'API View Transitions (fondu de l'ancienne page, la nouvelle
 * arrive en montant un peu ; voir motion.css). Rien quand les animations sont coupées, quand le
 * navigateur ne sait pas faire, ou quand une fenêtre (menu, tiroir) est ouverte : elle a sa propre
 * animation de fermeture.
 */
export function TransitionRouter({
  basename,
  children,
}: {
  basename?: string;
  children: ReactNode;
}) {
  const [history] = useState(() => UNSAFE_createBrowserHistory({ v5Compat: true }));
  const [state, setState] = useState<State>({ action: history.action, location: history.location });
  const path = useRef(history.location.pathname);

  useLayoutEffect(
    () =>
      history.listen((next) => {
        // Même page (seuls ?… ou #… changent) : pas de transition.
        const samePage = next.location.pathname === path.current;
        path.current = next.location.pathname;
        const animate =
          typeof document.startViewTransition === 'function' &&
          document.documentElement.dataset.motion === 'full' &&
          !document.querySelector('dialog[open]') &&
          !samePage;
        const update = () => setState({ action: next.action, location: next.location });
        if (animate) document.startViewTransition(() => flushSync(update));
        else update();
      }),
    [history],
  );

  return (
    <Router
      basename={basename}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      {children}
    </Router>
  );
}
