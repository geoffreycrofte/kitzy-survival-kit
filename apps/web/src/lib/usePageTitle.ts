import { useEffect } from 'react';

/** Titre de l'onglet, propre à chaque page (RAWeb 8.6). */
export function usePageTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} · Kitzy`;
  }, [title]);
}
