/**
 * Jetons de couleur de la direction « La Veillée ».
 * Source unique pour la PWA (variables CSS) et l'app Expo (thème React Native).
 */

export type ThemeName = 'sombre' | 'clair';

export interface ThemeTokens {
  /** Fond de page */
  bg: string;
  /** Cartes et surfaces */
  surface: string;
  /** Texte principal */
  text: string;
  /** Texte secondaire */
  muted: string;
  /** Libellés et éléments réussis */
  label: string;
  /** Titres de section : ambre de la lanterne, pour hiérarchiser les blocs */
  heading: string;
  /** Fond de l'action principale */
  btn: string;
  /** Texte de l'action principale */
  btnText: string;
  /** Séparateurs (décor) */
  line: string;
  /** Barre de navigation */
  nav: string;
  navText: string;
  navActive: string;
  /** Anneau autour de la fenêtre du terrier */
  ring: string;
  /** Luciole allumée */
  fly: string;
  flyEdge: string;
  flyGlow: string;
  /** Luciole à allumer */
  flyOff: string;
  /** Pastille « à consommer » */
  dotA: string;
  /** Pastille « rappel » */
  dotB: string;
  /** Halo autour de la fenêtre */
  halo: string;
  /** Lumière dans la fenêtre du terrier */
  glow: string;
}

export const themes: Record<ThemeName, ThemeTokens> = {
  sombre: {
    bg: '#12302B',
    surface: '#1C4139',
    text: '#FFF4E2',
    muted: '#B9CBC2',
    label: '#9CCB98',
    heading: '#F4B860',
    btn: '#F4B860',
    btnText: '#12302B',
    line: '#3E6B60',
    nav: '#0E2723',
    navText: '#B9CBC2',
    navActive: '#F4B860',
    ring: '#1C4139',
    fly: '#FFE08A',
    flyEdge: 'transparent',
    flyGlow: 'rgba(255, 224, 138, 0.55)',
    flyOff: '#6E9C90',
    dotA: '#F59A6A',
    dotB: '#9CCB98',
    halo: 'rgba(244, 184, 96, 0.28)',
    glow: 'radial-gradient(circle at 50% 64%, #FFE2A8 0%, #F4B860 24%, #D9773F 50%, #1C4139 76%)',
  },
  clair: {
    bg: '#E7F0EC',
    surface: '#FFFFFF',
    text: '#12302B',
    muted: '#47665D',
    label: '#2E6B3A',
    heading: '#8A5300',
    btn: '#F4B860',
    btnText: '#12302B',
    line: '#9DB8AF',
    nav: '#FFFFFF',
    navText: '#47665D',
    navActive: '#8A5300',
    ring: '#FFFFFF',
    fly: '#F2A93B',
    flyEdge: '#8A5300',
    flyGlow: 'rgba(242, 169, 59, 0.45)',
    flyOff: '#5E7E74',
    dotA: '#C9602B',
    dotB: '#2E6B3A',
    halo: 'rgba(242, 169, 59, 0.22)',
    glow: 'radial-gradient(circle at 50% 64%, #FFF3D1 0%, #FFD48A 26%, #F2A86A 50%, #CFE3DA 78%)',
  },
};

/** Paires texte/fond qui doivent atteindre 4,5:1 (RAWeb 3.2). */
export const textPairs: ReadonlyArray<[keyof ThemeTokens, keyof ThemeTokens]> = [
  ['text', 'bg'],
  ['text', 'surface'],
  ['muted', 'bg'],
  ['muted', 'surface'],
  ['label', 'surface'],
  ['heading', 'bg'],
  ['heading', 'surface'],
  ['btnText', 'btn'],
  ['navText', 'nav'],
  ['navActive', 'nav'],
];

/** Transforme `flyGlow` en `--kz-fly-glow`. */
export function cssVarName(token: keyof ThemeTokens): string {
  return '--kz-' + token.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
}

export function themeToCssVars(theme: ThemeTokens): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme)) {
    vars[cssVarName(key as keyof ThemeTokens)] = value;
  }
  return vars;
}

function channel(hex: string, start: number): number {
  const c = parseInt(hex.slice(start, start + 2), 16) / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  return 0.2126 * channel(hex, 1) + 0.7152 * channel(hex, 3) + 0.0722 * channel(hex, 5);
}

/** Ratio de contraste WCAG entre deux couleurs hexadécimales `#RRGGBB`. */
export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
