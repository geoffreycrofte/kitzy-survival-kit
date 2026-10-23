import type { QuizQuestion } from '../quiz';

/** Questions tirées du guide de Kitzy (lui-même résumé du guide officiel Lëtz prepare!). */
export const QUIZ: readonly QuizQuestion[] = [
  {
    id: 'sirene-test',
    prompt:
      'Premier lundi du mois, midi : la sirène sonne d’un son continu pendant une minute. Que fais-tu ?',
    options: [
      { id: 'a', text: 'Rien : c’est le test mensuel.' },
      { id: 'b', text: 'Je me mets à l’abri tout de suite.' },
      { id: 'c', text: 'J’appelle le 112 pour savoir ce qui se passe.' },
    ],
    answer: 'a',
    explanation:
      'Le test a lieu chaque premier lundi du mois à midi : un son continu d’une minute. S’il dure plus longtemps, ou à un autre moment, informe-toi.',
    guide: 'sirenes',
  },
  {
    id: 'sirene-alerte',
    prompt:
      'La sirène émet un son continu, toujours à la même hauteur, pendant deux minutes. C’est…',
    options: [
      { id: 'a', text: 'La fin d’une alarme.' },
      { id: 'b', text: 'Le signal d’alerte : je me mets en sécurité et je m’informe.' },
      { id: 'c', text: 'Un essai sans importance.' },
    ],
    answer: 'b',
    explanation:
      'Deux minutes de son continu : mets-toi en sécurité, informe-toi avec LU-Alert, la radio ou la télévision, puis suis les consignes.',
    guide: 'sirenes',
  },
  {
    id: 'sirene-alarme',
    prompt: 'Un son qui monte et qui descend, sans arrêt, pendant une minute. Que faire ?',
    options: [
      { id: 'a', text: 'Sortir voir ce qui se passe dehors.' },
      { id: 'b', text: 'Reprendre mes activités : le danger est passé.' },
      { id: 'c', text: 'Me mettre à l’abri au plus vite, dans un bâtiment solide et fermé.' },
    ],
    answer: 'c',
    explanation:
      'C’est le signal national d’alarme. La fin d’alarme ressemble, mais elle est coupée par de courtes pauses.',
    guide: 'sirenes',
  },
  {
    id: 'sirene-doute',
    prompt: 'Une sirène sonne et tu as un doute. Quel est le bon réflexe ?',
    options: [
      { id: 'a', text: 'Allumer la radio ou ouvrir LU-Alert.' },
      { id: 'b', text: 'Appeler le 112 ou le 113 pour demander.' },
      { id: 'c', text: 'Demander sur les réseaux sociaux.' },
    ],
    answer: 'a',
    explanation:
      'Les lignes 112 et 113 doivent rester libres pour les urgences. La radio et LU-Alert disent ce qui se passe.',
    guide: 'sirenes',
  },
  {
    id: 'vigilance-violet',
    prompt: 'Quel niveau de vigilance veut dire « danger imminent, il faut agir tout de suite » ?',
    options: [
      { id: 'a', text: 'Le niveau rouge.' },
      { id: 'b', text: 'Le niveau violet.' },
      { id: 'c', text: 'Le niveau orange.' },
    ],
    answer: 'b',
    explanation:
      'Jaune, orange et rouge suivent une situation qui s’aggrave peu à peu. Le violet, lui, signale un danger tout proche.',
    guide: 'alerte-lu-alert',
  },
  {
    id: 'radio',
    prompt: 'Plus de courant ni de réseau mobile. Où trouver les informations officielles ?',
    options: [
      { id: 'a', text: 'Sur les messages transférés par des amis.' },
      {
        id: 'b',
        text: 'À la radio : RTL ou radio 100,7, avec une radio à piles, à manivelle ou celle de la voiture.',
      },
      { id: 'c', text: 'Nulle part : il faut attendre le retour du courant.' },
    ],
    answer: 'b',
    explanation:
      'La radio continue souvent de fonctionner quand tout le reste est coupé. C’est le canal le plus solide.',
    guide: 'alerte-lu-alert',
  },
  {
    id: 'monoxyde',
    prompt:
      'La maison se refroidit. Peut-on se chauffer avec un barbecue ou un brasero dans le salon ?',
    options: [
      { id: 'a', text: 'Oui, si on ouvre un peu la fenêtre.' },
      { id: 'b', text: 'Oui, pendant une heure maximum.' },
      {
        id: 'c',
        text: 'Jamais : ils produisent du monoxyde de carbone, un gaz invisible et mortel.',
      },
    ],
    answer: 'c',
    explanation:
      'Les appareils prévus pour l’extérieur ne vont jamais à l’intérieur. Pour garder la chaleur : volets fermés, pulls et couvertures.',
    guide: 'coupure-electricite',
  },
  {
    id: 'rumeur',
    prompt:
      'Un message dit que l’eau du robinet est empoisonnée, sans dire d’où il vient. Que fais-tu ?',
    options: [
      { id: 'a', text: 'Je le partage vite pour prévenir mes proches.' },
      {
        id: 'b',
        text: 'Je vérifie auprès des sources officielles avant de croire ou de partager.',
      },
      { id: 'c', text: 'Je le crois s’il contient une photo.' },
    ],
    answer: 'b',
    explanation:
      'Qui l’a publié, quand, d’où vient-il, d’autres sources fiables le disent-elles ? Une image peut être fabriquée. Sans confirmation officielle, on ne partage pas.',
    guide: 'bien-s-informer',
  },
  {
    id: 'iode',
    prompt: 'Quand prendre les comprimés d’iode ?',
    options: [
      { id: 'a', text: 'Seulement quand les autorités le demandent.' },
      { id: 'b', text: 'Dès qu’on entend parler d’un accident, par précaution.' },
      { id: 'c', text: 'Une fois par an, pour être protégé.' },
    ],
    answer: 'a',
    explanation:
      'Jamais avant, et jamais par précaution. Garde-les dans le kit et attends la consigne.',
    guide: 'accident-nucleaire',
  },
  {
    id: 'cyber',
    prompt: 'Un message de « ta banque » te demande ton code par lien. Que faire ?',
    options: [
      { id: 'a', text: 'Cliquer et répondre vite pour éviter un blocage.' },
      { id: 'b', text: 'Répondre au message pour demander si c’est vrai.' },
      {
        id: 'c',
        text: 'Ne pas cliquer et contacter moi-même la banque avec ses coordonnées officielles.',
      },
    ],
    answer: 'c',
    explanation:
      'On ne donne jamais ses mots de passe ni ses codes. En cas de doute, on contacte soi-même l’organisme.',
    guide: 'a-quoi-se-preparer',
  },
];
