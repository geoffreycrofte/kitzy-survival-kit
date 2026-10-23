/** Deutsche Übersetzung des Leitfadens (gleiche Seiten, gleiche Reihenfolge, gleiche Links). */
import type { ContentTranslation } from '../../types';

const OFFICIAL_GUIDE = {
  label: 'Der offizielle Leitfaden Lëtz prepare!',
  url: 'https://letzprepare.public.lu/fr/guide.html',
};

export const guide: ContentTranslation['guide'] = [
  {
    slug: 'pourquoi-72-heures',
    title: 'Warum 72 Stunden?',
    summary:
      'Drei Tage selbst versorgt: So lange brauchen die Rettungskräfte, um sich zu organisieren.',
    chapter: 'comprendre',
    pose: 'lecture',
    blocks: [
      {
        type: 'p',
        text: 'Ein Sturm, ein Hochwasser, ein großer Stromausfall oder ein Cyberangriff können deinen Alltag verändern. Dann fehlen vielleicht Wasser, Strom, Telefon oder Internet.',
      },
      {
        type: 'p',
        text: 'Niemand weiß im Voraus, wie lange das dauern kann. Deshalb ist es sinnvoll, sich vorzubereiten, ruhig und ohne Sorge.',
      },
      { type: 'h2', text: 'Warum drei Tage?' },
      {
        type: 'p',
        text: 'Die ersten Stunden einer Krise sind oft die schwierigsten. Die Rettungskräfte müssen zuerst die Lage verstehen und sich organisieren. Sie helfen zuerst den Menschen, die am verletzlichsten sind.',
      },
      {
        type: 'p',
        text: 'Mit Vorräten für 72 Stunden deckst du in dieser Zeit deine Grundbedürfnisse: trinken, essen, Licht haben, dich versorgen und informiert bleiben.',
      },
      {
        type: 'p',
        text: 'Viele europäische Länder empfehlen dieselbe Dauer. Sie beruht auf den Erfahrungen aus den letzten Krisen.',
      },
      { type: 'h2', text: 'Eine gemeinsame Verantwortung' },
      {
        type: 'p',
        text: 'Staat und Gemeinden arbeiten zusammen, um die Bevölkerung zu schützen. Aber sie können nicht alles allein schaffen. Jeder Mensch kann helfen, so wie er kann.',
      },
      {
        type: 'p',
        text: 'Im Jahr 2025 hat Luxemburg die nationale Resilienzstrategie „Lëtz prepare!“ gestartet. Resilienz ist die Fähigkeit, eine schwierige Situation zu bewältigen und danach wieder zum normalen Leben zurückzukehren.',
      },
      { type: 'h2', text: 'Was die Vorbereitung verändert' },
      {
        type: 'list',
        items: [
          'Du reagierst schneller und ruhiger.',
          'Du schützt deine Familie und deine Wohnung.',
          'Du kannst deinen Angehörigen und Nachbarn helfen.',
          'Die Rettungskräfte können sich auf die dringendsten Fälle konzentrieren.',
        ],
      },
      {
        type: 'p',
        text: 'Ein paar einfache Handgriffe reichen. Du musst nicht alles an einem Tag erledigen: Geh Schritt für Schritt vor.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'Lëtz prepare!, die nationale Strategie', url: 'https://letzprepare.public.lu' },
    ],
  },
  {
    slug: 'a-quoi-se-preparer',
    title: 'Worauf sich vorbereiten?',
    summary: 'Die wichtigsten Risiken in Luxemburg und das richtige Verhalten bei jedem davon.',
    chapter: 'comprendre',
    pose: 'lecture',
    blocks: [
      {
        type: 'p',
        text: 'In Luxemburg können verschiedene Arten von Krisen deinen Alltag treffen. Hier sind die wichtigsten, mit den passenden Handgriffen für jede.',
      },
      { type: 'h2', text: 'Wetter: Sturm, Schnee, Glatteis, Hitzewelle' },
      {
        type: 'list',
        items: [
          'Bleib drinnen und fahr oder geh nur, wenn es nötig ist.',
          'Wenn du hinausmusst, sag einer vertrauten Person, wohin du gehst.',
          'Frag bei deinen Angehörigen nach, wie es ihnen geht.',
          'Bei Sturm: Räum weg oder befestige alles, was wegfliegen kann.',
          'Bei Hitzewelle: Folge den Gesundheitstipps auf santesecu.public.lu.',
        ],
      },
      { type: 'h2', text: 'Hochwasser' },
      {
        type: 'list',
        items: [
          'Geh kein Risiko ein.',
          'Prüfe, ob deine Wohnung in einem Überschwemmungsgebiet liegt (inondations.lu, eau.geoportail.lu).',
          'Halte Dachrinnen, Gräben und Abflüsse frei.',
          'Bring Elektrogeräte und umweltschädliche Produkte aus dem Keller nach oben.',
          'Wenn du noch Zeit hast, stell dein Auto woanders hin und schalte in gefährdeten Räumen den Strom ab.',
          'Meide überflutete Straßen, Flussufer, Untergeschosse und Tiefgaragen.',
          'Geh niemals durch Wasser, das mit Strom in Berührung sein kann.',
        ],
      },
      { type: 'h2', text: 'Cyberangriffe' },
      {
        type: 'list',
        items: [
          'Eine seltsame Anfrage? Kontaktiere die Person oder die Stelle selbst, über ihre offiziellen Kontaktdaten.',
          'Klick nicht auf Links in verdächtigen Nachrichten: Geh direkt auf die Website.',
          'Gib niemals deine Passwörter, Codes oder Bankdaten weiter.',
          'Nutze für jedes Konto ein langes, eigenes Passwort und die Zwei-Faktor-Authentifizierung.',
          'Mach die Updates und bewahre Kopien deiner Dokumente und Fotos auf.',
        ],
      },
      {
        type: 'p',
        text: 'Wenn du betroffen bist: Bewahre die Beweise auf, ändere deine Passwörter, ruf bei Betrug deine Bank an und trenne das betroffene Gerät vom Netz.',
      },
      { type: 'h2', text: 'Terrorgefahr' },
      {
        type: 'list',
        items: [
          'Sei aufmerksam an Orten, wo viele Menschen sind.',
          'Melde einen verdächtigen Gegenstand oder ein verdächtiges Verhalten der Polizei, ohne dich zu nähern.',
          'Bei einem Angriff: Entferne dich, wenn du kannst. Sonst such Schutz und verhalte dich unauffällig.',
          'Ruf die Rettungskräfte, sobald das ohne Gefahr möglich ist, und folge dann ihren Anweisungen.',
        ],
      },
      { type: 'h2', text: 'Atomunfall' },
      {
        type: 'p',
        text: 'Dieses Risiko ist sehr unwahrscheinlich. Die wichtigen Handgriffe stehen auf der Seite „Atomunfall“.',
      },
      { type: 'h2', text: 'Großer Stromausfall' },
      {
        type: 'p',
        text: 'Er würde viele Dienste gleichzeitig treffen. Die Seite „Großer Stromausfall“ erklärt dir, was zu tun ist.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: offizielle Warnungen', url: 'https://lu-alert.lu' },
      {
        label: 'MeteoLux: Wettervorhersagen und Unwetterwarnungen',
        url: 'https://www.meteolux.lu',
      },
      { label: 'Hochwasser: Informationen zu Überschwemmungen', url: 'https://www.inondations.lu' },
      {
        label: 'Gesundheit und Sicherheit: Hitzewelle und Notfälle',
        url: 'https://santesecu.public.lu',
      },
      { label: 'Cybersicherheit: praktische Tipps', url: 'https://www.cybersecurity.lu' },
    ],
  },
  {
    slug: 'coupure-electricite',
    title: 'Großer Stromausfall',
    summary:
      'Was ausfallen kann, die richtigen Handgriffe und ein Beispiel für drei Tage ohne Strom.',
    chapter: 'comprendre',
    pose: 'lanterne',
    blocks: [
      {
        type: 'p',
        text: 'Ein Stromausfall im ganzen Land ist unwahrscheinlich. Aber er hätte große Folgen, denn fast alles hängt vom Strom ab.',
      },
      { type: 'h2', text: 'Was ausfallen kann' },
      {
        type: 'list',
        items: [
          'Wohnung: kein Licht mehr, kein Kühlschrank, kein Kochen, keine Heizung und kein Aufzug.',
          'Telefon und Internet: instabile Netze, Anrufe schwierig, Rettungskräfte schwer erreichbar.',
          'Wasser: Wasserhahn, Toilette und Dusche funktionieren vielleicht nicht mehr.',
          'Verkehr: Ampeln aus, Züge und Busse gestört, Zapfsäulen außer Betrieb.',
          'Geld und Einkauf: Geldautomaten und Bankkarten außer Betrieb, Geschäfte geschlossen.',
          'Gesundheit: Krankenhäuser und Rettungsdienste arbeiten langsamer.',
          'Abwasser und Müll: bei starkem Regen mögliche Überläufe, Müllabfuhr verspätet.',
        ],
      },
      { type: 'h2', text: 'Das richtige Verhalten' },
      {
        type: 'list',
        items: [
          'Füll Flaschen und Behälter, solange noch Wasser fließt.',
          'Öffne Kühlschrank und Gefrierschrank so selten wie möglich.',
          'Schließ die Fensterläden, um die Wärme zu halten.',
          'Stell dein Handy auf Energiesparmodus. Lade es mit einer Powerbank auf.',
          'Hör Radio mit einem Batterie- oder Kurbelradio oder im Auto: RTL und radio 100,7.',
          'Fahr oder geh nur, wenn es nötig ist, und bleib in der Nähe deines Zuhauses.',
          'Bevor der Strom zurückkommt, zieh den Stecker von Kühlschrank, Gefrierschrank, Fernseher, Computer und Elektroauto.',
          'Schau bei deinen Nachbarn vorbei, vor allem bei den verletzlichsten.',
        ],
      },
      {
        type: 'note',
        text: 'Benutze niemals einen Grill, einen Feuerkorb, ein Stromaggregat oder ein anderes Gerät für draußen in einem geschlossenen Raum. Sie erzeugen Kohlenmonoxid: ein unsichtbares, geruchloses und tödliches Gas.',
      },
      { type: 'h2', text: 'Und wenn es dich trifft? Drei Tage ohne Strom' },
      {
        type: 'p',
        text: 'Tag 1. An einem Montag im Januar fällt der Strom aus, während du bei der Arbeit bist. Die Telefonleitungen sind überlastet. Eine LU-Alert-Nachricht empfiehlt, RTL und radio 100,7 zu hören. Es fahren keine Züge mehr: Eine Kollegin bringt dich mit dem Auto nach Hause. Am Abend holst du deine Lampe, deine Decken und deinen Gaskocher hervor.',
      },
      {
        type: 'p',
        text: 'Tag 2. Es kommt kein Wasser mehr und das Haus kühlt ab. Du nutzt deine Vorräte, sparst Akku und hörst Radio. Gerüchte machen die Runde: Du teilst nur offizielle Informationen. Deine Nachbarn laden dich ein, dich an ihrem Kamin aufzuwärmen.',
      },
      {
        type: 'p',
        text: 'Tag 3. Das Viertel organisiert sich, um sich gegenseitig zu helfen. Die Gemeinde öffnet einen beheizten Saal, um etwas Warmes zu trinken, sich zu informieren und Handys aufzuladen. Dann meldet das Radio, dass der Strom Gebiet für Gebiet zurückkommt. Wieder zu Hause ziehst du Bilanz. Was hat dir gefehlt? Was musst du ergänzen?',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'infocrise.lu: Informationen im Krisenfall', url: 'https://infocrise.lu' },
      { label: 'LU-Alert: offizielle Warnungen', url: 'https://lu-alert.lu' },
    ],
  },
  {
    slug: 'alerte-lu-alert',
    title: 'LU-Alert, die offizielle Warnung',
    summary: 'Wie die Behörden dich warnen und was die Warnstufen bedeuten.',
    chapter: 'alerte',
    pose: 'bonjour',
    blocks: [
      {
        type: 'p',
        text: 'LU-Alert ist das nationale Warn- und Informationssystem. Die Behörden nutzen es, um dich bei Gefahr schnell zu warnen.',
      },
      {
        type: 'p',
        text: 'LU-Alert informiert dich vor einem Ereignis, damit du dich vorbereiten kannst. Es hilft dir währenddessen, dich zu schützen. Manchmal sagt es dir auch, wenn die Gefahr vorbei ist.',
      },
      { type: 'h2', text: 'Mehrere Kanäle gleichzeitig' },
      {
        type: 'p',
        text: 'Dieselbe Nachricht läuft über mehrere Kanäle. So erreicht sie dich mit größerer Wahrscheinlichkeit.',
      },
      {
        type: 'list',
        items: [
          'Die Website lu-alert.lu: Dort werden alle Nachrichten veröffentlicht.',
          'Die kostenlose LU-Alert-App: Du wählst Themen, Stufen und Gebiete. Weniger ernste Warnungen, zum Beispiel zu Lebensmitteln, kommen meist nur über die App.',
          'Die standortbezogene SMS: Sie geht an alle Personen im Gefahrengebiet, egal bei welchem Anbieter.',
          'Cell Broadcast: eine vorrangige Nachricht auf allen kompatiblen Handys im Gebiet, mit Ton und Vibration, auch im Lautlos-Modus.',
          'Die Sirenen, bei großer oder unmittelbarer Gefahr.',
          'Die Medien: Radio, Fernsehen, Zeitungen und Nachrichtenseiten.',
        ],
      },
      { type: 'h2', text: 'Die 4 Warnstufen' },
      {
        type: 'p',
        text: 'Wenn sich eine Lage nach und nach verschlimmert, spricht man von einem fortschreitenden Szenario. Es hat drei Stufen:',
      },
      {
        type: 'list',
        items: [
          'Stufe Gelb, „Seien Sie aufmerksam“: geringes Risiko, mögliche Gefahr.',
          'Stufe Orange, „Seien Sie vorsichtig“: mittleres Risiko, es besteht eine Gefahr.',
          'Stufe Rot, „Absolute Wachsamkeit“: hohes Risiko, große Gefahr.',
        ],
      },
      {
        type: 'p',
        text: 'Wenn die Gefahr ganz nah ist, spricht man von einem unmittelbaren Szenario. Es hat nur eine Stufe: Stufe Violett, unmittelbare Gefahr. Dann musst du sofort handeln.',
      },
      {
        type: 'p',
        text: 'Stufe und Kanal wählt die zuständige Behörde je nach Schwere. Zum Beispiel MeteoLux, die Polizei, das CGDIS oder die Wasserwirtschaftsverwaltung.',
      },
      { type: 'h2', text: 'Das Radio, der zuverlässigste Kanal' },
      {
        type: 'p',
        text: 'Wenn Strom oder Mobilfunknetz ausfallen, funktioniert das Radio oft weiter. Halte ein Batterie- oder Kurbelradio bereit. Auch das Autoradio kann helfen. Hör RTL oder radio 100,7.',
      },
      {
        type: 'p',
        text: 'Tipp: Installier die LU-Alert-App am besten jetzt. Sie ist kostenlos im App Store und bei Google Play.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: offizielle Warnungen', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu: Informationen im Krisenfall', url: 'https://infocrise.lu' },
    ],
  },
  {
    slug: 'sirenes',
    title: 'Die Sirenensignale',
    summary: 'Die vier Sirenensignale erkennen und wissen, was bei jedem zu tun ist.',
    chapter: 'alerte',
    pose: 'bonjour',
    blocks: [
      {
        type: 'p',
        text: 'Die Sirenen warnen vor einer großen oder unmittelbaren Gefahr. Sie können in einem bestimmten Gebiet oder im ganzen Land ertönen.',
      },
      {
        type: 'p',
        text: 'Es gibt vier Signale. Jedes hat einen anderen Ton und eine klare Anweisung.',
      },
      { type: 'h2', text: 'Monatlicher Test' },
      {
        type: 'p',
        text: 'Der Ton: ein Dauerton, immer in derselben Höhe, 60 Sekunden lang.',
      },
      { type: 'p', text: 'Was tun: nichts. Es ist nur ein Test.' },
      { type: 'h2', text: 'Warnsignal' },
      {
        type: 'p',
        text: 'Der Ton: ein Dauerton, immer in derselben Höhe, 2 Minuten lang.',
      },
      {
        type: 'p',
        text: 'Was tun: Bring dich in Sicherheit und informier dich über LU-Alert, Radio oder Fernsehen. Folge dann den Anweisungen der Behörden.',
      },
      { type: 'h2', text: 'Nationales Alarmsignal' },
      {
        type: 'p',
        text: 'Der Ton: ein auf- und abschwellender Ton, ohne Pause, 60 Sekunden lang.',
      },
      {
        type: 'p',
        text: 'Was tun: Such so schnell wie möglich Schutz in einem stabilen, geschlossenen Gebäude.',
      },
      { type: 'h2', text: 'Entwarnung' },
      {
        type: 'p',
        text: 'Der Ton: ein auf- und abschwellender Ton, mit kurzen Pausen, 60 Sekunden lang.',
      },
      {
        type: 'p',
        text: 'Was tun: Die Gefahr ist vorbei. Du kannst deinen Alltag normal fortsetzen.',
      },
      {
        type: 'note',
        text: 'Der Test findet an jedem ersten Montag im Monat um 12 Uhr mittags statt. Ein einminütiger Dauerton zu dieser Zeit ist also normal. Dauert er länger oder kommt er zu einer anderen Zeit, informier dich.',
      },
      { type: 'h2', text: 'Du bist unsicher?' },
      {
        type: 'p',
        text: 'Schalte das Radio ein oder öffne LU-Alert. Ruf nicht die 112 oder die 113 an, um zu fragen, was los ist: Diese Leitungen müssen für Notfälle frei bleiben.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: offizielle Warnungen', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu: Informationen im Krisenfall', url: 'https://infocrise.lu' },
    ],
  },
  {
    slug: 'bien-s-informer',
    title: 'Sich richtig informieren',
    summary: 'Die richtigen Quellen finden und keine Falschinformationen teilen.',
    chapter: 'alerte',
    pose: 'lecture',
    blocks: [
      {
        type: 'p',
        text: 'In einer Krise sind viele Nachrichten im Umlauf. Manche sind falsch. Andere widersprechen sich. Ein paar einfache Gewohnheiten helfen dir, sie zu sortieren.',
      },
      { type: 'h2', text: 'Das richtige Verhalten' },
      {
        type: 'list',
        items: [
          'Folge den Anweisungen der Behörden.',
          'Informier dich bei offiziellen Quellen und bekannten Medien.',
          'Prüfe eine Information, bevor du sie teilst.',
          'Telefonier so wenig wie möglich, damit die Leitungen für die Rettungskräfte frei bleiben.',
        ],
      },
      { type: 'h2', text: 'Bevor du glaubst oder teilst' },
      { type: 'p', text: 'Stell dir diese vier Fragen:' },
      {
        type: 'list',
        items: [
          'Wer hat diese Information veröffentlicht?',
          'Wann wurde sie veröffentlicht?',
          'Woher kommt sie?',
          'Sagen andere zuverlässige Quellen dasselbe?',
        ],
      },
      { type: 'h2', text: 'Vorsicht vor falschen Bildern' },
      {
        type: 'p',
        text: 'Fotos und Videos können mit künstlicher Intelligenz (KI) erzeugt werden. Manchmal wirken sie sehr echt. Ein beeindruckendes Bild ist kein Beweis.',
      },
      {
        type: 'note',
        text: 'Wenn keine offizielle Quelle eine Warnung bestätigt, teile sie nicht. Auch nicht, um deine Angehörigen zu „warnen“.',
      },
      { type: 'h2', text: 'Wo nachprüfen?' },
      {
        type: 'list',
        items: [
          'lu-alert.lu, für Warnungen.',
          'infocrise.lu, für das Krisenmanagement.',
          'Das Radio: RTL und radio 100,7.',
          'Deine Gemeinde: Website, Aushänge, Gemeindeblatt, Versammlungen und Apps.',
        ],
      },
      {
        type: 'p',
        text: 'Im Zweifel geh immer zurück zu diesen offiziellen Kanälen.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: offizielle Warnungen', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu: Informationen im Krisenfall', url: 'https://infocrise.lu' },
    ],
  },
  {
    slug: 'accident-nucleaire',
    title: 'Atomunfall',
    summary: 'Ein sehr geringes Risiko, aber einfache Anweisungen, die man vorher kennen sollte.',
    chapter: 'comprendre',
    pose: 'lanterne',
    blocks: [
      {
        type: 'p',
        text: 'Ein Atomunfall ist sehr unwahrscheinlich. Aber seine Folgen für Gesundheit und Umwelt können schwer sein.',
      },
      {
        type: 'p',
        text: 'Wenn du die Anweisungen vorher kennst, kannst du dich besser schützen, ohne in Panik zu geraten.',
      },
      { type: 'h2', text: 'Die richtigen Handgriffe' },
      {
        type: 'list',
        items: [
          'Informier dich über LU-Alert, das Radio und die Medien.',
          'Such drinnen Schutz, wenn die Behörden es verlangen.',
          'Schließ Türen, Fenster und Fensterläden.',
          'Schalte Lüftung, Klimaanlage und Belüftungssysteme ab.',
          'Hol deine Jodtabletten hervor und halte sie griffbereit.',
        ],
      },
      { type: 'h2', text: 'Die Jodtabletten' },
      {
        type: 'p',
        text: 'Das sind Kaliumiodid-Tabletten. Du bekommst sie bei deiner Gemeinde. Bewahre sie in deinem Kit auf.',
      },
      {
        type: 'p',
        text: 'Sie sind in der Regel für Menschen unter 45 Jahren gedacht. Ab diesem Alter werden sie in der Regel nicht empfohlen.',
      },
      {
        type: 'note',
        text: 'Nimm die Jodtabletten nur, wenn die Behörden es verlangen. Niemals vorher und niemals „zur Vorsicht“.',
      },
      { type: 'h2', text: 'Mehr erfahren' },
      {
        type: 'p',
        text: 'Die Broschüre „Que faire en cas d’alerte nucléaire ?“ (Was tun bei einem Atomalarm?) gibt es auf infocrise.lu.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'infocrise.lu: was tun bei einem Atomalarm', url: 'https://infocrise.lu' },
      { label: 'LU-Alert: offizielle Warnungen', url: 'https://lu-alert.lu' },
    ],
  },
  {
    slug: 'kit-et-plan',
    title: 'Dein Kit und dein Plan',
    summary:
      'Vorbereitung in drei Schritten: das Kit, der Notfallplan und mit anderen darüber reden.',
    chapter: 'preparer',
    pose: 'provisions',
    blocks: [
      {
        type: 'p',
        text: 'Wenn du vorbereitet bist, bleibst du ruhiger und reagierst richtig. Du kannst heute anfangen, in drei Schritten.',
      },
      {
        type: 'steps',
        items: [
          'Stell dein Kit für 72 Stunden zusammen.',
          'Füll deinen persönlichen Notfallplan aus.',
          'Sprich mit anderen darüber und biete deine Hilfe an.',
        ],
      },
      { type: 'h2', text: '1. Dein Kit' },
      {
        type: 'p',
        text: 'Das Kit enthält, was du brauchst, um ein paar Tage zu Hause zu leben, wenn Geschäfte oder Dienste nicht mehr funktionieren.',
      },
      {
        type: 'list',
        items: [
          'Schau zuerst, was du schon zu Hause hast.',
          'Ergänze, was dein Haushalt braucht: Produkte für Babys oder Kinder, Tierfutter, Medikamente.',
          'Bewahre das Kit an einem sicheren Ort auf, leicht erreichbar und allen im Haushalt bekannt.',
          'Prüfe die Haltbarkeitsdaten mindestens zweimal im Jahr.',
          'Pack auch einen Notfallrucksack, falls du deine Wohnung verlassen musst.',
        ],
      },
      {
        type: 'p',
        text: 'Dieser Rucksack soll leicht und gut zu tragen sein. Pack das Wichtigste hinein: Wasser, Medikamente und Rezepte, Snacks, Handy und Powerbank, Ausweispapiere, Bargeld, Schlüssel und Erste-Hilfe-Set.',
      },
      { type: 'h2', text: '2. Dein persönlicher Notfallplan' },
      {
        type: 'p',
        text: 'Dieser Plan organisiert deinen Haushalt im Voraus. Füll ihn mit allen Menschen aus, die mit dir leben. Er enthält:',
      },
      {
        type: 'list',
        items: [
          'die Personen im Haushalt, ihre gesundheitlichen Bedürfnisse und deine Haustiere;',
          'wo die Wasser- und Gashähne, der Zähler, der Sicherungskasten und das Kit sind;',
          'die Menschen, die dir helfen können, und die, denen du helfen kannst;',
          'zwei Treffpunkte, falls ihr getrennt seid;',
          'wie ihr ohne Telefon Nachricht geben könnt;',
          'wer die Kinder von der Schule abholen kann;',
          'die wichtigen Telefonnummern.',
        ],
      },
      {
        type: 'note',
        text: 'Bewahre immer eine Papierkopie deines Plans auf. Ohne Strom kann dein Handy ausgehen.',
      },
      { type: 'h2', text: '3. Sprich darüber' },
      {
        type: 'p',
        text: 'Es betrifft uns alle. Sprich mit deinen Angehörigen und Nachbarn über deine Vorbereitung. Ermutige sie, ihr eigenes Kit zusammenzustellen.',
      },
      {
        type: 'p',
        text: 'Denk an Menschen, die allein oder verletzlich sind. Und wenn du selbst Hilfe brauchst, frag eine vertraute Person oder einen Nachbarn.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'Lëtz prepare!, die nationale Strategie', url: 'https://letzprepare.public.lu' },
    ],
  },
  {
    slug: 'entraide',
    title: 'Einander helfen',
    summary: 'Den Nachbarn helfen, Erste Hilfe lernen und aufeinander achten.',
    chapter: 'preparer',
    pose: 'fete',
    blocks: [
      {
        type: 'p',
        text: 'In einer Krise zählt der Zusammenhalt unter Nachbarn sehr. Die ersten Stunden können schwierig sein, auch wenn die Rettungskräfte gut vorbereitet sind. Die Hilfe jedes Einzelnen ergänzt ihre Arbeit.',
      },
      { type: 'h2', text: 'Jeder hat eine Rolle' },
      {
        type: 'p',
        text: 'Du kennst dein Viertel und die Menschen, die Hilfe brauchen könnten. Achte auf sie.',
      },
      {
        type: 'list',
        items: [
          'Hilf einer vertrauten Person, ihr Kit zusammenzustellen.',
          'Teile, was du kannst, oder deine Ausrüstung.',
          'Frag bei älteren, alleinlebenden oder kranken Menschen nach, wie es ihnen geht.',
          'Schreib in deinen Plan, wer dir helfen kann und wem du helfen kannst.',
        ],
      },
      {
        type: 'p',
        text: 'Solidarität entsteht jeden Tag, nicht nur in einer Krise.',
      },
      { type: 'h2', text: 'Erste Hilfe lernen' },
      {
        type: 'p',
        text: 'In wenigen Stunden kannst du die Handgriffe lernen, die Leben retten. Das Luxemburger Rote Kreuz und das CGDIS bieten im ganzen Land Kurse an.',
      },
      {
        type: 'p',
        text: 'Du willst dich mehr engagieren? Du kannst in deiner Gemeinde freiwillige Feuerwehrfrau oder freiwilliger Feuerwehrmann beim CGDIS werden.',
      },
      { type: 'h2', text: 'Brauchst du jemanden zum Reden?' },
      {
        type: 'p',
        text: 'In einer Krise ist es normal, Stress oder Angst zu spüren oder sich allein zu fühlen.',
      },
      { type: 'p', text: 'Um jemanden zu unterstützen, helfen ein paar einfache Gesten:' },
      {
        type: 'list',
        items: [
          'freundlich zuhören, ohne zu urteilen;',
          'beruhigen;',
          'der Person helfen, ihre gewohnten Abläufe wiederzufinden;',
          'wenn nötig, sie an eine vertraute Person, eine Fachkraft oder einen Hilfsdienst weiterleiten.',
        ],
      },
      {
        type: 'p',
        text: 'Bei einem Nachbarn vorbeischauen oder bei einem Menschen in Not bleiben, macht schon einen echten Unterschied. Und wenn es dir selbst nicht gut geht, sprich ruhig darüber. Auch das Hilfetelefon SOS Détresse kann dir helfen.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'Luxemburger Rotes Kreuz', url: 'https://www.croix-rouge.lu' },
      { label: 'Erste-Hilfe-Kurse des CGDIS', url: 'https://cours.cgdis.lu' },
    ],
  },
  {
    slug: 'contacts-utiles',
    title: 'Wichtige Kontakte',
    summary: 'Die Notrufnummern und offiziellen Websites, die du griffbereit haben solltest.',
    chapter: 'preparer',
    pose: 'bonjour',
    blocks: [
      { type: 'h2', text: 'Notrufnummern' },
      {
        type: 'list',
        items: [
          '112: Rettungsdienst des CGDIS (Feuerwehr, Krankenwagen).',
          '113: Polizei.',
          '8002 7788: kostenlose Hotline, die während einer Krise geöffnet werden kann.',
        ],
      },
      {
        type: 'note',
        text: 'Ruf die 112 oder die 113 nur in einem echten Notfall an. Wähl sie niemals zum Ausprobieren.',
      },
      {
        type: 'p',
        text: 'Telefonier während einer Krise so wenig wie möglich. So bleiben die Leitungen für die Rettungskräfte frei.',
      },
      { type: 'h2', text: 'Schreib sie auf Papier' },
      {
        type: 'p',
        text: 'Notier auch die Nummern deiner Angehörigen, deines Arztes, der Schule und deiner Arbeit. Ergänze die deiner Anbieter: Strom, Gas, Wasser, Telefon, Versicherung und Bank. Bewahre diese Liste in deinem Kit auf.',
      },
      { type: 'h2', text: 'Deine Gemeinde' },
      {
        type: 'p',
        text: 'Auch deine Gemeinde informiert dich: Website, Aushänge, Gemeindeblatt, Versammlungen und Apps. Sie erstellt einen Plan, der zu den Risiken in deiner Gegend passt.',
      },
      { type: 'h2', text: 'Die offiziellen Websites' },
      {
        type: 'p',
        text: 'Vertrau nur offiziellen Quellen. Die wichtigsten findest du unten.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: Warnungen und Anweisungen', url: 'https://lu-alert.lu' },
      {
        label: 'infocrise.lu: richtiges Verhalten und Krisenmanagement',
        url: 'https://infocrise.lu',
      },
      {
        label: 'Lëtz prepare!: die nationale Resilienzstrategie',
        url: 'https://letzprepare.public.lu',
      },
      { label: '112.lu: Notfälle, Tipps und Bereitschaftsdienste', url: 'https://112.lu' },
      { label: 'police.lu: Police Lëtzebuerg', url: 'https://police.lu' },
      { label: 'inondations.lu: Informationen zu Hochwasser', url: 'https://www.inondations.lu' },
      { label: 'seveso.lu: Industrieanlagen mit Risiko', url: 'https://www.seveso.lu' },
      {
        label: 'meteolux.lu: Wettervorhersagen und Unwetterwarnungen',
        url: 'https://www.meteolux.lu',
      },
      { label: 'cours.cgdis.lu: Erste-Hilfe-Kurse', url: 'https://cours.cgdis.lu' },
      {
        label: 'santesecu.public.lu: Notfälle, Bereitschaftsdienste, Hitzewelle',
        url: 'https://santesecu.public.lu',
      },
    ],
  },
];
