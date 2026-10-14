/**
 * Textes français (langue source). Format i18next, pluriels en `_one` / `_other`.
 */
export const fr = {
  app: {
    name: 'Kitzy',
    skipLink: 'Aller au contenu',
    homeLink: 'Kitzy, accueil',
    nav: 'Navigation principale',
    update: 'Une nouvelle version de Kitzy est prête.',
    updateAction: 'Recharger',
    offlineReady: 'Kitzy fonctionne maintenant sans connexion.',
    dismiss: 'Fermer',
  },
  nav: {
    home: 'Terrier',
    shopping: 'Courses',
    plan: 'Mon plan',
    guide: 'Guide',
    settings: 'Réglages',
  },
  theme: {
    toDark: 'Passer en thème sombre',
    toLight: 'Passer en thème clair',
  },
  essentials: {
    water: 'Eau',
    food: 'Repas',
    light: 'Lumière',
    warmth: 'Chaleur',
    care: 'Soins',
    plan: 'Mon plan',
  },
  home: {
    title: 'Terrier',
    hello: 'Moien !',
    stage: {
      start: 'Prépare ton terrier.',
      growing: 'Ton terrier se prépare.',
      weekend: 'Ton terrier tient déjà un week-end.',
      ready: 'Ton terrier tient 72 h.',
    },
    fliesLabel_one: '{{count}} luciole allumée sur 6',
    fliesLabel_other: '{{count}} lucioles allumées sur 6',
    remaining_one: 'Encore {{count}} luciole à allumer pour tenir 72 h.',
    remaining_other: 'Encore {{count}} lucioles à allumer pour tenir 72 h.',
    firstMissionLabel: 'Pour commencer',
    firstMission: 'Dis-moi qui vit chez toi : je calcule ce qu’il te faut pour 72 h.',
    firstMissionCta: 'Présenter mon foyer',
  },
  soon: {
    body: 'Cette partie de Kitzy arrive bientôt.',
    back: 'Retour au terrier',
  },
  settings: {
    title: 'Réglages',
    theme: 'Thème',
    themeSystem: 'Comme mon appareil',
    themeDark: 'Sombre',
    themeLight: 'Clair',
    motion: 'Animations d’ambiance',
    motionHelp:
      'Les lucioles qui flottent et la lanterne qui respire. Par défaut, Kitzy suit le réglage « réduire les animations » de ton appareil.',
    motionAuto: 'Comme mon appareil',
    motionOn: 'Activées',
    motionOff: 'Désactivées',
    language: 'Langue',
    languageSoon:
      'Kitzy parle français pour l’instant. L’anglais, le luxembourgeois, l’allemand et le portugais arrivent.',
  },
  pages: {
    shopping: 'Courses',
    plan: 'Mon plan',
    guide: 'Guide',
    household: 'Mon foyer',
    notFound: 'Page introuvable',
  },
  notFound: {
    body: 'Cette page n’existe pas, ou plus. Le terrier, lui, est toujours là.',
  },
} as const;

export type Messages = typeof fr;
