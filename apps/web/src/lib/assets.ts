export type MascotPose =
  | 'bonjour'
  | 'endormi'
  | 'lanterne'
  | 'provisions'
  | 'fete'
  | 'lecture'
  | 'sac'
  | 'radio'
  | 'eau'
  | 'plan'
  | 'curieux';

/** Dimensions réelles de chaque image, pour réserver la bonne place avant chargement. */
const SIZES: Record<MascotPose, [number, number]> = {
  bonjour: [640, 1060],
  endormi: [720, 707],
  lanterne: [640, 1004],
  provisions: [619, 1282],
  fete: [640, 706],
  lecture: [622, 1290],
  sac: [640, 1139],
  radio: [640, 852],
  eau: [640, 1067],
  plan: [640, 1133],
  curieux: [640, 848],
};

/** Chemin d'une pose du hérisson, compatible avec le chemin de publication. */
export function mascot(pose: MascotPose): string {
  return `${import.meta.env.BASE_URL}mascot/kitzy-${pose}.webp`;
}

/** `src`, `width` et `height` d'une pose, à étaler sur un `<img>`. */
export function mascotImage(pose: MascotPose): { src: string; width: number; height: number } {
  const [width, height] = SIZES[pose];
  return { src: mascot(pose), width, height };
}
