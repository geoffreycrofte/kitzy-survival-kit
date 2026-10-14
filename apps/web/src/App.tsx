import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Announcer } from './components/Announcer';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { UpdateBanner } from './components/UpdateBanner';
import { GuideArticle, GuideIndex } from './pages/Guide';
import { Home } from './pages/Home';
import { Household } from './pages/Household';
import { Item } from './pages/Item';
import { KitDetail } from './pages/KitDetail';
import { Kits } from './pages/Kits';
import { NewItem } from './pages/NewItem';
import { NotFound } from './pages/NotFound';
import { Settings } from './pages/Settings';
import { SharedList } from './pages/SharedList';
import { Shopping } from './pages/Shopping';
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
    // Le titre peut n'apparaître qu'une fois les données chargées : on l'attend un court instant.
    let frames = 0;
    let handle = 0;
    const tryFocus = () => {
      const heading = document.querySelector<HTMLElement>('main h1');
      if (heading) heading.focus();
      else if (frames++ < 60) handle = requestAnimationFrame(tryFocus);
    };
    tryFocus();
    return () => cancelAnimationFrame(handle);
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
          <Route path="/foyer" element={<Household />} />
          <Route path="/kits" element={<Kits />} />
          <Route path="/kits/:kitId" element={<KitDetail />} />
          <Route path="/kits/:kitId/nouveau" element={<NewItem />} />
          <Route path="/kits/:kitId/:key" element={<Item />} />
          <Route path="/courses" element={<Shopping />} />
          <Route path="/partage" element={<SharedList />} />
          <Route path="/plan" element={<Soon titleKey="pages.plan" />} />
          <Route path="/guide" element={<GuideIndex />} />
          <Route path="/guide/:slug" element={<GuideArticle />} />
          <Route path="/reglages" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BottomNav />
      <UpdateBanner />
      <Announcer />
    </div>
  );
}
