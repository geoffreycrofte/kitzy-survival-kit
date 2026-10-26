/**
 * Image de partage (Open Graph, 1200 × 630) de kitzy.lu.
 * Dessinée en HTML avec les polices, les couleurs du thème sombre et la mascotte de Kitzy,
 * puis photographiée par Chromium. À relancer si le titre ou la mascotte changent :
 *   node apps/web/scripts/og-image.mjs  (PLAYWRIGHT_CHROMIUM_PATH pour un Chromium déjà installé)
 */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const web = resolve(import.meta.dirname, '..');
const file = (path) => pathToFileURL(resolve(web, path)).href;
const font = (name) => file(`node_modules/@fontsource/${name}`);
const out = resolve(web, 'landing/public/og/kitzy-og.png');

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><style>
@font-face { font-family: 'Young Serif'; src: url(${font('young-serif/files/young-serif-latin-400-normal.woff2')}); }
@font-face { font-family: 'Figtree'; font-weight: 600; src: url(${font('figtree/files/figtree-latin-600-normal.woff2')}); }
@font-face { font-family: 'Figtree'; font-weight: 700; src: url(${font('figtree/files/figtree-latin-700-normal.woff2')}); }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; background: #12302B; color: #FFF4E2;
  font-family: 'Figtree', sans-serif; position: relative; }
.glow { position: absolute; right: -160px; top: -40px; width: 720px; height: 720px; border-radius: 50%;
  background: radial-gradient(circle at 50% 50%, rgba(255,226,168,.55) 0%, rgba(244,184,96,.32) 26%, rgba(217,119,63,.12) 50%, rgba(18,48,43,0) 70%); }
.fly { position: absolute; width: 10px; height: 10px; border-radius: 50%; background: #FFE08A;
  box-shadow: 0 0 18px 6px rgba(255,224,138,.55); }
.hog { position: absolute; right: 40px; bottom: -10px; height: 600px; }
.text { position: absolute; left: 80px; top: 60px; width: 640px; }
.brand { font-family: 'Young Serif'; font-size: 40px; color: #F4B860; }
h1 { font-family: 'Young Serif'; font-weight: 400; font-size: 66px; line-height: 1.06; margin-top: 30px; letter-spacing: -0.01em; }
p { font-size: 26px; line-height: 1.4; color: #B9CBC2; margin-top: 24px; font-weight: 600; max-width: 560px; text-wrap: balance; }
.url { position: absolute; left: 80px; bottom: 56px; font-size: 26px; font-weight: 700; color: #F4B860; }
</style></head><body>
<div class="glow"></div>
<span class="fly" style="left:760px;top:120px"></span>
<span class="fly" style="left:1110px;top:90px;transform:scale(.7)"></span>
<span class="fly" style="left:700px;top:430px;transform:scale(.6)"></span>
<img class="hog" src="${file('public/mascot/kitzy-lanterne.webp')}" alt="">
<div class="text">
  <div class="brand">Kitzy</div>
  <h1>Trois jours d’avance sur l’imprévu.</h1>
  <p>Ta réserve d’urgence de 72&nbsp;heures, calculée pour ton foyer. Gratuit, sans compte, hors ligne.</p>
</div>
<div class="url">kitzy.lu</div>
</body></html>`;

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
// Une vraie page file:// : elle a le droit de charger les polices et l'image locales.
const dir = mkdtempSync(join(tmpdir(), 'kitzy-og-'));
const htmlFile = join(dir, 'og.html');
writeFileSync(htmlFile, html);
await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'load' });
// Les polices doivent être prêtes avant la capture.
await page.evaluate(() => globalThis.document.fonts.ready);
await page.screenshot({ path: out, type: 'png' });
await browser.close();
rmSync(dir, { recursive: true, force: true });
console.log(`Image écrite : ${out}`);
