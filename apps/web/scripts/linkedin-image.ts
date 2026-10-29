/**
 * Visuel LinkedIn du lancement (1080 × 1350) : les guides officiels « Lëtz prepare! », kitzy.lu dans
 * un téléphone et Kitzy à la lanterne. La capture du téléphone est faite sur le site construit.
 *   pnpm build && pnpm linkedin-image  (PLAYWRIGHT_CHROMIUM_PATH pour un Chromium déjà installé)
 * Sortie : assets/social/kitzy-linkedin-lancement.png
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const web = resolve(import.meta.dirname, '..');
const root = resolve(web, '../..');
const file = (path: string) => pathToFileURL(resolve(web, path)).href;
const font = (name: string) => file(`node_modules/@fontsource/${name}`);
const PORT = 4180;

const dir = mkdtempSync(join(tmpdir(), 'kitzy-linkedin-'));
const phoneShot = join(dir, 'phone.png');

// 1. kitzy.lu sur un téléphone, thème sombre.
const server = spawn(process.execPath, [resolve(web, 'scripts/serve-dist.mjs')], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: 'ignore',
});
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
});
try {
  await new Promise((r) => setTimeout(r, 600));
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
    locale: 'fr-LU',
  });
  const phone = await context.newPage();
  await phone.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  // Le hérisson est déjà en grand sur le visuel : dans le téléphone, on montre la suite de la page.
  await phone.addStyleTag({ content: '.hero .stage { display: none !important; }' });
  await phone.evaluate(() => globalThis.document.fonts.ready);
  await phone.screenshot({ path: phoneShot });
  await context.close();

  // 2. Le montage.
  const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><style>
@font-face { font-family: 'Young Serif'; src: url(${font('young-serif/files/young-serif-latin-400-normal.woff2')}); }
@font-face { font-family: 'Figtree'; font-weight: 600; src: url(${font('figtree/files/figtree-latin-600-normal.woff2')}); }
@font-face { font-family: 'Figtree'; font-weight: 700; src: url(${font('figtree/files/figtree-latin-700-normal.woff2')}); }
* { margin: 0; box-sizing: border-box; }
body { width: 1080px; height: 1350px; overflow: hidden; background: #12302B; color: #FFF4E2;
  font-family: 'Figtree', sans-serif; position: relative; }
.glow { position: absolute; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,226,168,.5) 0%, rgba(244,184,96,.28) 28%, rgba(217,119,63,.1) 52%, rgba(18,48,43,0) 70%); }
.fly { position: absolute; width: 10px; height: 10px; border-radius: 50%; background: #FFE08A;
  box-shadow: 0 0 18px 6px rgba(255,224,138,.55); }
h1 { position: absolute; left: 72px; top: 60px; width: 940px; font-family: 'Young Serif'; font-weight: 400;
  font-size: 92px; line-height: 1; letter-spacing: -0.015em; }
.guides { position: absolute; left: 72px; top: 296px; width: 660px; transform: rotate(-2.5deg);
  border-radius: 18px; box-shadow: 0 30px 60px rgba(0,0,0,.45); }
.credit { position: absolute; left: 80px; top: 630px; font-size: 18px; font-weight: 600; color: #8FA89E; }
.pitch { position: absolute; left: 72px; top: 700px; width: 500px; }
.pitch h2 { font-family: 'Young Serif'; font-weight: 400; font-size: 50px; line-height: 1.08; color: #F4B860; }
.pitch p { margin-top: 20px; font-size: 25px; line-height: 1.42; font-weight: 600; color: #D8E3DC; }
.cta { position: absolute; left: 72px; top: 1086px; padding: 14px 28px; border-radius: 999px;
  background: #F4B860; color: #12302B; font-size: 32px; font-weight: 700; }
.phone { position: absolute; right: 60px; top: 520px; width: 350px; height: 742px; padding: 13px;
  border-radius: 54px; background: #0B1F1C; transform: rotate(4deg);
  box-shadow: 0 0 0 3px #2C4A43, 0 40px 80px rgba(0,0,0,.55); }
.phone img { width: 100%; height: 100%; object-fit: cover; object-position: top; border-radius: 42px; display: block; }
.notch { position: absolute; left: 50%; top: 24px; width: 100px; height: 28px; margin-left: -50px;
  border-radius: 999px; background: #0B1F1C; }
.hog { position: absolute; left: 330px; bottom: -30px; height: 400px; }
</style></head><body>
<div class="glow" style="left:480px;top:520px;width:820px;height:820px"></div>
<div class="glow" style="left:200px;top:900px;width:560px;height:560px;opacity:.7"></div>
<span class="fly" style="left:820px;top:200px"></span>
<span class="fly" style="left:980px;top:420px;transform:scale(.7)"></span>
<span class="fly" style="left:640px;top:1120px;transform:scale(.6)"></span>
<span class="fly" style="left:120px;top:1240px;transform:scale(.8)"></span>
<h1>Vous avez reçu<br>ce guide&#8239;?</h1>
<img class="guides" src="${pathToFileURL(resolve(root, 'assets/social/guides-letz-prepare.png')).href}" alt="">
<p class="credit">Les guides officiels « Lëtz prepare! », Luxembourg</p>
<div class="pitch">
  <h2>J’en ai fait une app gratuite, qui évolue avec vous.</h2>
  <p>Votre kit de 72 h calculé pour votre foyer, vos dates de péremption, votre plan d’urgence. Sans compte, hors connexion, en 5 langues.</p>
</div>
<div class="cta">kitzy.lu</div>
<img class="hog" src="${file('public/mascot/kitzy-lanterne.webp')}" alt="">
<div class="phone"><img src="${pathToFileURL(phoneShot).href}" alt=""><span class="notch"></span></div>
</body></html>`;
  const htmlFile = join(dir, 'post.html');
  writeFileSync(htmlFile, html);
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 2,
  });
  await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'load' });
  await page.evaluate(() => globalThis.document.fonts.ready);
  const out = resolve(root, 'assets/social/kitzy-linkedin-lancement.png');
  await page.screenshot({ path: out, type: 'png' });
  console.log(`Image écrite : ${out}`);
} finally {
  await browser.close();
  server.kill();
  rmSync(dir, { recursive: true, force: true });
}
