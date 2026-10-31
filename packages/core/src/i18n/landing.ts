/**
 * Textes de la page de présentation (kitzy.lu), dans les cinq langues.
 * Page statique et légère : elle n'embarque pas les textes de l'app.
 */
import type { Locale } from './locales';

/** Un mot qui s'accorde avec un nombre. */
export interface Plural {
  one: string;
  other: string;
}

export interface LandingTexts {
  title: string;
  description: string;
  skip: string;
  language: string;
  /** Lien proposé quand l'appareil parle une autre langue que la page. */
  langHint: string;
  /** Texte alternatif de l'image de partage de cette langue. */
  ogImageAlt: string;
  /** Phrase sous le titre, sur l'image de partage. */
  ogTagline: string;
  openApp: string;
  hero: { title: string; lead: string; open: string; install: string };
  /** Ce que fait l'app, en une liste : la réponse à « mais ça sert à quoi ? ». */
  features: { title: string; lead: string; items: Array<{ title: string; text: string }> };
  household: {
    title: string;
    lead: string;
    legend: string;
    members: { adults: string; children: string; babies: string; dogs: string; cats: string };
    /** Noms accessibles des boutons, avec `{{label}}`. */
    more: string;
    less: string;
    results: { water: Plural; meals: Plural; pets: Plural; bags: Plural };
    note: string;
    lists: string;
  };
  split: {
    title: string;
    lead: string;
    home: { title: string; items: string[] };
    bag: { title: string; items: string[] };
  };
  buy: {
    title: string;
    text: string;
    tiers: Array<{ mark: string; name: string; text: string }>;
    fair: string;
  };
  reminders: {
    title: string;
    lead: string;
    samples: Array<{ when: string; what: string }>;
    notify: string;
    ics: string;
  };
  evening: {
    title: string;
    lead: string;
    programme: Array<{ time: string; title: string; text: string }>;
    after: string;
  };
  privacy: { title: string; text: string };
  /** Partager Kitzy : pourquoi, le bouton, le QR code. */
  together: {
    title: string;
    text: string;
    button: string;
    qrLabel: string;
    qrHelp: string;
    copied: string;
    message: string;
    shareTitle: string;
  };
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
    studio: { before: string; after: string };
    checkfox: { before: string; after: string };
    privacy: string;
    transparency: string;
    project: string;
  };
}

const fr: LandingTexts = {
  title: 'Kitzy, ta réserve d’urgence de 72 heures',
  description:
    'Kitzy t’aide à préparer, suivre et faire tourner ta réserve d’urgence de 72 heures, d’après le guide officiel Lëtz prepare!. Gratuit, sans compte, hors ligne.',
  skip: 'Aller au contenu',
  language: 'Langue',
  langHint: 'Lire cette page en français',
  ogImageAlt:
    'Kitzy le hérisson tient une lanterne allumée, à côté du titre « Trois jours d’avance sur l’imprévu. »',
  ogTagline:
    'Ta réserve d’urgence de 72\u00a0heures, calculée pour ton foyer. Gratuit, sans compte, hors ligne.',
  openApp: 'Ouvrir l’app',
  hero: {
    title: 'Trois jours d’avance sur l’imprévu.',
    lead: 'Panne de courant, tempête, crise grave : Kitzy t’aide à préparer de quoi tenir 72 heures chez toi, pas à pas et sans angoisse. Il calcule, range et surveille les dates à ta place. Gratuit, sans compte, et ça marche hors ligne.',
    open: 'Ouvrir Kitzy',
    install: 'L’installer',
  },
  features: {
    title: 'Ce que Kitzy fait pour toi',
    lead: 'Se préparer à une crise, c’est souvent une liste sans fin et une boule au ventre. Kitzy en fait un projet simple, à ton rythme.',
    items: [
      {
        title: 'Se préparer sans s’angoisser',
        text: 'Pas de scénario catastrophe : des petites étapes, des progrès qui se voient, et un hérisson qui t’encourage.',
      },
      {
        title: 'Ta réserve, à la maison et dans les sacs',
        text: 'Panne de courant, tempête, inondation, conflit : Kitzy calcule ce qu’il faut à ton foyer et te dit où ranger chaque chose.',
      },
      {
        title: 'Des alertes avant les péremptions',
        text: 'Eau, conserves, piles, médicaments : tu es prévenu à temps, sur ton téléphone ou dans ton agenda.',
      },
      {
        title: 'Une routine qui tient',
        text: 'Un mini-check de deux minutes le premier lundi du mois, un grand check-up aux changements d’heure. Le kit reste prêt sans que tu y penses.',
      },
      {
        title: 'Des recettes avec tes conserves',
        text: 'Chili express, pâtes aux sardines, salade de lentilles : des idées originales pour faire tourner tes boîtes avant qu’elles ne périment.',
      },
      {
        title: 'Toute la famille embarquée',
        text: 'Un plan d’urgence à remplir ensemble et à imprimer, une liste de courses à partager par lien, des défis et un quiz à faire en famille.',
      },
      {
        title: 'Le voisinage, dans les deux sens',
        text: 'Ton plan note les voisins qui peuvent t’aider et ceux qui auront besoin de toi. Et tu leur fais découvrir Kitzy d’un QR code.',
      },
    ],
  },

  household: {
    title: 'Calculé pour ta maisonnée',
    lead: 'Dis à Kitzy qui vit chez toi, animaux compris : il calcule les quantités à réunir. Essaie.',
    legend: 'Chez moi, il y a',
    members: {
      adults: 'Adultes',
      children: 'Enfants',
      babies: 'Bébés',
      dogs: 'Chiens',
      cats: 'Chats',
    },
    more: '{{label}} : un de plus',
    less: '{{label}} : un de moins',
    results: {
      water: { one: 'litre d’eau', other: 'litres d’eau' },
      meals: { one: 'repas', other: 'repas' },
      pets: { one: 'ration pour les animaux', other: 'rations pour les animaux' },
      bags: { one: 'sac à dos prêt à partir', other: 'sacs à dos prêts à partir' },
    },
    note: 'Pour 72 heures, d’après les repères officiels : 3 litres d’eau par personne et par jour.',
    lists:
      'Par défaut, Kitzy suit la liste officielle du Luxembourg. Tu peux activer en un geste la liste conseillée par des experts, ou la version complète, confort compris.',
  },
  split: {
    title: 'La maison, et les sacs à dos',
    lead: 'Le gros de la réserve reste chez toi. Un sac par personne attend près de la porte, au cas où il faudrait partir. Kitzy répartit chaque article et te dit où le ranger.',
    home: {
      title: 'À la maison',
      items: [
        'L’eau et les repas pour trois jours',
        'Le réchaud, les lampes, les piles',
        'Couvertures et vêtements chauds',
        'La trousse de soins et les médicaments',
      ],
    },
    bag: {
      title: 'Dans chaque sac',
      items: [
        'Une bouteille d’eau et des en-cas',
        'Lampe frontale et batterie externe',
        'Copies des papiers et un peu d’argent liquide',
        'Les médicaments du quotidien',
      ],
    },
  },
  buy: {
    title: 'Quoi acheter, à ton budget',
    text: 'Pour beaucoup d’articles, Kitzy propose des pistes à trois budgets. Sans prix affiché, sans marque imposée : des caractéristiques à chercher, ou ce que tu as déjà.',
    tiers: [
      { mark: '€', name: 'Essentiel', text: 'L’indispensable, simple et efficace.' },
      { mark: '€€', name: 'Équilibré', text: 'Plus pratique au quotidien.' },
      { mark: '€€€', name: 'Durable', text: 'Fait pour durer des années.' },
    ],
    fair: 'Un conseil ne dépend jamais d’un lien d’affiliation, et chaque lien le dit.',
  },
  reminders: {
    title: 'Les dates, sans y penser',
    lead: 'Péremptions, recharges, check-ups : Kitzy note tout et te prévient au bon moment.',
    samples: [
      { when: 'Premier lundi du mois, midi', what: 'Mini-check pendant le test des sirènes' },
      { when: 'Dans 30 jours', what: 'Conserves à consommer, puis à racheter' },
      { when: 'Changement d’heure', what: 'Grand check-up de la réserve' },
    ],
    notify:
      'Quand ton navigateur le permet, les notifications sont calculées sur ton appareil : aucune donnée ne part ailleurs.',
    ics: 'Sinon, ou en plus, exporte tes rappels dans un fichier agenda (.ics) pour ton téléphone.',
  },
  evening: {
    title: 'Se préparer, en s’amusant',
    lead: 'Programme d’une soirée au terrier, à vivre en famille.',
    programme: [
      {
        time: '19 h',
        title: 'Soirée « boîtes »',
        text: 'Une recette avec les conserves qui approchent de leur date. Chili, soupe ou riz au lait.',
      },
      {
        time: '20 h',
        title: 'Défi sans électricité',
        text: 'On éteint tout et on vit avec le kit. Ce qui manque part dans la liste de courses.',
      },
      {
        time: '21 h',
        title: 'Simulation 72 h',
        text: 'Trois jours sans courant, choix après choix, avec ce que ton foyer a vraiment.',
      },
      {
        time: '21 h 30',
        title: 'Quiz des bons réflexes',
        text: 'Sirènes, alertes, rumeurs : dix questions, sans chronomètre.',
      },
    ],
    after:
      'Et chaque premier lundi à midi, un mini-check de deux minutes. Des succès se débloquent au fil des progrès.',
  },
  privacy: {
    title: 'Tout reste chez toi',
    text: 'Pas de compte, pas de publicité, pas de suivi. Tes données restent sur ton appareil, et Kitzy fonctionne même sans connexion.',
  },
  together: {
    title: 'Quand la famille et le quartier sont prêts, on s’entraide plus facilement.',
    text: 'Parle de Kitzy à tes proches et à tes voisins : chacun prépare son kit, et vous pourrez compter les uns sur les autres.',
    button: 'Partager Kitzy',
    qrLabel: 'QR code vers kitzy.lu, à scanner avec l’appareil photo',
    qrHelp:
      'À montrer à un voisin ou à un proche : il le scanne avec l’appareil photo de son téléphone.',
    copied: 'Lien copié : colle-le dans un message.',
    message:
      'Je prépare notre kit pour tenir 72 heures avec Kitzy. C’est gratuit, et tout reste sur le téléphone. Quand la famille et le quartier sont prêts, on s’entraide plus facilement.',
    shareTitle: 'Kitzy, le kit 72 h',
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
    studio: { before: 'Distribué gratuitement par ', after: '.' },
    checkfox: { before: 'Rendu accessible grâce à ', after: '.' },
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
  langHint: 'Read this page in English',
  ogImageAlt:
    'Kitzy the hedgehog holds a lit lantern, next to the title “Three days ahead of the unexpected.”',
  ogTagline:
    'Your 72-hour emergency supply, sized for your household. Free, no account, works offline.',
  openApp: 'Open the app',
  hero: {
    title: 'Three days ahead of the unexpected.',
    lead: 'Power cut, storm, serious crisis: Kitzy helps you get ready to manage 72 hours at home, step by step and without the worry. It does the maths, sorts things out and watches the dates for you. Free, no account, and it works offline.',
    open: 'Open Kitzy',
    install: 'Install it',
  },
  features: {
    title: 'What Kitzy does for you',
    lead: 'Getting ready for a crisis often means an endless list and a knot in your stomach. Kitzy turns it into a simple project, at your own pace.',
    items: [
      {
        title: 'Prepare without the worry',
        text: 'No disaster scenarios: small steps, progress you can see, and a hedgehog cheering you on.',
      },
      {
        title: 'Your supply, at home and in your bags',
        text: 'Power cut, storm, flooding, conflict: Kitzy works out what your household needs and tells you where to keep each thing.',
      },
      {
        title: 'Alerts before things expire',
        text: 'Water, tins, batteries, medicines: you’re warned in time, on your phone or in your calendar.',
      },
      {
        title: 'A routine that sticks',
        text: 'A two-minute mini-check on the first Monday of the month, a big check-up when the clocks change. Your kit stays ready without you having to think about it.',
      },
      {
        title: 'Recipes from your tins',
        text: 'Quick chilli, sardine pasta, lentil salad: fresh ideas to use up your tins before they expire.',
      },
      {
        title: 'The whole family on board',
        text: 'An emergency plan to fill in together and print, a shopping list to share by link, challenges and a quiz to do as a family.',
      },
      {
        title: 'Neighbours, both ways',
        text: 'Your plan lists the neighbours who can help you and those who will need you. And a QR code is all it takes to show them Kitzy.',
      },
    ],
  },

  household: {
    title: 'Worked out for your household',
    lead: 'Tell Kitzy who lives with you, pets included: it works out the quantities to gather. Give it a try.',
    legend: 'At home, there are',
    members: {
      adults: 'Adults',
      children: 'Children',
      babies: 'Babies',
      dogs: 'Dogs',
      cats: 'Cats',
    },
    more: '{{label}}: one more',
    less: '{{label}}: one fewer',
    results: {
      water: { one: 'litre of water', other: 'litres of water' },
      meals: { one: 'meal', other: 'meals' },
      pets: { one: 'pet ration', other: 'pet rations' },
      bags: { one: 'grab bag ready to go', other: 'grab bags ready to go' },
    },
    note: 'For 72 hours, based on official guidance: 3 litres of water per person per day.',
    lists:
      'By default, Kitzy follows Luxembourg’s official list. In one tap, you can switch on the list recommended by experts, or the complete version with home comforts.',
  },
  split: {
    title: 'Your home, and your grab bags',
    lead: 'Most of the supply stays at home. One bag per person waits by the door, in case you have to leave. Kitzy sorts every item and tells you where to put it.',
    home: {
      title: 'At home',
      items: [
        'Water and meals for three days',
        'The camping stove, torches, batteries',
        'Blankets and warm clothes',
        'The first-aid kit and medicines',
      ],
    },
    bag: {
      title: 'In each bag',
      items: [
        'A bottle of water and snacks',
        'A head torch and a power bank',
        'Copies of documents and some cash',
        'Everyday medicines',
      ],
    },
  },
  buy: {
    title: 'What to buy, on your budget',
    text: 'For many items, Kitzy suggests ideas at three budgets. No prices, no brands pushed: features to look for, or what you already own.',
    tiers: [
      { mark: '€', name: 'Essential', text: 'The basics, simple and effective.' },
      { mark: '€€', name: 'Balanced', text: 'Handier day to day.' },
      { mark: '€€€', name: 'Lasting', text: 'Built to last for years.' },
    ],
    fair: 'Advice never depends on an affiliate link, and every link says so.',
  },
  reminders: {
    title: 'Dates, without the worry',
    lead: 'Use-by dates, recharging, check-ups: Kitzy keeps track and lets you know at the right time.',
    samples: [
      { when: 'First Monday of the month, noon', what: 'Mini-check during the siren test' },
      { when: 'In 30 days', what: 'Tins to eat, then to replace' },
      { when: 'When the clocks change', what: 'Big check-up of your supply' },
    ],
    notify:
      'When your browser allows it, notifications are worked out on your device: no data goes anywhere else.',
    ics: 'Otherwise, or as well, export your reminders to a calendar file (.ics) for your phone.',
  },
  evening: {
    title: 'Getting ready, the fun way',
    lead: 'An evening at the burrow, to share with the family.',
    programme: [
      {
        time: '7 pm',
        title: 'Tinned-food night',
        text: 'A recipe with the tins nearing their date. Chilli, soup or rice pudding.',
      },
      {
        time: '8 pm',
        title: 'No-electricity challenge',
        text: 'Switch everything off and live with the kit. Whatever’s missing goes on the shopping list.',
      },
      {
        time: '9 pm',
        title: '72-hour simulation',
        text: 'Three days without power, choice by choice, with what your household really has.',
      },
      {
        time: '9.30 pm',
        title: 'Good-reflexes quiz',
        text: 'Sirens, alerts, rumours: ten questions, no timer.',
      },
    ],
    after:
      'And every first Monday at noon, a two-minute mini-check. Achievements unlock as you progress.',
  },
  privacy: {
    title: 'Everything stays with you',
    text: 'No account, no ads, no tracking. Your data stays on your device, and Kitzy even works offline.',
  },
  together: {
    title: 'When family and neighbours are ready, it’s easier to help each other.',
    text: 'Tell your loved ones and neighbours about Kitzy: everyone prepares their own kit, and you can count on each other.',
    button: 'Share Kitzy',
    qrLabel: 'QR code to kitzy.lu, to scan with a phone camera',
    qrHelp: 'Show it to a neighbour or a relative: they scan it with their phone’s camera.',
    copied: 'Link copied: paste it into a message.',
    message:
      'I’m preparing our kit to last 72 hours with Kitzy. It’s free, and everything stays on the phone. When family and neighbours are ready, it’s easier to help each other.',
    shareTitle: 'Kitzy, the 72-hour kit',
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
    studio: { before: 'Distributed free of charge by ', after: '.' },
    checkfox: { before: 'Made accessible thanks to ', after: '.' },
    privacy: 'Privacy',
    transparency: 'Shopping links and transparency',
    project: 'The project on GitHub',
  },
};

// Allemand, luxembourgeois et portugais : traduits à partir du français (voir plus bas).
import { de, lb, pt } from './landing.more';

export const LANDING: Readonly<Record<Locale, LandingTexts>> = { fr, en, de, lb, pt };
