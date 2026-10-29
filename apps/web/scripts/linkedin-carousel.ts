/**
 * Carrousel LinkedIn des fonctionnalités (PDF, pages de 1080 × 1350) : une page par fonction,
 * avec une vraie capture de l'app (foyer d'exemple, thème sombre).
 *   pnpm build && pnpm linkedin-carousel  (PLAYWRIGHT_CHROMIUM_PATH pour un Chromium déjà installé)
 * Sortie : assets/social/kitzy-linkedin-fonctionnalites.pdf
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import { messagesFor } from '../../../packages/core/src/content';

const web = resolve(import.meta.dirname, '..');
const root = resolve(web, '../..');
const file = (path: string) => pathToFileURL(resolve(web, path)).href;
const font = (name: string) => file(`node_modules/@fontsource/${name}`);
const PORT = 4182;

interface Slide {
  title: string;
  text: string;
  /** Page de l'app à capturer (sous /app/). */
  screen: string;
}

const COVER = {
  title: 'Kitzy, votre réserve de 72&nbsp;h sans prise de tête.',
  text: 'Ce que l’app fait pour vous, écran par écran.',
  hint: 'Faites glisser pour découvrir',
};

const SLIDES: Slide[] = [
  {
    title: 'Une réserve à la mesure de votre foyer',
    text: 'Adultes, enfants, nourrissons, animaux&nbsp;: Kitzy calcule l’eau, les repas et le matériel qu’il vous faut.',
    screen: 'foyer',
  },
  {
    title: 'Six lucioles pour savoir où vous en êtes',
    text: 'Eau, repas, lumière, chaleur, soins, plan. Chaque réserve prête en allume une.',
    screen: '',
  },
  {
    title: 'La maison, et un sac par personne',
    text: 'Votre réserve à la maison, un sac prêt pour chacun si vous devez partir. Kitzy vous prévient avant chaque date de péremption.',
    screen: 'kits',
  },
  {
    title: 'Une liste de courses toute prête',
    text: 'Ce qui manque, où le ranger, et un lien pour la partager avec votre foyer.',
    screen: 'courses',
  },
  {
    title: 'Des idées recettes avec vos boîtes',
    text: 'Chili, pâtes sardines-tomates, salade de lentilles&nbsp;: de quoi faire tourner vos conserves avant qu’elles ne périment.',
    screen: 'recettes',
  },
  {
    title: 'Des activités pour garder le kit vivant',
    text: 'Un mini-check le premier lundi du mois, un grand check-up aux changements d’heure, un quiz et une simulation de 72&nbsp;h en famille.',
    screen: 'activites',
  },
  {
    title: 'Votre plan d’urgence, protégé',
    text: 'Qui appeler, où se retrouver, où couper l’eau. Chiffré sur votre téléphone, il s’ouvre avec votre empreinte ou votre code.',
    screen: 'plan',
  },
  {
    title: 'Les bons gestes, en clair',
    text: 'Installer LU-Alert, reconnaître les sirènes, et le guide officiel résumé en langage simple.',
    screen: 'gestes',
  },
];

const END = {
  title: 'Gratuit. Sans compte. Hors connexion.',
  points: [
    'En français, anglais, allemand, luxembourgeois et portugais',
    'Vos données restent sur votre téléphone',
    'Pas de store&nbsp;: elle s’installe depuis le site',
  ],
};

const dir = mkdtempSync(join(tmpdir(), 'kitzy-carousel-'));
const server = spawn(process.execPath, [resolve(web, 'scripts/serve-dist.mjs')], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: 'ignore',
});
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
});

/** Les captures de l'app, avec un foyer : 2 adultes, 1 enfant, 1 chat. */
async function shootScreens(): Promise<Map<string, string>> {
  const m = messagesFor('fr');
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
    locale: 'fr-LU',
  });
  const page = await context.newPage();
  const base = `http://localhost:${PORT}/app/`;
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: m.home.firstMissionCta }).click();
  for (const who of [m.household.adults, m.household.children, m.household.cats]) {
    await page.getByRole('button', { name: m.household.more.replace('{{label}}', who) }).click();
  }
  await page.getByRole('button', { name: m.household.save }).click();
  await page.getByRole('status').filter({ hasText: m.household.saved }).waitFor();
  const shots = new Map<string, string>();
  for (const { screen } of SLIDES) {
    await page.goto(base + screen, { waitUntil: 'networkidle' });
    // Bandeaux passagers (succès, mise à jour) : ils ne servent pas le propos.
    await page.addStyleTag({
      content: '.unlock-region, .update-banner-region { display: none !important; }',
    });
    await page.evaluate(() => globalThis.document.fonts.ready);
    await page.waitForTimeout(500);
    const path = join(dir, `screen-${screen || 'accueil'}.png`);
    await page.screenshot({ path });
    shots.set(screen, path);
  }
  await context.close();
  return shots;
}

const glow = (x: number, y: number, size: number, opacity = 1) =>
  `<div class="glow" style="left:${x}px;top:${y}px;width:${size}px;height:${size}px;opacity:${opacity}"></div>`;
const flies = `
<span class="fly" style="left:900px;top:150px"></span>
<span class="fly" style="left:120px;top:1180px;transform:scale(.7)"></span>
<span class="fly" style="left:980px;top:760px;transform:scale(.6)"></span>`;

const html = (shots: Map<string, string>) => {
  const total = SLIDES.length + 2;
  const foot = (n: number) =>
    `<div class="foot"><span>kitzy.lu</span><span>${n}&#8239;/&#8239;${total}</span></div>`;
  const pages = [
    `<section class="page cover">${glow(240, 520, 900)}${flies}
      <h1>${COVER.title}</h1>
      <p class="lead">${COVER.text}</p>
      <img class="hog" src="${file('public/mascot/kitzy-lanterne.webp')}" alt="">
      <p class="hint">${COVER.hint}</p>
      ${foot(1)}
    </section>`,
    ...SLIDES.map(
      (slide, i) => `<section class="page">${glow(140, 560, 860, 0.8)}${flies}
      <h2>${slide.title}</h2>
      <p class="lead">${slide.text}</p>
      <div class="phone"><img src="${pathToFileURL(shots.get(slide.screen) ?? '').href}" alt=""></div>
      ${foot(i + 2)}
    </section>`,
    ),
    `<section class="page end">${glow(300, 600, 860)}${flies}
      <h2>${END.title}</h2>
      <ul>${END.points.map((point) => `<li>${point}</li>`).join('')}</ul>
      <div class="cta">kitzy.lu</div>
      <img class="hog" src="${file('public/mascot/kitzy-fete.webp')}" alt="">
      ${foot(total)}
    </section>`,
  ];
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><style>
@font-face { font-family: 'Young Serif'; src: url(${font('young-serif/files/young-serif-latin-400-normal.woff2')}); }
@font-face { font-family: 'Figtree'; font-weight: 600; src: url(${font('figtree/files/figtree-latin-600-normal.woff2')}); }
@font-face { font-family: 'Figtree'; font-weight: 700; src: url(${font('figtree/files/figtree-latin-700-normal.woff2')}); }
@page { size: 1080px 1350px; margin: 0; }
* { margin: 0; box-sizing: border-box; }
body { background: #12302B; color: #FFF4E2; font-family: 'Figtree', sans-serif; }
.page { position: relative; width: 1080px; height: 1350px; overflow: hidden; background: #12302B;
  break-after: page; padding: 84px 80px 0; }
.glow { position: absolute; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,226,168,.42) 0%, rgba(244,184,96,.22) 28%, rgba(217,119,63,.08) 52%, rgba(18,48,43,0) 70%); }
.fly { position: absolute; width: 10px; height: 10px; border-radius: 50%; background: #FFE08A;
  box-shadow: 0 0 18px 6px rgba(255,224,138,.55); }
h1, h2 { position: relative; font-family: 'Young Serif'; font-weight: 400; letter-spacing: -0.01em; text-wrap: balance; }
h1 { font-size: 96px; line-height: 1.02; }
h2 { font-size: 68px; line-height: 1.06; color: #F4B860; }
.lead { position: relative; margin-top: 26px; font-size: 32px; line-height: 1.4; font-weight: 600;
  color: #D8E3DC; max-width: 900px; text-wrap: pretty; }
.cover .lead { color: #F4B860; }
.hint { position: absolute; left: 80px; bottom: 120px; font-size: 26px; font-weight: 700; color: #8FA89E; }
.cover .hog { position: absolute; right: 40px; bottom: -40px; height: 760px; }
.phone { position: absolute; left: 50%; top: 470px; width: 540px; height: 1150px; margin-left: -270px;
  padding: 16px; border-radius: 72px; background: #0B1F1C;
  box-shadow: 0 0 0 3px #2C4A43, 0 40px 90px rgba(0,0,0,.55); }
.phone img { width: 100%; height: 100%; object-fit: cover; object-position: top; border-radius: 58px; display: block; }
.foot { position: absolute; left: 80px; right: 80px; bottom: 44px; display: flex; justify-content: space-between;
  font-size: 22px; font-weight: 700; color: #8FA89E; }
.page:not(.cover):not(.end) .foot { left: 40px; right: 40px; }
.end h2 { font-size: 84px; max-width: 760px; }
.end ul { position: relative; margin: 44px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 22px; max-width: 620px; }
.end li { position: relative; padding-left: 38px; font-size: 32px; line-height: 1.3; font-weight: 600; color: #E6EEE9; }
.end li::before { content: ''; position: absolute; left: 0; top: 0.42em; width: 16px; height: 16px; border-radius: 50%;
  background: #F4B860; box-shadow: 0 0 12px 3px rgba(244,184,96,.45); }
.cta { position: absolute; left: 80px; bottom: 150px; padding: 18px 40px; border-radius: 999px;
  background: #F4B860; color: #12302B; font-size: 48px; font-weight: 700; }
.end .hog { position: absolute; right: 30px; bottom: -30px; height: 640px; }
</style></head><body>${pages.join('\n')}</body></html>`;
};

try {
  await new Promise((r) => setTimeout(r, 600));
  const shots = await shootScreens();
  const htmlFile = join(dir, 'carousel.html');
  writeFileSync(htmlFile, html(shots));
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  await page.goto(pathToFileURL(htmlFile).href, { waitUntil: 'load' });
  await page.evaluate(() => globalThis.document.fonts.ready);
  const out = resolve(root, 'assets/social/kitzy-linkedin-fonctionnalites.pdf');
  await page.pdf({ path: out, width: '1080px', height: '1350px', printBackground: true });
  console.log(`PDF écrit : ${out}`);
  if (process.env.PREVIEW_DIR) {
    // Aperçus PNG de chaque page, pour vérifier la mise en page.
    const sections = await page.locator('section.page').all();
    for (const [i, section] of sections.entries()) {
      await section.screenshot({ path: join(process.env.PREVIEW_DIR, `page-${i + 1}.png`) });
    }
  }
} finally {
  await browser.close();
  server.kill();
  rmSync(dir, { recursive: true, force: true });
}
