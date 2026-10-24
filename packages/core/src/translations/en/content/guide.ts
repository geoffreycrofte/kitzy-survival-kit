/**
 * English translation of the Kitzy guide (same pages, same order, same link addresses).
 * Rewritten in plain language from the official “Mon guide 72h d’autonomie” (Lëtz prepare!, HCPN, 2026).
 * If in doubt, the official source prevails.
 */
import type { ContentTranslation } from '../../types';

const OFFICIAL_GUIDE = {
  label: 'The official Lëtz prepare! guide',
  url: 'https://letzprepare.public.lu/fr/guide.html',
};

export const guide: ContentTranslation['guide'] = [
  {
    slug: 'pourquoi-72-heures',
    title: 'Why 72 hours?',
    summary: 'Three days on your own: the time the emergency services need to get organised.',
    chapter: 'comprendre',
    pose: 'lecture',
    blocks: [
      {
        type: 'p',
        text: 'A storm, a flood, a major power cut or a cyberattack can change your daily life. You might then be without water, electricity, phone or internet.',
      },
      {
        type: 'p',
        text: 'Nobody knows in advance how long it might last. That is why it helps to prepare, calmly and without worrying.',
      },
      { type: 'h2', text: 'Why three days?' },
      {
        type: 'p',
        text: 'The first hours of a crisis are often the hardest. The emergency services first need to understand the situation and get organised. They help the most vulnerable people first.',
      },
      {
        type: 'p',
        text: 'With supplies for 72 hours, you cover your basic needs during that time: drinking, eating, having light, looking after your health and staying informed.',
      },
      {
        type: 'p',
        text: 'Many European countries recommend the same length of time. It comes from experience of recent crises.',
      },
      { type: 'h2', text: 'A shared responsibility' },
      {
        type: 'p',
        text: 'The State and the municipalities work together to protect the population. But they cannot do everything on their own. Everyone can help, in their own way.',
      },
      {
        type: 'p',
        text: 'In 2025, Luxembourg launched its national resilience strategy, “Lëtz prepare!”. Resilience is the ability to cope with a difficulty, then get back to normal life.',
      },
      { type: 'h2', text: 'What being prepared changes' },
      {
        type: 'list',
        items: [
          'You react faster and more calmly.',
          'You protect your family and your home.',
          'You can help your loved ones and your neighbours.',
          'The emergency services can focus on the most urgent cases.',
        ],
      },
      {
        type: 'p',
        text: 'A few simple actions are enough. You don’t need to do everything in one day: go step by step.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'Lëtz prepare!, the national strategy', url: 'https://letzprepare.public.lu' },
    ],
  },
  {
    slug: 'a-quoi-se-preparer',
    title: 'What to prepare for?',
    summary: 'The main risks in Luxembourg and the right reflexes for each one.',
    chapter: 'comprendre',
    pose: 'lecture',
    blocks: [
      {
        type: 'p',
        text: 'In Luxembourg, several kinds of crisis can affect your daily life. Here are the main ones, with useful actions for each.',
      },
      { type: 'h2', text: 'Weather: storms, snow, ice, heatwaves' },
      {
        type: 'list',
        items: [
          'Stay indoors and limit your journeys.',
          'If you have to go out, tell someone close to you where you are going.',
          'Check in on your loved ones.',
          'In a storm, put away or tie down anything that could blow away.',
          'In a heatwave, follow the health advice on santesecu.public.lu.',
        ],
      },
      { type: 'h2', text: 'Floods' },
      {
        type: 'list',
        items: [
          'Don’t take any risks.',
          'Check whether your home is in a flood zone (inondations.lu, eau.geoportail.lu).',
          'Keep gutters, ditches and drains clear.',
          'Move electrical appliances and polluting products higher up than the cellar.',
          'If you still have time, move your car away and switch off the power in the rooms at risk.',
          'Avoid flooded roads, riverbanks, basements and underground car parks.',
          'Never walk through water that may be in contact with electricity.',
        ],
      },
      { type: 'h2', text: 'Cyberattacks' },
      {
        type: 'list',
        items: [
          'A strange request? Contact the person or organisation yourself, using their official contact details.',
          'Don’t click on links in suspicious messages: go straight to the website.',
          'Never give out your passwords, codes or bank details.',
          'Use a long, different password for each account, and two-factor authentication.',
          'Install updates and keep copies of your documents and photos.',
        ],
      },
      {
        type: 'p',
        text: 'If you are a victim: keep the evidence, change your passwords, call your bank in case of fraud and disconnect the affected device from the network.',
      },
      { type: 'h2', text: 'Terrorist threat' },
      {
        type: 'list',
        items: [
          'Stay alert in crowded places.',
          'Report a suspicious object or behaviour to the police, without going near it.',
          'In an attack, get away if you can. If not, take shelter and keep quiet.',
          'Call the emergency services as soon as you can do so safely, then follow their instructions.',
        ],
      },
      { type: 'h2', text: 'Nuclear accident' },
      {
        type: 'p',
        text: 'This risk is very unlikely. The actions to know are explained on the “Nuclear accident” page.',
      },
      { type: 'h2', text: 'Major power cut' },
      {
        type: 'p',
        text: 'It would affect many services at once. The “Major power cut” page explains what to do.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: official alerts', url: 'https://lu-alert.lu' },
      { label: 'MeteoLux: weather forecasts and warnings', url: 'https://www.meteolux.lu' },
      { label: 'Floods: information on high water', url: 'https://www.inondations.lu' },
      { label: 'Health and safety: heatwaves and emergencies', url: 'https://santesecu.public.lu' },
      { label: 'Cybersecurity: practical advice', url: 'https://www.cybersecurity.lu' },
    ],
  },
  {
    slug: 'coupure-electricite',
    title: 'Major power cut',
    summary:
      'What can stop working, the right actions, and an example of three days without power.',
    chapter: 'comprendre',
    pose: 'lanterne',
    blocks: [
      {
        type: 'p',
        text: 'A power cut across the whole country is unlikely. But it would have major consequences, because almost everything depends on electricity.',
      },
      { type: 'h2', text: 'What can stop working' },
      {
        type: 'list',
        items: [
          'Home: no more light, fridge, cooking, heating or lift.',
          'Phone and internet: unstable networks, calls hard to get through, emergency services hard to reach.',
          'Water: taps, toilets and showers may stop working.',
          'Transport: traffic lights off, trains and buses disrupted, petrol pumps out of order.',
          'Money and shopping: cash machines and bank cards out of service, shops closed.',
          'Health: hospitals and emergency services slowed down.',
          'Waste water and rubbish: possible overflows in heavy rain, delayed collection.',
        ],
      },
      { type: 'h2', text: 'The right reflexes' },
      {
        type: 'list',
        items: [
          'Fill bottles and containers while the water is still running.',
          'Open the fridge and freezer as little as possible.',
          'Close the shutters to keep the heat in.',
          'Put your phone in power-saving mode. Charge it with a power bank.',
          'Listen to a battery or wind-up radio, or your car radio: RTL and radio 100,7.',
          'Limit your journeys and stay close to home.',
          'Before the power comes back, unplug the fridge, freezer, television, computer and electric car.',
          'Go and see your neighbours, especially the most vulnerable.',
        ],
      },
      {
        type: 'note',
        text: 'Never use a barbecue, fire pit, generator or any other appliance meant for outdoors in an enclosed space. They give off carbon monoxide: an invisible, odourless and deadly gas.',
      },
      { type: 'h2', text: 'What if it were you? Three days without power' },
      {
        type: 'p',
        text: 'Day 1. One Monday in January, the power goes off while you are at work. The phone lines are overloaded. A LU-Alert message advises listening to RTL and radio 100,7. There are no more trains: a colleague drives you home. In the evening, you get out your torch, your blankets and your gas stove.',
      },
      {
        type: 'p',
        text: 'Day 2. The water has stopped and the house is getting colder. You use your supplies, save your battery and listen to the radio. Rumours are going around: you only share official information. Your neighbours invite you to warm up by their fireplace.',
      },
      {
        type: 'p',
        text: 'Day 3. The neighbourhood gets organised to help one another. The municipality opens a heated hall where people can have a hot drink, get information and charge their phones. Then the radio announces that the power is coming back, area by area. Back home, you take stock. What were you missing? What will you need to add?',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'infocrise.lu: information in a crisis', url: 'https://infocrise.lu' },
      { label: 'LU-Alert: official alerts', url: 'https://lu-alert.lu' },
    ],
  },
  {
    slug: 'alerte-lu-alert',
    title: 'LU-Alert, the official alert',
    summary: 'How the authorities alert you and what the alert levels mean.',
    chapter: 'alerte',
    pose: 'radio',
    blocks: [
      {
        type: 'p',
        text: 'LU-Alert is the national alert and information system. The authorities use it to warn you quickly when there is danger.',
      },
      {
        type: 'p',
        text: 'LU-Alert informs you before an event, so you can prepare. It helps you during it, so you can protect yourself. Sometimes it also tells you when the danger has passed.',
      },
      { type: 'h2', text: 'Several channels at once' },
      {
        type: 'p',
        text: 'The same message goes out through several channels. That way, it has a better chance of reaching you.',
      },
      {
        type: 'list',
        items: [
          'The lu-alert.lu website: all messages are published there.',
          'The free LU-Alert app: you choose the topics, levels and areas. Less serious alerts, for example about food, usually go out only through the app.',
          'Location-based SMS: it is sent to everyone in the area at risk, whatever their mobile network.',
          'Cell Broadcast: a priority message on all compatible phones in the area, with a sound and a vibration, even in silent mode.',
          'Sirens, for serious or imminent danger.',
          'The media: radio, television, newspapers and news websites.',
        ],
      },
      { type: 'h2', text: 'The 4 alert levels' },
      {
        type: 'p',
        text: 'When a situation gets worse little by little, it is called a progressive scenario. It has three levels:',
      },
      {
        type: 'list',
        items: [
          'Yellow level, “Be attentive”: low risk, possible danger.',
          'Orange level, “Be careful”: medium risk, there is danger.',
          'Red level, “Maximum vigilance”: high risk, serious danger.',
        ],
      },
      {
        type: 'p',
        text: 'When the danger is very close, it is called an imminent scenario. It has only one level: the purple level, imminent danger. You must act straight away.',
      },
      {
        type: 'p',
        text: 'The level and the channel are chosen by the authority concerned, depending on how serious it is. For example MeteoLux, the Police, the CGDIS or the Water Management Administration.',
      },
      { type: 'h2', text: 'Radio, the most reliable channel' },
      {
        type: 'p',
        text: 'If the power or the mobile network is down, the radio often keeps working. Keep a battery or wind-up radio. Your car radio can also do the job. Listen to RTL or radio 100,7.',
      },
      {
        type: 'p',
        text: 'Tip: install the LU-Alert app now. It is free on the App Store and Google Play.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: official alerts', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu: information in a crisis', url: 'https://infocrise.lu' },
    ],
  },
  {
    slug: 'sirenes',
    title: 'Siren signals',
    summary: 'Recognise the four siren signals and know what to do for each one.',
    chapter: 'alerte',
    pose: 'bonjour',
    blocks: [
      {
        type: 'p',
        text: 'Sirens are used to warn of serious or imminent danger. They can sound in a specific area or across the whole country.',
      },
      {
        type: 'p',
        text: 'There are four signals. Each one has a different sound and a clear instruction.',
      },
      { type: 'h2', text: 'Monthly test' },
      {
        type: 'p',
        text: 'The sound: a continuous tone, always at the same pitch, for 60 s.',
      },
      { type: 'p', text: 'What to do: nothing. It is only a test.' },
      { type: 'h2', text: 'Warning signal' },
      {
        type: 'p',
        text: 'The sound: a continuous tone, always at the same pitch, for 2 min.',
      },
      {
        type: 'p',
        text: 'What to do: get to safety and find out more with LU-Alert, the radio or the television. Then follow the authorities’ instructions.',
      },
      { type: 'h2', text: 'National alarm signal' },
      {
        type: 'p',
        text: 'The sound: a tone that rises and falls, non-stop, for 60 s.',
      },
      {
        type: 'p',
        text: 'What to do: take shelter as quickly as possible, in a solid, closed building.',
      },
      { type: 'h2', text: 'All clear' },
      {
        type: 'p',
        text: 'The sound: a tone that rises and falls, broken up by short pauses, for 60 s.',
      },
      {
        type: 'p',
        text: 'What to do: the danger is over. You can go back to your normal activities.',
      },
      {
        type: 'note',
        text: 'The test takes place on the first Monday of every month at noon. A continuous one-minute tone at that time is therefore normal. If it lasts longer, or happens at another time, find out more.',
      },
      { type: 'h2', text: 'Not sure?' },
      {
        type: 'p',
        text: 'Turn on the radio or open LU-Alert. Don’t call 112 or 113 to ask what is happening: these lines must stay free for emergencies.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: official alerts', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu: information in a crisis', url: 'https://infocrise.lu' },
    ],
  },
  {
    slug: 'bien-s-informer',
    title: 'Staying well informed',
    summary: 'Find the right sources and avoid sharing false information.',
    chapter: 'alerte',
    pose: 'radio',
    blocks: [
      {
        type: 'p',
        text: 'During a crisis, lots of messages go around. Some are false. Others contradict each other. A few simple reflexes help you sort them out.',
      },
      { type: 'h2', text: 'The right reflexes' },
      {
        type: 'list',
        items: [
          'Follow the authorities’ instructions.',
          'Get your information from official sources and well-known media.',
          'Check a piece of information before sharing it.',
          'Use the phone as little as possible, to keep the lines free for the emergency services.',
        ],
      },
      { type: 'h2', text: 'Before you believe or share' },
      { type: 'p', text: 'Ask yourself these four questions:' },
      {
        type: 'list',
        items: [
          'Who published this information?',
          'When was it published?',
          'Where does it come from?',
          'Do other reliable sources say the same thing?',
        ],
      },
      { type: 'h2', text: 'Watch out for fake images' },
      {
        type: 'p',
        text: 'Photos and videos can be made with artificial intelligence (AI). Sometimes they look very real. A striking image is not proof.',
      },
      {
        type: 'note',
        text: 'If no official source confirms an alert, don’t share it. Not even to “warn” your loved ones.',
      },
      { type: 'h2', text: 'Where to check?' },
      {
        type: 'list',
        items: [
          'lu-alert.lu, for alerts.',
          'infocrise.lu, for crisis management.',
          'The radio: RTL and radio 100,7.',
          'Your municipality: website, notices, newsletter, meetings and apps.',
        ],
      },
      {
        type: 'p',
        text: 'If in doubt, always come back to these official channels.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: official alerts', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu: information in a crisis', url: 'https://infocrise.lu' },
    ],
  },
  {
    slug: 'accident-nucleaire',
    title: 'Nuclear accident',
    summary: 'A very low risk, but simple instructions worth knowing in advance.',
    chapter: 'comprendre',
    pose: 'lanterne',
    blocks: [
      {
        type: 'p',
        text: 'A nuclear accident is very unlikely. But its consequences for health and the environment could be serious.',
      },
      {
        type: 'p',
        text: 'Knowing the instructions in advance helps you protect yourself better, without panicking.',
      },
      { type: 'h2', text: 'The right actions' },
      {
        type: 'list',
        items: [
          'Get information from LU-Alert, the radio and the media.',
          'Take shelter indoors if the authorities ask you to.',
          'Close the doors, windows and shutters.',
          'Turn off ventilation, air conditioning and air-circulation systems.',
          'Get out your iodine tablets and keep them within reach.',
        ],
      },
      { type: 'h2', text: 'Iodine tablets' },
      {
        type: 'p',
        text: 'These are potassium iodide tablets. You can get them from your municipality. Keep them in your kit.',
      },
      {
        type: 'p',
        text: 'They are generally intended for people under 45. Above that age, they are generally not recommended.',
      },
      {
        type: 'note',
        text: 'Take iodine tablets only when the authorities tell you to. Never before, and never “just in case”.',
      },
      { type: 'h2', text: 'Find out more' },
      {
        type: 'p',
        text: 'The brochure “What to do in the event of a nuclear alert?” is available on infocrise.lu.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'infocrise.lu: what to do in a nuclear alert', url: 'https://infocrise.lu' },
      { label: 'LU-Alert: official alerts', url: 'https://lu-alert.lu' },
    ],
  },
  {
    slug: 'kit-et-plan',
    title: 'Your kit and your plan',
    summary: 'Get prepared in three steps: your kit, your emergency plan, and talking about it.',
    chapter: 'preparer',
    pose: 'plan',
    blocks: [
      {
        type: 'p',
        text: 'Being prepared helps you stay calm and react well. You can start today, in three steps.',
      },
      {
        type: 'steps',
        items: [
          'Put together your kit for 72 hours.',
          'Fill in your personal emergency plan.',
          'Talk about it with the people around you and offer your help.',
        ],
      },
      { type: 'h2', text: '1. Your kit' },
      {
        type: 'p',
        text: 'The kit contains what you need to live at home for a few days, if shops or services stop working.',
      },
      {
        type: 'list',
        items: [
          'Start by looking at what you already have at home.',
          'Add what your household needs: baby or child products, pet food, medicines.',
          'Keep the kit in a safe, easy-to-reach place that everyone in the household knows.',
          'Check the dates at least twice a year.',
          'Also prepare a grab bag in case you have to leave your home.',
        ],
      },
      {
        type: 'p',
        text: 'This bag should stay light and easy to carry. Put the essentials in it: water, medicines and prescriptions, snacks, phone and power bank, documents, cash, keys and a first-aid kit.',
      },
      { type: 'h2', text: '2. Your personal emergency plan' },
      {
        type: 'p',
        text: 'This plan organises your household in advance. Fill it in with everyone who lives with you. It includes:',
      },
      {
        type: 'list',
        items: [
          'the people in the household, their health needs and your pets;',
          'where the water and gas valves, the meter, the fuse box and the kit are;',
          'the people who can help you, and those you can help;',
          'two places to meet if you get separated;',
          'how to give news without a phone;',
          'who can pick the children up from school;',
          'useful numbers.',
        ],
      },
      {
        type: 'note',
        text: 'Always keep a paper copy of your plan. Without power, your phone may run out.',
      },
      { type: 'h2', text: '3. Talk about it' },
      {
        type: 'p',
        text: 'This concerns all of us. Talk about being prepared with your loved ones and your neighbours. Encourage them to put together their own kit.',
      },
      {
        type: 'p',
        text: 'Think of people who live alone or are vulnerable. And if you need help yourself, ask someone close to you or a neighbour.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'Lëtz prepare!, the national strategy', url: 'https://letzprepare.public.lu' },
    ],
  },
  {
    slug: 'entraide',
    title: 'Helping one another',
    summary: 'Helping your neighbours, learning first aid and looking out for each other.',
    chapter: 'preparer',
    pose: 'fete',
    blocks: [
      {
        type: 'p',
        text: 'During a crisis, the bonds between neighbours matter a lot. The first hours can be difficult, even if the emergency services are well prepared. Everyone’s help adds to their work.',
      },
      { type: 'h2', text: 'Everyone has a role' },
      {
        type: 'p',
        text: 'You know your neighbourhood and the people who might need help. Keep an eye out for them.',
      },
      {
        type: 'list',
        items: [
          'Help someone close to you prepare their kit.',
          'Share what you know how to do, or your equipment.',
          'Check in on people who are elderly, alone or ill.',
          'Write down in your plan who can help you and who you can help.',
        ],
      },
      {
        type: 'p',
        text: 'Solidarity is built every day, not only during a crisis.',
      },
      { type: 'h2', text: 'Learn first aid' },
      {
        type: 'p',
        text: 'In a few hours, you can learn the actions that save a life. The Luxembourg Red Cross and the CGDIS offer courses all over the country.',
      },
      {
        type: 'p',
        text: 'Want to get more involved? You can become a volunteer firefighter with the CGDIS, in your municipality.',
      },
      { type: 'h2', text: 'Need to talk?' },
      {
        type: 'p',
        text: 'During a crisis, it is normal to feel stressed, afraid or isolated.',
      },
      { type: 'p', text: 'To support someone, a few simple actions help:' },
      {
        type: 'list',
        items: [
          'listen kindly, without judging;',
          'reassure them;',
          'help them get back to their usual routine;',
          'if needed, point them towards someone close, a professional or a support service.',
        ],
      },
      {
        type: 'p',
        text: 'Dropping in on a neighbour or staying with someone who is struggling already makes a real difference. And if you are the one who is not doing well, don’t hesitate to talk about it. The SOS Détresse listening service can also help you.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'Luxembourg Red Cross', url: 'https://www.croix-rouge.lu' },
      { label: 'CGDIS first-aid courses', url: 'https://cours.cgdis.lu' },
    ],
  },
  {
    slug: 'contacts-utiles',
    title: 'Useful contacts',
    summary: 'Emergency numbers and official websites to keep close at hand.',
    chapter: 'preparer',
    pose: 'bonjour',
    blocks: [
      { type: 'h2', text: 'Emergency numbers' },
      {
        type: 'list',
        items: [
          '112: CGDIS emergency services (fire brigade, ambulance).',
          '113: Police.',
          '8002 7788: free helpline, which may be opened during a crisis.',
        ],
      },
      {
        type: 'note',
        text: 'Call 112 or 113 only in a real emergency. Never dial them to test them.',
      },
      {
        type: 'p',
        text: 'During a crisis, use the phone as little as possible. That way you keep the lines free for the emergency services.',
      },
      { type: 'h2', text: 'Write them down on paper' },
      {
        type: 'p',
        text: 'Also write down the numbers of your loved ones, your doctor, the school and your work. Add those of your providers: electricity, gas, water, phone, insurance and bank. Keep this list in your kit.',
      },
      { type: 'h2', text: 'Your municipality' },
      {
        type: 'p',
        text: 'Your municipality also keeps you informed: website, notices, newsletter, meetings and apps. It prepares a plan suited to the risks in your area.',
      },
      { type: 'h2', text: 'Official websites' },
      {
        type: 'p',
        text: 'Only trust official sources. You will find the main ones below.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: alerts and instructions', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu: right actions and crisis management', url: 'https://infocrise.lu' },
      {
        label: 'Lëtz prepare!: the national resilience strategy',
        url: 'https://letzprepare.public.lu',
      },
      { label: '112.lu: emergencies, advice and on-duty services', url: 'https://112.lu' },
      { label: 'police.lu: Grand Ducal Police', url: 'https://police.lu' },
      { label: 'inondations.lu: information on high water', url: 'https://www.inondations.lu' },
      { label: 'seveso.lu: high-risk industrial sites', url: 'https://www.seveso.lu' },
      { label: 'meteolux.lu: weather forecasts and warnings', url: 'https://www.meteolux.lu' },
      { label: 'cours.cgdis.lu: first-aid courses', url: 'https://cours.cgdis.lu' },
      {
        label: 'santesecu.public.lu: emergencies, on-duty services, heatwaves',
        url: 'https://santesecu.public.lu',
      },
    ],
  },
];
