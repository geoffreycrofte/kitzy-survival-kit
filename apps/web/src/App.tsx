import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { UpdateBanner } from './components/UpdateBanner';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Settings } from './pages/Settings';
import { Soon } from './pages/Soon';

/** Après une navigation, le focus va sur le titre de la nouvelle page (RAWeb 12.x). */
function useFocusOnNavigation() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    document.querySelector<HTMLElement>('main h1')?.focus();
  }, [pathname]);
}

export function App() {
  const { t } = useTranslation();
  useFocusOnNavigation();

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        {t('app.skipLink')}
      </a>
      <Header />
      <main id="main" className="app__main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Soon titleKey="pages.shopping" />} />
          <Route path="/plan" element={<Soon titleKey="pages.plan" />} />
          <Route path="/guide" element={<Soon titleKey="pages.guide" />} />
          <Route path="/foyer" element={<Soon titleKey="pages.household" />} />
          <Route path="/reglages" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BottomNav />
      <UpdateBanner />
    </div>
  );
}
