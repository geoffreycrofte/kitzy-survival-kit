/** English (en-GB) translation of the item catalogue. */
import type { ContentTranslation } from '../../types';

export const catalog: ContentTranslation['catalog'] = {
  items: {
    // Water
    'drinking-water': {
      name: 'Drinking water in bottles',
      hint: 'Allow 3 L per person per day, plus water for your pets.',
    },
    'empty-water-containers': {
      name: 'Empty water containers',
      hint: 'Bottles or a foldable jerrycan: fill them from the tap as soon as an alert goes out.',
    },
    'water-purification': {
      name: 'Water purification tablets or water filter',
      hint: 'Your back-up plan if the bottles run out.',
    },
    bucket: {
      name: '10 L bucket',
      hint: 'For fetching water or rigging up an emergency toilet.',
    },
    // Food
    'non-perishable-food': {
      name: 'Non-perishable food',
      hint: 'Go for ready-to-eat food first: about 2,000 kcal per adult per day.',
    },
    'snacks-energy-bars': {
      name: 'Biscuits, nuts, dried fruit and bars',
      hint: 'Light and ready to eat, they keep you going with no cooking and no washing-up.',
    },
    'pet-food': {
      name: 'Pet food',
      hint: 'Plan each pet’s usual ration, according to its species and weight.',
    },
    'canned-meals': {
      name: 'Tinned food',
      hint: 'Ready meals, vegetables, fish or pulses: you can eat them cold too.',
    },
    'pasta-rice': {
      name: 'Pasta, rice or porridge oats',
      hint: 'Remember to keep extra water for cooking.',
    },
    'long-life-milk': {
      name: 'UHT or powdered milk',
      hint: 'It keeps for months without a fridge, as long as the carton stays closed.',
    },
    'fruit-pouches': {
      name: 'Fruit purée pouches',
      hint: 'Handy for children: no spoon, no washing-up.',
    },
    'comfort-pantry': {
      name: 'Coffee, tea, sugar, salt and chocolate',
      hint: 'A hot drink or a square of chocolate helps keep your spirits up.',
    },
    'baby-food': {
      name: 'Baby formula and baby food jars',
      hint: 'Stick to the brand your baby usually has, and keep water for making up bottles.',
    },
    'special-diet-food': {
      name: 'Food for special diets',
      hint: 'Gluten-free, suitable for diabetics… depending on your household’s health needs.',
    },
    // Cooking
    'camping-stove': {
      name: 'Camping stove',
      hint: 'It lets you heat up a meal or water when the cooker no longer works.',
      safety:
        'Risk of carbon monoxide: use it outdoors or in a very well-ventilated room, never for heating.',
    },
    'gas-cartridges': {
      name: 'Gas cartridges',
      hint: 'One or two are enough for 72 hours: check them once a year.',
    },
    'manual-can-opener': {
      name: 'Manual tin opener',
      hint: 'Without one, your tins stay shut: an electric one is useless without power.',
    },
    cookware: {
      name: 'Saucepan, cutlery and cup',
      hint: 'A small saucepan that fits on the camping stove is enough.',
    },
    'foil-freezer-bags': {
      name: 'Kitchen foil and freezer bags',
      hint: 'For covering, wrapping and keeping leftovers clean.',
    },
    'reusable-dishes': {
      name: 'Reusable plates and cups',
      hint: 'Light and unbreakable, they save you wasting water on fragile crockery.',
    },
    'dish-soap-sponge': {
      name: 'Washing-up liquid and sponge',
      hint: 'A small bottle is enough to wash up with very little water.',
    },
    // Light and power
    flashlight: {
      name: 'Torch and 2 sets of batteries',
      hint: 'Or a wind-up torch, which works without batteries.',
    },
    headlamp: {
      name: 'Head torch',
      hint: 'It leaves both hands free for cooking or first aid.',
    },
    'candles-matches': {
      name: 'Candles and matches or a lighter',
      hint: 'A soft light that depends on neither batteries nor mains power.',
      safety: 'Never leave a lit candle unattended, and keep it away from curtains and children.',
    },
    'power-bank': {
      name: 'Power bank and cables',
      hint: 'To charge your phone: keep it charged and top it up every 3 months.',
    },
    'device-chargers': {
      name: 'Phone and laptop chargers',
      hint: 'Keep them with the kit so you don’t have to hunt for them on the day.',
    },
    'spare-batteries': {
      name: 'Spare batteries',
      hint: 'AA, AAA and the sizes your devices take: check the date on the packaging.',
    },
    'storm-matches': {
      name: 'Storm matches in a waterproof box',
      hint: 'They light even in wind or rain.',
    },
    'spare-lighter': {
      name: 'Spare lighter',
      hint: 'Small and light, it takes over if the matches get wet.',
    },
    'led-lantern': {
      name: 'LED lantern',
      hint: 'It lights a whole room, and is much safer than a candle.',
    },
    'light-sticks': {
      name: 'Glow sticks',
      hint: 'No batteries, no flame: reassuring for children at night.',
    },
    'solar-panel': {
      name: 'Foldable USB solar panel',
      hint: 'Useful if the power cut drags on: it charges your phone and power bank in the sun.',
    },
    // Warmth and clothing
    'sleeping-bags-blankets': {
      name: 'Sleeping bag or blanket',
      hint: 'Without heating, the house gets cold quickly: one per person.',
    },
    'change-of-clothes': {
      name: 'Change of clothes and shoes',
      hint: 'Match them to the season and to your children’s current sizes.',
    },
    'warm-clothes': {
      name: 'Woolly hat, gloves and fleece',
      hint: 'We lose a lot of heat through our head and hands.',
    },
    'emergency-blanket': {
      name: 'Emergency foil blanket',
      hint: 'It weighs a few grams and holds in body heat.',
    },
    'rain-poncho': {
      name: 'Poncho or rain jacket',
      hint: 'Staying dry means staying warm.',
    },
    'walking-shoes': {
      name: 'Sturdy walking shoes',
      hint: 'Choose a pair you’ve already worn in, to avoid blisters.',
    },
    'hand-warmers': {
      name: 'Hand warmers',
      hint: 'An instant burst of warmth for hands or feet.',
    },
    // Care
    'first-aid-kit': {
      name: 'First aid kit',
      hint: 'Plasters, gauze pads, antiseptic and paracetamol at the very least.',
    },
    'prescription-medication': {
      name: 'Your current prescription medicines',
      hint: 'Keep a few days’ extra supply and a copy of your prescription.',
      safety: 'Build up your supply on the advice of your doctor or pharmacist.',
    },
    'potassium-iodide': {
      name: 'Iodine tablets',
      hint: 'They are available free of charge from your local council (commune).',
      safety: 'Take them only when the authorities tell you to, generally for people under 45.',
    },
    'bandages-tape': {
      name: 'Elastic bandage and surgical tape',
      hint: 'To support a sprain or hold a pressure dressing in place.',
    },
    'tweezers-tick-remover': {
      name: 'Tweezers and tick remover',
      hint: 'Ticks are common in the country’s forests: remove them quickly.',
    },
    thermometer: {
      name: 'Thermometer',
      hint: 'To keep an eye on a fever when it’s hard to see a doctor.',
    },
    'oral-rehydration-salts': {
      name: 'Oral rehydration salts',
      hint: 'For diarrhoea or vomiting, especially in children.',
    },
    'ffp2-masks': {
      name: 'FFP2 masks',
      hint: 'They protect against dust, smoke and viruses.',
    },
    'disposable-gloves': {
      name: 'Disposable nitrile gloves',
      hint: 'For treating a wound or handling waste safely.',
    },
    'spare-glasses': {
      name: 'Spare glasses or contact lenses',
      hint: 'An old pair with your prescription will do, plus contact lens solution.',
    },
    'otc-medication': {
      name: 'Antihistamine and anti-diarrhoea medicine',
      hint: 'For minor everyday problems, when the pharmacy is closed.',
      safety: 'Ask your pharmacist for advice before choosing them.',
    },
    'medical-device-batteries': {
      name: 'Batteries for hearing aids and medical equipment',
      hint: 'Think of any health device that must never stop working.',
    },
    'sunscreen-insect-repellent': {
      name: 'Sun cream and insect repellent',
      hint: 'Useful if you have to stay outdoors for a long time after an evacuation.',
    },
    // Hygiene
    'wet-wipes': {
      name: 'Wet wipes',
      hint: 'For washing without water when the tap is off.',
    },
    'toilet-paper': {
      name: 'Toilet paper',
      hint: 'Allow about two rolls per person for 72 hours.',
    },
    'hand-sanitizer': {
      name: 'Hand sanitiser',
      hint: 'To keep your hands clean before eating or giving first aid.',
    },
    toiletries: {
      name: 'Soap and deodorant',
      hint: 'Travel sizes are enough and take up little space.',
    },
    'toothbrush-kit': {
      name: 'Toothbrush and toothpaste',
      hint: 'One toothbrush per person, with a small tube of toothpaste.',
    },
    'menstrual-products': {
      name: 'Period products',
      hint: 'Pack some even if your period isn’t due: stress can bring it on early.',
    },
    'emergency-toilet': {
      name: 'Emergency toilet',
      hint: 'A bucket, bags and cat litter: the toilet may stop flushing.',
    },
    'diapers-baby-wipes': {
      name: 'Nappies and baby wipes',
      hint: 'Get your baby’s current size and check it each time you review the kit.',
    },
    'microfiber-towel': {
      name: 'Microfibre towel',
      hint: 'Light, compact and quick-drying.',
    },
    'unscented-bleach': {
      name: 'Unscented bleach',
      hint: 'For disinfecting surfaces and the emergency toilet.',
    },
    // Documents and money
    'document-copies': {
      name: 'Copies of important documents',
      hint: 'ID card, passport, driving licence and insurance, in a waterproof pouch.',
    },
    cash: {
      name: 'Cash',
      hint: 'In small notes and coins: cash machines and card terminals go down with the power.',
    },
    wallet: {
      name: 'Wallet with documents and cards',
      hint: 'ID, cards and a little cash, to grab as you leave.',
    },
    'spare-keys': {
      name: 'Spare house and car keys',
      hint: 'So you don’t get locked out if you have to leave in a hurry.',
    },
    'medical-records': {
      name: 'Prescriptions and vaccination records',
      hint: 'Also note down everyone’s blood group and allergies.',
    },
    'family-photos': {
      name: 'Recent photos of your household and pets',
      hint: 'They help find a missing person or a lost pet.',
    },
    'encrypted-usb-backup': {
      name: 'Encrypted USB stick with your documents',
      hint: 'A digital copy protected by a strong password.',
    },
    'pet-documents': {
      name: 'Pet health record',
      hint: 'With the microchip number, useful if you need to leave your pet with someone or find it.',
    },
    // Staying informed
    'crank-radio': {
      name: 'Battery or wind-up radio',
      hint: 'On FM or DAB+: in a crisis, listen to RTL or radio 100,7. Test it every month.',
    },
    'emergency-contacts-paper': {
      name: 'Paper list of useful numbers',
      hint: 'Your phone may die: read through the list once a year.',
    },
    'emergency-plan': {
      name: 'Printed personal emergency plan',
      hint: 'Who does what, where to meet: Kitzy helps you fill it in.',
    },
    'mobile-phone': {
      name: 'Mobile phone and charger',
      hint: 'With LU-Alert installed, to receive alerts for your area.',
    },
    // Tools
    'pocket-knife': {
      name: 'Multi-purpose pocket knife',
      hint: 'A Swiss army knife covers most small jobs.',
    },
    scissors: {
      name: 'Scissors',
      hint: 'For cutting bandages, tape or packaging.',
    },
    'pen-pencil-notebook': {
      name: 'Pen, pencil and notebook',
      hint: 'A pencil writes even on wet paper.',
    },
    multitool: {
      name: 'Multi-tool',
      hint: 'Pliers, screwdriver and blade in a single tool.',
    },
    'duct-tape': {
      name: 'Duct tape',
      hint: 'For repairing, patching or sealing a window.',
    },
    paracord: {
      name: 'Thin cord (paracord)',
      hint: 'About 15 m: for tying, hanging or putting up a tarpaulin.',
    },
    'zip-ties': {
      name: 'Cable ties',
      hint: 'Handy for fastening things quickly and securely.',
    },
    'work-gloves': {
      name: 'Work gloves',
      hint: 'For clearing up or handling debris without hurting yourself.',
    },
    'plastic-tarp': {
      name: 'Plastic tarpaulin',
      hint: 'For a shelter, a broken window or keeping equipment out of the rain.',
    },
    'heavy-duty-trash-bags': {
      name: 'Heavy-duty bin bags',
      hint: 'For rubbish, an emergency toilet or a makeshift poncho.',
    },
    'utility-shutoff-key': {
      name: 'Key to turn off the gas and water',
      hint: 'Find your shut-off valves now and note them in your plan.',
    },
    'fire-extinguisher-blanket': {
      name: 'Fire extinguisher and fire blanket',
      hint: 'Keep them near the kitchen and have the extinguisher serviced.',
    },
    'smoke-co-detector': {
      name: 'Smoke and CO alarm',
      hint: 'It wakes you if there’s a fire or carbon monoxide.',
    },
    whistle: {
      name: 'Whistle',
      hint: 'It can be heard from far away and is less tiring than shouting.',
    },
    'paper-map-compass': {
      name: 'Paper map of the area and compass',
      hint: 'GPS and the mobile network can go down; paper can’t.',
    },
    'thick-rope': {
      name: 'Thick rope',
      hint: 'About 10 m, for pulling or securing a heavy load.',
    },
    carabiners: {
      name: 'Carabiners',
      hint: 'For hanging a water bottle, torch or bag on the outside of your rucksack.',
    },
    'sewing-kit': {
      name: 'Sewing kit',
      hint: 'Thread, needles and safety pins to mend clothes or a bag.',
    },
    // Morale and family
    'games-books': {
      name: 'Playing cards, board games and books',
      hint: 'Without screens, time passes better together, especially for children.',
    },
    'comfort-toy': {
      name: 'Comforter or favourite toy',
      hint: 'A familiar object is very reassuring for a child away from home.',
    },
    treats: {
      name: 'Treats',
      hint: 'A little something sweet does you good when the day is long.',
    },
    // The bag
    backpack: {
      name: 'Sturdy rucksack',
      hint: 'One for each person able to carry it: keep it light and easy to carry.',
    },
    'storage-bin': {
      name: 'Labelled box for the home supply',
      hint: 'Keep it somewhere safe and easy to reach that everyone in the household knows about.',
    },
    'dry-bags': {
      name: 'Dry bags or zip-lock bags',
      hint: 'To keep documents, matches and electronics dry.',
    },
  },
  categories: {
    water: 'Water',
    food: 'Meals',
    cooking: 'Cooking',
    light: 'Light and power',
    warmth: 'Warmth and clothing',
    care: 'Health care',
    hygiene: 'Hygiene',
    documents: 'Documents and money',
    info: 'Staying informed',
    tools: 'Tools',
    morale: 'Morale and family',
    bag: 'The bag',
  },
};
