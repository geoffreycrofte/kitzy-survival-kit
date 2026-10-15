/**
 * Conseils d'achat par palier. Chaque conseil décrit des caractéristiques à chercher,
 * jamais une marque imposée : les liens mènent à une recherche chez le marchand.
 * Une page produit précise peut remplacer la recherche (`url`) une fois vérifiée.
 *
 * Paliers, à lire par catégorie : 1 = essentiel (€), 2 = équilibré (€€), 3 = durable (€€€).
 * AliExpress est exclu pour tout ce qui touche à la sécurité ou à la santé (§ 8.3).
 */
import type { Offer, Product, Tier } from '../products';

interface Queries {
  /** Recherche en français (Amazon.fr). */
  fr: string;
  /** Recherche en allemand (Amazon.de). */
  de?: string;
  /** Recherche Decathlon, pour l'outdoor. */
  decathlon?: string;
}

function product(
  id: string,
  templateIds: string[],
  tier: Tier,
  name: string,
  why: string,
  q: Queries,
): Product {
  const offers: Offer[] = [{ merchant: 'amazon-fr', query: q.fr }];
  if (q.de) offers.push({ merchant: 'amazon-de', query: q.de });
  if (q.decathlon) offers.push({ merchant: 'decathlon-fr', query: q.decathlon });
  return { id, templateIds, tier, name, why, offers };
}

export const PRODUCTS: readonly Product[] = [
  /* ---------- Eau ---------- */
  product(
    'jerrycan-10l',
    ['empty-water-containers'],
    1,
    'Jerrican alimentaire de 10 L avec robinet',
    'Le plus simple pour stocker l’eau du robinet et la verser sans en perdre.',
    {
      fr: 'jerrican eau alimentaire 10 L robinet',
      de: 'Wasserkanister 10 l Hahn lebensmittelecht',
    },
  ),
  product(
    'water-bag-foldable',
    ['empty-water-containers'],
    2,
    'Réservoir d’eau pliable de 10 à 20 L',
    'Prend très peu de place quand il est vide, se remplit dès l’alerte.',
    {
      fr: 'réservoir eau pliable 20 L alimentaire',
      de: 'faltbarer Wasserkanister 20 l',
      decathlon: 'jerrican pliable',
    },
  ),
  product(
    'purification-tablets',
    ['water-purification'],
    1,
    'Pastilles de purification d’eau',
    'Légères et peu chères : de quoi rendre l’eau du robinet buvable si elle est contaminée.',
    {
      fr: 'pastilles purification eau',
      de: 'Wasserentkeimungstabletten',
      decathlon: 'pastilles purification eau',
    },
  ),
  product(
    'water-filter',
    ['water-purification'],
    3,
    'Filtre à eau portable (0,1 micron)',
    'Filtre des centaines de litres sans produit chimique ; à compléter par des pastilles contre les virus.',
    {
      fr: 'filtre à eau portable 0,1 micron',
      de: 'Wasserfilter outdoor 0,1 Mikron',
      decathlon: 'filtre à eau',
    },
  ),

  /* ---------- Cuisiner ---------- */
  product(
    'stove-cartridge',
    ['camping-stove'],
    1,
    'Réchaud à cartouche, simple et stable',
    'Pour chauffer de l’eau et les conserves. Uniquement dehors ou sur un balcon ouvert.',
    {
      fr: 'réchaud camping cartouche gaz',
      de: 'Campingkocher Gaskartusche',
      decathlon: 'réchaud camping',
    },
  ),
  product(
    'stove-butane-case',
    ['camping-stove'],
    2,
    'Réchaud portable à cartouche butane en mallette',
    'Très stable pour une casserole, pratique pour cuisiner plusieurs jours.',
    { fr: 'réchaud portable butane mallette', de: 'Gaskocher tragbar Butan Koffer' },
  ),
  product(
    'gas-cartridges-match',
    ['gas-cartridges'],
    1,
    'Cartouches compatibles avec ton réchaud',
    'Vérifie le type exact (à valve, à percer ou butane long) indiqué sur ton réchaud.',
    {
      fr: 'cartouche gaz valve camping',
      de: 'Gaskartusche Ventil Camping',
      decathlon: 'cartouche gaz',
    },
  ),
  product(
    'can-opener',
    ['manual-can-opener'],
    1,
    'Ouvre-boîte manuel à roulette',
    'Indispensable si les conserves n’ont pas d’ouverture facile.',
    { fr: 'ouvre-boîte manuel inox', de: 'Dosenöffner manuell Edelstahl' },
  ),

  /* ---------- Lumière et énergie ---------- */
  product(
    'flashlight-aa',
    ['flashlight'],
    1,
    'Lampe de poche LED à piles AA',
    'Les piles AA se trouvent partout et se gardent longtemps.',
    { fr: 'lampe torche LED piles AA', de: 'Taschenlampe LED AA Batterien' },
  ),
  product(
    'headlamp-aaa',
    ['headlamp'],
    1,
    'Lampe frontale à piles AAA, 200 lumens environ',
    'Les mains restent libres ; les piles se changent sans prise électrique.',
    {
      fr: 'lampe frontale piles AAA 200 lumens',
      de: 'Stirnlampe AAA 200 Lumen',
      decathlon: 'lampe frontale piles',
    },
  ),
  product(
    'headlamp-hybrid',
    ['headlamp'],
    2,
    'Lampe frontale rechargeable USB-C qui accepte aussi des piles',
    'Rechargeable au quotidien, et toujours utilisable avec des piles si le courant manque.',
    {
      fr: 'lampe frontale rechargeable USB-C hybride piles AAA',
      de: 'Stirnlampe hybrid USB-C AAA',
      decathlon: 'lampe frontale rechargeable',
    },
  ),
  product(
    'powerbank-20k',
    ['power-bank'],
    1,
    'Batterie externe de 20 000 mAh',
    'Recharge un téléphone quatre fois environ. Pense à la recharger tous les trois mois.',
    { fr: 'batterie externe 20000 mAh USB-C', de: 'Powerbank 20000 mAh USB-C' },
  ),
  product(
    'powerstation',
    ['power-bank'],
    3,
    'Station d’énergie portable (environ 250 Wh)',
    'Fait tenir téléphones, radio et lampes plusieurs jours ; rechargeable au solaire.',
    { fr: 'station énergie portable 250Wh', de: 'Powerstation 250Wh tragbar' },
  ),
  product(
    'batteries-alkaline',
    ['spare-batteries'],
    1,
    'Piles alcalines AA et AAA, longue conservation',
    'Choisis une date de péremption lointaine : elles dorment dans le kit.',
    { fr: 'piles alcalines AA AAA longue durée lot', de: 'Alkaline Batterien AA AAA Vorratspack' },
  ),
  product(
    'batteries-lithium',
    ['spare-batteries'],
    3,
    'Piles lithium AA (non rechargeables)',
    'Se conservent jusqu’à 20 ans et résistent au froid ; idéales pour un kit oublié au grenier.',
    { fr: 'piles lithium AA 1,5V', de: 'Lithium Batterien AA 1,5V' },
  ),
  product(
    'led-lantern',
    ['led-lantern'],
    1,
    'Lanterne LED à piles',
    'Éclaire toute une pièce, plus sûr qu’une bougie.',
    {
      fr: 'lanterne LED piles camping',
      de: 'LED Campinglaterne Batterie',
      decathlon: 'lanterne camping',
    },
  ),
  product(
    'solar-panel-21w',
    ['solar-panel'],
    2,
    'Panneau solaire pliable USB de 20 W environ',
    'Recharge une batterie externe ou un téléphone en journée, même sans courant.',
    { fr: 'panneau solaire pliable USB 21W', de: 'faltbares Solarpanel USB 21W' },
  ),

  /* ---------- Chaleur ---------- */
  product(
    'sleeping-bag-comfort',
    ['sleeping-bags-blankets'],
    1,
    'Sac de couchage, température de confort autour de 10 °C',
    'Suffisant dans une maison non chauffée en hiver, avec une couverture.',
    {
      fr: 'sac de couchage confort 10 degrés',
      de: 'Schlafsack Komfort 10 Grad',
      decathlon: 'sac de couchage 10°',
    },
  ),
  product(
    'sleeping-bag-winter',
    ['sleeping-bags-blankets'],
    2,
    'Sac de couchage, température de confort autour de 0 °C',
    'Pour les maisons qui se refroidissent vite ou les personnes frileuses.',
    {
      fr: 'sac de couchage confort 0 degré',
      de: 'Schlafsack Komfort 0 Grad',
      decathlon: 'sac de couchage 0°',
    },
  ),
  product(
    'emergency-blanket',
    ['emergency-blanket'],
    1,
    'Couvertures de survie (lot)',
    'Minuscules et légères : une par personne dans chaque sac.',
    { fr: 'couverture de survie lot', de: 'Rettungsdecke Set', decathlon: 'couverture de survie' },
  ),

  /* ---------- Soins ---------- */
  product(
    'first-aid-basic',
    ['first-aid-kit'],
    1,
    'Trousse de premiers secours familiale',
    'Vérifie son contenu à l’achat et complète avec tes médicaments habituels.',
    {
      fr: 'trousse de secours famille',
      de: 'Erste-Hilfe-Set Familie',
      decathlon: 'trousse de secours',
    },
  ),
  product(
    'first-aid-din',
    ['first-aid-kit'],
    2,
    'Trousse de premiers secours conforme DIN 13157',
    'Le contenu d’une trousse d’entreprise : plus complet et normé.',
    { fr: 'trousse de secours DIN 13157', de: 'Verbandkasten DIN 13157' },
  ),
  product(
    'ffp2',
    ['ffp2-masks'],
    1,
    'Masques FFP2 marqués CE (EN 149)',
    'Utiles en cas de fumée, de poussière ou d’épidémie.',
    { fr: 'masque FFP2 CE EN 149', de: 'FFP2 Maske CE EN 149' },
  ),

  /* ---------- S'informer ---------- */
  product(
    'radio-batteries',
    ['crank-radio'],
    1,
    'Radio FM à piles',
    'Simple et fiable pour écouter RTL et la radio 100,7.',
    { fr: 'radio FM portable piles', de: 'Kofferradio Batterie UKW' },
  ),
  product(
    'radio-crank',
    ['crank-radio'],
    2,
    'Radio à manivelle et solaire avec lampe et sortie USB',
    'Fonctionne sans piles ; recharge un peu le téléphone en dépannage.',
    { fr: 'radio manivelle solaire USB lampe', de: 'Kurbelradio Solar USB Taschenlampe' },
  ),
  product(
    'radio-dab',
    ['crank-radio'],
    3,
    'Radio DAB+ et FM, manivelle et batterie intégrée',
    'La réception numérique en plus, pour une écoute claire partout au Luxembourg.',
    { fr: 'radio DAB+ manivelle solaire', de: 'DAB+ Kurbelradio Solar' },
  ),

  /* ---------- Outils et sécurité ---------- */
  product(
    'pocket-knife',
    ['pocket-knife'],
    1,
    'Couteau de poche multifonction avec ouvre-boîte',
    'Une lame, des ciseaux et un ouvre-boîte en un seul objet.',
    {
      fr: 'couteau de poche multifonction ouvre-boîte',
      de: 'Taschenmesser Dosenöffner',
      decathlon: 'couteau multifonction',
    },
  ),
  product(
    'multitool',
    ['multitool'],
    2,
    'Pince multifonction avec blocage des outils',
    'Pince, tournevis et lame verrouillables : solide pour les petites réparations.',
    { fr: 'pince multifonction outils verrouillables', de: 'Multitool Zange Verriegelung' },
  ),
  product(
    'duct-tape',
    ['duct-tape'],
    1,
    'Ruban adhésif renforcé toilé (duct tape)',
    'Répare presque tout, de la bâche à la chaussure.',
    { fr: 'ruban adhésif toilé renforcé duct tape', de: 'Gewebeband Panzertape' },
  ),
  product(
    'paracord',
    ['paracord'],
    1,
    'Paracorde 550, 30 m',
    'Fine, très solide : pour attacher, étendre, réparer.',
    { fr: 'paracorde 550 30 m', de: 'Paracord 550 30 m', decathlon: 'paracorde' },
  ),
  product(
    'smoke-detector',
    ['smoke-co-detector'],
    1,
    'Détecteur de fumée certifié EN 14604, pile 10 ans',
    'Un par étage au minimum ; la pile longue durée évite les oublis.',
    { fr: 'détecteur de fumée EN 14604 pile 10 ans', de: 'Rauchmelder EN 14604 10 Jahre Batterie' },
  ),
  product(
    'co-detector',
    ['smoke-co-detector'],
    2,
    'Détecteur de monoxyde de carbone certifié EN 50291',
    'Indispensable si tu utilises un chauffage d’appoint ou un poêle pendant une coupure.',
    { fr: 'détecteur monoxyde de carbone EN 50291', de: 'CO Melder EN 50291' },
  ),
  product(
    'fire-blanket',
    ['fire-extinguisher-blanket'],
    1,
    'Couverture anti-feu certifiée EN 1869',
    'Étouffe un début de feu de casserole en quelques secondes.',
    { fr: 'couverture anti-feu EN 1869', de: 'Löschdecke EN 1869' },
  ),
  product(
    'extinguisher',
    ['fire-extinguisher-blanket'],
    2,
    'Extincteur à mousse de 2 kg ou 2 L, norme EN 3',
    'Pour la cuisine et le salon ; à faire vérifier régulièrement.',
    { fr: 'extincteur mousse 2 L EN3 maison', de: 'Schaumfeuerlöscher 2 l EN3' },
  ),
  product(
    'whistle',
    ['whistle'],
    1,
    'Sifflet de secours sans bille',
    'S’entend de loin et ne s’enraye pas, même mouillé.',
    { fr: 'sifflet de secours sans bille', de: 'Notfallpfeife ohne Kugel', decathlon: 'sifflet' },
  ),

  /* ---------- Sac ---------- */
  product(
    'backpack-30l',
    ['backpack'],
    1,
    'Sac à dos de 30 L avec ceinture',
    'Assez grand pour 72 heures, assez léger pour marcher longtemps.',
    {
      fr: 'sac à dos randonnée 30 L',
      de: 'Wanderrucksack 30 l',
      decathlon: 'sac à dos randonnée 30 L',
    },
  ),
  product(
    'dry-bags',
    ['dry-bags'],
    1,
    'Sacs étanches de plusieurs tailles',
    'Protègent papiers, vêtements et électronique de la pluie.',
    {
      fr: 'sac étanche lot plusieurs tailles',
      de: 'Packsack wasserdicht Set',
      decathlon: 'sac étanche',
    },
  ),
];
