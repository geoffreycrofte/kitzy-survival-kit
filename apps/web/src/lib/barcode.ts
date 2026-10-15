/**
 * Lecture de codes-barres : l'API native BarcodeDetector quand elle existe
 * (Chrome Android), sinon le décodeur ZXing en WebAssembly, servi par Kitzy
 * lui-même et précaché : le scan marche hors-ligne et rien ne part sur un CDN.
 */
import wasmUrl from 'zxing-wasm/reader/zxing_reader.wasm?url';

/** Codes des produits du commerce (EAN, UPC) et codes internes courants. */
const FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'] as const;

export interface Detector {
  detect(source: CanvasImageSource): Promise<Array<{ rawValue: string }>>;
}

interface NativeDetectorClass {
  new (options: { formats: string[] }): Detector;
  getSupportedFormats(): Promise<string[]>;
}

let detector: Promise<Detector> | null = null;

async function create(): Promise<Detector> {
  const Native = (window as unknown as { BarcodeDetector?: NativeDetectorClass }).BarcodeDetector;
  if (Native) {
    const supported = await Native.getSupportedFormats().catch(() => [] as string[]);
    const formats = FORMATS.filter((f) => supported.includes(f));
    if (formats.length) return new Native({ formats });
  }
  const { BarcodeDetector, prepareZXingModule } = await import('barcode-detector/ponyfill');
  prepareZXingModule({
    overrides: {
      locateFile: (path: string, prefix: string) =>
        path.endsWith('.wasm') ? new URL(wasmUrl, location.href).href : prefix + path,
    },
  });
  return new BarcodeDetector({ formats: [...FORMATS] });
}

export function getDetector(): Promise<Detector> {
  detector ??= create().catch((error: unknown) => {
    detector = null;
    throw error;
  });
  return detector;
}

/** Nettoie une saisie manuelle : chiffres uniquement, longueur d'un code produit. */
export function cleanManualCode(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 6 && digits.length <= 14 ? digits : null;
}
