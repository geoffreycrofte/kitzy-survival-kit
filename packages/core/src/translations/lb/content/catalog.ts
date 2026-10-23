/** Katalog op Lëtzebuergesch: Artikelen a Kategorien. */
import type { ContentTranslation } from '../../types';

export const catalog: ContentTranslation['catalog'] = {
  items: {
    // ── Waasser ──
    'drinking-water': {
      name: 'Drénkwaasser a Fläschen',
      hint: 'Rechen 3 L pro Persoun an Dag, plus d’Waasser fir d’Déieren.',
    },
    'empty-water-containers': {
      name: 'Eidel Behälter fir Waasser',
      hint: 'Fläschen oder e faltbare Kanister: fëll se um Krunn, soubal eng Warnung erausgeet.',
    },
    'water-purification': {
      name: 'Desinfektiounstabletten oder Waasserfilter',
      hint: 'Deng Noutléisung, wann d’Fläschen eidel sinn.',
    },
    bucket: {
      name: 'Eemer vun 10 L',
      hint: 'Fir Waasser ze schäffen oder eng Nouttoilett ze improviséieren.',
    },

    // ── Iessen ──
    'non-perishable-food': {
      name: 'Haltbar Iessen',
      hint: 'Huel virun allem Saachen, déi een direkt iesse kann: ongeféier 2.000 kcal pro Erwuessenen an Dag.',
    },
    'snacks-energy-bars': {
      name: 'Kichelcher, Nëss, gedréchent Uebst a Riegelen',
      hint: 'Liicht a fäerdeg fir z’iessen: si hëllefen aus, ouni Kachen an ouni Ofwäsch.',
    },
    'pet-food': {
      name: 'Déierefudder',
      hint: 'Plang déi gewinnt Ratioun fir all Déier an, no senger Aart a sengem Gewiicht.',
    },
    'canned-meals': {
      name: 'Konserven',
      hint: 'Fäerdeg Platen, Geméis, Fësch oder Hülsefrüchten: dat kann een och kal iessen.',
    },
    'pasta-rice': {
      name: 'Nuddelen, Rais oder Hafferflocken',
      hint: 'Denk drun, extra Waasser fir d’Kachen op der Säit ze halen.',
    },
    'long-life-milk': {
      name: 'UHT-Mëllech oder Mëllechpolver',
      hint: 'Si hält sech Méint laang ouni Frigo, soulaang d’Packung zou ass.',
    },
    'fruit-pouches': {
      name: 'Kompott am Quetschbeidel',
      hint: 'Praktesch fir Kanner: kee Läffel, keen Ofwäsch.',
    },
    'comfort-pantry': {
      name: 'Kaffi, Téi, Zocker, Salz a Schockela',
      hint: 'E waarmt Gedrénks oder e Stéck Schockela hëlleft, gutt drop ze bleiwen.',
    },
    'baby-food': {
      name: 'Babymëllech a Kannerbräi am Glas',
      hint: 'Bleif bei der gewinnter Mark vun dengem Puppelchen an hal Waasser fir d’Fläschen ze maachen.',
    },
    'special-diet-food': {
      name: 'Iessen fir eng speziell Diät',
      hint: 'Glutenfräi, fir Diabetiker… jee no de Gesondheetsbedierfnesser vum Haushalt.',
    },

    // ── Kachen ──
    'camping-stove': {
      name: 'Campingkacher mat Gas',
      hint: 'Domat kanns du e Plat oder Waasser waarm maachen, wann den Hiert net méi geet.',
      safety:
        'Gefor vu Kuelemonoxid: benotz en dobaussen oder an engem Raum, dee ganz gutt gelëft ass, ni fir ze hëtzen.',
    },
    'gas-cartridges': {
      name: 'Gaskartuschen',
      hint: 'Eng bis zwou reechen fir 72 h: kontrolléier se eemol am Joer.',
    },
    'manual-can-opener': {
      name: 'Manuellen Dousenopmaacher',
      hint: 'Ouni hie bleiwen deng Konserven zou: en elektreschen notzt ouni Stroum näischt.',
    },
    cookware: {
      name: 'Kasseroll, Besteck a Becher',
      hint: 'Eng kleng Kasseroll, déi op de Campingkacher passt, geet duer.',
    },
    'foil-freezer-bags': {
      name: 'Alufolie a Gefréierbeidelen',
      hint: 'Fir zouzedecken, anzepaken an d’Reschter propper ze halen.',
    },
    'reusable-dishes': {
      name: 'Wiederverwendbar Telleren a Bechere',
      hint: 'Liicht an onzerbriechlech: esou verschwends du kee Waasser mat fragillem Geschier.',
    },
    'dish-soap-sponge': {
      name: 'Spullmëttel a Schwamp',
      hint: 'E klengt Fläschen geet duer, fir mat ganz wéineg Waasser ze spullen.',
    },

    // ── Liicht an Energie ──
    flashlight: {
      name: 'Täschelamp an 2 Sätz Batterien',
      hint: 'Oder eng Kurbellamp, déi ouni Batterie funktionéiert.',
    },
    headlamp: {
      name: 'Kapplamp',
      hint: 'Esou hues du béid Hänn fräi, fir ze kachen oder een ze versuergen.',
    },
    'candles-matches': {
      name: 'Käerzen a Fixfeieren oder Feierzeug',
      hint: 'E mëllt Liicht, dat weder vu Batterien nach vum Stroum ofhänkt.',
      safety:
        'Looss ni eng brennend Käerz ouni Opsiicht, an hal se wäit vu Rideauen a Kanner ewech.',
    },
    'power-bank': {
      name: 'Powerbank a Kabelen',
      hint: 'Fir däin Handy ze lueden: hal se gelueden a lued se all 3 Méint nei op.',
    },
    'device-chargers': {
      name: 'Luedegeräter fir Handy a Computer',
      hint: 'Leeë se bei de Kit, da muss de se um Dag X net sichen.',
    },
    'spare-batteries': {
      name: 'Ersatzbatterien',
      hint: 'AA, AAA an d’Formater vun dengen Apparater: kuck den Datum op der Verpackung.',
    },
    'storm-matches': {
      name: 'Stuermfixfeieren an enger waasserdichter Dous',
      hint: 'Déi brennen souguer bei Wand oder Reen.',
    },
    'spare-lighter': {
      name: 'Ersatzfeierzeug',
      hint: 'Kleng a liicht: et hëlleft aus, wann d’Fixfeieren naass sinn.',
    },
    'led-lantern': {
      name: 'LED-Lanter',
      hint: 'Si beliicht e ganze Raum a si ass vill méi sécher wéi eng Käerz.',
    },
    'light-sticks': {
      name: 'Liichtstäb',
      hint: 'Ouni Batterie an ouni Flam: berouegend fir Kanner an der Nuecht.',
    },
    'solar-panel': {
      name: 'Faltbare USB-Solarpanneau',
      hint: 'Praktesch, wann de Stroumausfall méi laang dauert: hie luet Handy a Powerbank mat der Sonn op.',
    },

    // ── Wäermt a Kleeder ──
    'sleeping-bags-blankets': {
      name: 'Schlofsak oder Deck',
      hint: 'Ouni Hëtzung gëtt d’Haus séier kal: ee pro Persoun.',
    },
    'change-of-clothes': {
      name: 'Kleeder a Schong zum Wiesselen',
      hint: 'Pass se der Joreszäit an der aktueller Gréisst vun de Kanner un.',
    },
    'warm-clothes': {
      name: 'Mutz, Händschen a Fleecepullover',
      hint: 'Mir verléieren vill Wäermt iwwer de Kapp an d’Hänn.',
    },
    'emergency-blanket': {
      name: 'Rettungsdeck',
      hint: 'Si weit e puer Gramm an hält d’Kierperwäermt.',
    },
    'rain-poncho': {
      name: 'Poncho oder Reejack',
      hint: 'Wie dréche bleift, bleift waarm.',
    },
    'walking-shoes': {
      name: 'Robust Trëppelschong',
      hint: 'Huel e Paar, dat schonn agedroen ass, da kriss de keng Blosen.',
    },
    'hand-warmers': {
      name: 'Handwiermer',
      hint: 'Direkt Wäermt fir d’Hänn oder d’Féiss.',
    },

    // ── Fleeg ──
    'first-aid-kit': {
      name: 'Éischt-Hëllef-Täsch',
      hint: 'Op d’mannst Plooschter, Kompressen, Desinfektiounsmëttel a Paracetamol.',
    },
    'prescription-medication': {
      name: 'Medikamenter vun der aktueller Behandlung',
      hint: 'Hal e puer Deeg am Viraus an eng Kopie vun der Ordonnance.',
      safety: 'Leg deng Reserv nëmmen no Rot vun dengem Dokter oder Apdikter un.',
    },
    'potassium-iodide': {
      name: 'Jodtabletten',
      hint: 'Du kriss se gratis bei denger Gemeng.',
      safety:
        'Nëmmen op Uweisung vun den Autoritéiten huelen, normalerweis fir Leit ënner 45 Joer.',
    },
    'bandages-tape': {
      name: 'Elastesch Bind a Heftplooschter',
      hint: 'Fir e verdréinte Fouss oder en Drockverband ze stabiliséieren.',
    },
    'tweezers-tick-remover': {
      name: 'Pinzett an Zeckenzaang',
      hint: 'Zecke sinn an de Bëscher am Land heefeg: huel se séier eraus.',
    },
    thermometer: {
      name: 'Thermometer',
      hint: 'Fir Féiwer z’iwwerwaachen, wann et schwéier ass, bei en Dokter ze kommen.',
    },
    'oral-rehydration-salts': {
      name: 'Rehydratatiounssalzer',
      hint: 'Bei Duerchfall oder Erbriechen, virun allem bei Kanner.',
    },
    'ffp2-masks': {
      name: 'FFP2-Masken',
      hint: 'Si schützen viru Stëbs, Damp a Viren.',
    },
    'disposable-gloves': {
      name: 'Wegwerfhändschen aus Nitril',
      hint: 'Fir eng Wonn ze versuergen oder Offall ouni Risiko unzepaken.',
    },
    'spare-glasses': {
      name: 'Ersatzbrëll oder Kontaktlënsen',
      hint: 'Eng al Brëll mat denger Stäerkt geet duer, mat der Flëssegkeet fir d’Lënsen.',
    },
    'otc-medication': {
      name: 'Antihistaminikum a Mëttel géint Duerchfall',
      hint: 'Fir kleng alldeeglech Problemer, wann d’Apdikt zou ass.',
      safety: 'Fro däin Apdikter ëm Rot, ier s du se auswiels.',
    },
    'medical-device-batteries': {
      name: 'Batterie fir Héierapparat a medezinesch Geräter',
      hint: 'Denk un all Gesondheetsapparat, deen ni däerf stoe bleiwen.',
    },
    'sunscreen-insect-repellent': {
      name: 'Sonnecrème a Méckespray',
      hint: 'Nëtzlech, wann s de no enger Evakuéierung laang dobausse bleiwe muss.',
    },

    // ── Hygiène ──
    'wet-wipes': {
      name: 'Fiicht Dicher',
      hint: 'Fir dech ouni Waasser ze wäschen, wann d’Waasser ofgestallt ass.',
    },
    'toilet-paper': {
      name: 'Toilettepabeier',
      hint: 'Rechen ongeféier zwou Rolle pro Persoun fir 72 h.',
    },
    'hand-sanitizer': {
      name: 'Desinfektiounsgel',
      hint: 'Fir propper Hänn ze halen, ier s de iss oder een versuergs.',
    },
    toiletries: {
      name: 'Seef an Deodorant',
      hint: 'Reesformater ginn duer a brauche wéineg Plaz.',
    },
    'toothbrush-kit': {
      name: 'Zännbiischt an Zännpasta',
      hint: 'Eng Biischt pro Persoun, mat enger klenger Tub Zännpasta.',
    },
    'menstrual-products': {
      name: 'Hygieneprodukter fir d’Reegel',
      hint: 'Plang der och an, wann s de net deng Reegel hues: Stress ka se méi fréi kommen loossen.',
    },
    'emergency-toilet': {
      name: 'Nouttoilett',
      hint: 'En Eemer, Säck a Kazestreu: et kann sinn, datt d’Spullung net méi geet.',
    },
    'diapers-baby-wipes': {
      name: 'Wëndelen a Babydicher',
      hint: 'Huel déi aktuell Gréisst a kontrolléier se bei all Check vum Kit.',
    },
    'microfiber-towel': {
      name: 'Mikrofaserhanddoch',
      hint: 'Liicht, kompakt a séier dréchen.',
    },
    'unscented-bleach': {
      name: 'Javel ouni Parfum',
      hint: 'Fir Flächen an d’Nouttoilett ze desinfizéieren.',
    },

    // ── Dokumenter a Geld ──
    'document-copies': {
      name: 'Kopië vu wichtege Pabeieren',
      hint: 'Identitéitskaart, Pass, Führerschäin a Versécherungen, an enger waasserdichter Mapp.',
    },
    cash: {
      name: 'Boergeld',
      hint: 'A klenge Geldschäiner a Mënzen: Bancomaten a Kaartenterminale falen ouni Stroum aus.',
    },
    wallet: {
      name: 'Portemonnaie mat Pabeieren a Kaarten',
      hint: 'Ausweis, Kaarten an e bësse Boergeld, fir matzehuelen, wann s de fortgees.',
    },
    'spare-keys': {
      name: 'Ersatzschlëssele fir Haus an Auto',
      hint: 'Fir net virun der Dier ze stoen, wann s de séier fort muss.',
    },
    'medical-records': {
      name: 'Ordonnancen a Vaccinatiounskaart',
      hint: 'Schreif och vu jidderengem d’Bluttgrupp an d’Allergien op.',
    },
    'family-photos': {
      name: 'Aktuell Fotoe vun der Famill an den Déieren',
      hint: 'Si hëllefen, eng vermësst Persoun oder e verluert Déier erëmzefannen.',
    },
    'encrypted-usb-backup': {
      name: 'Verschlësselten USB-Stick mat dengen Dokumenter',
      hint: 'Eng digital Kopie, geschützt duerch e staarkt Passwuert.',
    },
    'pet-documents': {
      name: 'Gesondheetspass vum Déier',
      hint: 'Mat der Chipnummer: nëtzlech, wann s du et engem muss uvertrauen oder et erëmfanne muss.',
    },

    // ── Informéiert bleiwen ──
    'crank-radio': {
      name: 'Radio mat Batterien oder Kurbel',
      hint: 'Op FM oder DAB+: an enger Kris lauschter RTL oder radio 100,7. Test en all Mount.',
    },
    'emergency-contacts-paper': {
      name: 'Lëscht vun de wichtegen Nummeren op Pabeier',
      hint: 'Däin Handy kann ausgoen: liess d’Lëscht eemol am Joer duerch.',
    },
    'emergency-plan': {
      name: 'Ausgedréckten Noutplang',
      hint: 'Wie mécht wat, wou ee sech trefft: Kitzy hëlleft der, en auszefëllen.',
    },
    'mobile-phone': {
      name: 'Handy mat Chargeur',
      hint: 'Mat LU-Alert installéiert, fir d’Warnunge fir deng Zon ze kréien.',
    },

    // ── Geschir ──
    'pocket-knife': {
      name: 'Multifunktiouns-Sackmesser',
      hint: 'E Schwäizer Messer deckt déi meescht kleng Besoinen of.',
    },
    scissors: {
      name: 'Schéier',
      hint: 'Fir Bandagen, Klebband oder Verpackungen ze schneiden.',
    },
    'pen-pencil-notebook': {
      name: 'Stylo, Bläistëft a Notizbuch',
      hint: 'De Bläistëft schreift och op naassem Pabeier.',
    },
    multitool: {
      name: 'Multifunktiounszaang',
      hint: 'Zaang, Tournevis a Kling an engem eenzege Geschir.',
    },
    'duct-tape': {
      name: 'Verstäerkt Klebband',
      hint: 'Fir ze reparéieren, Lächer zouzemaachen oder eng Fënster ofzedichten.',
    },
    paracord: {
      name: 'Dënnt Seel (Paracord)',
      hint: 'Ongeféier 15 m: fir unzebannen, opzehänken oder eng Bâche ze spanen.',
    },
    'zip-ties': {
      name: 'Kabelbinder',
      hint: 'Praktesch, fir eppes séier a fest ze befestegen.',
    },
    'work-gloves': {
      name: 'Aarbechtshändschen',
      hint: 'Fir Schutt ewechzeraumen oder Stécker unzepaken, ouni dech ze blesséieren.',
    },
    'plastic-tarp': {
      name: 'Plastiksbâche',
      hint: 'Fir en Ënnerstand, eng futtis Fënster oder fir Material virum Reen ze schützen.',
    },
    'heavy-duty-trash-bags': {
      name: 'Robust Poubellessäck',
      hint: 'Fir Offall, d’Nouttoilett oder als improviséierte Poncho.',
    },
    'utility-shutoff-key': {
      name: 'Schlëssel fir Gas a Waasser ofzestellen',
      hint: 'Fann elo schonn eraus, wou deng Haaptventiler sinn, a schreif se an däi Plang.',
    },
    'fire-extinguisher-blanket': {
      name: 'Feierläscher a Läschdeck',
      hint: 'Leeë se no bei d’Kichen a looss de Feierläscher kontrolléieren.',
    },
    'smoke-co-detector': {
      name: 'Damp- a CO-Melder',
      hint: 'Hie weckt dech, wann et brennt oder wann Kuelemonoxid do ass.',
    },
    whistle: {
      name: 'Peif',
      hint: 'Een héiert se vu wäitem, an et ass manner ustrengend wéi ze jäizen.',
    },
    'paper-map-compass': {
      name: 'Pabeierkaart vun der Regioun a Kompass',
      hint: 'GPS an Netz kënnen ausfalen, de Pabeier net.',
    },
    'thick-rope': {
      name: 'Déckt Seel',
      hint: 'Ongeféier 10 m, fir eng schwéier Laascht ze zéien oder ze sécheren.',
    },
    carabiners: {
      name: 'Karabiner',
      hint: 'Fir Gourde, Lamp oder Täsch baussen um Rucksak festzemaachen.',
    },
    'sewing-kit': {
      name: 'Néizeech',
      hint: 'Fuedem, Nolen a Sécherheetsnolen, fir e Kleedungsstéck oder eng Täsch ze flécken.',
    },

    // ── Moral a Famill ──
    'games-books': {
      name: 'Kaarten, Gesellschaftsspiller a Bicher',
      hint: 'Ouni Bildschierm vergeet d’Zäit zesumme méi séier, virun allem fir d’Kanner.',
    },
    'comfort-toy': {
      name: 'Kuscheldéier oder Liiblingsspillsaach',
      hint: 'Eppes Vertrautes berouegt e Kand vill, wann et wäit vun doheem ass.',
    },
    treats: {
      name: 'Séissegkeeten',
      hint: 'Eppes Séisses deet gutt, wann den Dag laang ass.',
    },

    // ── De Sak ──
    backpack: {
      name: 'Robuste Rucksak',
      hint: 'Ee fir all Persoun, déi en droe kann: hal e liicht a bequem ze transportéieren.',
    },
    'storage-bin': {
      name: 'Beschrëft Këscht fir de Stock doheem',
      hint: 'Stell se op eng sécher Plaz, déi einfach z’erreechen ass an déi jiddereen am Haus kennt.',
    },
    'dry-bags': {
      name: 'Waasserdicht Säck oder Zip-Beidelen',
      hint: 'Fir Dokumenter, Fixfeieren an Elektronik dréchen ze halen.',
    },
  },
  categories: {
    water: 'Waasser',
    food: 'Iessen',
    cooking: 'Kachen',
    light: 'Liicht an Energie',
    warmth: 'Wäermt a Kleeder',
    care: 'Fleeg',
    hygiene: 'Hygiène',
    documents: 'Dokumenter a Geld',
    info: 'Informéiert bleiwen',
    tools: 'Geschir',
    morale: 'Moral a Famill',
    bag: 'De Sak',
  },
};
