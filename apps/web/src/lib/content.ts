import { contentFor, type Content } from '@kitzy/core';
import { useLocale } from './locale';

/** Guide, gestes, recettes, quiz, simulation et produits dans la langue affichée. */
export function useContent(): Content {
  return contentFor(useLocale().locale);
}
