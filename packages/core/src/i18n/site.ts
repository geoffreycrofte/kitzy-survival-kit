/**
 * Textes des pages publiques du site (kitzy.lu/kit/, kitzy.lu/guide/), dans les cinq langues.
 * Ces pages reprennent le catalogue, les conseils d'achat et le guide de l'app, lisibles sans
 * l'app et par les moteurs de recherche. Les textes de l'app (paliers, sources, guide) sont
 * réutilisés tels quels : ici, seulement ce qui est propre au site.
 */
import type { QuantityPer } from '../catalog';
import type { Locale } from './locales';

export interface SiteTexts {
  nav: { home: string; kit: string; guide: string; crumbs: string };
  kit: {
    title: string;
    metaTitle: string;
    description: string;
    lead: string;
    legend: string;
    home: string;
    bag: string;
    /** Lien vers la fiche d'un article, avec `{{name}}`. */
    advice: string;
  };
  /** Quantité par règle du catalogue : `{{q}}` vaut « 2 pièces », `{{n}}` un nombre seul. */
  rules: Record<QuantityPer, string>;
  item: {
    metaTitle: string;
    description: string;
    quantity: string;
    readAlso: string;
    related: string;
    back: string;
  };
  guide: {
    title: string;
    metaTitle: string;
    description: string;
    /** Titre d'une page du guide dans l'onglet, avec `{{title}}`. */
    metaTitleArticle: string;
  };
  cta: { title: string; text: string; button: string };
  /** Lien vers la liste, depuis la page d'accueil. */
  more: string;
}

const fr: SiteTexts = {
  nav: { home: 'Accueil', kit: 'La liste du kit', guide: 'Le guide', crumbs: 'Fil d’Ariane' },
  kit: {
    title: 'La liste du kit d’urgence 72 heures',
    metaTitle: 'Liste du kit d’urgence 72 h au Luxembourg : quoi stocker | Kitzy',
    description:
      'La liste du kit d’urgence pour tenir 72 heures : eau, repas, lumière, chaleur, soins, documents. D’après le guide officiel Lëtz prepare!, avec les quantités et des conseils d’achat.',
    lead: 'Tout ce qu’il faut pour tenir trois jours chez toi, et le sac à préparer pour chaque personne. La liste officielle du Luxembourg, complétée par les conseils des listes expertes.',
    legend:
      '« Liste officielle » vient du guide Lëtz prepare!. « Conseillé » vient des listes expertes. « Confort » rend les jours plus doux.',
    home: 'À la maison',
    bag: 'Dans chaque sac',
    advice: 'Bien choisir : {{name}}',
  },
  rules: {
    household: '{{q}} pour le foyer',
    person: '{{q}} par personne',
    personDay: '{{q}} par personne et par jour',
    meal: '{{n}} repas par personne et par jour',
    water: '3 L par personne et par jour, plus l’eau des animaux',
    pet: '{{q}} par animal',
    petDay: '{{q}} par animal et par jour',
    infant: '{{q}} par bébé et par jour',
  },
  item: {
    metaTitle: '{{name}} : bien le choisir pour ton kit d’urgence | Kitzy',
    description:
      '{{name}} pour ton kit d’urgence 72 h : la quantité à prévoir, ce qu’il faut regarder et des pistes à trois budgets.',
    quantity: 'Combien en prévoir',
    readAlso: 'À lire dans le guide',
    related: 'Dans la même rubrique',
    back: 'Toute la liste du kit',
  },
  guide: {
    title: 'Le guide pour se préparer',
    metaTitle: 'Se préparer à une crise au Luxembourg : le guide en clair | Kitzy',
    description:
      'Les conseils officiels Lëtz prepare! en langage clair : pourquoi 72 heures, coupure d’électricité, LU-Alert, sirènes, s’informer, s’entraider.',
    metaTitleArticle: '{{title}} | Kitzy',
  },
  cta: {
    title: 'Kitzy calcule tout ça pour ton foyer',
    text: 'Indique qui vit chez toi : Kitzy calcule les quantités, range chaque article à sa place et te prévient avant les dates. Gratuit, sans compte, et ça marche hors ligne.',
    button: 'Ouvrir Kitzy',
  },
  more: 'Voir la liste complète du kit',
};

const en: SiteTexts = {
  nav: { home: 'Home', kit: 'The kit list', guide: 'The guide', crumbs: 'Breadcrumb' },
  kit: {
    title: 'The 72-hour emergency kit list',
    metaTitle: '72-hour emergency kit list for Luxembourg: what to store | Kitzy',
    description:
      'The emergency kit list to get through 72 hours: water, meals, light, warmth, care, documents. Based on the official Lëtz prepare! guide, with quantities and buying advice.',
    lead: 'Everything you need to get through three days at home, and the bag to pack for each person. The official Luxembourg list, completed with advice from expert lists.',
    legend:
      '“Official list” comes from the Lëtz prepare! guide. “Recommended” comes from expert lists. “Comfort” makes the days easier.',
    home: 'At home',
    bag: 'In each bag',
    advice: 'Choosing well: {{name}}',
  },
  rules: {
    household: '{{q}} for the household',
    person: '{{q}} per person',
    personDay: '{{q}} per person per day',
    meal: '{{n}} meals per person per day',
    water: '3 L per person per day, plus water for pets',
    pet: '{{q}} per pet',
    petDay: '{{q}} per pet per day',
    infant: '{{q}} per baby per day',
  },
  item: {
    metaTitle: '{{name}}: choosing well for your emergency kit | Kitzy',
    description:
      '{{name}} for your 72-hour emergency kit: how much to keep, what to look for, and ideas at three budgets.',
    quantity: 'How much to keep',
    readAlso: 'Read in the guide',
    related: 'In the same section',
    back: 'The full kit list',
  },
  guide: {
    title: 'The guide to getting ready',
    metaTitle: 'Getting ready for a crisis in Luxembourg: the plain-language guide | Kitzy',
    description:
      'The official Lëtz prepare! advice in plain words: why 72 hours, power cuts, LU-Alert, sirens, staying informed, helping each other.',
    metaTitleArticle: '{{title}} | Kitzy',
  },
  cta: {
    title: 'Kitzy works all this out for your household',
    text: 'Tell Kitzy who lives with you: it works out the quantities, puts each item in its place and reminds you before the dates. Free, no account, and it works offline.',
    button: 'Open Kitzy',
  },
  more: 'See the full kit list',
};

const de: SiteTexts = {
  nav: {
    home: 'Startseite',
    kit: 'Die Notvorrat-Liste',
    guide: 'Der Leitfaden',
    crumbs: 'Brotkrumen',
  },
  kit: {
    title: 'Die Liste für den Notvorrat für 72 Stunden',
    metaTitle: 'Notvorrat-Liste für 72 Stunden in Luxemburg: was einlagern | Kitzy',
    description:
      'Die Liste für deinen Notvorrat für 72 Stunden: Wasser, Mahlzeiten, Licht, Wärme, Pflege, Dokumente. Nach dem offiziellen Leitfaden Lëtz prepare!, mit Mengen und Kaufberatung.',
    lead: 'Alles, um drei Tage zu Hause durchzuhalten, und der Rucksack für jede Person. Die offizielle Liste Luxemburgs, ergänzt um die Ratschläge von Expertenlisten.',
    legend:
      '„Offizielle Liste“ stammt aus dem Leitfaden Lëtz prepare!. „Empfohlen“ stammt aus Expertenlisten. „Komfort“ macht die Tage angenehmer.',
    home: 'Zu Hause',
    bag: 'In jedem Rucksack',
    advice: 'Gut auswählen: {{name}}',
  },
  rules: {
    household: '{{q}} für den Haushalt',
    person: '{{q}} pro Person',
    personDay: '{{q}} pro Person und Tag',
    meal: '{{n}} Mahlzeiten pro Person und Tag',
    water: '3 L pro Person und Tag, plus Wasser für die Haustiere',
    pet: '{{q}} pro Tier',
    petDay: '{{q}} pro Tier und Tag',
    infant: '{{q}} pro Baby und Tag',
  },
  item: {
    metaTitle: '{{name}}: richtig auswählen für deinen Notvorrat | Kitzy',
    description:
      '{{name}} für deinen Notvorrat für 72 Stunden: die richtige Menge, worauf du achten solltest, und Vorschläge für drei Budgets.',
    quantity: 'Wie viel du brauchst',
    readAlso: 'Im Leitfaden lesen',
    related: 'In derselben Rubrik',
    back: 'Die ganze Liste',
  },
  guide: {
    title: 'Der Leitfaden zur Vorsorge',
    metaTitle: 'Vorsorge für Krisen in Luxemburg: der Leitfaden in einfacher Sprache | Kitzy',
    description:
      'Die offiziellen Ratschläge von Lëtz prepare! in einfachen Worten: warum 72 Stunden, Stromausfall, LU-Alert, Sirenen, sich informieren, sich gegenseitig helfen.',
    metaTitleArticle: '{{title}} | Kitzy',
  },
  cta: {
    title: 'Kitzy rechnet das alles für deinen Haushalt aus',
    text: 'Sag Kitzy, wer bei dir wohnt: Kitzy berechnet die Mengen, ordnet jeden Artikel seinem Platz zu und erinnert dich vor den Terminen. Kostenlos, ohne Konto, und es funktioniert offline.',
    button: 'Kitzy öffnen',
  },
  more: 'Die ganze Notvorrat-Liste ansehen',
};

const lb: SiteTexts = {
  nav: { home: 'Startsäit', kit: 'D’Lëscht vum Kit', guide: 'De Guide', crumbs: 'Navigatiounspad' },
  kit: {
    title: 'D’Lëscht vum Noutkit fir 72 Stonnen',
    metaTitle: 'Lëscht vum Noutkit fir 72 Stonnen zu Lëtzebuerg: wat ophalen | Kitzy',
    description:
      'D’Lëscht vum Noutkit, fir 72 Stonnen duerchzehalen: Waasser, Iessen, Liicht, Wäermt, Fleeg, Dokumenter. Nom offizielle Guide Lëtz prepare!, mat de Quantitéiten an Akafstipps.',
    lead: 'Alles, fir dräi Deeg doheem duerchzehalen, an de Rucksak fir all Persoun. Déi offiziell Lëscht vu Lëtzebuerg, ergänzt mat de Rotschléi vun Expertelëschten.',
    legend:
      '„Offiziell Lëscht“ kënnt aus dem Guide Lëtz prepare!. „Recommandéiert“ kënnt vun Expertelëschten. „Komfort“ mécht d’Deeg méi agreabel.',
    home: 'Doheem',
    bag: 'An all Rucksak',
    advice: 'Gutt auswielen: {{name}}',
  },
  rules: {
    household: '{{q}} fir den Haushalt',
    person: '{{q}} pro Persoun',
    personDay: '{{q}} pro Persoun an Dag',
    meal: '{{n}} Moolzechten pro Persoun an Dag',
    water: '3 L pro Persoun an Dag, plus Waasser fir d’Déieren',
    pet: '{{q}} pro Déier',
    petDay: '{{q}} pro Déier an Dag',
    infant: '{{q}} pro Puppelchen an Dag',
  },
  item: {
    metaTitle: '{{name}}: gutt auswielen fir däin Noutkit | Kitzy',
    description:
      '{{name}} fir däin Noutkit fir 72 Stonnen: wéi vill s de brauchs, op wat s de oppasse solls, an Iddien fir dräi Budgeten.',
    quantity: 'Wéi vill s de brauchs',
    readAlso: 'Am Guide liesen',
    related: 'An der selwechter Rubrik',
    back: 'Déi ganz Lëscht',
  },
  guide: {
    title: 'De Guide fir sech virzebereeden',
    metaTitle: 'Sech op eng Kris zu Lëtzebuerg virbereeden: de Guide an einfacher Sprooch | Kitzy',
    description:
      'Déi offiziell Rotschléi vu Lëtz prepare! an einfache Wierder: firwat 72 Stonnen, Stroumausfall, LU-Alert, Sirenen, sech informéieren, sech géigesäiteg hëllefen.',
    metaTitleArticle: '{{title}} | Kitzy',
  },
  cta: {
    title: 'Kitzy rechent dat alles fir däin Haushalt aus',
    text: 'So Kitzy, wien bei dir wunnt: Kitzy rechent d’Quantitéiten aus, setzt all Artikel op seng Plaz an erënnert dech virun den Datumer. Gratis, ouni Kont, an et funktionéiert offline.',
    button: 'Kitzy opmaachen',
  },
  more: 'Déi ganz Lëscht vum Kit gesinn',
};

const pt: SiteTexts = {
  nav: { home: 'Início', kit: 'A lista do kit', guide: 'O guia', crumbs: 'Caminho de navegação' },
  kit: {
    title: 'A lista do kit de emergência para 72 horas',
    metaTitle: 'Lista do kit de emergência 72 h no Luxemburgo: o que guardar | Kitzy',
    description:
      'A lista do kit de emergência para aguentar 72 horas: água, refeições, luz, calor, cuidados, documentos. Segundo o guia oficial Lëtz prepare!, com as quantidades e conselhos de compra.',
    lead: 'Tudo o que precisas para aguentar três dias em casa, e a mochila a preparar para cada pessoa. A lista oficial do Luxemburgo, completada com os conselhos de listas de especialistas.',
    legend:
      '«Lista oficial» vem do guia Lëtz prepare!. «Recomendado» vem de listas de especialistas. «Conforto» torna os dias mais suaves.',
    home: 'Em casa',
    bag: 'Em cada mochila',
    advice: 'Escolher bem: {{name}}',
  },
  rules: {
    household: '{{q}} para a casa',
    person: '{{q}} por pessoa',
    personDay: '{{q}} por pessoa e por dia',
    meal: '{{n}} refeições por pessoa e por dia',
    water: '3 L por pessoa e por dia, mais a água dos animais',
    pet: '{{q}} por animal',
    petDay: '{{q}} por animal e por dia',
    infant: '{{q}} por bebé e por dia',
  },
  item: {
    metaTitle: '{{name}}: escolher bem para o teu kit de emergência | Kitzy',
    description:
      '{{name}} para o teu kit de emergência de 72 h: quanto prever, o que verificar e ideias para três orçamentos.',
    quantity: 'Quanto prever',
    readAlso: 'Ler no guia',
    related: 'Na mesma secção',
    back: 'A lista completa do kit',
  },
  guide: {
    title: 'O guia para te preparares',
    metaTitle: 'Preparar-se para uma crise no Luxemburgo: o guia em linguagem simples | Kitzy',
    description:
      'Os conselhos oficiais Lëtz prepare! em palavras simples: porquê 72 horas, falha de energia, LU-Alert, sirenes, estar informado, entreajuda.',
    metaTitleArticle: '{{title}} | Kitzy',
  },
  cta: {
    title: 'O Kitzy calcula tudo isto para a tua família',
    text: 'Diz ao Kitzy quem vive contigo: calcula as quantidades, arruma cada artigo no seu lugar e avisa-te antes das datas. Gratuito, sem conta, e funciona offline.',
    button: 'Abrir o Kitzy',
  },
  more: 'Ver a lista completa do kit',
};

export const SITE: Readonly<Record<Locale, SiteTexts>> = { fr, en, de, lb, pt };
