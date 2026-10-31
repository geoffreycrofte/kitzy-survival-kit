/**
 * Page de présentation de Kitzy (kitzy.lu). Statique et légère :
 * - textes dans la langue choisie, la même que dans l'app (clé `kitzy.locale`) ;
 * - thème et animations réglés comme dans l'app (clés `kitzy.theme`, `kitzy.motion`) ;
 * - la maisonnée : les quantités se recalculent avec les mêmes règles que l'app ;
 * - installation : bouton quand le navigateur le propose, sinon les étapes de l'appareil.
 */
import '@fontsource/young-serif/400.css';
import '@fontsource/figtree/400.css';
import '@fontsource/figtree/600.css';
import '@fontsource/figtree/700.css';
import './landing.css';
import {
  LANDING,
  SITE_URL,
  computeTargets,
  countMembers,
  intlLocale,
  isLocale,
  themeToCssVars,
  themes,
  type Household,
  type LandingTexts,
  type Locale,
  type Member,
  type Plural,
} from '@kitzy/core';

const root = document.documentElement;

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/* ---------- Thème et animations ---------- */

function applyTheme(): void {
  const pref = read('kitzy.theme');
  const light = matchMedia('(prefers-color-scheme: light)').matches;
  const theme = pref === 'clair' || (pref !== 'sombre' && light) ? 'clair' : 'sombre';
  root.dataset.theme = theme;
  for (const [name, value] of Object.entries(themeToCssVars(themes[theme]))) {
    root.style.setProperty(name, value);
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themes[theme].bg);
  const motion = read('kitzy.motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.dataset.motion = motion === 'on' || (motion !== 'off' && !reduced) ? 'full' : 'reduced';
}

/* ---------- Langue ---------- */

/** La langue de la page vient de son adresse (`/`, `/en/`…) : le texte est déjà écrit au build. */
const locale: Locale = isLocale(root.lang) ? root.lang : 'fr';

function texts(): LandingTexts {
  return LANDING[locale];
}

/** Adresse de la page dans une autre langue, depuis la page en cours. */
function hrefFor(target: Locale): string {
  const up = locale === 'fr' ? '' : '../';
  return target === 'fr' ? up || './' : `${up}${target}/`;
}

/** La langue de l'appareil, si Kitzy la parle (sinon rien : pas de suggestion au hasard). */
function deviceLocale(): Locale | null {
  const tags = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of tags) {
    const code = tag.toLowerCase().split('-')[0];
    if (isLocale(code)) return code;
  }
  return null;
}

function remember(value: Locale): void {
  try {
    // Même clé que l'app : la langue choisie ici suit dans Kitzy.
    localStorage.setItem('kitzy.locale', value);
  } catch {
    // Stockage indisponible : la langue vaut pour cette visite.
  }
}

function initLanguage(): void {
  for (const link of document.querySelectorAll<HTMLAnchorElement>('[data-locale]')) {
    link.addEventListener('click', () => {
      const value = link.dataset.locale;
      if (isLocale(value)) remember(value);
    });
  }
  // Menu des langues : Échap le referme (le focus revient sur le bouton), un clic à côté aussi.
  const menu = document.querySelector<HTMLDetailsElement>('details.lang');
  if (menu) {
    menu.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !menu.open) return;
      menu.open = false;
      menu.querySelector('summary')?.focus();
    });
    document.addEventListener('click', (event) => {
      if (menu.open && !menu.contains(event.target as Node)) menu.open = false;
    });
  }
  // L'appareil parle une autre langue, et rien n'a encore été choisi : on propose la traduction.
  const device = deviceLocale();
  const hint = document.querySelector<HTMLElement>('#lang-hint');
  if (!hint || !device || device === locale || isLocale(read('kitzy.locale'))) return;
  const link = document.createElement('a');
  // La même page dans l'autre langue (menu des langues), sinon sa page d'accueil.
  link.href =
    document.querySelector<HTMLAnchorElement>(`[data-locale="${device}"]`)?.href ?? hrefFor(device);
  link.hreflang = device;
  link.lang = device;
  link.textContent = LANDING[device].langHint;
  link.addEventListener('click', () => remember(device));
  hint.append(link);
  hint.hidden = false;
}

/* ---------- La maisonnée ---------- */

type MemberKey = 'adults' | 'children' | 'babies' | 'dogs' | 'cats';
const MAX = 12;

function counts(): Record<MemberKey, number> {
  const out = { adults: 0, children: 0, babies: 0, dogs: 0, cats: 0 };
  for (const el of document.querySelectorAll<HTMLElement>('.member')) {
    out[el.dataset.member as MemberKey] = Number(el.dataset.value ?? 0);
  }
  return out;
}

function household(c: Record<MemberKey, number>): Household {
  const members: Member[] = [];
  const add = (n: number, member: Omit<Member, 'id'>) => {
    for (let i = 0; i < n; i++) members.push({ id: `${member.type}-${members.length}`, ...member });
  };
  add(c.adults, { type: 'adult' });
  add(c.children, { type: 'child' });
  add(c.babies, { type: 'infant' });
  add(c.dogs, { type: 'pet', petSpecies: 'dog' });
  add(c.cats, { type: 'pet', petSpecies: 'cat' });
  return { members, durationDays: 3 };
}

/** Mêmes règles que le catalogue : 3 repas par jour et par mangeur, 2 rations par animal et par jour. */
function results(h: Household): Record<'water' | 'meals' | 'pets' | 'bags', number> {
  const c = countMembers(h);
  return {
    water: computeTargets(h).waterLiters,
    meals: 3 * c.eaters * c.days,
    pets: 2 * c.pets * c.days,
    // Un sac par personne qui peut le porter.
    bags: c.eaters,
  };
}

function plural(word: Plural, n: number): string {
  return new Intl.PluralRules(intlLocale(locale)).select(n) === 'one' ? word.one : word.other;
}

/** Le chiffre défile jusqu'à sa nouvelle valeur (seulement si les animations sont permises). */
function animateNumber(el: HTMLElement, to: number, format: Intl.NumberFormat): void {
  const from = Number(el.dataset.n ?? to);
  el.dataset.n = String(to);
  if (root.dataset.motion !== 'full' || from === to) {
    el.textContent = format.format(to);
    return;
  }
  const start = performance.now();
  const duration = 420;
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = format.format(Math.round((from + (to - from) * eased) * 10) / 10);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  el.classList.remove('result__n--bump');
  void el.offsetWidth;
  el.classList.add('result__n--bump');
}

function renderHousehold(animate: boolean): void {
  const t = texts().household;
  const c = counts();
  const values = results(household(c));
  const format = new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 1 });
  for (const key of Object.keys(values) as Array<keyof typeof values>) {
    const n = document.querySelector<HTMLElement>(`[data-result="${key}"]`);
    const label = document.querySelector<HTMLElement>(`[data-result-label="${key}"]`);
    if (n) {
      if (animate) animateNumber(n, values[key], format);
      else {
        n.dataset.n = String(values[key]);
        n.textContent = format.format(values[key]);
      }
    }
    if (label) label.textContent = plural(t.results[key], values[key]);
  }
  const pets = document.querySelector<HTMLElement>('[data-result-row="pets"]');
  if (pets) pets.hidden = values.pets === 0;

  for (const el of document.querySelectorAll<HTMLElement>('.member')) {
    const key = el.dataset.member as MemberKey;
    const name = t.members[key];
    const value = c[key];
    const [less, more] = el.querySelectorAll<HTMLButtonElement>('.stepper__btn');
    if (less) {
      less.setAttribute('aria-label', t.less.replace('{{label}}', name));
      less.disabled = value <= 0;
    }
    if (more) {
      more.setAttribute('aria-label', t.more.replace('{{label}}', name));
      more.disabled = value >= MAX;
    }
    const output = el.querySelector('output');
    if (output) output.textContent = String(value);
  }
}

function initHousehold(): void {
  for (const el of document.querySelectorAll<HTMLElement>('.member')) {
    el.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.stepper__btn');
      if (!button || button.disabled) return;
      const value = Math.min(
        MAX,
        Math.max(0, Number(el.dataset.value ?? 0) + Number(button.dataset.step)),
      );
      el.dataset.value = String(value);
      renderHousehold(true);
      // Le bouton devenu inactif (0 ou maximum) rend le focus à son voisin.
      if (button.disabled)
        el.querySelector<HTMLButtonElement>('.stepper__btn:not(:disabled)')?.focus();
    });
  }
}

/* ---------- Installation ---------- */

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function platform(): 'android' | 'ios' | 'desktop' {
  const ua = navigator.userAgent;
  if (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  ) {
    return 'ios';
  }
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

function initInstall(): void {
  // L'appareil de la personne passe en premier, signalé en toutes lettres.
  const mine = platform();
  const list = document.querySelector('.platforms');
  const card = document.querySelector<HTMLElement>(`.platform[data-platform="${mine}"]`);
  if (list && card) {
    card.classList.add('platform--yours');
    list.prepend(card);
  }

  const button = document.querySelector<HTMLButtonElement>('#install-now');
  const state = document.querySelector<HTMLElement>('#install-state');
  let deferred: InstallPromptEvent | null = null;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferred = event as InstallPromptEvent;
    if (button) button.hidden = false;
  });
  window.addEventListener('appinstalled', () => {
    if (button) button.hidden = true;
    if (state) state.textContent = texts().install.installed;
  });
  button?.addEventListener('click', async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    button.hidden = true;
  });
}

/* ---------- Partager Kitzy ---------- */

function initShare(): void {
  const button = document.querySelector<HTMLButtonElement>('#share-app');
  const state = document.querySelector<HTMLElement>('#share-state');
  button?.addEventListener('click', async () => {
    const t = texts().together;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: t.shareTitle, text: t.message, url: SITE_URL });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        // Partage refusé : on copie le lien à la place.
      }
    }
    try {
      await navigator.clipboard.writeText(`${t.message} ${SITE_URL}`);
      if (state) state.textContent = t.copied;
    } catch {
      // Pas de presse-papiers : le QR code et l'adresse restent visibles.
    }
  });
}

applyTheme();
initHousehold();
renderHousehold(false);
initLanguage();
initInstall();
initShare();
matchMedia('(prefers-color-scheme: light)').addEventListener('change', applyTheme);
