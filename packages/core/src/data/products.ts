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
  /* ---------- Eau (contenants) ---------- */
  product(
    'bucket-lid',
    ['bucket'],
    1,
    'Seau alimentaire de 10 L avec couvercle',
    'Pour garder de l’eau pour la toilette et la chasse d’eau, sans poussière.',
    { fr: 'seau alimentaire 10 L couvercle', de: 'Eimer lebensmittelecht 10 l Deckel' },
  ),

  /* ---------- Cuisiner (ustensiles) ---------- */
  product(
    'camping-cookset',
    ['cookware'],
    1,
    'Popote de camping avec casserole, poêle et gobelet',
    'Tout s’emboîte : une casserole pour le réchaud, sans abîmer celles de la cuisine.',
    { fr: 'popote camping casserole', de: 'Camping Kochgeschirr Set', decathlon: 'popote' },
  ),
  product(
    'freezer-bags-foil',
    ['foil-freezer-bags'],
    1,
    'Sacs congélation zippés et papier aluminium',
    'Pour garder les restes au sec et protéger les documents.',
    { fr: 'sacs congélation zip lot', de: 'Gefrierbeutel Zipper' },
  ),
  product(
    'reusable-tableware',
    ['reusable-dishes'],
    1,
    'Assiettes, bols et gobelets réutilisables',
    'Légers, incassables, ils se lavent avec très peu d’eau.',
    {
      fr: 'vaisselle camping réutilisable set',
      de: 'Campinggeschirr Set wiederverwendbar',
      decathlon: 'vaisselle camping',
    },
  ),

  /* ---------- Lumière et feu ---------- */
  product(
    'candles-long',
    ['candles-matches'],
    1,
    'Bougies chauffe-plat longue durée et allumettes',
    'De la lumière d’appoint, à poser sur une surface stable, loin de tout ce qui brûle.',
    { fr: 'bougies chauffe-plat longue durée 8 heures', de: 'Teelichter 8 Stunden Brenndauer' },
  ),
  product(
    'storm-matches-box',
    ['storm-matches'],
    1,
    'Allumettes tempête dans une boîte étanche',
    'Elles s’allument sous le vent et même humides.',
    {
      fr: 'allumettes tempête boîte étanche',
      de: 'Sturmstreichhölzer wasserdicht',
      decathlon: 'allumettes tempête',
    },
  ),
  product(
    'lighters-pack',
    ['spare-lighter'],
    1,
    'Briquets de rechange, lot de plusieurs',
    'Un dans la réserve, un dans chaque sac.',
    { fr: 'briquets lot', de: 'Feuerzeuge Set' },
  ),
  product(
    'glow-sticks',
    ['light-sticks'],
    1,
    'Bâtons lumineux de 12 heures',
    'Une lumière sans flamme ni pile, rassurante pour les enfants la nuit.',
    { fr: 'bâtons lumineux 12 heures', de: 'Knicklichter 12 Stunden' },
  ),
  product(
    'charging-cables',
    ['device-chargers'],
    1,
    'Câble de charge multiple (USB-C, Lightning, micro-USB)',
    'Un seul câble pour tous les téléphones du foyer.',
    { fr: 'câble charge multiple 3 en 1', de: 'Multi Ladekabel 3 in 1' },
  ),

  /* ---------- Chaleur ---------- */
  product(
    'rain-poncho',
    ['rain-poncho'],
    1,
    'Poncho de pluie réutilisable',
    'Couvre aussi le sac à dos, se range dans une poche.',
    {
      fr: 'poncho pluie réutilisable',
      de: 'Regenponcho wiederverwendbar',
      decathlon: 'poncho pluie',
    },
  ),
  product(
    'hand-warmers',
    ['hand-warmers'],
    1,
    'Chaufferettes pour les mains',
    'Quelques heures de chaleur sans électricité, dans les poches ou les gants.',
    { fr: 'chaufferettes mains', de: 'Handwärmer', decathlon: 'chaufferette' },
  ),
  product(
    'fleece-hat-gloves',
    ['warm-clothes'],
    1,
    'Bonnet et gants polaires',
    'Les mains, les pieds et les oreilles se refroidissent en premier quand le chauffage s’arrête.',
    { fr: 'bonnet gants polaire', de: 'Fleecemütze Handschuhe Set', decathlon: 'bonnet polaire' },
  ),

  /* ---------- Soins ---------- */
  product(
    'bandages-set',
    ['bandages-tape'],
    1,
    'Bandes élastiques et rouleau de sparadrap',
    'Pour maintenir un pansement ou soutenir une cheville.',
    { fr: 'bande élastique sparadrap', de: 'elastische Binde Pflaster Rolle' },
  ),
  product(
    'tick-remover',
    ['tweezers-tick-remover'],
    1,
    'Tire-tique et pince à épiler',
    'Le tire-tique retire la tique sans l’écraser.',
    { fr: 'tire tique pince', de: 'Zeckenzange Pinzette' },
  ),
  product(
    'digital-thermometer',
    ['thermometer'],
    1,
    'Thermomètre digital avec piles de rechange',
    'Rapide et simple, sans mercure.',
    { fr: 'thermomètre digital médical', de: 'digitales Fieberthermometer' },
  ),
  product(
    'nitrile-gloves',
    ['disposable-gloves'],
    1,
    'Gants jetables en nitrile, boîte',
    'Pour soigner une plaie sans risque, même en cas d’allergie au latex.',
    { fr: 'gants nitrile jetables boîte', de: 'Nitrilhandschuhe Box' },
  ),
  product(
    'sunscreen-repellent',
    ['sunscreen-insect-repellent'],
    1,
    'Crème solaire et anti-moustiques',
    'Utiles dès qu’on passe plusieurs heures dehors.',
    { fr: 'crème solaire spf 50', de: 'Sonnencreme LSF 50' },
  ),

  /* ---------- Hygiène ---------- */
  product(
    'wet-wipes',
    ['wet-wipes'],
    1,
    'Lingettes humides, grand paquet',
    'Pour se laver un peu quand l’eau manque.',
    { fr: 'lingettes humides grand paquet', de: 'Feuchttücher Großpackung' },
  ),
  product(
    'hand-sanitizer',
    ['hand-sanitizer'],
    1,
    'Gel hydroalcoolique en flacon',
    'Se laver les mains sans eau, avant de manger ou de soigner.',
    { fr: 'gel hydroalcoolique flacon', de: 'Desinfektionsgel Hände' },
  ),
  product(
    'travel-toiletries',
    ['toothbrush-kit', 'toiletries'],
    1,
    'Trousse de toilette de voyage',
    'Brosse à dents, dentifrice et savon en petit format pour le sac.',
    { fr: 'kit toilette voyage brosse à dents', de: 'Reise Kulturbeutel Set Zahnbürste' },
  ),
  product(
    'emergency-toilet-bags',
    ['emergency-toilet'],
    1,
    'Sacs de toilette avec poudre gélifiante',
    'Quand les toilettes ne fonctionnent plus : hygiénique et sans odeur.',
    { fr: 'sac toilette urgence gélifiant', de: 'Notfalltoilette Beutel Geliermittel' },
  ),
  product(
    'microfiber-towel',
    ['microfiber-towel'],
    1,
    'Serviette microfibre',
    'Sèche vite et prend peu de place dans le sac.',
    { fr: 'serviette microfibre', de: 'Mikrofaser Handtuch', decathlon: 'serviette microfibre' },
  ),

  /* ---------- Documents ---------- */
  product(
    'document-pouch',
    ['document-copies', 'medical-records'],
    1,
    'Pochette étanche pour documents A4',
    'Garde les copies des papiers au sec, dans la réserve ou le sac.',
    { fr: 'pochette étanche documents A4', de: 'wasserdichte Dokumententasche A4' },
  ),
  product(
    'encrypted-usb',
    ['encrypted-usb-backup'],
    2,
    'Clé USB chiffrée par code',
    'Les scans des papiers restent protégés si elle est perdue.',
    { fr: 'clé usb chiffrée code', de: 'verschlüsselter USB Stick PIN' },
  ),

  /* ---------- Outils ---------- */
  product(
    'waterproof-notebook',
    ['pen-pencil-notebook'],
    1,
    'Carnet imperméable et crayon',
    'Pour noter des messages ou des numéros, même sous la pluie.',
    { fr: 'carnet imperméable crayon', de: 'wasserfestes Notizbuch' },
  ),
  product(
    'zip-ties',
    ['zip-ties'],
    1,
    'Colliers de serrage de plusieurs tailles',
    'Pour réparer, attacher une bâche ou fermer un sac.',
    { fr: 'colliers de serrage lot', de: 'Kabelbinder Set' },
  ),
  product(
    'work-gloves',
    ['work-gloves'],
    1,
    'Gants de travail résistants aux coupures',
    'Pour déblayer ou manipuler du verre sans se blesser.',
    { fr: 'gants de travail anti coupure', de: 'Arbeitshandschuhe schnittfest' },
  ),
  product(
    'tarp',
    ['plastic-tarp'],
    1,
    'Bâche renforcée avec œillets',
    'Pour couvrir une fenêtre cassée ou un toit abîmé.',
    { fr: 'bâche renforcée oeillets 3x4', de: 'Abdeckplane mit Ösen 3x4' },
  ),
  product(
    'heavy-trash-bags',
    ['heavy-duty-trash-bags'],
    1,
    'Sacs-poubelle très résistants',
    'Pour les déchets, la toilette de secours ou garder des affaires au sec.',
    { fr: 'sacs poubelle très résistants', de: 'Müllsäcke extra stark' },
  ),
  product(
    'utility-key',
    ['utility-shutoff-key'],
    1,
    'Clé multifonction pour vannes et compteurs',
    'Pour couper le gaz ou l’eau quand les secours le demandent.',
    { fr: 'clé multifonction vanne compteur', de: 'Absperrschlüssel Wasser Gas Zähler' },
  ),
  product(
    'compass',
    ['paper-map-compass'],
    1,
    'Boussole de randonnée',
    'Se repérer sans téléphone, avec une carte papier de la région.',
    { fr: 'boussole randonnée', de: 'Kompass Wandern', decathlon: 'boussole' },
  ),
  product(
    'braided-rope',
    ['thick-rope'],
    1,
    'Corde tressée de 10 mm, 15 m',
    'Plus épaisse que la paracorde : pour tirer, hisser ou se tenir.',
    { fr: 'corde tressée 10 mm 15 m', de: 'Seil geflochten 10 mm 15 m' },
  ),
  product(
    'carabiners',
    ['carabiners'],
    1,
    'Mousquetons à vis, lot de plusieurs',
    'Pour accrocher le matériel au sac.',
    { fr: 'mousquetons à vis lot', de: 'Karabiner Schraubverschluss Set' },
  ),
  product(
    'sewing-kit',
    ['sewing-kit'],
    1,
    'Petit kit de couture',
    'Recoudre un bouton ou une sangle, sans machine.',
    { fr: 'kit couture voyage', de: 'Nähset Reise' },
  ),

  /* ---------- Moral et famille ---------- */
  product(
    'card-games',
    ['games-books'],
    1,
    'Jeux de cartes et petits jeux de société',
    'Passer les soirées sans écran, en famille.',
    { fr: 'jeu de cartes famille', de: 'Kartenspiel Familie' },
  ),

  /* ---------- Réserve ---------- */
  product(
    'storage-box',
    ['storage-bin'],
    1,
    'Caisse de rangement avec couvercle, 50 à 60 L',
    'Toute la réserve au même endroit, facile à vérifier.',
    { fr: 'boîte de rangement couvercle 60 L', de: 'Aufbewahrungsbox mit Deckel 60 l' },
  ),
];
