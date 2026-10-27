import '@fontsource/young-serif/400.css';
import '@fontsource/figtree/400.css';
import '@fontsource/figtree/600.css';
import '@fontsource/figtree/700.css';
import './styles/global.css';
import './styles/motion.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { CrashBoundary } from './components/CrashBoundary';
import { TransitionRouter } from './components/TransitionRouter';
import { initI18n } from './lib/i18n';
import { initInstall } from './lib/install';
import { initLocale } from './lib/locale';
import { initPreferences } from './lib/preferences';

initPreferences();
initI18n();
initLocale();
initInstall();

const root = document.getElementById('root');
if (!root) throw new Error('Élément #root introuvable');

/**
 * L'écran de démarrage (index.html) s'efface une fois l'app affichée, après un court instant
 * pour qu'il ne fasse pas qu'un éclair. Sans animations, il disparaît tout de suite.
 */
function hideSplash() {
  const splash = document.getElementById('splash');
  if (!splash || splash.hidden) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = reduced ? 0 : Math.max(0, 900 - performance.now());
  window.setTimeout(() => {
    splash.classList.add('splash--out');
    window.setTimeout(() => splash.remove(), reduced ? 0 : 500);
  }, wait);
}

createRoot(root).render(
  <StrictMode>
    <TransitionRouter basename={import.meta.env.BASE_URL}>
      <CrashBoundary>
        <App />
      </CrashBoundary>
    </TransitionRouter>
  </StrictMode>,
);

requestAnimationFrame(hideSplash);
