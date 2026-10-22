/** Rezepte auf Deutsch: gleiche Reihenfolge der Zutaten und Schritte wie im Französischen. */
import type { ContentTranslation } from '../../types';

export const recipes: ContentTranslation['recipes'] = {
  'chili-express': {
    title: 'Express-Chili aus dem Bau',
    summary: 'Kidneybohnen, Tomaten und Mais, in einer Viertelstunde gewürzt und fertig.',
    ingredients: [
      '1 Dose Kidneybohnen, abgetropft',
      '1 Dose gehackte Tomaten',
      '1 kleine Dose Mais',
      '1 Prise Salz, Kreuzkümmel oder Paprika',
      'Reis, falls du welchen hast',
    ],
    steps: [
      'Gib die Tomaten in den Topf und erhitze sie 5 Minuten lang.',
      'Füge Bohnen, Mais und Gewürze hinzu.',
      'Lass alles 10 Minuten köcheln und rühr ab und zu um.',
      'Serviere es pur, mit Reis oder mit Crackern.',
    ],
    tip: 'Heb die Flüssigkeit von Bohnen und Mais für eine Suppe am nächsten Tag auf: So sparst du Wasser.',
  },
  'pates-sardines': {
    title: 'Nudeln mit Sardinen und Tomaten',
    summary: 'Der Klassiker aus dem Vorratsschrank, in 15 Minuten fertig.',
    ingredients: [
      '200 g kurze Nudeln',
      '1 Dose Sardinen in Öl',
      '1 Dose gehackte Tomaten',
      'Salz, Pfeffer',
    ],
    steps: [
      'Koch die Nudeln in 1 L Wasser, gerade genug, um sie zu bedecken. Leg einen Deckel auf den Topf: So kocht es schneller und du sparst Gas.',
      'Gieß die Nudeln ab und behalte dabei einen Rest Kochwasser.',
      'Gib die Tomaten und die zerpflückten Sardinen samt Öl dazu und erwärme alles 2 Minuten.',
    ],
    tip: 'Dünne Nudeln garen schneller: weniger Gas, weniger Wasser.',
  },
  'salade-lentilles': {
    title: 'Linsensalat ohne Kochen',
    summary: 'Kein Kocher, kein Wasser: aufmachen, mischen, essen.',
    ingredients: [
      '1 Dose gekochte Linsen, abgetropft',
      '1 Dose Thunfisch oder Makrele',
      '1 kleine Dose Mais oder Erbsen',
      'Ein Schuss Öl und Essig, Salz',
    ],
    steps: [
      'Lass Linsen und Mais abtropfen.',
      'Vermische sie mit dem zerpflückten Fisch.',
      'Würze mit Öl, Essig und Salz.',
    ],
    tip: 'Das klappt auch mit Kichererbsen oder weißen Bohnen.',
  },
  porridge: {
    title: 'Porridge am Morgen',
    summary: 'Haferflocken, Milch und Fruchtmus: warm oder schon am Vorabend zubereitet.',
    ingredients: [
      '80 g Haferflocken',
      '400 ml H-Milch oder mit Wasser angerührtes Milchpulver',
      '2 Quetschbeutel mit Fruchtmus',
      '1 Löffel Zucker oder etwas Trockenobst',
    ],
    steps: [
      'Erhitze die Milch mit den Haferflocken unter Rühren 5 Minuten lang.',
      'Nimm den Topf vom Herd und rühr Fruchtmus und Zucker unter.',
      'Ohne Kocher: Misch Haferflocken und Milch am Vorabend, deck sie ab und lass sie über Nacht quellen.',
    ],
  },
  'soupe-pois-chiches': {
    title: 'Kichererbsensuppe mit Tomate',
    summary: 'Eine Suppe, die wärmt, wenn das Haus auskühlt.',
    ingredients: [
      '1 Dose Kichererbsen',
      '1 Dose gehackte Tomaten',
      '1 Brühwürfel und 500 ml Wasser',
      'Eine Handvoll kleine Nudeln, wenn du magst',
    ],
    steps: [
      'Bring das Wasser mit dem Brühwürfel zum Kochen.',
      'Gib Tomaten, Kichererbsen und Nudeln dazu.',
      'Lass alles 10 Minuten kochen und zerdrück dann ein paar Kichererbsen, damit die Suppe sämiger wird.',
    ],
  },
  'tartines-croustillantes': {
    title: 'Knusprige Häppchen',
    summary: 'Cracker, Fischaufstrich und Trockenobst: ein Abendessen ohne Kochen.',
    ingredients: [
      'Cracker oder Zwieback',
      '1 Dose Thunfisch oder Sardinen',
      '1 Löffel Senf oder Mayonnaise aus der Tube',
      'Trockenobst zum Nachtisch',
    ],
    steps: [
      'Zerdrück den Fisch mit der Gabel und misch ihn mit dem Senf.',
      'Bestreich die Cracker erst kurz vor dem Essen, damit sie knusprig bleiben.',
      'Zum Abschluss gibt es Trockenobst.',
    ],
  },
  'riz-au-lait': {
    title: 'Tröstender Milchreis',
    summary: 'Der Wohlfühl-Nachtisch, mit der restlichen H-Milch.',
    ingredients: ['60 g Rundkornreis', '500 ml H-Milch', '2 Löffel Zucker, ein Stück Schokolade'],
    steps: [
      'Lass die Milch leicht köcheln und gib dann den Reis hinein.',
      'Bei schwacher Hitze 20 Minuten garen und dabei oft umrühren.',
      'Rühr den Zucker unter und lass das Stück Schokolade obendrauf schmelzen.',
    ],
    tip: 'Milchreis schmeckt am nächsten Tag auch kalt.',
  },
  'couscous-express': {
    title: 'Express-Couscous',
    summary: 'Heißes Wasser genügt: Der Couscous gart von allein.',
    ingredients: [
      '150 g Couscous',
      '1 Dose Gemüse (Ratatouille, Erbsen und Möhren)',
      '1 Dose Kichererbsen',
      'Salz, ein Schuss Öl',
    ],
    steps: [
      'Erhitze 300 ml Wasser. Nimm den Topf vom Herd, gib den Couscous hinein, deck ihn ab und warte 5 Minuten.',
      'Wärme in der Zwischenzeit Gemüse und Kichererbsen auf.',
      'Lockere den Couscous mit der Gabel und dem Öl auf und serviere ihn mit dem Gemüse.',
    ],
  },
};
