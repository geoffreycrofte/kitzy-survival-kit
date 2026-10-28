/** Propose un fichier à enregistrer. */
export function downloadFile(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** La feuille de partage du téléphone sait-elle recevoir un fichier (Drive, Dropbox, Fichiers…) ? */
export function canShareFile(): boolean {
  try {
    return (
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [new File(['{}'], 'kitzy.json', { type: 'application/json' })] })
    );
  } catch {
    return false;
  }
}

/**
 * Ouvre la feuille de partage avec le fichier.
 * - `shared` : envoyé ;
 * - `cancelled` : la personne a refermé la feuille ;
 * - `blocked` : le navigateur exige un geste plus récent (le chiffrement a pris trop de temps),
 *   il suffit de toucher à nouveau un bouton ;
 * - `downloaded` : le partage a échoué, le fichier a été téléchargé à la place.
 */
export type ShareOutcome = 'shared' | 'cancelled' | 'blocked' | 'downloaded';

export async function shareFile(
  filename: string,
  content: string,
  type: string,
): Promise<ShareOutcome> {
  try {
    await navigator.share({ files: [new File([content], filename, { type })], title: filename });
    return 'shared';
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
    if (error instanceof DOMException && error.name === 'NotAllowedError') return 'blocked';
    downloadFile(filename, content, type);
    return 'downloaded';
  }
}
