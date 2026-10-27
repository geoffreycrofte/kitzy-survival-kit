/**
 * Écrans de démarrage d'iOS (apple-touch-startup-image) : sans eux, l'app installée sur iPhone
 * s'ouvre sur un écran blanc. Même dessin que l'écran de démarrage de l'app (index.html) :
 * Kitzy et sa lanterne sur le fond du terrier. À relancer si la mascotte change :
 *   pnpm splash-images  (PLAYWRIGHT_CHROMIUM_PATH pour un Chromium déjà installé)
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const web = resolve(import.meta.dirname, '..');
const file = (path: string) => pathToFileURL(resolve(web, path)).href;

/** Écrans en points CSS et densité : chaque taille couvre un groupe d'iPhone ou d'iPad. */
export const SPLASH_SCREENS = [
  { width: 430, height: 932, ratio: 3 }, // iPhone 14/15/16 Pro Max, Plus
  { width: 393, height: 852, ratio: 3 }, // iPhone 14/15/16 Pro, 15/16
  { width: 390, height: 844, ratio: 3 }, // iPhone 12, 13, 14
  { width: 375, height: 812, ratio: 3 }, // iPhone X, XS, 11 Pro, mini
  { width: 414, height: 896, ratio: 2 }, // iPhone XR, 11
  { width: 375, height: 667, ratio: 2 }, // iPhone SE, 8
  { width: 820, height: 1180, ratio: 2 }, // iPad Air, iPad 10e
  { width: 1024, height: 1366, ratio: 2 }, // iPad Pro 12,9"
] as const;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Young Serif'; src: url(${file('node_modules/@fontsource/young-serif/files/young-serif-latin-400-normal.woff2')}); }
* { margin: 0; }
html, body { height: 100%; }
body { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
  background: #12302b; overflow: hidden; position: relative; }
.glow { position: absolute; width: min(110vw, 620px); aspect-ratio: 1; top: 50%; left: 50%;
  translate: -50% -58%; border-radius: 50%;
  background: radial-gradient(circle, rgb(255 226 168 / 0.42) 0%, rgb(244 184 96 / 0.2) 30%,
    rgb(217 119 63 / 0.06) 52%, transparent 70%); }
img { position: relative; height: min(46vh, 360px); }
p { position: relative; color: #f4b860; font: 400 2.25rem/1 'Young Serif', Georgia, serif; }
</style></head><body>
<div class="glow"></div>
<img src="${file('public/mascot/kitzy-lanterne.webp')}" alt="">
<p>Kitzy</p>
</body></html>`;

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
});
const dir = mkdtempSync(join(tmpdir(), 'kitzy-splash-'));
const htmlFile = join(dir, 'splash.html');
writeFileSync(htmlFile, html);
for (const { width, height, ratio } of SPLASH_SCREENS) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: ratio });
  await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'load' });
  await page.evaluate(() => globalThis.document.fonts.ready);
  const out = resolve(web, 'public/splash', `splash-${width * ratio}x${height * ratio}.jpg`);
  // JPEG : une photo de mascotte sur un dégradé, cinq fois plus légère qu'en PNG.
  await page.screenshot({ path: out, type: 'jpeg', quality: 86 });
  await page.close();
  console.log(`Image écrite : ${out}`);
}
await browser.close();
rmSync(dir, { recursive: true, force: true });
