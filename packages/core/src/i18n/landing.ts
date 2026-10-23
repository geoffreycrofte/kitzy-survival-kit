/**
 * Textes de la page de présentation (kitzy.lu), dans les cinq langues.
 * Page statique et légère : elle n'embarque pas les textes de l'app.
 */
import type { Locale } from './locales';

export interface LandingTexts {
  title: string;
  description: string;
  skip: string;
  language: string;
  openApp: string;
  hero: { eyebrow: string; title: string; lead: string; open: string; install: string };
  features: {
    title: string;
    items: Array<{ title: string; text: string }>;
  };
  privacy: { title: string; text: string };
  install: {
    title: string;
    intro: string;
    yours: string;
    now: string;
    installed: string;
    platforms: {
      android: { title: string; steps: string[] };
      ios: { title: string; steps: string[] };
      desktop: { title: string; steps: string[] };
    };
    browser: string;
    browserLink: string;
  };
  footer: {
    source: string;
    privacy: string;
    transparency: string;
    project: string;
  };
}

const fr: LandingTexts = {
  title: 'Kitzy, ta réserve d’urgence de 72 heures',
  description:
    'Kitzy t’aide à préparer, suivre et faire tourner ta réserve d’urgence de 72 heures, d’après le guide officiel Lëtz prepare! Gratuit, sans compte, hors ligne.',
  skip: 'Aller au contenu',
  language: 'Langue',
  openApp: 'Ouvrir l’app',
  hero: {
    eyebrow: 'Kit d’urgence 72 h, Luxembourg',
    title: 'Ta réserve d’urgence, prête et à jour.',
    lead: 'Kitzy t’aide à préparer de quoi tenir trois jours chez toi : eau, repas, lumière, chaleur, soins et un plan. Puis il pense aux dates à ta place, en douceur.',
    open: 'Ouvrir Kitzy',
    install: 'Installer l’app',
  },
  features: {
    title: 'Ce que fait Kitzy',
    items: [
      {
        title: 'Six lucioles',
        text: 'Une par essentiel. Elles s’allument au fur et à mesure que ta réserve se remplit.',
      },
      {
        title: 'Une liste de courses',
        text: 'Calculée pour ton foyer, avec l’endroit où ranger chaque article.',
      },
      {
        title: 'Des rappels',
        text: 'Dates de péremption, recharges, mini-check du premier lundi : Kitzy y pense pour toi.',
      },
      {
        title: 'Le guide officiel',
        text: 'Les conseils de Lëtz prepare! en langage clair, et ton plan d’urgence à imprimer.',
      },
    ],
  },
  privacy: {
    title: 'Tout reste chez toi',
    text: 'Pas de compte, pas de publicité : tes données restent sur ton appareil. Kitzy fonctionne même sans connexion.',
  },
  install: {
    title: 'Installer Kitzy',
    intro:
      'Kitzy est une app web : pas besoin de store. Une fois installée, elle s’ouvre comme une app, fonctionne hors ligne et peut te prévenir.',
    yours: 'Ton appareil',
    now: 'Installer maintenant',
    installed: 'Kitzy est déjà installée : ouvre-la depuis ton écran d’accueil.',
    platforms: {
      android: {
        title: 'Android',
        steps: [
          'Ouvre kitzy.lu dans Chrome.',
          'Touche le menu ⋮ en haut à droite.',
          'Choisis « Installer l’application » ou « Ajouter à l’écran d’accueil ».',
        ],
      },
      ios: {
        title: 'iPhone et iPad',
        steps: [
          'Ouvre kitzy.lu dans Safari.',
          'Touche le bouton Partager, le carré avec une flèche.',
          'Choisis « Sur l’écran d’accueil », puis « Ajouter ».',
        ],
      },
      desktop: {
        title: 'Ordinateur',
        steps: [
          'Ouvre kitzy.lu dans Chrome ou Edge.',
          'Clique sur l’icône d’installation dans la barre d’adresse.',
          'Confirme avec « Installer ».',
        ],
      },
    },
    browser: 'Tu préfères ton navigateur ? Kitzy marche aussi très bien sans installation.',
    browserLink: 'Ouvrir Kitzy dans le navigateur',
  },
  footer: {
    source:
      'Conseils tirés du guide officiel Lëtz prepare! Kitzy est une app indépendante, non affiliée au Gouvernement du Luxembourg.',
    privacy: 'Confidentialité',
    transparency: 'Liens d’achat et transparence',
    project: 'Le projet sur GitHub',
  },
};

const en: LandingTexts = {
  title: 'Kitzy, your 72-hour emergency supply',
  description:
    'Kitzy helps you build, track and rotate your 72-hour emergency supply, based on the official Lëtz prepare! guide. Free, no account, works offline.',
  skip: 'Skip to content',
  language: 'Language',
  openApp: 'Open the app',
  hero: {
    eyebrow: '72-hour emergency kit, Luxembourg',
    title: 'Your emergency supply, ready and up to date.',
    lead: 'Kitzy helps you get what you need to manage three days at home: water, meals, light, warmth, care and a plan. Then it keeps an eye on the dates for you, gently.',
    open: 'Open Kitzy',
    install: 'Install the app',
  },
  features: {
    title: 'What Kitzy does',
    items: [
      {
        title: 'Six fireflies',
        text: 'One per essential. They light up as your supply fills up.',
      },
      {
        title: 'A shopping list',
        text: 'Worked out for your household, with where to store each item.',
      },
      {
        title: 'Reminders',
        text: 'Use-by dates, recharging, the first-Monday mini-check: Kitzy remembers for you.',
      },
      {
        title: 'The official guide',
        text: 'Lëtz prepare! advice in plain language, and your emergency plan ready to print.',
      },
    ],
  },
  privacy: {
    title: 'Everything stays with you',
    text: 'No account, no ads: your data stays on your device. Kitzy even works offline.',
  },
  install: {
    title: 'Install Kitzy',
    intro:
      'Kitzy is a web app: no app store needed. Once installed, it opens like an app, works offline and can remind you.',
    yours: 'Your device',
    now: 'Install now',
    installed: 'Kitzy is already installed: open it from your home screen.',
    platforms: {
      android: {
        title: 'Android',
        steps: [
          'Open kitzy.lu in Chrome.',
          'Tap the ⋮ menu at the top right.',
          'Choose “Install app” or “Add to Home screen”.',
        ],
      },
      ios: {
        title: 'iPhone and iPad',
        steps: [
          'Open kitzy.lu in Safari.',
          'Tap the Share button, the square with an arrow.',
          'Choose “Add to Home Screen”, then “Add”.',
        ],
      },
      desktop: {
        title: 'Computer',
        steps: [
          'Open kitzy.lu in Chrome or Edge.',
          'Click the install icon in the address bar.',
          'Confirm with “Install”.',
        ],
      },
    },
    browser: 'Prefer your browser? Kitzy works just as well without installing.',
    browserLink: 'Open Kitzy in the browser',
  },
  footer: {
    source:
      'Advice based on the official Lëtz prepare! guide. Kitzy is an independent app, not affiliated with the Government of Luxembourg.',
    privacy: 'Privacy',
    transparency: 'Shopping links and transparency',
    project: 'The project on GitHub',
  },
};

const de: LandingTexts = {
  title: 'Kitzy, dein Notvorrat für 72 Stunden',
  description:
    'Kitzy hilft dir, deinen Notvorrat für 72 Stunden anzulegen, im Blick zu behalten und rechtzeitig zu erneuern, nach dem offiziellen Ratgeber Lëtz prepare! Kostenlos, ohne Konto, offline nutzbar.',
  skip: 'Zum Inhalt springen',
  language: 'Sprache',
  openApp: 'App öffnen',
  hero: {
    eyebrow: '72-Stunden-Notvorrat, Luxemburg',
    title: 'Dein Notvorrat, bereit und aktuell.',
    lead: 'Kitzy hilft dir, alles für drei Tage zu Hause bereitzuhalten: Wasser, Mahlzeiten, Licht, Wärme, Pflege und einen Plan. Danach behält es die Daten für dich im Blick, ganz entspannt.',
    open: 'Kitzy öffnen',
    install: 'App installieren',
  },
  features: {
    title: 'Was Kitzy kann',
    items: [
      {
        title: 'Sechs Glühwürmchen',
        text: 'Eins pro Grundbedarf. Sie leuchten auf, sobald dein Vorrat wächst.',
      },
      {
        title: 'Eine Einkaufsliste',
        text: 'Für deinen Haushalt berechnet, mit dem Platz für jeden Artikel.',
      },
      {
        title: 'Erinnerungen',
        text: 'Haltbarkeitsdaten, Aufladen, der Mini-Check am ersten Montag: Kitzy denkt für dich daran.',
      },
      {
        title: 'Der offizielle Ratgeber',
        text: 'Die Tipps von Lëtz prepare! in einfacher Sprache und dein Notfallplan zum Ausdrucken.',
      },
    ],
  },
  privacy: {
    title: 'Alles bleibt bei dir',
    text: 'Kein Konto, keine Werbung: Deine Daten bleiben auf deinem Gerät. Kitzy funktioniert sogar offline.',
  },
  install: {
    title: 'Kitzy installieren',
    intro:
      'Kitzy ist eine Web-App: kein App Store nötig. Einmal installiert, öffnet sie sich wie eine App, funktioniert offline und kann dich erinnern.',
    yours: 'Dein Gerät',
    now: 'Jetzt installieren',
    installed: 'Kitzy ist schon installiert: Öffne sie über deinen Startbildschirm.',
    platforms: {
      android: {
        title: 'Android',
        steps: [
          'Öffne kitzy.lu in Chrome.',
          'Tippe oben rechts auf das Menü ⋮.',
          'Wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“.',
        ],
      },
      ios: {
        title: 'iPhone und iPad',
        steps: [
          'Öffne kitzy.lu in Safari.',
          'Tippe auf „Teilen“, das Quadrat mit dem Pfeil.',
          'Wähle „Zum Home-Bildschirm“ und dann „Hinzufügen“.',
        ],
      },
      desktop: {
        title: 'Computer',
        steps: [
          'Öffne kitzy.lu in Chrome oder Edge.',
          'Klicke auf das Installationssymbol in der Adressleiste.',
          'Bestätige mit „Installieren“.',
        ],
      },
    },
    browser: 'Lieber im Browser? Kitzy funktioniert auch ohne Installation.',
    browserLink: 'Kitzy im Browser öffnen',
  },
  footer: {
    source:
      'Tipps nach dem offiziellen Ratgeber Lëtz prepare! Kitzy ist eine unabhängige App, nicht mit der luxemburgischen Regierung verbunden.',
    privacy: 'Datenschutz',
    transparency: 'Kauflinks und Transparenz',
    project: 'Das Projekt auf GitHub',
  },
};

const lb: LandingTexts = {
  title: 'Kitzy, däi Noutvirrot fir 72 Stonnen',
  description:
    'Kitzy hëlleft dir, däi Noutvirrot fir 72 Stonnen unzeleeën, am A ze behalen an z’erneieren, nom offiziellen Guide Lëtz prepare! Gratis, ouni Kont, och offline.',
  skip: 'Direkt bei den Inhalt',
  language: 'Sprooch',
  openApp: 'App opmaachen',
  hero: {
    eyebrow: '72-Stonne-Kit, Lëtzebuerg',
    title: 'Däi Noutvirrot, prett an aktuell.',
    lead: 'Kitzy hëlleft dir, alles fir dräi Deeg doheem prett ze hunn: Waasser, Iessen, Liicht, Wäermt, Fleeg an e Plang. Duerno denkt et fir dech un d’Datumer, ganz entspaant.',
    open: 'Kitzy opmaachen',
    install: 'App installéieren',
  },
  features: {
    title: 'Wat Kitzy mécht',
    items: [
      {
        title: 'Sechs Liichtwiermercher',
        text: 'Eent fir all Basisbesoin. Si ginn un, esou wéi däi Virrot méi grouss gëtt.',
      },
      {
        title: 'Eng Akafslëscht',
        text: 'Fir däin Haushalt ausgerechent, mat der Plaz fir all Artikel.',
      },
      {
        title: 'Erënnerungen',
        text: 'Haltbarkeetsdatumer, Oplueden, de Mini-Check um éischte Méindeg: Kitzy denkt fir dech drun.',
      },
      {
        title: 'Den offizielle Guide',
        text: 'D’Rotschléi vu Lëtz prepare! a kloerer Sprooch, an däin Noutfallplang fir auszedrécken.',
      },
    ],
  },
  privacy: {
    title: 'Alles bleift bei dir',
    text: 'Kee Kont, keng Reklamm: Deng Donnéeë bleiwen op dengem Apparat. Kitzy funktionéiert souguer offline.',
  },
  install: {
    title: 'Kitzy installéieren',
    intro:
      'Kitzy ass eng Web-App: Du brauchs keen App Store. Eemol installéiert, geet se op wéi eng App, funktionéiert offline a kann dech erënneren.',
    yours: 'Däin Apparat',
    now: 'Elo installéieren',
    installed: 'Kitzy ass schonn installéiert: maach se iwwer däin Startbildschierm op.',
    platforms: {
      android: {
        title: 'Android',
        steps: [
          'Maach kitzy.lu a Chrome op.',
          'Dréck uewe riets op de Menü ⋮.',
          'Wiel „App installéieren“ oder „Zum Startbildschierm bäisetzen“.',
        ],
      },
      ios: {
        title: 'iPhone an iPad',
        steps: [
          'Maach kitzy.lu a Safari op.',
          'Dréck op „Deelen“, de Quadrat mam Feil.',
          'Wiel „Zum Home-Bildschirm“ an dann „Hinzufügen“.',
        ],
      },
      desktop: {
        title: 'Computer',
        steps: [
          'Maach kitzy.lu a Chrome oder Edge op.',
          'Klick op d’Installatiounsikon an der Adressläischt.',
          'Confirméier mat „Installéieren“.',
        ],
      },
    },
    browser: 'Léiwer am Browser? Kitzy funktionéiert och ganz gutt ouni Installatioun.',
    browserLink: 'Kitzy am Browser opmaachen',
  },
  footer: {
    source:
      'Rotschléi nom offiziellen Guide Lëtz prepare! Kitzy ass eng onofhängeg App, net mat der Lëtzebuerger Regierung verbonnen.',
    privacy: 'Dateschutz',
    transparency: 'Akafslinken an Transparenz',
    project: 'De Projet op GitHub',
  },
};

const pt: LandingTexts = {
  title: 'Kitzy, a tua reserva de emergência para 72 horas',
  description:
    'O Kitzy ajuda-te a preparar, acompanhar e renovar a tua reserva de emergência para 72 horas, com base no guia oficial Lëtz prepare! Gratuito, sem conta, funciona offline.',
  skip: 'Ir para o conteúdo',
  language: 'Língua',
  openApp: 'Abrir a app',
  hero: {
    eyebrow: 'Kit de emergência 72 horas, Luxemburgo',
    title: 'A tua reserva de emergência, pronta e em dia.',
    lead: 'O Kitzy ajuda-te a ter em casa o necessário para três dias: água, refeições, luz, calor, cuidados e um plano. Depois, lembra-se das datas por ti, com calma.',
    open: 'Abrir o Kitzy',
    install: 'Instalar a app',
  },
  features: {
    title: 'O que faz o Kitzy',
    items: [
      {
        title: 'Seis pirilampos',
        text: 'Um por cada essencial. Acendem-se à medida que a tua reserva cresce.',
      },
      {
        title: 'Uma lista de compras',
        text: 'Calculada para a tua casa, com o sítio onde guardar cada artigo.',
      },
      {
        title: 'Lembretes',
        text: 'Datas de validade, carregamentos, o mini-check da primeira segunda-feira: o Kitzy lembra-se por ti.',
      },
      {
        title: 'O guia oficial',
        text: 'Os conselhos do Lëtz prepare! em linguagem simples, e o teu plano de emergência pronto a imprimir.',
      },
    ],
  },
  privacy: {
    title: 'Tudo fica contigo',
    text: 'Sem conta, sem publicidade: os teus dados ficam no teu aparelho. O Kitzy funciona até sem ligação à internet.',
  },
  install: {
    title: 'Instalar o Kitzy',
    intro:
      'O Kitzy é uma app web: não precisas de loja de apps. Depois de instalado, abre como uma app, funciona offline e pode avisar-te.',
    yours: 'O teu aparelho',
    now: 'Instalar agora',
    installed: 'O Kitzy já está instalado: abre-o a partir do teu ecrã principal.',
    platforms: {
      android: {
        title: 'Android',
        steps: [
          'Abre kitzy.lu no Chrome.',
          'Toca no menu ⋮ em cima, à direita.',
          'Escolhe «Instalar aplicação» ou «Adicionar ao ecrã principal».',
        ],
      },
      ios: {
        title: 'iPhone e iPad',
        steps: [
          'Abre kitzy.lu no Safari.',
          'Toca no botão Partilhar, o quadrado com uma seta.',
          'Escolhe «Adicionar ao ecrã principal» e depois «Adicionar».',
        ],
      },
      desktop: {
        title: 'Computador',
        steps: [
          'Abre kitzy.lu no Chrome ou no Edge.',
          'Clica no ícone de instalação na barra de endereço.',
          'Confirma com «Instalar».',
        ],
      },
    },
    browser: 'Preferes o navegador? O Kitzy também funciona muito bem sem instalação.',
    browserLink: 'Abrir o Kitzy no navegador',
  },
  footer: {
    source:
      'Conselhos baseados no guia oficial Lëtz prepare! O Kitzy é uma app independente, sem ligação ao Governo do Luxemburgo.',
    privacy: 'Privacidade',
    transparency: 'Links de compra e transparência',
    project: 'O projeto no GitHub',
  },
};

export const LANDING: Readonly<Record<Locale, LandingTexts>> = { fr, en, de, lb, pt };
