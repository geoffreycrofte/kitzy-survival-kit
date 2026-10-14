/**
 * Profil Luxembourg : faits officiels tirés de « Mon guide 72h d’autonomie » (Lëtz prepare!).
 */
import type { CountryProfile } from '../../country';

export const LU: CountryProfile = {
  code: 'lu',
  name: 'Luxembourg',
  source: {
    name: 'Lëtz prepare!',
    publisher: 'Gouvernement du Grand-Duché de Luxembourg (HCPN)',
    url: 'https://letzprepare.public.lu/fr/guide.html',
  },
  emergencyNumbers: [
    {
      number: '112',
      label: 'Secours (CGDIS) : pompiers et ambulance',
      note: 'À n’utiliser qu’en cas de réelle urgence, jamais à titre d’essai.',
    },
    {
      number: '113',
      label: 'Police Lëtzebuerg',
      note: 'À n’utiliser qu’en cas de réelle urgence, jamais à titre d’essai.',
    },
    {
      number: '8002 7788',
      label: 'Numéro vert de crise',
      note: 'Peut être activé en cas de crise pour informer la population.',
    },
  ],
  alertSystem: {
    name: 'LU-Alert',
    url: 'https://lu-alert.lu',
    appNote:
      'Télécharge l’application gratuite LU-Alert et règle les notifications pour les zones qui te concernent.',
  },
  sirenTest: {
    weekday: 1,
    nth: 1,
    time: '12:00',
    description: 'Test des sirènes chaque premier lundi du mois à midi',
  },
  crisisRadios: ['RTL', 'radio 100,7'],
  usefulSites: [
    {
      label: 'lu-alert.lu',
      url: 'https://lu-alert.lu',
      description: 'Le système officiel d’alerte de la population au Luxembourg.',
    },
    {
      label: 'infocrise.lu',
      url: 'https://infocrise.lu',
      description: 'Les informations officielles du gouvernement pendant une crise.',
    },
    {
      label: 'letzprepare.lu',
      url: 'https://letzprepare.lu',
      description: 'Le guide officiel pour se préparer à 72 heures d’autonomie.',
    },
    {
      label: '112.lu',
      url: 'https://112.lu',
      description: 'Les urgences et les services de garde : médecins, pharmacies, dentistes.',
    },
    {
      label: 'police.lu',
      url: 'https://police.lu',
      description: 'Le site de la Police grand-ducale et ses conseils de prévention.',
    },
    {
      label: 'inondations.lu',
      url: 'https://inondations.lu',
      description: 'Les niveaux des cours d’eau et les alertes de crue en temps réel.',
    },
    {
      label: 'eau.geoportail.lu',
      url: 'https://eau.geoportail.lu',
      description: 'Les cartes des zones inondables, pour savoir si ton logement est exposé.',
    },
    {
      label: 'seveso.lu',
      url: 'https://seveso.lu',
      description: 'Les sites industriels à risque et les bons réflexes en cas d’accident.',
    },
    {
      label: 'meteolux.lu',
      url: 'https://meteolux.lu',
      description: 'Les prévisions et les vigilances météo officielles du pays.',
    },
    {
      label: 'cours.cgdis.lu',
      url: 'https://cours.cgdis.lu',
      description: 'Les inscriptions aux cours de premiers secours du CGDIS.',
    },
    {
      label: 'santesecu.public.lu',
      url: 'https://santesecu.public.lu',
      description: 'La sécurité sanitaire, dont la radioprotection et les comprimés d’iode.',
    },
    {
      label: 'cybersecurity.lu',
      url: 'https://cybersecurity.lu',
      description: 'Le portail national de la cybersécurité, ses conseils et ses alertes.',
    },
    {
      label: 'cyberfraud.lu',
      url: 'https://cyberfraud.lu',
      description: 'Reconnaître et signaler les arnaques en ligne.',
    },
    {
      label: 'bee-secure.lu',
      url: 'https://bee-secure.lu',
      description:
        'Les conseils pour un usage sûr d’internet, avec une helpline gratuite au 8002 1234.',
    },
  ],
};
