/** Katalog auf Deutsch: Artikel und Kategorien. */
import type { ContentTranslation } from '../../types';

export const catalog: ContentTranslation['catalog'] = {
  items: {
    // ── Wasser ──
    'drinking-water': {
      name: 'Trinkwasser in Flaschen',
      hint: 'Rechne mit 3 L pro Person und Tag, plus Wasser für die Haustiere.',
    },
    'empty-water-containers': {
      name: 'Leere Wasserbehälter',
      hint: 'Flaschen oder ein Faltkanister: Füll sie am Wasserhahn, sobald eine Warnung kommt.',
    },
    'water-purification': {
      name: 'Entkeimungstabletten oder Wasserfilter',
      hint: 'Deine Notlösung, wenn die Flaschen leer sind.',
    },
    bucket: {
      name: 'Eimer (10 L)',
      hint: 'Zum Wasserschöpfen oder für eine improvisierte Nottoilette.',
    },
    // ── Essen ──
    'non-perishable-food': {
      name: 'Haltbare Lebensmittel',
      hint: 'Wähle zuerst Fertiges, das du direkt essen kannst: etwa 2.000 kcal pro Erwachsenem und Tag.',
    },
    'snacks-energy-bars': {
      name: 'Kekse, Nüsse, Trockenobst und Riegel',
      hint: 'Leicht und sofort essbar – ganz ohne Kochen und Abwasch.',
    },
    'pet-food': {
      name: 'Tierfutter',
      hint: 'Plane die gewohnte Ration für jedes Tier ein, je nach Art und Gewicht.',
    },
    'canned-meals': {
      name: 'Konserven',
      hint: 'Fertiggerichte, Gemüse, Fisch oder Hülsenfrüchte: Das kann man auch kalt essen.',
    },
    'pasta-rice': {
      name: 'Nudeln, Reis oder Haferflocken',
      hint: 'Denk daran, zusätzlich Wasser zum Kochen aufzubewahren.',
    },
    'long-life-milk': {
      name: 'H-Milch oder Milchpulver',
      hint: 'Hält sich monatelang ohne Kühlschrank, solange die Packung geschlossen ist.',
    },
    'fruit-pouches': {
      name: 'Quetschbeutel mit Fruchtmus',
      hint: 'Praktisch für Kinder: kein Löffel, kein Abwasch.',
    },
    'comfort-pantry': {
      name: 'Kaffee, Tee, Zucker, Salz und Schokolade',
      hint: 'Ein heißes Getränk oder ein Stück Schokolade hilft, die Stimmung zu halten.',
    },
    'baby-food': {
      name: 'Säuglingsmilch und Babygläschen',
      hint: 'Bleib bei der gewohnten Marke deines Babys und halte Wasser für die Fläschchen bereit.',
    },
    'special-diet-food': {
      name: 'Lebensmittel für besondere Ernährung',
      hint: 'Glutenfrei, für Diabetiker … je nach den gesundheitlichen Bedürfnissen im Haushalt.',
    },
    // ── Kochen ──
    'camping-stove': {
      name: 'Campingkocher (Gas)',
      hint: 'Damit wärmst du ein Gericht oder Wasser auf, wenn der Herd nicht mehr geht.',
      safety:
        'Kohlenmonoxid-Gefahr: Benutze ihn draußen oder in einem sehr gut belüfteten Raum, niemals zum Heizen.',
    },
    'gas-cartridges': {
      name: 'Gaskartuschen',
      hint: 'Ein bis zwei reichen für 72 Stunden: Prüfe sie einmal im Jahr.',
    },
    'manual-can-opener': {
      name: 'Manueller Dosenöffner',
      hint: 'Ohne ihn bleiben deine Konserven zu: Ein elektrischer nützt ohne Strom nichts.',
    },
    cookware: {
      name: 'Kochtopf, Besteck und Becher',
      hint: 'Ein kleiner Topf, der auf den Campingkocher passt, genügt.',
    },
    'foil-freezer-bags': {
      name: 'Alufolie und Gefrierbeutel',
      hint: 'Zum Abdecken, Einpacken und um Reste sauber aufzubewahren.',
    },
    'reusable-dishes': {
      name: 'Wiederverwendbare Teller und Becher',
      hint: 'Leicht und unzerbrechlich – so verschwendest du kein Wasser für empfindliches Geschirr.',
    },
    'dish-soap-sponge': {
      name: 'Spülmittel und Schwamm',
      hint: 'Eine kleine Flasche reicht, um mit sehr wenig Wasser abzuwaschen.',
    },
    // ── Licht und Energie ──
    flashlight: {
      name: 'Taschenlampe und 2 Sätze Batterien',
      hint: 'Oder eine Kurbellampe, die ohne Batterien funktioniert.',
    },
    headlamp: {
      name: 'Stirnlampe',
      hint: 'So hast du beide Hände frei zum Kochen oder Verarzten.',
    },
    'candles-matches': {
      name: 'Kerzen und Streichhölzer oder Feuerzeug',
      hint: 'Ein sanftes Licht, das weder von Batterien noch von Strom abhängt.',
      safety:
        'Lass eine brennende Kerze nie unbeaufsichtigt und halte sie fern von Vorhängen und Kindern.',
    },
    'power-bank': {
      name: 'Powerbank und Kabel',
      hint: 'Zum Aufladen deines Handys: Halte sie geladen und lade sie alle 3 Monate nach.',
    },
    'device-chargers': {
      name: 'Ladegeräte für Handy und Computer',
      hint: 'Bewahre sie beim Vorrat auf, damit du sie im Ernstfall nicht suchen musst.',
    },
    'spare-batteries': {
      name: 'Ersatzbatterien',
      hint: 'AA, AAA und die Größen deiner Geräte: Prüfe das Datum auf der Verpackung.',
    },
    'storm-matches': {
      name: 'Sturmstreichhölzer in wasserdichter Dose',
      hint: 'Sie zünden sogar bei Wind und Regen.',
    },
    'spare-lighter': {
      name: 'Ersatzfeuerzeug',
      hint: 'Klein und leicht – es springt ein, wenn die Streichhölzer nass sind.',
    },
    'led-lantern': {
      name: 'LED-Laterne',
      hint: 'Sie beleuchtet einen ganzen Raum und ist viel sicherer als eine Kerze.',
    },
    'light-sticks': {
      name: 'Leuchtstäbe',
      hint: 'Ohne Batterie und ohne Flamme: beruhigend für Kinder in der Nacht.',
    },
    'solar-panel': {
      name: 'Faltbares USB-Solarpanel',
      hint: 'Nützlich bei längerem Stromausfall: Es lädt Handy und Powerbank in der Sonne.',
    },
    // ── Wärme und Kleidung ──
    'sleeping-bags-blankets': {
      name: 'Schlafsack oder Decke',
      hint: 'Ohne Heizung kühlt das Haus schnell aus: einer pro Person.',
    },
    'change-of-clothes': {
      name: 'Kleidung und Schuhe zum Wechseln',
      hint: 'Passend zur Jahreszeit und zur aktuellen Größe der Kinder.',
    },
    'warm-clothes': {
      name: 'Mütze, Handschuhe und Fleecejacke',
      hint: 'Über Kopf und Hände verliert man viel Wärme.',
    },
    'emergency-blanket': {
      name: 'Rettungsdecke',
      hint: 'Sie wiegt nur wenige Gramm und hält die Körperwärme.',
    },
    'rain-poncho': {
      name: 'Regenponcho oder Regenjacke',
      hint: 'Wer trocken bleibt, bleibt warm.',
    },
    'walking-shoes': {
      name: 'Feste Wanderschuhe',
      hint: 'Nimm ein bereits eingelaufenes Paar, um Blasen zu vermeiden.',
    },
    'hand-warmers': {
      name: 'Wärmepads',
      hint: 'Sofortige Wärme für Hände oder Füße.',
    },
    // ── Gesundheit ──
    'first-aid-kit': {
      name: 'Erste-Hilfe-Set',
      hint: 'Mindestens Pflaster, Kompressen, Desinfektionsmittel und Paracetamol.',
    },
    'prescription-medication': {
      name: 'Medikamente für die laufende Behandlung',
      hint: 'Halte einige Tage Vorrat und eine Kopie des Rezepts bereit.',
      safety: 'Leg deinen Vorrat in Absprache mit deinem Arzt oder deiner Apotheke an.',
    },
    'potassium-iodide': {
      name: 'Jodtabletten',
      hint: 'Du bekommst sie kostenlos bei deiner Gemeinde.',
      safety:
        'Nur auf Anweisung der Behörden einnehmen, in der Regel für Personen unter 45 Jahren.',
    },
    'bandages-tape': {
      name: 'Elastische Binde und Heftpflaster',
      hint: 'Zum Stabilisieren einer Verstauchung oder für einen Druckverband.',
    },
    'tweezers-tick-remover': {
      name: 'Pinzette und Zeckenzange',
      hint: 'Zecken sind in den Wäldern des Landes häufig: Entferne sie schnell.',
    },
    thermometer: {
      name: 'Fieberthermometer',
      hint: 'Um Fieber im Blick zu behalten, wenn ein Arztbesuch schwierig ist.',
    },
    'oral-rehydration-salts': {
      name: 'Elektrolytpulver (Rehydratationssalze)',
      hint: 'Bei Durchfall oder Erbrechen, besonders bei Kindern.',
    },
    'ffp2-masks': {
      name: 'FFP2-Masken',
      hint: 'Sie schützen vor Staub, Rauch und Viren.',
    },
    'disposable-gloves': {
      name: 'Nitril-Einweghandschuhe',
      hint: 'Um eine Wunde zu versorgen oder Abfall gefahrlos anzufassen.',
    },
    'spare-glasses': {
      name: 'Ersatzbrille oder Kontaktlinsen',
      hint: 'Eine alte Brille mit deiner Sehstärke reicht, dazu das Pflegemittel für Linsen.',
    },
    'otc-medication': {
      name: 'Antiallergikum und Mittel gegen Durchfall',
      hint: 'Für kleine, alltägliche Beschwerden, wenn die Apotheke geschlossen ist.',
      safety: 'Lass dich vor der Auswahl in der Apotheke beraten.',
    },
    'medical-device-batteries': {
      name: 'Batterien für Hörgerät und medizinische Geräte',
      hint: 'Denk an jedes Gesundheitsgerät, das niemals ausfallen darf.',
    },
    'sunscreen-insect-repellent': {
      name: 'Sonnencreme und Mückenschutz',
      hint: 'Nützlich, wenn du nach einer Evakuierung lange draußen bleiben musst.',
    },
    // ── Hygiene ──
    'wet-wipes': {
      name: 'Feuchttücher',
      hint: 'Zum Waschen ohne Wasser, wenn der Hahn trocken bleibt.',
    },
    'toilet-paper': {
      name: 'Toilettenpapier',
      hint: 'Rechne mit etwa zwei Rollen pro Person für 72 Stunden.',
    },
    'hand-sanitizer': {
      name: 'Desinfektionsgel',
      hint: 'Damit die Hände vor dem Essen oder Verarzten sauber bleiben.',
    },
    toiletries: {
      name: 'Seife und Deo',
      hint: 'Reisegrößen genügen und brauchen wenig Platz.',
    },
    'toothbrush-kit': {
      name: 'Zahnbürste und Zahnpasta',
      hint: 'Eine Bürste pro Person, dazu eine kleine Tube Zahnpasta.',
    },
    'menstrual-products': {
      name: 'Monatshygiene',
      hint: 'Leg auch außerhalb der Periode etwas bereit: Stress kann die Regel verfrühen.',
    },
    'emergency-toilet': {
      name: 'Nottoilette',
      hint: 'Ein Eimer, Beutel und Streu: Die Spülung funktioniert vielleicht nicht mehr.',
    },
    'diapers-baby-wipes': {
      name: 'Windeln und Baby-Feuchttücher',
      hint: 'Nimm die aktuelle Größe und prüfe sie bei jeder Kontrolle des Vorrats.',
    },
    'microfiber-towel': {
      name: 'Mikrofaserhandtuch',
      hint: 'Leicht, kompakt und schnell trocken.',
    },
    'unscented-bleach': {
      name: 'Parfümfreie Chlorbleiche',
      hint: 'Zum Desinfizieren von Oberflächen und der Nottoilette.',
    },
    // ── Dokumente und Geld ──
    'document-copies': {
      name: 'Kopien wichtiger Dokumente',
      hint: 'Ausweis, Reisepass, Führerschein und Versicherungen, in einer wasserdichten Hülle.',
    },
    cash: {
      name: 'Bargeld',
      hint: 'In kleinen Scheinen und Münzen: Geldautomaten und Kartenterminals fallen mit dem Strom aus.',
    },
    wallet: {
      name: 'Geldbörse mit Ausweisen und Karten',
      hint: 'Ausweise, Karten und etwas Bargeld, zum Mitnehmen beim Aufbruch.',
    },
    'spare-keys': {
      name: 'Ersatzschlüssel für Haus und Auto',
      hint: 'Damit du nicht ausgesperrt bist, wenn du überstürzt aufbrichst.',
    },
    'medical-records': {
      name: 'Rezepte und Impfpass',
      hint: 'Notiere auch Blutgruppe und Allergien jeder Person.',
    },
    'family-photos': {
      name: 'Aktuelle Fotos der Familie und der Haustiere',
      hint: 'Sie helfen, eine vermisste Person oder ein entlaufenes Tier wiederzufinden.',
    },
    'encrypted-usb-backup': {
      name: 'Verschlüsselter USB-Stick mit deinen Dokumenten',
      hint: 'Eine digitale Kopie, geschützt durch ein starkes Passwort.',
    },
    'pet-documents': {
      name: 'Heimtierausweis',
      hint: 'Mit der Chipnummer – nützlich, wenn du das Tier abgeben oder wiederfinden musst.',
    },
    // ── Informiert bleiben ──
    'crank-radio': {
      name: 'Batterie- oder Kurbelradio',
      hint: 'Über UKW oder DAB+: Hör in der Krise RTL oder Radio 100,7. Teste es jeden Monat.',
    },
    'emergency-contacts-paper': {
      name: 'Liste wichtiger Nummern auf Papier',
      hint: 'Dein Handy kann ausgehen: Lies die Liste einmal im Jahr durch.',
    },
    'emergency-plan': {
      name: 'Ausgedruckter persönlicher Notfallplan',
      hint: 'Wer macht was, wo trifft man sich: Kitzy hilft dir beim Ausfüllen.',
    },
    'mobile-phone': {
      name: 'Handy und Ladegerät',
      hint: 'Mit installiertem LU-Alert, um die Warnungen für deine Gegend zu erhalten.',
    },
    // ── Werkzeug ──
    'pocket-knife': {
      name: 'Taschenmesser mit mehreren Funktionen',
      hint: 'Ein Schweizer Taschenmesser deckt die meisten kleinen Bedürfnisse ab.',
    },
    scissors: {
      name: 'Schere',
      hint: 'Zum Schneiden von Binden, Klebeband oder Verpackungen.',
    },
    'pen-pencil-notebook': {
      name: 'Kugelschreiber, Bleistift und Notizbuch',
      hint: 'Ein Bleistift schreibt sogar auf nassem Papier.',
    },
    multitool: {
      name: 'Multitool',
      hint: 'Zange, Schraubenzieher und Klinge in einem einzigen Werkzeug.',
    },
    'duct-tape': {
      name: 'Gewebeklebeband',
      hint: 'Zum Reparieren, Abdichten oder um ein Fenster abzukleben.',
    },
    paracord: {
      name: 'Dünne Schnur (Paracord)',
      hint: 'Etwa 15 m: zum Festbinden, Aufhängen oder Spannen einer Plane.',
    },
    'zip-ties': {
      name: 'Kabelbinder',
      hint: 'Praktisch, um etwas schnell und fest zu befestigen.',
    },
    'work-gloves': {
      name: 'Arbeitshandschuhe',
      hint: 'Zum Aufräumen oder Anfassen von Trümmern, ohne dich zu verletzen.',
    },
    'plastic-tarp': {
      name: 'Kunststoffplane',
      hint: 'Für einen Unterstand, ein kaputtes Fenster oder um Ausrüstung vor Regen zu schützen.',
    },
    'heavy-duty-trash-bags': {
      name: 'Reißfeste Müllsäcke',
      hint: 'Für Abfall, die Nottoilette oder als improvisierter Poncho.',
    },
    'utility-shutoff-key': {
      name: 'Schlüssel zum Absperren von Gas und Wasser',
      hint: 'Finde deine Absperrhähne schon jetzt und notiere sie in deinem Plan.',
    },
    'fire-extinguisher-blanket': {
      name: 'Feuerlöscher und Löschdecke',
      hint: 'Bewahre sie in der Nähe der Küche auf und lass den Feuerlöscher prüfen.',
    },
    'smoke-co-detector': {
      name: 'Rauch- und CO-Melder',
      hint: 'Er weckt dich bei einem Brand oder bei Kohlenmonoxid.',
    },
    whistle: {
      name: 'Trillerpfeife',
      hint: 'Man hört sie von Weitem, und sie ist weniger anstrengend als Rufen.',
    },
    'paper-map-compass': {
      name: 'Papierkarte der Region und Kompass',
      hint: 'GPS und Netz können ausfallen, Papier nicht.',
    },
    'thick-rope': {
      name: 'Dickes Seil',
      hint: 'Etwa 10 m, um eine schwere Last zu ziehen oder zu sichern.',
    },
    carabiners: {
      name: 'Karabiner',
      hint: 'Um Trinkflasche, Lampe oder Beutel außen am Rucksack zu befestigen.',
    },
    'sewing-kit': {
      name: 'Nähset',
      hint: 'Faden, Nadeln und Sicherheitsnadeln, um Kleidung oder einen Rucksack zu flicken.',
    },
    // ── Stimmung und Familie ──
    'games-books': {
      name: 'Kartenspiele, Brettspiele und Bücher',
      hint: 'Ohne Bildschirm vergeht die Zeit gemeinsam besser, vor allem für Kinder.',
    },
    'comfort-toy': {
      name: 'Kuscheltier oder Lieblingsspielzeug',
      hint: 'Ein vertrauter Gegenstand beruhigt ein Kind fern von zu Hause sehr.',
    },
    treats: {
      name: 'Süßigkeiten',
      hint: 'Eine kleine Leckerei tut gut, wenn der Tag lang ist.',
    },
    // ── Der Rucksack ──
    backpack: {
      name: 'Robuster Rucksack',
      hint: 'Einer für jede Person, die ihn tragen kann: Halte ihn leicht und gut zu transportieren.',
    },
    'storage-bin': {
      name: 'Beschriftete Kiste für den Hausvorrat',
      hint: 'Bewahre sie an einem sicheren, zugänglichen Ort auf, den alle im Haushalt kennen.',
    },
    'dry-bags': {
      name: 'Wasserdichte Packsäcke oder Zipp-Beutel',
      hint: 'Damit Dokumente, Streichhölzer und Elektronik trocken bleiben.',
    },
  },
  categories: {
    water: 'Wasser',
    food: 'Mahlzeiten',
    cooking: 'Kochen',
    light: 'Licht und Energie',
    warmth: 'Wärme und Kleidung',
    care: 'Gesundheit',
    hygiene: 'Hygiene',
    documents: 'Dokumente und Geld',
    info: 'Informiert bleiben',
    tools: 'Werkzeug',
    morale: 'Stimmung und Familie',
    bag: 'Der Rucksack',
  },
};
