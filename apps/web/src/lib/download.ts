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

/** Ouvre la feuille de partage avec le fichier. `false` si la personne a annulé. */
export async function shareFile(filename: string, content: string, type: string): Promise<boolean> {
  try {
    await navigator.share({ files: [new File([content], filename, { type })], title: filename });
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return false;
    // Partage refusé par le navigateur : on retombe sur le téléchargement.
    downloadFile(filename, content, type);
    return true;
  }
}
