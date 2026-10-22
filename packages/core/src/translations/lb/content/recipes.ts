/** Rezepter op Lëtzebuergesch: d’Zoutaten an d’Schrëtt an der selwechter Reiefolleg wéi op Franséisch. */
import type { ContentTranslation } from '../../types';

export const recipes: ContentTranslation['recipes'] = {
  'chili-express': {
    title: 'Express-Chili aus dem Bau',
    summary: 'Rout Bounen, Tomaten a Mais, an enger Véierelstonn gewierzt a fäerdeg.',
    ingredients: [
      '1 Dous rout Bounen, ofgegoss',
      '1 Dous gestéckelt Tomaten',
      '1 kleng Dous Mais',
      '1 Prise Salz, Cumin oder Paprika',
      'Rais, wann s de der hues',
    ],
    steps: [
      'Schëdd d’Tomaten an d’Kasseroll a maach se 5 Minutte waarm.',
      'Gëff d’Bounen, de Mais an d’Gewierzer derbäi.',
      'Looss alles 10 Minutten op klengem Feier kachen a réier ab an zou ëm.',
      'Servéier et esou, mat Rais oder mat Crackers.',
    ],
    tip: 'Gëss de Jus vun de Bounen an dem Mais net ewech: domat gëtt et den Dag drop eng Zopp, an du verbrauchs manner Waasser.',
  },
  'pates-sardines': {
    title: 'Nuddele mat Sardinen an Tomaten',
    summary: 'De Klassiker aus dem Schaf, an 15 Minutte fäerdeg.',
    ingredients: [
      '200 g kuerz Nuddelen',
      '1 Dous Sardinen am Ueleg',
      '1 Dous gestéckelt Tomaten',
      'Salz, Peffer',
    ],
    steps: [
      'Koch d’Nuddelen an 1 L Waasser, just genuch fir se ze bedecken. Maach en Deckel op d’Kasseroll: et kacht méi séier an et spuert Gas.',
      'Schëdd d’Waasser of, mä hal e bësse Kachwaasser zeréck.',
      'Gëff d’Tomaten an déi zerdréckt Sardinen mat hirem Ueleg derbäi a maach alles 2 Minutte waarm.',
    ],
    tip: 'Dënn Nuddele kache méi séier: manner Gas, manner Waasser.',
  },
  'salade-lentilles': {
    title: 'Lënsenzalot ouni Kachen',
    summary: 'Kee Campingkacher, kee Waasser: opmaachen, mëschen, iessen.',
    ingredients: [
      '1 Dous gekacht Lënsen, ofgegoss',
      '1 Dous Thon oder Makrell',
      '1 kleng Dous Mais oder Ierbessen',
      'E bëssen Ueleg an Esseg, Salz',
    ],
    steps: [
      'Gëss d’Lënsen an de Mais of.',
      'Mësch se mam zerdréckte Fësch.',
      'Maach se mat Ueleg, Esseg a Salz un.',
    ],
    tip: 'Dat geet och mat Kichererbsen oder wäisse Bounen.',
  },
  porridge: {
    title: 'Porridge fir de Moien',
    summary: 'Hafferflocken, Mëllech a Kompott: waarm oder den Owend virdrun virbereet.',
    ingredients: [
      '80 g Hafferflocken',
      '40 cl UHT-Mëllech, oder Mëllechpolver mat Waasser gemëscht',
      '2 Kompotten am Quetschbeidel',
      '1 Läffel Zocker oder e bësse gedréchent Uebst',
    ],
    steps: [
      'Maach d’Mëllech mat de Flocken 5 Minutte waarm a réier dobäi.',
      'Huel d’Kasseroll vum Feier a gëff de Kompott an den Zocker derbäi.',
      'Ouni Campingkacher: mësch d’Flocken an d’Mëllech den Owend virdrun, deck se zou a looss se iwwer Nuecht opquellen.',
    ],
  },
  'soupe-pois-chiches': {
    title: 'Kichererbsenzopp mat Tomaten',
    summary: 'Eng Zopp, déi waarm mécht, wann d’Haus auskillt.',
    ingredients: [
      '1 Dous Kichererbsen',
      '1 Dous gestéckelt Tomaten',
      '1 Bouillonswierfel an 50 cl Waasser',
      'Eng Handvoll kleng Nuddelen, wann s de wëlls',
    ],
    steps: [
      'Bréng d’Waasser mam Bouillonswierfel zum Kachen.',
      'Gëff d’Tomaten, d’Kichererbsen an d’Nuddelen derbäi.',
      'Looss alles 10 Minutte kachen an zerdréck dann e puer Kichererbsen, fir datt d’Zopp méi déck gëtt.',
    ],
  },
  'tartines-croustillantes': {
    title: 'Knuspereg Schmieren',
    summary: 'Crackers, Fëschpaste a gedréchent Uebst: en Owesiessen ouni Kachen.',
    ingredients: [
      'Crackers oder Biscotten',
      '1 Dous Thon oder Sardinen',
      '1 Läffel Moschter oder Mayonnaise aus der Tub',
      'Gedréchent Uebst als Dessert',
    ],
    steps: [
      'Zerdréck de Fësch mat der Forschett an dem Moschter.',
      'Schmier en eréischt kuerz virum Iessen op d’Crackers, da bleiwe se knuspereg.',
      'Zum Schluss gëtt et dat gedréchent Uebst.',
    ],
  },
  'riz-au-lait': {
    title: 'Mëllechrais, deen d’Häerz wiermt',
    summary: 'Den Dessert zum Wuelfillen, mat der UHT-Mëllech, déi nach iwwreg ass.',
    ingredients: ['60 g Rondkärrais', '50 cl UHT-Mëllech', '2 Läffel Zocker, e Stéck Schockela'],
    steps: [
      'Looss d’Mëllech bal kachen, a schëdd dann de Rais dran.',
      'Looss en op klengem Feier 20 Minutte kachen a réier dacks.',
      'Gëff den Zocker derbäi a looss dann d’Stéck Schockela driwwer schmëlzen.',
    ],
    tip: 'Mëllechrais schmaacht den Dag drop och kal.',
  },
  'couscous-express': {
    title: 'Express-Couscous',
    summary: 'Et brauch just waarmt Waasser: de Couscous gëtt vum selwe gar.',
    ingredients: [
      '150 g Couscous',
      '1 Dous Geméis (Ratatouille, Ierbessen a Muerten)',
      '1 Dous Kichererbsen',
      'Salz, e bëssen Ueleg',
    ],
    steps: [
      'Maach 30 cl Waasser waarm. Huel et vum Feier, schëdd de Couscous dran, deck zou a waart 5 Minutten.',
      'Mëttlerweil maach d’Geméis an d’Kichererbsen waarm.',
      'Lockere de Couscous mat der Forschett an dem Ueleg op a servéier e mam Geméis.',
    ],
  },
};
