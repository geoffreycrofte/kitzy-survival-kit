/** Deutsche Übersetzung der 72-Stunden-Simulation. */
import type { ContentTranslation } from '../../types';

export const simulation: ContentTranslation['simulation'] = {
  steps: {
    'jour1-travail': {
      when: 'Tag 1, 10 Uhr',
      story: [
        'Ein Montag im Januar. Du bist bei der Arbeit, als alles ausgeht: Bildschirme, Licht, Heizung.',
        'Dein Handy zeigt noch Netz an, aber Anrufe kommen nicht durch: Die Leitungen sind überlastet.',
      ],
      question: 'Wie erfährst du, was los ist?',
      options: {
        a: {
          text: 'Ich rufe die 112 an und frage.',
          feedback:
            'Die 112 muss für Notfälle frei bleiben. Die Informationen kommen über LU-Alert und das Radio.',
        },
        b: {
          text: 'Ich schaue auf LU-Alert und höre Radio.',
          feedback:
            'Gut gemacht. Eine LU-Alert-Nachricht empfiehlt genau das: RTL oder radio 100,7 hören.',
        },
        c: {
          text: 'Ich vertraue der ersten Nachricht, die in einem Messenger weitergeleitet wird.',
          feedback:
            'In einer Krise sind viele Nachrichten falsch. Man prüft zuerst bei offiziellen Quellen nach.',
        },
      },
    },
    'jour1-retour': {
      when: 'Tag 1, 15 Uhr',
      story: [
        'Es fahren keine Züge mehr. Eine Kollegin bietet an, dich mit dem Auto nach Hause zu bringen.',
        'Der Rest des Haushalts ist vielleicht in der Schule oder bei der Arbeit, ohne dich erreichen zu können.',
      ],
      question: 'Wie findet ihr wieder zusammen?',
      options: {
        a: {
          text: 'Alle gehen zu dem Treffpunkt, den wir gemeinsam gewählt haben.',
          feedback:
            'Genau dafür ist der Notfallplan da: ein Ort, den alle kennen, und jemand, der die Kinder abholt.',
        },
        b: {
          text: 'Ich warte am Bahnhof, bis die Züge wieder fahren.',
          feedback:
            'Niemand weiß, wie lange das dauert. Besser nach Hause gehen und zum Haushalt zurückkehren.',
        },
        c: {
          text: 'Ich versuche immer wieder, alle anzurufen.',
          feedback:
            'Die Leitungen sind überlastet und der Akku wird leer. Ein vorher vereinbarter Treffpunkt erspart das.',
        },
      },
    },
    'jour1-soir': {
      when: 'Tag 1, 18 Uhr',
      story: [
        'Im Januar wird es früh dunkel. Zu Hause ist alles finster, und der Elektroherd funktioniert nicht mehr.',
      ],
      question: 'Wie hast du Licht und eine warme Mahlzeit?',
      options: {
        a: {
          text: 'Ich hole den Grill ins Wohnzimmer.',
          feedback:
            'Niemals: Ein Grill oder ein Feuerkorb drinnen erzeugt Kohlenmonoxid, ein unsichtbares und tödliches Gas.',
        },
        b: {
          text: 'Stirnlampe, und der Kocher in einem gut gelüfteten Raum.',
          feedback:
            'Perfekt. Eine Lampe für jede Person und eine Konserve, die man auch kalt essen kann, falls das Gas ausgeht.',
        },
        c: {
          text: 'Kerzen in allen Zimmern.',
          feedback:
            'Kerzen helfen zur Not, aber eine Lampe ist sicherer. Lass eine brennende Kerze niemals unbeaufsichtigt.',
        },
      },
    },
    'jour2-eau': {
      when: 'Tag 2',
      story: [
        'Beim Aufwachen kommt kein Wasser mehr aus dem Hahn. Das Haus ist in der Nacht abgekühlt.',
      ],
      question: 'Wie kommst du durch den Tag?',
      options: {
        a: {
          text: 'Ich warte, bis das Wasser zurückkommt, bevor ich mich organisiere.',
          feedback: 'Niemand weiß, wann es zurückkommt. Besser gleich deinen Vorrat einteilen.',
        },
        b: {
          text: 'Ich trinke von meinem Vorrat, schließe die Fensterläden und hole Pullover und Decken hervor.',
          feedback: 'Ja. Rechne mit etwa 3 Litern pro Person und Tag und halte die Wärme drinnen.',
        },
      },
    },
    'jour2-rumeur': {
      when: 'Tag 2, 14 Uhr',
      story: [
        'Eine Nachricht macht die Runde: „Das Leitungswasser ist vergiftet, weitersagen!“ Es gibt weder Quelle noch Datum.',
      ],
      question: 'Was machst du mit dieser Nachricht?',
      options: {
        a: {
          text: 'Ich teile sie, um meine Angehörigen zu warnen.',
          feedback:
            'Auch nicht, um zu „warnen“: Man teilt keine Warnung, die keine offizielle Quelle bestätigt.',
        },
        b: {
          text: 'Ich prüfe im Radio oder auf LU-Alert nach und teile nur Offizielles.',
          feedback:
            'Genau. Wer hat sie veröffentlicht, wann, woher kommt sie? Sagen andere zuverlässige Quellen dasselbe?',
        },
      },
    },
    'jour3-entraide': {
      when: 'Tag 3',
      story: [
        'Das Viertel organisiert sich. Die Gemeinde öffnet einen beheizten Saal, um etwas Warmes zu trinken, sich zu informieren und Handys aufzuladen.',
        'Deine ältere Nachbarin lebt allein. Du hast sie seit Beginn des Stromausfalls nicht gesehen.',
      ],
      question: 'Was tust du?',
      options: {
        a: {
          text: 'Ich klopfe bei ihr und frage, wie es ihr geht.',
          feedback:
            'Das ist der Kern der gegenseitigen Hilfe: zuerst die Menschen, die allein oder verletzlich sind.',
        },
        b: {
          text: 'Ich störe sie nicht: Jemand anderes wird sich darum kümmern.',
          feedback:
            'Die Rettungskräfte können nicht überall sein. Ein aufmerksamer Nachbar macht oft den Unterschied.',
        },
      },
    },
  },
  checks: {
    'task-lu-alert': 'Die LU-Alert-App installiert',
    'item-crank-radio': 'Ein Batterie- oder Kurbelradio',
    'plan-meeting': 'Ein Treffpunkt in deinem Plan notiert',
    'plan-urgence': 'Der Schritt „Im Notfall“ des Plans abgeschlossen',
    'essential-light': 'Licht (Glühwürmchen leuchtet)',
    'item-camping-stove': 'Ein Campingkocher',
    'essential-food': 'Mahlzeiten für 72 Std. (Glühwürmchen leuchtet)',
    'essential-water': 'Wasser für 72 Std. (Glühwürmchen leuchtet)',
    'essential-warmth': 'Wärme (Glühwürmchen leuchtet)',
    'item-power-bank': 'Eine aufgeladene Powerbank',
    'plan-quartier': 'Die Menschen, denen du helfen willst, in deinem Plan notiert',
  },
};
