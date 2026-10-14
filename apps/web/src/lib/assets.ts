export type MascotPose = 'bonjour' | 'endormi' | 'lanterne' | 'provisions' | 'fete' | 'lecture';

/** Chemin d'une pose du hérisson, compatible avec le chemin de publication. */
export function mascot(pose: MascotPose): string {
  return `${import.meta.env.BASE_URL}mascot/kitzy-${pose}.webp`;
}
