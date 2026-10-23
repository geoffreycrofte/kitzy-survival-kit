/** Remplace les `{{nom}}` d'un texte traduit (même syntaxe qu'i18next), hors de React. */
export function fill(
  template: string,
  values: Readonly<Record<string, string | number>> = {},
): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
