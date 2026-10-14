/**
 * Base64 URL-safe, sans dépendance à btoa/Buffer (fonctionne aussi dans React Native).
 */
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

export function toBase64Url(bytes: Uint8Array): string {
  let out = '';
  let i = 0;
  for (; i + 2 < bytes.length; i += 3) {
    const n = (bytes[i]! << 16) | (bytes[i + 1]! << 8) | bytes[i + 2]!;
    out +=
      ALPHABET[(n >> 18) & 63]! +
      ALPHABET[(n >> 12) & 63]! +
      ALPHABET[(n >> 6) & 63]! +
      ALPHABET[n & 63]!;
  }
  const rest = bytes.length - i;
  if (rest === 1) {
    const n = bytes[i]! << 16;
    out += ALPHABET[(n >> 18) & 63]! + ALPHABET[(n >> 12) & 63]!;
  } else if (rest === 2) {
    const n = (bytes[i]! << 16) | (bytes[i + 1]! << 8);
    out += ALPHABET[(n >> 18) & 63]! + ALPHABET[(n >> 12) & 63]! + ALPHABET[(n >> 6) & 63]!;
  }
  return out;
}

export function fromBase64Url(text: string): Uint8Array {
  const clean = text.replace(/=+$/, '');
  if (!/^[A-Za-z0-9_-]*$/.test(clean)) throw new Error('Caractères invalides');
  const values = [...clean].map((c) => ALPHABET.indexOf(c));
  const out: number[] = [];
  for (let i = 0; i < values.length; i += 4) {
    const a = values[i] ?? 0;
    const b = values[i + 1] ?? 0;
    const c = values[i + 2];
    const d = values[i + 3];
    const n = (a << 18) | (b << 12) | ((c ?? 0) << 6) | (d ?? 0);
    out.push((n >> 16) & 255);
    if (c !== undefined) out.push((n >> 8) & 255);
    if (d !== undefined) out.push(n & 255);
  }
  return new Uint8Array(out);
}
