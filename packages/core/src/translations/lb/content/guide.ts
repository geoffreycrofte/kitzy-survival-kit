/** Guide op Lëtzebuergesch (selwecht Säiten, Kapitelen, Posen a Linken wéi de franséische Guide). */
import type { ContentTranslation } from '../../types';

const OFFICIAL_GUIDE = {
  label: 'Den offizielle Guide Lëtz prepare!',
  url: 'https://letzprepare.public.lu/fr/guide.html',
};

export const guide: ContentTranslation['guide'] = [
  {
    slug: 'pourquoi-72-heures',
    title: 'Firwat 72 Stonnen?',
    summary:
      'Dräi Deeg autonom: sou vill Zäit brauchen d’Rettungsdéngschter, fir sech ze organiséieren.',
    chapter: 'comprendre',
    pose: 'lecture',
    blocks: [
      {
        type: 'p',
        text: 'E Stuerm, eng Iwwerschwemmung, e grousse Stroumausfall oder eng Cyberattack kënnen däin Alldag änneren. Da kann et u Waasser, Stroum, Telefon oder Internet feelen.',
      },
      {
        type: 'p',
        text: 'Keen weess am Viraus, wéi laang dat dauere kann. Dofir ass et gutt, sech virzebereeden, roueg an ouni sech Suergen ze maachen.',
      },
      { type: 'h2', text: 'Firwat dräi Deeg?' },
      {
        type: 'p',
        text: 'Déi éischt Stonne vun enger Kris sinn dacks déi schwéierst. D’Rettungsdéngschter mussen als Éischt d’Situatioun verstoen a sech organiséieren. Si hëllefen als Éischt de Leit, déi am fragilste sinn.',
      },
      {
        type: 'p',
        text: 'Mat Reserve fir 72 Stonnen deckst du während där Zäit deng Basisbedierfnesser: drénken, iessen, Liicht hunn, dech versuergen an informéiert bleiwen.',
      },
      {
        type: 'p',
        text: 'Vill europäesch Länner roden zu där selwechter Dauer. Si kënnt aus der Erfahrung mat de leschte Krisen.',
      },
      { type: 'h2', text: 'Eng gedeelte Verantwortung' },
      {
        type: 'p',
        text: 'De Staat an d’Gemenge schaffen zesummen, fir d’Bevëlkerung ze schützen. Mee si kënnen net alles eleng maachen. Jidderee kann hëllefen, sou gutt wéi hie kann.',
      },
      {
        type: 'p',
        text: '2025 huet Lëtzebuerg déi national Resilienzstrategie „Lëtz prepare!“ lancéiert. Resilienz ass d’Fäegkeet, mat enger Schwieregkeet eens ze ginn an duerno erëm normal ze liewen.',
      },
      { type: 'h2', text: 'Wat d’Virbereedung ännert' },
      {
        type: 'list',
        items: [
          'Du reagéiers méi séier a méi roueg.',
          'Du schützt deng Famill an deng Wunneng.',
          'Du kanns denge Léiwen an dengen Noperen hëllefen.',
          'D’Rettungsdéngschter kënne sech op déi dréngendst Fäll konzentréieren.',
        ],
      },
      {
        type: 'p',
        text: 'E puer einfach Handgrëffer ginn duer. Du muss net alles un engem Dag maachen: gëff Schrëtt fir Schrëtt vir.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'Lëtz prepare!, déi national Strategie', url: 'https://letzprepare.public.lu' },
    ],
  },
  {
    slug: 'a-quoi-se-preparer',
    title: 'Op wat sech virbereeden?',
    summary: 'Déi wichtegst Risiken zu Lëtzebuerg an déi richteg Reflexer fir all eenzelnen.',
    chapter: 'comprendre',
    pose: 'lecture',
    blocks: [
      {
        type: 'p',
        text: 'Zu Lëtzebuerg kënne verschidden Aarte vu Krisen däin Alldag treffen. Hei sinn déi wichtegst, mat den nëtzlechen Handgrëffer fir all eenzel.',
      },
      { type: 'h2', text: 'Wieder: Stuerm, Schnéi, Glatäis, Hëtztwell' },
      {
        type: 'list',
        items: [
          'Bleif dobannen a maach sou wéineg Weeër wéi méiglech.',
          'Wann s du eraus muss, so enger Persoun, déi dir no steet, wou s du hi gees.',
          'Fro bei denge Léiwen no, wéi et hinne geet.',
          'Bei Stuerm: raum alles op oder maach alles fest, wat ewechfléie kann.',
          'Bei Hëtzt: folleg de Gesondheetsrotschléi vu santesecu.public.lu.',
        ],
      },
      { type: 'h2', text: 'Iwwerschwemmungen' },
      {
        type: 'list',
        items: [
          'Huel kee Risiko.',
          'Kuck, ob deng Wunneng an enger Iwwerschwemmungszon läit (inondations.lu, eau.geoportail.lu).',
          'Haal d’Dachrennen, d’Gruewen an d’Ofleef gutt fräi.',
          'Stell elektresch Apparater a Produkter, déi d’Ëmwelt verschmotzen, méi héich wéi de Keller.',
          'Wann s du nach Zäit hues, fuer däin Auto ewech a schalt de Stroum an de geféierdete Raim aus.',
          'Vermeit iwwerschwemmt Stroossen, Ufer, Kelleren an Ënnergronds-Parkingen.',
          'Gei ni duerch Waasser, dat mat Stroum a Kontakt kéint sinn.',
        ],
      },
      { type: 'h2', text: 'Cyberattacken' },
      {
        type: 'list',
        items: [
          'Eng komesch Ufro? Kontaktéier d’Persoun oder d’Organisatioun selwer, iwwer hir offiziell Kontaktdaten.',
          'Klick net op d’Linken a verdächtege Messagen: gei direkt op de Site.',
          'Gëff ni deng Passwierder, deng Coden oder deng Bankdaten eraus.',
          'Benotz fir all Kont e laangt an en anert Passwuert, an d’Zwee-Faktor-Authentifikatioun.',
          'Maach d’Updates a maach Kopie vun denge Dokumenter a Fotoen.',
        ],
      },
      {
        type: 'p',
        text: 'Wann et dech getraff huet: haal d’Beweiser, änner deng Passwierder, ruff bei Bedruch deng Bank un an trenn de betraffenen Apparat vum Netz.',
      },
      { type: 'h2', text: 'Terrorgefor' },
      {
        type: 'list',
        items: [
          'Bleif opmierksam op Plazen, wou vill Leit sinn.',
          'Mell e verdächtegen Objet oder e verdächtegt Verhalen der Police, ouni no drun ze goen.',
          'Bei engem Ugrëff: maach dech ewech, wann s du kanns. Soss sich dir Schutz a bleif onopfälleg.',
          'Ruff d’Rettungsdéngschter, soubal s du dat ouni Gefor maache kanns, a folleg dann hiren Uweisungen.',
        ],
      },
      { type: 'h2', text: 'Nuklearaccident' },
      {
        type: 'p',
        text: 'Dëse Risiko ass ganz onwahrscheinlech. Déi wichteg Handgrëffer sinn op der Säit „Nuklearaccident“ erkläert.',
      },
      { type: 'h2', text: 'Grousse Stroumausfall' },
      {
        type: 'p',
        text: 'E géif vill Servicer gläichzäiteg treffen. D’Säit „Grousse Stroumausfall“ erkläert dir, wat s du maache solls.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: offiziell Warnungen', url: 'https://lu-alert.lu' },
      { label: 'MeteoLux: Wiederprevisiounen a Wiederwarnungen', url: 'https://www.meteolux.lu' },
      {
        label: 'Iwwerschwemmungen: Informatiounen iwwer Héichwaasser',
        url: 'https://www.inondations.lu',
      },
      { label: 'Gesondheet a Sécherheet: Hëtzt an Noutfäll', url: 'https://santesecu.public.lu' },
      { label: 'Cybersécherheet: praktesch Tipps', url: 'https://www.cybersecurity.lu' },
    ],
  },
  {
    slug: 'coupure-electricite',
    title: 'Grousse Stroumausfall',
    summary: 'Wat ausfale kann, déi richteg Handgrëffer an e Beispill vun dräi Deeg ouni Stroum.',
    chapter: 'comprendre',
    pose: 'lanterne',
    blocks: [
      {
        type: 'p',
        text: 'E Stroumausfall am ganze Land ass net wahrscheinlech. Mee e géif grouss Konsequenzen hunn, well bal alles vum Stroum ofhänkt.',
      },
      { type: 'h2', text: 'Wat ausfale kann' },
      {
        type: 'list',
        items: [
          'Wunneng: kee Liicht méi, kee Frigo, näischt fir ze kachen, keng Heizung a keen Lift.',
          'Telefon an Internet: onstabil Netzer, Uriff schwiereg, d’Rettungsdéngschter schwéier z’erreechen.',
          'Waasser: de Krunn, d’Toilette an d’Dusch kënnen ausfalen.',
          'Transport: Verkéiersluuchten aus, Zich a Busse gestéiert, Tankstellen a Pann.',
          'Suen an Akeef: Bankomaten a Bankkaarte funktionéieren net, Geschäfter zou.',
          'Gesondheet: Spideeler a Rettungsdéngschter si méi lues.',
          'Ofwaasser an Offall: bei staarkem Reen kann et iwwerlafen, den Offall gëtt méi spéit ofgeholl.',
        ],
      },
      { type: 'h2', text: 'Déi richteg Reflexer' },
      {
        type: 'list',
        items: [
          'Fëll Fläschen a Behälter, soulaang d’Waasser nach leeft.',
          'Maach de Frigo an de Congélateur sou wéineg wéi méiglech op.',
          'Maach d’Luede zou, fir d’Wäermt dobannen ze halen.',
          'Setz däin Handy an de Stroumspuermodus. Lued e mat enger externer Batterie op.',
          'Lauschter Radio mat Batterien, mat Kurbel oder am Auto: RTL a radio 100,7.',
          'Maach sou wéineg Weeër wéi méiglech a bleif no bei doheem.',
          'Ier de Stroum erëmkënnt, zéi de Stecker vum Frigo, Congélateur, Fernseh, Computer an Elektroauto.',
          'Kuck bei dengen Noperen eran, virun allem bei deenen, déi am fragilste sinn.',
        ],
      },
      {
        type: 'note',
        text: 'Benotz ni e Barbecue, e Feierkuerf, e Stroumgenerator oder en aneren Apparat fir dobaussen an engem zouene Raum. Si produzéiere Kuelemonoxid: e Gas, deen een net gesäit, deen net richt an deen déidlech ass.',
      },
      { type: 'h2', text: 'A wann et dech géif treffen? Dräi Deeg ouni Stroum' },
      {
        type: 'p',
        text: 'Dag 1. Et ass e Méindeg am Januar. De Stroum fält aus, während s du op der Aarbecht bass. D’Telefonsleitunge sinn iwwerlaascht. E LU-Alert-Message rot, RTL an de radio 100,7 ze lauschteren. Et fiert keen Zuch méi: eng Kolleegin bréngt dech mam Auto heem. Owes huels du deng Lamp, deng Decken an däi Gasrechaud eraus.',
      },
      {
        type: 'p',
        text: 'Dag 2. D’Waasser leeft net méi an d’Haus gëtt kal. Du benotz deng Reserven, du spuers deng Batterie an du lauschters Radio. Et ginn Rumeuren erëm: du deels just déi offiziell Informatiounen. Deng Noperen invitéieren dech, dech bei hirem Kamäin z’erwiermen.',
      },
      {
        type: 'p',
        text: 'Dag 3. De Quartier organiséiert sech, fir sech géigesäiteg ze hëllefen. D’Gemeng mécht e geheizte Sall op, wou ee waarm drénke kann, sech informéieren an den Handy oplueden. Dann annoncéiert de Radio, datt de Stroum Zon fir Zon erëmkënnt. Erëm doheem méchs du de Bilan. Wat huet dir gefeelt? Wat muss du nach ergänzen?',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'infocrise.lu: Informatiounen an enger Kris', url: 'https://infocrise.lu' },
      { label: 'LU-Alert: offiziell Warnungen', url: 'https://lu-alert.lu' },
    ],
  },
  {
    slug: 'alerte-lu-alert',
    title: 'LU-Alert, déi offiziell Warnung',
    summary: 'Wéi d’Autoritéiten dech warnen a wat d’Vigilanzniveaue bedeiten.',
    chapter: 'alerte',
    pose: 'bonjour',
    blocks: [
      {
        type: 'p',
        text: 'LU-Alert ass den nationale Warn- an Informatiounssystem. D’Autoritéite benotzen en, fir dech bei Gefor séier ze warnen.',
      },
      {
        type: 'p',
        text: 'LU-Alert informéiert dech virun engem Evenement, fir datt s du dech virbereede kanns. Et hëlleft dir während dem Evenement, fir dech ze schützen. Heiansdo seet et dir och, wann d’Gefor eriwwer ass.',
      },
      { type: 'h2', text: 'Verschidde Kanäl gläichzäiteg' },
      {
        type: 'p',
        text: 'Dee selwechte Message leeft iwwer verschidde Kanäl. Sou ass d’Chance méi grouss, datt e bei dir ukënnt.',
      },
      {
        type: 'list',
        items: [
          'De Site lu-alert.lu: all d’Message gi do publizéiert.',
          'D’LU-Alert-App, gratis: du wiels d’Themen, d’Niveauen an d’Zonen. Manner schlëmm Warnungen, zum Beispill iwwer Liewensmëttel, ginn normalerweis just iwwer d’App.',
          'Déi geolokaliséiert SMS: si gëtt un all d’Leit geschéckt, déi an der geféierdeter Zon sinn, egal bei wéi engem Operateur si sinn.',
          'De Cell Broadcast: e prioritäre Message op all kompatibelen Handy an der Zon, mat Toun a Vibratioun, och am Rouhmodus.',
          'D’Sirenen, bei enger grousser oder imminenter Gefor.',
          'D’Medien: Radio, Fernseh, Press an Informatiounssäiten.',
        ],
      },
      { type: 'h2', text: 'Déi 4 Vigilanzniveauen' },
      {
        type: 'p',
        text: 'Wann eng Situatioun sech lues a lues verschlechtert, schwätzt ee vun engem progressive Szenario. Et huet dräi Niveauen:',
      },
      {
        type: 'list',
        items: [
          'Giele Niveau, „Sidd opmierksam“: klenge Risiko, méiglech Gefor.',
          'Orange Niveau, „Sidd virsiichteg“: mëttlere Risiko, et gëtt eng Gefor.',
          'Roude Niveau, „Absolut Vigilanz“: héije Risiko, grouss Gefor.',
        ],
      },
      {
        type: 'p',
        text: 'Wann d’Gefor ganz no ass, schwätzt ee vun engem imminente Szenario. Et huet just een Niveau: de vioulette Niveau, imminent Gefor. Du muss direkt handelen.',
      },
      {
        type: 'p',
        text: 'Den Niveau an de Kanal gi vun der zoustänneger Autoritéit no der Gravitéit gewielt. Zum Beispill MeteoLux, d’Police, de CGDIS oder d’Administration de la gestion de l’eau.',
      },
      { type: 'h2', text: 'De Radio, de robusteste Kanal' },
      {
        type: 'p',
        text: 'Wann de Stroum oder d’Handysnetz ausfält, funktionéiert de Radio dacks weider. Haal e Radio mat Batterien oder mat Kurbel parat. Den Autoradio kann och hëllefen. Lauschter RTL oder radio 100,7.',
      },
      {
        type: 'p',
        text: 'Tipp: installéier d’LU-Alert-App elo schonn. Si ass gratis am App Store an op Google Play.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: offiziell Warnungen', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu: Informatiounen an enger Kris', url: 'https://infocrise.lu' },
    ],
  },
  {
    slug: 'sirenes',
    title: 'D’Signaler vun de Sirenen',
    summary: 'Déi véier Sirenesignaler erkennen a wëssen, wat s du bei all eenzelnem maache solls.',
    chapter: 'alerte',
    pose: 'bonjour',
    blocks: [
      {
        type: 'p',
        text: 'D’Sirene warnen virun enger grousser oder imminenter Gefor. Si kënnen an enger bestëmmter Zon oder am ganze Land lassgoen.',
      },
      {
        type: 'p',
        text: 'Et gëtt véier Signaler. All Signal huet en aneren Toun an eng genee Uweisung.',
      },
      { type: 'h2', text: 'Test all Mount' },
      {
        type: 'p',
        text: 'Den Toun: en duerchgoenden Toun, ëmmer op der selwechter Héicht, 60 s laang.',
      },
      { type: 'p', text: 'Wat maachen: näischt. Et ass just en Test.' },
      { type: 'h2', text: 'Warnsignal' },
      {
        type: 'p',
        text: 'Den Toun: en duerchgoenden Toun, ëmmer op der selwechter Héicht, 2 Min. laang.',
      },
      {
        type: 'p',
        text: 'Wat maachen: bréng dech a Sécherheet an informéier dech iwwer LU-Alert, de Radio oder de Fernseh. Folleg dann den Uweisunge vun den Autoritéiten.',
      },
      { type: 'h2', text: 'Nationalt Alarmsignal' },
      {
        type: 'p',
        text: 'Den Toun: en Toun, deen ouni Paus erop an erof geet, 60 s laang.',
      },
      {
        type: 'p',
        text: 'Wat maachen: sich dir sou séier wéi méiglech Schutz an engem stabillen, zouene Gebai.',
      },
      { type: 'h2', text: 'Enn vum Alarm' },
      {
        type: 'p',
        text: 'Den Toun: en Toun, deen erop an erof geet, mat kuerze Pausen dertëscht, 60 s laang.',
      },
      {
        type: 'p',
        text: 'Wat maachen: d’Gefor ass eriwwer. Du kanns normal mat denge gewinnten Aktivitéite weidermaachen.',
      },
      {
        type: 'note',
        text: 'Den Test ass all éischte Méindeg vum Mount um 12 Auer mëttes. En duerchgoenden Toun vun enger Minutt ass zu där Zäit also normal. Wann e méi laang dauert, oder zu enger anerer Zäit kënnt, informéier dech.',
      },
      { type: 'h2', text: 'Bass du net sécher?' },
      {
        type: 'p',
        text: 'Maach de Radio un oder maach LU-Alert op. Ruff net den 112 oder den 113 un, fir ze froen, wat lass ass: dës Linne musse fir Noutfäll fräi bleiwen.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: offiziell Warnungen', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu: Informatiounen an enger Kris', url: 'https://infocrise.lu' },
    ],
  },
  {
    slug: 'bien-s-informer',
    title: 'Sech richteg informéieren',
    summary: 'Déi richteg Quelle fannen a vermeiden, falsch Informatiounen ze deelen.',
    chapter: 'alerte',
    pose: 'lecture',
    blocks: [
      {
        type: 'p',
        text: 'Während enger Kris zirkuléiere vill Messagen. Verschiddener si falsch. Anerer widderspriechen sech. E puer einfach Reflexer hëllefen dir, se ze sortéieren.',
      },
      { type: 'h2', text: 'Déi richteg Reflexer' },
      {
        type: 'list',
        items: [
          'Folleg den Uweisunge vun den Autoritéiten.',
          'Informéier dech bei offizielle Quellen a bekannte Medien.',
          'Iwwerpréif eng Informatioun, ier s du se deels.',
          'Telefonéier sou wéineg wéi méiglech, fir d’Linne fräi ze halen fir d’Rettungsdéngschter.',
        ],
      },
      { type: 'h2', text: 'Ier s du eppes gleefs oder deels' },
      { type: 'p', text: 'Stell dir dës véier Froen:' },
      {
        type: 'list',
        items: [
          'Wien huet dës Informatioun publizéiert?',
          'Wéini gouf se publizéiert?',
          'Wou kënnt se hier?',
          'Soen aner zouverlässeg Quellen datselwecht?',
        ],
      },
      { type: 'h2', text: 'Opgepasst bei falsche Biller' },
      {
        type: 'p',
        text: 'Fotoen a Videoe kënne mat kënschtlecher Intelligenz (KI) gemaach ginn. Heiansdo gesi se ganz echt aus. E beandrockend Bild ass kee Beweis.',
      },
      {
        type: 'note',
        text: 'Wann keng offiziell Quell eng Warnung bestätegt, deel se net. Och net, fir deng Léiwen „ze warnen“.',
      },
      { type: 'h2', text: 'Wou iwwerpréiwen?' },
      {
        type: 'list',
        items: [
          'lu-alert.lu, fir d’Warnungen.',
          'infocrise.lu, fir de Krisemanagement.',
          'De Radio: RTL a radio 100,7.',
          'Deng Gemeng: Internetsite, Aushang, Bulletin, Versammlungen an Apps.',
        ],
      },
      {
        type: 'p',
        text: 'Wann s du Zweiwel hues, gräif ëmmer op dës offiziell Kanäl zeréck.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: offiziell Warnungen', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu: Informatiounen an enger Kris', url: 'https://infocrise.lu' },
    ],
  },
  {
    slug: 'accident-nucleaire',
    title: 'Nuklearaccident',
    summary: 'E ganz klenge Risiko, mee einfach Uweisungen, déi s du am Viraus kenne solls.',
    chapter: 'comprendre',
    pose: 'lanterne',
    blocks: [
      {
        type: 'p',
        text: 'En Nuklearaccident ass ganz onwahrscheinlech. Mee seng Konsequenze kënne fir d’Gesondheet an d’Ëmwelt schlëmm sinn.',
      },
      {
        type: 'p',
        text: 'Wann s du d’Uweisungen am Viraus kenns, kanns du dech besser schützen, ouni a Panik ze geroden.',
      },
      { type: 'h2', text: 'Déi richteg Handgrëffer' },
      {
        type: 'list',
        items: [
          'Informéier dech iwwer LU-Alert, de Radio an d’Medien.',
          'Sich dobanne Schutz, wann d’Autoritéiten dat froen.',
          'Maach d’Dieren, d’Fënsteren an d’Luede zou.',
          'Schalt d’Ventilatioun, d’Klimaanlag an d’Belëftungssystemer aus.',
          'Huel deng Jodtabletten eraus an haal se griffbereet.',
        ],
      },
      { type: 'h2', text: 'D’Jodtabletten' },
      {
        type: 'p',
        text: 'Et si Kaliumjodid-Tabletten. Du kriss se bei denger Gemeng. Leg se an däi Kit.',
      },
      {
        type: 'p',
        text: 'Si sinn normalerweis fir Leit ënner 45 Joer geduecht. Fir méi al Leit ginn se normalerweis net ugeroden.',
      },
      {
        type: 'note',
        text: 'Huel d’Jodtabletten nëmmen, wann d’Autoritéiten dat froen. Ni virdrun, an ni „aus Virsiicht“.',
      },
      { type: 'h2', text: 'Fir méi ze wëssen' },
      {
        type: 'p',
        text: 'D’Broschür „Wat maachen am Fall vun engem nuklearen Alarm?“ fënns du op infocrise.lu.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      {
        label: 'infocrise.lu: wat maachen am Fall vun engem nuklearen Alarm',
        url: 'https://infocrise.lu',
      },
      { label: 'LU-Alert: offiziell Warnungen', url: 'https://lu-alert.lu' },
    ],
  },
  {
    slug: 'kit-et-plan',
    title: 'Däi Kit an däi Plang',
    summary:
      'Dech an dräi Schrëtt virbereeden: de Kit, den Noutfallplang a mat anere Leit driwwer schwätzen.',
    chapter: 'preparer',
    pose: 'provisions',
    blocks: [
      {
        type: 'p',
        text: 'Wann s du dech virbereets, bleiws du méi roueg a reagéiers besser. Du kanns haut schonn ufänken, an dräi Schrëtt.',
      },
      {
        type: 'steps',
        items: [
          'Stell däi Kit fir 72 Stonnen zesummen.',
          'Fëll däi perséinlechen Noutfallplang aus.',
          'Schwätz mat anere Leit driwwer a biet deng Hëllef un.',
        ],
      },
      { type: 'h2', text: '1. Däi Kit' },
      {
        type: 'p',
        text: 'De Kit enthält dat, wat s du brauchs, fir e puer Deeg doheem ze liewen, wann d’Geschäfter oder d’Servicer net méi funktionéieren.',
      },
      {
        type: 'list',
        items: [
          'Kuck als Éischt, wat s du schonn doheem hues.',
          'Setz dobäi, wat däin Haushalt brauch: Saache fir Puppelcher oder Kanner, Déierefudder, Medikamenter.',
          'Leg de Kit op eng sécher Plaz, déi een einfach erreecht an déi jiddereen am Haushalt kennt.',
          'Kuck d’Datumer op d’mannst zweemol am Joer no.',
          'Plang och en Noutfallsak an, fir matzehuelen, wann s du deng Wunneng verloosse muss.',
        ],
      },
      {
        type: 'p',
        text: 'Dëse Sak soll liicht bleiwen an einfach ze droen. Maach dat Wichtegst dran: Waasser, Medikamenter an Ordonnancen, eppes fir ze knabberen, Handy an extern Batterie, Pabeieren, Boergeld, Schlësselen an eng Éischt-Hëllef-Täsch.',
      },
      { type: 'h2', text: '2. Däi perséinlechen Noutfallplang' },
      {
        type: 'p',
        text: 'Dëse Plang organiséiert däin Haushalt am Viraus. Fëll e mat alle Leit aus, déi mat dir wunnen. Hien enthält:',
      },
      {
        type: 'list',
        items: [
          'd’Leit aus dem Haushalt, hir gesondheetlech Bedierfnesser an deng Déieren;',
          'wou d’Waasser- an de Gaskrunn, de Compteur, d’Sécherungen an de Kit sinn;',
          'd’Leit, déi dir hëllefe kënnen, an déi, deenen s du hëllefe kanns;',
          'zwou Plazen, wou dir iech erëmfannt, wann dir getrennt sidd;',
          'wéi s du ouni Telefon Bescheed soe kanns;',
          'wien d’Kanner an der Schoul ofhuele kann;',
          'déi wichteg Nummeren.',
        ],
      },
      {
        type: 'note',
        text: 'Haal ëmmer eng Kopie vun dengem Plang op Pabeier. Ouni Stroum kann däin Handy ausgoen.',
      },
      { type: 'h2', text: '3. Schwätz driwwer' },
      {
        type: 'p',
        text: 'Mir sinn all betraff. Schwätz mat denge Léiwen an dengen Noperen iwwer deng Virbereedung. Encouragéier se, hire Kit ze maachen.',
      },
      {
        type: 'p',
        text: 'Denk un d’Leit, déi eleng oder fragil sinn. A wann s du selwer Hëllef brauchs, fro eng Persoun, déi dir no steet, oder en Noper.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'Lëtz prepare!, déi national Strategie', url: 'https://letzprepare.public.lu' },
    ],
  },
  {
    slug: 'entraide',
    title: 'Sech géigesäiteg hëllefen',
    summary: 'Den Noperen hëllefen, Éischt Hëllef léieren a fireneen do sinn.',
    chapter: 'preparer',
    pose: 'fete',
    blocks: [
      {
        type: 'p',
        text: 'Während enger Kris zielen d’Bezéiungen tëscht Noperen vill. Déi éischt Stonne kënne schwéier sinn, och wann d’Rettungsdéngschter gutt virbereet sinn. D’Hëllef vun all eenzelnem ergänzt hir Aarbecht.',
      },
      { type: 'h2', text: 'Jidderee spillt eng Roll' },
      {
        type: 'p',
        text: 'Du kenns däi Quartier an d’Leit, déi eventuell Hëllef brauche kéinten. Haal en A op si.',
      },
      {
        type: 'list',
        items: [
          'Hëllef enger Persoun, déi dir no steet, hire Kit virzebereeden.',
          'Deel, wat s du kanns, oder däi Material.',
          'Fro no, wéi et eelere Leit geet, a Leit, déi eleng oder krank sinn.',
          'Schreif an däi Plang, wien dir hëllefe kann a wiem s du hëllefe kanns.',
        ],
      },
      {
        type: 'p',
        text: 'Solidaritéit entsteet all Dag, net nëmmen während enger Kris.',
      },
      { type: 'h2', text: 'Éischt Hëllef léieren' },
      {
        type: 'p',
        text: 'An e puer Stonne kanns du d’Handgrëffer léieren, déi e Liewe retten. D’Lëtzebuerger Rout Kräiz an de CGDIS bidden am ganze Land Formatiounen un.',
      },
      {
        type: 'p',
        text: 'Wëlls du dech méi engagéieren? Du kanns an denger Gemeng fräiwëllege Pompjee beim CGDIS ginn.',
      },
      { type: 'h2', text: 'Brauchs du een, fir ze schwätzen?' },
      {
        type: 'p',
        text: 'Während enger Kris ass et normal, Stress oder Angscht ze spieren oder sech isoléiert ze fillen.',
      },
      { type: 'p', text: 'Fir engem bäizestoen, hëllefen e puer einfach Handgrëffer:' },
      {
        type: 'list',
        items: [
          'frëndlech nolauschteren, ouni ze jugéieren;',
          'berouegen;',
          'der Persoun hëllefen, sech erëm an hirem gewinnten Alldag zerechtzefannen;',
          'wann néideg, se bei eng Persoun, déi hir no steet, bei e Fachmann oder bei en Hëllefsdéngscht schécken.',
        ],
      },
      {
        type: 'p',
        text: 'Bei engem Noper laanschtkucken oder bei enger Persoun a Schwieregkeete bleiwen, mécht schonn e richtegen Ënnerscheed. A wann et dir net gutt geet, zéck net, driwwer ze schwätzen. Den Nolauschterdéngscht SOS Détresse kann dir och hëllefen.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'Lëtzebuerger Rout Kräiz', url: 'https://www.croix-rouge.lu' },
      { label: 'Éischt-Hëllef-Course vum CGDIS', url: 'https://cours.cgdis.lu' },
    ],
  },
  {
    slug: 'contacts-utiles',
    title: 'Nëtzlech Kontakter',
    summary: 'D’Noutruffnummeren an d’offiziell Säiten, déi s du bei der Hand hale solls.',
    chapter: 'preparer',
    pose: 'bonjour',
    blocks: [
      { type: 'h2', text: 'Noutruffnummeren' },
      {
        type: 'list',
        items: [
          '112: Rettungsdéngscht vum CGDIS (Pompjeeën, Ambulanz).',
          '113: Police.',
          '8002 7788: gratis Nummer, déi während enger Kris opgemaach ka ginn.',
        ],
      },
      {
        type: 'note',
        text: 'Ruff den 112 oder den 113 nëmmen an engem richtegen Noutfall un. Wiel se ni, fir ze probéieren.',
      },
      {
        type: 'p',
        text: 'Während enger Kris telefonéier sou wéineg wéi méiglech. Sou bleiwen d’Linne fräi fir d’Rettungsdéngschter.',
      },
      { type: 'h2', text: 'Schreif se op Pabeier' },
      {
        type: 'p',
        text: 'Schreif och d’Nummere vun denge Léiwen op, vun dengem Dokter, vun der Schoul a vun denger Aarbecht. Setz déi vun dengen Ubidder derbäi: Stroum, Gas, Waasser, Telefon, Versécherung a Bank. Leg dës Lëscht an däi Kit.',
      },
      { type: 'h2', text: 'Deng Gemeng' },
      {
        type: 'p',
        text: 'Deng Gemeng informéiert dech och: Internetsite, Aushang, Bulletin, Versammlungen an Apps. Si mécht e Plang, deen un d’Risiken an denger Géigend ugepasst ass.',
      },
      { type: 'h2', text: 'D’offiziell Säiten' },
      {
        type: 'p',
        text: 'Vertrau just offizielle Quellen. Déi wichtegst fënns du hei drënner.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: Warnungen an Uweisungen', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu: richteg Handgrëffer a Krisemanagement', url: 'https://infocrise.lu' },
      {
        label: 'Lëtz prepare!: déi national Resilienzstrategie',
        url: 'https://letzprepare.public.lu',
      },
      { label: '112.lu: Noutfäll, Rotschléi a Garde-Déngschter', url: 'https://112.lu' },
      { label: 'police.lu: Police Lëtzebuerg', url: 'https://police.lu' },
      {
        label: 'inondations.lu: Informatiounen iwwer Héichwaasser',
        url: 'https://www.inondations.lu',
      },
      { label: 'seveso.lu: Industrieanlage mat Risiko', url: 'https://www.seveso.lu' },
      {
        label: 'meteolux.lu: Wiederprevisiounen a Wiederwarnungen',
        url: 'https://www.meteolux.lu',
      },
      { label: 'cours.cgdis.lu: Éischt-Hëllef-Coursen', url: 'https://cours.cgdis.lu' },
      {
        label: 'santesecu.public.lu: Noutfäll, Garde-Déngschter, Hëtzt',
        url: 'https://santesecu.public.lu',
      },
    ],
  },
];
