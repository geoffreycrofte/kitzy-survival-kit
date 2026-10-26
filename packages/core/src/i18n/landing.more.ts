/** Page de présentation : allemand, luxembourgeois et portugais (traduits du français). */
import type { LandingTexts } from './landing';

export const de: LandingTexts = {
  title: 'Kitzy, dein Notvorrat für 72 Stunden',
  description:
    'Kitzy hilft dir, deinen Notvorrat für 72 Stunden anzulegen, im Blick zu behalten und regelmäßig zu erneuern, nach dem offiziellen Leitfaden Lëtz prepare!. Kostenlos, ohne Konto, offline.',
  skip: 'Zum Inhalt springen',
  language: 'Sprache',
  openApp: 'App öffnen',
  hero: {
    title: 'Dem Unerwarteten drei Tage voraus.',
    lead: 'Kitzy hilft dir, alles für 72 Stunden zu Hause bereitzuhalten, passend zu deinem Haushalt, und behält danach die Termine im Blick. Kostenlos, ohne Konto, und es funktioniert offline.',
    open: 'Kitzy öffnen',
    install: 'Installieren',
  },
  household: {
    title: 'Berechnet für deinen Haushalt',
    lead: 'Sag Kitzy, wer bei dir wohnt, Haustiere inklusive: Kitzy rechnet aus, welche Mengen du brauchst. Probier’s aus.',
    legend: 'Bei mir zu Hause leben',
    members: {
      adults: 'Erwachsene',
      children: 'Kinder',
      babies: 'Babys',
      dogs: 'Hunde',
      cats: 'Katzen',
    },
    more: '{{label}}: eins mehr',
    less: '{{label}}: eins weniger',
    results: {
      water: { one: 'Liter Wasser', other: 'Liter Wasser' },
      meals: { one: 'Mahlzeit', other: 'Mahlzeiten' },
      pets: { one: 'Futterration für die Tiere', other: 'Futterrationen für die Tiere' },
      bags: { one: 'startklarer Notfallrucksack', other: 'startklare Notfallrucksäcke' },
    },
    note: 'Für 72 Stunden, nach den offiziellen Richtwerten: 3 Liter Wasser pro Person und Tag.',
    lists:
      'Standardmäßig folgt Kitzy der offiziellen Liste Luxemburgs. Mit einem Tipp schaltest du die von Fachleuten empfohlene Liste ein, oder die vollständige Version mit Komfort-Extras.',
  },
  split: {
    title: 'Das Zuhause und die Notfallrucksäcke',
    lead: 'Der Großteil des Vorrats bleibt bei dir zu Hause. Ein Rucksack pro Person wartet an der Tür, falls du mal losmusst. Kitzy ordnet jeden Artikel zu und sagt dir, wo er hingehört.',
    home: {
      title: 'Zu Hause',
      items: [
        'Wasser und Mahlzeiten für drei Tage',
        'Der Campingkocher, Lampen, Batterien',
        'Decken und warme Kleidung',
        'Der Erste-Hilfe-Kasten und die Medikamente',
      ],
    },
    bag: {
      title: 'In jedem Rucksack',
      items: [
        'Eine Flasche Wasser und Snacks',
        'Stirnlampe und Powerbank',
        'Kopien der Dokumente und etwas Bargeld',
        'Die täglichen Medikamente',
      ],
    },
  },
  buy: {
    title: 'Was kaufen, passend zu deinem Budget',
    text: 'Für viele Artikel schlägt Kitzy Ideen in drei Budgets vor. Ohne Preise, ohne vorgegebene Marken: Merkmale, auf die du achten kannst, oder was du schon hast.',
    tiers: [
      { mark: '€', name: 'Basis', text: 'Das Nötigste, einfach und wirksam.' },
      { mark: '€€', name: 'Ausgewogen', text: 'Praktischer im Alltag.' },
      { mark: '€€€', name: 'Langlebig', text: 'Gemacht für viele Jahre.' },
    ],
    fair: 'Ein Rat hängt nie von einem Affiliate-Link ab, und jeder dieser Links ist als solcher gekennzeichnet.',
  },
  reminders: {
    title: 'Termine, ohne dran zu denken',
    lead: 'Haltbarkeitsdaten, Aufladen, Check-ups: Kitzy merkt sich alles und sagt dir rechtzeitig Bescheid.',
    samples: [
      { when: 'Erster Montag im Monat, 12 Uhr', what: 'Mini-Check während des Sirenentests' },
      { when: 'In 30 Tagen', what: 'Konserven aufbrauchen, dann neu kaufen' },
      { when: 'Zeitumstellung', what: 'Großer Check-up des Vorrats' },
    ],
    notify:
      'Wenn dein Browser es erlaubt, werden die Benachrichtigungen auf deinem Gerät berechnet: Keine Daten verlassen es.',
    ics: 'Sonst, oder zusätzlich, exportierst du deine Erinnerungen als Kalenderdatei (.ics) für dein Handy.',
  },
  evening: {
    title: 'Vorsorgen, mit Spaß',
    lead: 'Programm für einen Abend im Bau, mit der ganzen Familie.',
    programme: [
      {
        time: '19 Uhr',
        title: 'Dosen-Abend',
        text: 'Ein Rezept mit den Konserven, deren Datum näher rückt. Chili, Suppe oder Milchreis.',
      },
      {
        time: '20 Uhr',
        title: 'Challenge ohne Strom',
        text: 'Alles aus, und ihr lebt mit dem Kit. Was fehlt, kommt auf die Einkaufsliste.',
      },
      {
        time: '21 Uhr',
        title: '72-Stunden-Simulation',
        text: 'Drei Tage ohne Strom, Entscheidung für Entscheidung, mit dem, was dein Haushalt wirklich hat.',
      },
      {
        time: '21.30 Uhr',
        title: 'Quiz: richtig reagieren',
        text: 'Sirenen, Warnungen, Gerüchte: zehn Fragen, ohne Zeitdruck.',
      },
    ],
    after:
      'Und an jedem ersten Montag um 12 Uhr ein Mini-Check von zwei Minuten. Mit jedem Fortschritt schaltest du Erfolge frei.',
  },
  privacy: {
    title: 'Alles bleibt bei dir',
    text: 'Kein Konto, keine Werbung, kein Tracking. Deine Daten bleiben auf deinem Gerät, und Kitzy funktioniert sogar ohne Internet.',
  },
  together: {
    title: 'Wenn Familie und Nachbarschaft vorbereitet sind, hilft man sich leichter.',
    text: 'Erzähl deinen Liebsten und Nachbarn von Kitzy: Jeder bereitet sein Kit vor, und ihr könnt aufeinander zählen.',
    button: 'Kitzy teilen',
    qrLabel: 'QR-Code zu kitzy.lu, mit der Handykamera scannen',
    qrHelp: 'Zeig ihn Nachbarn oder Angehörigen: Sie scannen ihn mit der Kamera ihres Handys.',
    copied: 'Link kopiert: Füge ihn in eine Nachricht ein.',
    message:
      'Ich bereite mit Kitzy unser Kit für 72 Stunden vor. Es ist kostenlos, und alles bleibt auf dem Handy. Wenn Familie und Nachbarschaft vorbereitet sind, hilft man sich leichter.',
    shareTitle: 'Kitzy, das 72-Stunden-Kit',
  },
  install: {
    title: 'Kitzy installieren',
    intro:
      'Kitzy ist eine Web-App: Du brauchst keinen App Store. Einmal installiert, öffnet sie sich wie eine App, funktioniert offline und kann dich erinnern.',
    yours: 'Dein Gerät',
    now: 'Jetzt installieren',
    installed: 'Kitzy ist schon installiert: Öffne die App über deinen Home-Bildschirm.',
    platforms: {
      android: {
        title: 'Android',
        steps: [
          'Öffne kitzy.lu in Chrome.',
          'Tippe oben rechts auf das Menü ⋮.',
          'Wähle „App installieren“ oder „Zum Startbildschirm hinzufügen“.',
        ],
      },
      ios: {
        title: 'iPhone und iPad',
        steps: [
          'Öffne kitzy.lu in Safari.',
          'Tippe auf „Teilen“, das Quadrat mit dem Pfeil.',
          'Wähle „Zum Home-Bildschirm“, dann „Hinzufügen“.',
        ],
      },
      desktop: {
        title: 'Computer',
        steps: [
          'Öffne kitzy.lu in Chrome oder Edge.',
          'Klicke in der Adressleiste auf das Installationssymbol.',
          'Bestätige mit „Installieren“.',
        ],
      },
    },
    browser: 'Lieber im Browser? Kitzy funktioniert auch ohne Installation bestens.',
    browserLink: 'Kitzy im Browser öffnen',
  },
  footer: {
    source:
      'Ratschläge aus dem offiziellen Leitfaden Lëtz prepare! Kitzy ist eine unabhängige App und nicht mit der luxemburgischen Regierung verbunden.',
    studio: { before: 'Kostenlos angeboten von ', after: '.' },
    checkfox: { before: 'Barrierefrei dank ', after: '.' },
    privacy: 'Datenschutz',
    transparency: 'Kauflinks und Transparenz',
    project: 'Das Projekt auf GitHub',
  },
};

export const lb: LandingTexts = {
  title: 'Kitzy, däin Noutvirrot fir 72 Stonnen',
  description:
    'Kitzy hëlleft dir, däin Noutvirrot fir 72 Stonnen opzebauen, am A ze behalen a regelméisseg z’erneieren, nom offizielle Guide Lëtz prepare!. Gratis, ouni Kont, offline.',
  skip: 'Op den Inhalt sprangen',
  language: 'Sprooch',
  openApp: 'D’App opmaachen',
  hero: {
    title: 'Dem Onerwaarten dräi Deeg viraus.',
    lead: 'Kitzy hëlleft dir, alles fir 72 Stonnen doheem prett ze hunn, ugepasst un däin Haushalt, a behält duerno d’Datumer am A. Gratis, ouni Kont, an et funktionéiert offline.',
    open: 'Kitzy opmaachen',
    install: 'Installéieren',
  },
  household: {
    title: 'Ausgerechent fir däin Haushalt',
    lead: 'So Kitzy, wien alles bei dir wunnt, Déieren abegraff: Kitzy rechent aus, wéi vill s du brauchs. Probéier et aus.',
    legend: 'Bei mir doheem wunnen',
    members: {
      adults: 'Erwuessener',
      children: 'Kanner',
      babies: 'Bëbeeën',
      dogs: 'Hënn',
      cats: 'Kazen',
    },
    more: '{{label}}: eent méi',
    less: '{{label}}: eent manner',
    results: {
      water: { one: 'Liter Waasser', other: 'Liter Waasser' },
      meals: { one: 'Moolzecht', other: 'Moolzechten' },
      pets: { one: 'Ratioun fir d’Déieren', other: 'Ratioune fir d’Déieren' },
      bags: {
        one: 'Noutfallsak, prett fir lasszegoen',
        other: 'Noutfallsäck, prett fir lasszegoen',
      },
    },
    note: 'Fir 72 Stonnen, no den offizielle Richtwäerter: 3 Liter Waasser pro Persoun an Dag.',
    lists:
      'Standardméisseg hält Kitzy sech un déi offiziell Lëscht vu Lëtzebuerg. Mat engem Tipp kanns du d’Lëscht aschalten, déi Experte recommandéieren, oder déi komplett Versioun, mat Komfort.',
  },
  split: {
    title: 'D’Haus an d’Noutfallsäck',
    lead: 'Dat meescht vum Virrot bleift bei dir doheem. All Persoun huet e Sak, deen un der Dier waart, fir de Fall, dass ee fortmuss. Kitzy deelt all Artikel an a seet dir, wou en hikënnt.',
    home: {
      title: 'Doheem',
      items: [
        'Waasser a Moolzechte fir dräi Deeg',
        'De Campingkacher, d’Luuchten, d’Batterien',
        'Decken a waarm Kleeder',
        'D’Éischt-Hëllef-Këscht an d’Medikamenter',
      ],
    },
    bag: {
      title: 'An all Sak',
      items: [
        'Eng Fläsch Waasser an e puer Snacks',
        'Kapplut a Powerbank',
        'Kopie vun de Pabeieren an e bësse Boergeld',
        'D’Medikamenter fir all Dag',
      ],
    },
  },
  buy: {
    title: 'Wat kafen, no dengem Budget',
    text: 'Fir vill Artikele proposéiert Kitzy Iddien an dräi Budgeten. Ouni Präisser, ouni virgeschriwwe Marken: Eegenschaften, op déi s de kucke kanns, oder dat, wat s de schonn hues.',
    tiers: [
      { mark: '€', name: 'Basis', text: 'Dat Néidegst, einfach an effikass.' },
      { mark: '€€', name: 'Equilibréiert', text: 'Méi praktesch am Alldag.' },
      { mark: '€€€', name: 'Haltbar', text: 'Gemaach, fir Joere laang ze halen.' },
    ],
    fair: 'E Rot hänkt ni vun engem Affiliate-Link of, an all esou e Link gëtt et un.',
  },
  reminders: {
    title: 'D’Datumer, ouni drun ze denken',
    lead: 'Oflafdatumer, Oplueden, Check-ups: Kitzy hält alles fest a seet dir zur richteger Zäit Bescheed.',
    samples: [
      { when: 'Éischte Méindeg am Mount, Mëtteg', what: 'Mini-Check beim Test vun de Sirenen' },
      { when: 'An 30 Deeg', what: 'Konserven iessen, duerno nei kafen' },
      { when: 'Zäitëmstellung', what: 'Grousse Check-up vum Virrot' },
    ],
    notify:
      'Wann däi Browser et erlaabt, ginn d’Notifikatiounen op dengem Apparat berechent: Keng Donnéeë verloossen däin Apparat.',
    ics: 'Soss, oder zousätzlech, exportéiers de deng Erënnerungen an eng Kalennerdatei (.ics) fir däin Handy.',
  },
  evening: {
    title: 'Sech virbereeden, mat Spaass',
    lead: 'Programm fir en Owend am Bau, mat der ganzer Famill.',
    programme: [
      {
        time: '19 Auer',
        title: 'Konserven-Owend',
        text: 'E Rezept mat de Konserven, déi geschwë oflafen. Chili, Zopp oder Mëllechräis.',
      },
      {
        time: '20 Auer',
        title: 'Challenge ouni Stroum',
        text: 'Alles aus, a mir liewe mam Kit. Wat feelt, kënnt op d’Akafslëscht.',
      },
      {
        time: '21 Auer',
        title: '72-Stonne-Simulatioun',
        text: 'Dräi Deeg ouni Stroum, Choix fir Choix, mat deem, wat däin Haushalt wierklech huet.',
      },
      {
        time: '21.30 Auer',
        title: 'Quiz: richteg reagéieren',
        text: 'Sirenen, Alarmer, Rumeuren: zéng Froen, ouni Zäitdrock.',
      },
    ],
    after:
      'An all éischte Méindeg um 12 Auer e Mini-Check vun zwou Minutten. Mat all Fortschrëtt schalts de nei Erfolleger fräi.',
  },
  privacy: {
    title: 'Alles bleift bei dir',
    text: 'Kee Kont, keng Reklamm, keen Tracking. Deng Donnéeë bleiwen op dengem Apparat, a Kitzy funktionéiert souguer ouni Verbindung.',
  },
  together: {
    title: 'Wann d’Famill an d’Noperschaft virbereet sinn, hëlleft ee sech méi einfach.',
    text: 'Schwätz mat denge Léifsten an denge Noperen iwwer Kitzy: jiddereen preparéiert säi Kit, an dir kënnt op een aneren zielen.',
    button: 'Kitzy deelen',
    qrLabel: 'QR-Code op kitzy.lu, mat der Kamera vum Handy ze scannen',
    qrHelp:
      'Weis en engem Noper oder engem Familljemember: si scannen en mat der Kamera vun hirem Handy.',
    copied: 'Link kopéiert: setz en an e Message.',
    message:
      'Ech preparéieren mat Kitzy eise Kit fir 72 Stonnen. Et ass gratis, an alles bleift um Handy. Wann d’Famill an d’Noperschaft virbereet sinn, hëlleft ee sech méi einfach.',
    shareTitle: 'Kitzy, de Kit fir 72 Stonnen',
  },
  install: {
    title: 'Kitzy installéieren',
    intro:
      'Kitzy ass eng Web-App: Du brauchs keen App Store. Eemol installéiert, mécht se sech op wéi eng App, funktionéiert offline a kann dech erënneren.',
    yours: 'Däin Apparat',
    now: 'Elo installéieren',
    installed: 'Kitzy ass schonn installéiert: Maach d’App iwwer däin Home-Bildschierm op.',
    platforms: {
      android: {
        title: 'Android',
        steps: [
          'Maach kitzy.lu a Chrome op.',
          'Tipp uewe riets op de Menü ⋮.',
          'Wiel „App installieren“ oder „Zum Startbildschirm hinzufügen“.',
        ],
      },
      ios: {
        title: 'iPhone an iPad',
        steps: [
          'Maach kitzy.lu a Safari op.',
          'Tipp op „Teilen“, dat Véiereck mam Feil.',
          'Wiel „Zum Home-Bildschirm“, duerno „Hinzufügen“.',
        ],
      },
      desktop: {
        title: 'Computer',
        steps: [
          'Maach kitzy.lu a Chrome oder Edge op.',
          'Klick an der Adressleescht op d’Installatiounssymbol.',
          'Bestäteg mat „Installieren“.',
        ],
      },
    },
    browser: 'Léiwer am Browser? Kitzy funktionéiert och ouni Installatioun ganz gutt.',
    browserLink: 'Kitzy am Browser opmaachen',
  },
  footer: {
    source:
      'Rotschléi aus dem offizielle Guide Lëtz prepare! Kitzy ass eng onofhängeg App, net mat der Lëtzebuerger Regierung verbonnen.',
    studio: { before: 'Gratis ugebuede vu ', after: '.' },
    checkfox: { before: 'Barrierefräi dank ', after: '.' },
    privacy: 'Dateschutz',
    transparency: 'Akafslinken an Transparenz',
    project: 'De Projet op GitHub',
  },
};

export const pt: LandingTexts = {
  title: 'Kitzy, a tua reserva de emergência para 72 horas',
  description:
    'O Kitzy ajuda-te a preparar, acompanhar e renovar a tua reserva de emergência para 72 horas, com base no guia oficial Lëtz prepare!. Gratuito, sem conta, funciona offline.',
  skip: 'Ir para o conteúdo',
  language: 'Idioma',
  openApp: 'Abrir a app',
  hero: {
    title: 'Três dias à frente do imprevisto.',
    lead: 'O Kitzy ajuda-te a reunir o necessário para aguentar 72 horas em casa, à medida da tua família, e depois fica de olho nas datas. Gratuito, sem conta, e funciona offline.',
    open: 'Abrir o Kitzy',
    install: 'Instalar',
  },
  household: {
    title: 'Calculado para a tua família',
    lead: 'Diz ao Kitzy quem vive contigo, animais incluídos: ele calcula as quantidades a reunir. Experimenta.',
    legend: 'Em minha casa há',
    members: {
      adults: 'Adultos',
      children: 'Crianças',
      babies: 'Bebés',
      dogs: 'Cães',
      cats: 'Gatos',
    },
    more: '{{label}}: mais um',
    less: '{{label}}: menos um',
    results: {
      water: { one: 'litro de água', other: 'litros de água' },
      meals: { one: 'refeição', other: 'refeições' },
      pets: { one: 'ração para os animais', other: 'rações para os animais' },
      bags: { one: 'mochila de emergência pronta', other: 'mochilas de emergência prontas' },
    },
    note: 'Para 72 horas, segundo as referências oficiais: 3 litros de água por pessoa e por dia.',
    lists:
      'Por defeito, o Kitzy segue a lista oficial do Luxemburgo. Com um toque, podes ativar a lista recomendada por especialistas, ou a versão completa, com conforto incluído.',
  },
  split: {
    title: 'A casa e as mochilas de emergência',
    lead: 'A maior parte da reserva fica em tua casa. Uma mochila por pessoa espera junto à porta, caso seja preciso sair. O Kitzy distribui cada artigo e diz-te onde o guardar.',
    home: {
      title: 'Em casa',
      items: [
        'A água e as refeições para três dias',
        'O fogareiro, as lanternas, as pilhas',
        'Cobertores e roupa quente',
        'A caixa de primeiros socorros e os medicamentos',
      ],
    },
    bag: {
      title: 'Em cada mochila',
      items: [
        'Uma garrafa de água e snacks',
        'Lanterna frontal e bateria externa',
        'Cópias dos documentos e algum dinheiro',
        'Os medicamentos do dia a dia',
      ],
    },
  },
  buy: {
    title: 'O que comprar, conforme o teu orçamento',
    text: 'Para muitos artigos, o Kitzy sugere opções para três orçamentos. Sem preços, sem marcas impostas: características a procurar, ou o que já tens.',
    tiers: [
      { mark: '€', name: 'Essencial', text: 'O indispensável, simples e eficaz.' },
      { mark: '€€', name: 'Equilibrado', text: 'Mais prático no dia a dia.' },
      { mark: '€€€', name: 'Duradouro', text: 'Feito para durar anos.' },
    ],
    fair: 'Um conselho nunca depende de um link de afiliado, e cada link desse tipo indica-o.',
  },
  reminders: {
    title: 'As datas, sem teres de pensar nisso',
    lead: 'Validades, recargas, revisões: o Kitzy regista tudo e avisa-te na altura certa.',
    samples: [
      {
        when: 'Primeira segunda-feira do mês, meio-dia',
        what: 'Mini-verificação durante o teste das sirenes',
      },
      { when: 'Daqui a 30 dias', what: 'Conservas a consumir e depois a repor' },
      { when: 'Mudança da hora', what: 'Grande revisão da reserva' },
    ],
    notify:
      'Quando o teu navegador o permite, as notificações são calculadas no teu dispositivo: nenhum dado sai dele.',
    ics: 'Caso contrário, ou além disso, exporta os teus lembretes para um ficheiro de calendário (.ics) para o teu telemóvel.',
  },
  evening: {
    title: 'Preparar-se, a divertir-se',
    lead: 'Programa de um serão na toca, para viver em família.',
    programme: [
      {
        time: '19h',
        title: 'Serão das latas',
        text: 'Uma receita com as conservas cuja data se aproxima. Chili, sopa ou arroz-doce.',
      },
      {
        time: '20h',
        title: 'Desafio sem eletricidade',
        text: 'Desliga-se tudo e vive-se com o kit. O que faltar vai para a lista de compras.',
      },
      {
        time: '21h',
        title: 'Simulação de 72 horas',
        text: 'Três dias sem luz, escolha a escolha, com o que a tua casa tem realmente.',
      },
      {
        time: '21h30',
        title: 'Quiz dos bons reflexos',
        text: 'Sirenes, alertas, boatos: dez perguntas, sem cronómetro.',
      },
    ],
    after:
      'E em cada primeira segunda-feira, ao meio-dia, uma mini-verificação de dois minutos. Vais desbloqueando conquistas à medida que avanças.',
  },
  privacy: {
    title: 'Tudo fica contigo',
    text: 'Sem conta, sem publicidade, sem rastreamento. Os teus dados ficam no teu dispositivo, e o Kitzy funciona mesmo sem ligação.',
  },
  together: {
    title:
      'Quando a família e o bairro estão preparados, é mais fácil ajudarmo-nos uns aos outros.',
    text: 'Fala do Kitzy aos teus próximos e vizinhos: cada um prepara o seu kit, e podem contar uns com os outros.',
    button: 'Partilhar o Kitzy',
    qrLabel: 'Código QR para kitzy.lu, para ler com a câmara do telemóvel',
    qrHelp: 'Mostra-o a um vizinho ou a um familiar: basta lê-lo com a câmara do telemóvel.',
    copied: 'Ligação copiada: cola-a numa mensagem.',
    message:
      'Estou a preparar o nosso kit para 72 horas com o Kitzy. É gratuito, e fica tudo no telemóvel. Quando a família e o bairro estão preparados, é mais fácil ajudarmo-nos uns aos outros.',
    shareTitle: 'Kitzy, o kit de 72 horas',
  },
  install: {
    title: 'Instalar o Kitzy',
    intro:
      'O Kitzy é uma app web: não precisas de loja de apps. Depois de instalado, abre-se como uma app, funciona offline e pode avisar-te.',
    yours: 'O teu dispositivo',
    now: 'Instalar agora',
    installed: 'O Kitzy já está instalado: abre-o a partir do teu ecrã principal.',
    platforms: {
      android: {
        title: 'Android',
        steps: [
          'Abre kitzy.lu no Chrome.',
          'Toca no menu ⋮, no canto superior direito.',
          'Escolhe «Instalar app» ou «Adicionar ao ecrã principal».',
        ],
      },
      ios: {
        title: 'iPhone e iPad',
        steps: [
          'Abre kitzy.lu no Safari.',
          'Toca no botão «Partilhar», o quadrado com uma seta.',
          'Escolhe «Adicionar ao ecrã principal» e depois «Adicionar».',
        ],
      },
      desktop: {
        title: 'Computador',
        steps: [
          'Abre kitzy.lu no Chrome ou no Edge.',
          'Clica no ícone de instalação na barra de endereço.',
          'Confirma com «Instalar».',
        ],
      },
    },
    browser: 'Preferes o navegador? O Kitzy também funciona muito bem sem instalação.',
    browserLink: 'Abrir o Kitzy no navegador',
  },
  footer: {
    source:
      'Conselhos retirados do guia oficial Lëtz prepare! O Kitzy é uma app independente, sem ligação ao Governo do Luxemburgo.',
    studio: { before: 'Distribuído gratuitamente por ', after: '.' },
    checkfox: { before: 'Acessível graças a ', after: '.' },
    privacy: 'Privacidade',
    transparency: 'Links de compra e transparência',
    project: 'O projeto no GitHub',
  },
};
