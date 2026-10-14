/**
 * Profil pays (§ 12.4 du plan) : tout ce qui change d'un pays à l'autre.
 */

export interface EmergencyNumber {
  number: string;
  label: string;
  note?: string;
}

export interface CountryProfile {
  /** Code ISO 3166-1 alpha-2 en minuscules. */
  code: string;
  name: string;
  /** Source officielle de la liste. */
  source: { name: string; publisher: string; url: string };
  emergencyNumbers: EmergencyNumber[];
  alertSystem: { name: string; url: string; appNote?: string };
  /** Test régulier des sirènes, pour le rituel mensuel. */
  sirenTest?: {
    /** 1 = lundi … 7 = dimanche */
    weekday: number;
    /** Rang dans le mois : 1 = premier */
    nth: number;
    /** Heure locale HH:MM */
    time: string;
    description: string;
  };
  crisisRadios: string[];
  usefulSites: { label: string; url: string; description: string }[];
}
