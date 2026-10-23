/** Deutsche Übersetzung des Quiz. */
import type { ContentTranslation } from '../../types';

export const quiz: ContentTranslation['quiz'] = {
  'sirene-test': {
    prompt:
      'Erster Montag im Monat, 12 Uhr mittags: Die Sirene gibt eine Minute lang einen Dauerton. Was tust du?',
    options: {
      a: 'Nichts: Das ist der monatliche Test.',
      b: 'Ich suche sofort Schutz.',
      c: 'Ich rufe die 112 an, um zu erfahren, was los ist.',
    },
    explanation:
      'Der Test findet an jedem ersten Montag im Monat um 12 Uhr mittags statt: ein einminütiger Dauerton. Dauert er länger oder kommt er zu einer anderen Zeit, informier dich.',
  },
  'sirene-alerte': {
    prompt: 'Die Sirene gibt zwei Minuten lang einen Dauerton, immer in derselben Höhe. Das ist…',
    options: {
      a: 'Das Ende eines Alarms.',
      b: 'Das Warnsignal: Ich bringe mich in Sicherheit und informiere mich.',
      c: 'Ein unwichtiger Test.',
    },
    explanation:
      'Zwei Minuten Dauerton: Bring dich in Sicherheit, informier dich über LU-Alert, Radio oder Fernsehen und folge dann den Anweisungen.',
  },
  'sirene-alarme': {
    prompt: 'Ein auf- und abschwellender Ton, ohne Pause, eine Minute lang. Was tun?',
    options: {
      a: 'Rausgehen und nachsehen, was draußen los ist.',
      b: 'Meinen Alltag fortsetzen: Die Gefahr ist vorbei.',
      c: 'So schnell wie möglich Schutz suchen, in einem stabilen, geschlossenen Gebäude.',
    },
    explanation:
      'Das ist das nationale Alarmsignal. Die Entwarnung klingt ähnlich, hat aber kurze Pausen.',
  },
  'sirene-doute': {
    prompt: 'Eine Sirene ertönt und du bist unsicher. Was ist das richtige Verhalten?',
    options: {
      a: 'Das Radio einschalten oder LU-Alert öffnen.',
      b: 'Die 112 oder die 113 anrufen und fragen.',
      c: 'In den sozialen Netzwerken fragen.',
    },
    explanation:
      'Die Nummern 112 und 113 müssen für Notfälle frei bleiben. Radio und LU-Alert sagen, was los ist.',
  },
  'vigilance-violet': {
    prompt: 'Welche Warnstufe bedeutet „unmittelbare Gefahr, sofort handeln“?',
    options: {
      a: 'Stufe Rot.',
      b: 'Stufe Violett.',
      c: 'Stufe Orange.',
    },
    explanation:
      'Gelb, Orange und Rot begleiten eine Lage, die sich nach und nach verschlimmert. Violett dagegen meldet eine ganz nahe Gefahr.',
  },
  radio: {
    prompt: 'Kein Strom und kein Mobilfunknetz mehr. Wo findest du die offiziellen Informationen?',
    options: {
      a: 'In Nachrichten, die Freunde weiterleiten.',
      b: 'Im Radio: RTL oder radio 100,7, mit einem Batterie- oder Kurbelradio oder dem Autoradio.',
      c: 'Nirgends: Man muss warten, bis der Strom zurückkommt.',
    },
    explanation:
      'Das Radio funktioniert oft weiter, wenn alles andere ausgefallen ist. Es ist der zuverlässigste Kanal.',
  },
  monoxyde: {
    prompt:
      'Das Haus kühlt ab. Darf man im Wohnzimmer mit einem Grill oder einem Feuerkorb heizen?',
    options: {
      a: 'Ja, wenn man das Fenster ein wenig öffnet.',
      b: 'Ja, höchstens eine Stunde lang.',
      c: 'Niemals: Sie erzeugen Kohlenmonoxid, ein unsichtbares und tödliches Gas.',
    },
    explanation:
      'Geräte für draußen gehören niemals nach drinnen. Um die Wärme zu halten: Fensterläden zu, Pullover und Decken.',
  },
  rumeur: {
    prompt:
      'Eine Nachricht behauptet, das Leitungswasser sei vergiftet, ohne zu sagen, woher sie kommt. Was tust du?',
    options: {
      a: 'Ich teile sie schnell, um meine Angehörigen zu warnen.',
      b: 'Ich prüfe bei offiziellen Quellen nach, bevor ich etwas glaube oder teile.',
      c: 'Ich glaube sie, wenn ein Foto dabei ist.',
    },
    explanation:
      'Wer hat sie veröffentlicht, wann, woher kommt sie, sagen andere zuverlässige Quellen dasselbe? Ein Bild kann gefälscht sein. Ohne offizielle Bestätigung teilt man nichts.',
  },
  iode: {
    prompt: 'Wann nimmt man die Jodtabletten?',
    options: {
      a: 'Nur, wenn die Behörden es verlangen.',
      b: 'Sobald man von einem Unfall hört, zur Vorsicht.',
      c: 'Einmal im Jahr, um geschützt zu sein.',
    },
    explanation:
      'Niemals vorher und niemals zur Vorsicht. Bewahre sie im Kit auf und warte auf die Anweisung.',
  },
  cyber: {
    prompt: 'Eine Nachricht „deiner Bank“ fragt per Link nach deinem Code. Was tun?',
    options: {
      a: 'Klicken und schnell antworten, damit nichts gesperrt wird.',
      b: 'Auf die Nachricht antworten und fragen, ob sie echt ist.',
      c: 'Nicht klicken und die Bank selbst über ihre offiziellen Kontaktdaten kontaktieren.',
    },
    explanation:
      'Man gibt niemals Passwörter oder Codes weiter. Im Zweifel kontaktiert man die Stelle selbst.',
  },
};
