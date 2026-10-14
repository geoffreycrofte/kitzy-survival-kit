/**
 * Pages du guide : contenu officiel reformulé en langage clair.
 */

export type GuideBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'steps'; items: string[] }
  | { type: 'note'; text: string }
  | { type: 'h2'; text: string };

export interface GuideLink {
  label: string;
  url: string;
}

export interface GuidePage {
  /** Identifiant d'URL en français (ex. `pourquoi-72-heures`). */
  slug: string;
  title: string;
  /** Une phrase pour la liste des pages. */
  summary: string;
  /** Chapitre, pour regrouper les pages. */
  chapter: 'comprendre' | 'alerte' | 'preparer';
  /** Pose du hérisson illustrant la page. */
  pose?: 'bonjour' | 'endormi' | 'lanterne' | 'provisions' | 'fete' | 'lecture';
  blocks: GuideBlock[];
  links?: GuideLink[];
}
