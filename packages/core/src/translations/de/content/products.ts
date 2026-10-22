/** Kaufempfehlungen auf Deutsch: nur Bezeichnung und Begründung. */
import type { ContentTranslation } from '../../types';

export const products: ContentTranslation['products'] = {
  // ── Wasser ──
  'jerrycan-10l': {
    name: 'Lebensmittelechter Wasserkanister, 10 L, mit Hahn',
    why: 'Am einfachsten, um Leitungswasser aufzubewahren und ohne Verlust auszugießen.',
  },
  'water-bag-foldable': {
    name: 'Faltbarer Wasserkanister, 10 bis 20 L',
    why: 'Braucht leer kaum Platz und ist bei einer Warnung sofort gefüllt.',
  },
  'purification-tablets': {
    name: 'Tabletten zur Wasserentkeimung',
    why: 'Leicht und günstig: So wird Leitungswasser trinkbar, falls es verunreinigt ist.',
  },
  'water-filter': {
    name: 'Tragbarer Wasserfilter (0,1 Mikron)',
    why: 'Filtert Hunderte Liter ohne Chemie; gegen Viren mit Tabletten ergänzen.',
  },
  // ── Kochen ──
  'stove-cartridge': {
    name: 'Kartuschen-Campingkocher, einfach und stabil',
    why: 'Zum Erhitzen von Wasser und Konserven. Nur draußen oder auf einem offenen Balkon benutzen.',
  },
  'stove-butane-case': {
    name: 'Tragbarer Butan-Campingkocher im Koffer',
    why: 'Sehr stabil für einen Topf, praktisch, um mehrere Tage zu kochen.',
  },
  'gas-cartridges-match': {
    name: 'Passende Kartuschen für deinen Campingkocher',
    why: 'Prüf den genauen Typ (mit Ventil, Stechkartusche oder Butan-Stabkartusche), der auf deinem Kocher steht.',
  },
  'can-opener': {
    name: 'Manueller Dosenöffner mit Schneidrad',
    why: 'Unverzichtbar, wenn die Konserven keinen Aufreißdeckel haben.',
  },
  // ── Licht und Energie ──
  'flashlight-aa': {
    name: 'LED-Taschenlampe mit AA-Batterien',
    why: 'AA-Batterien gibt es überall, und sie halten sich lange.',
  },
  'headlamp-aaa': {
    name: 'Stirnlampe mit AAA-Batterien, etwa 200 Lumen',
    why: 'Die Hände bleiben frei; die Batterien wechselst du ohne Steckdose.',
  },
  'headlamp-hybrid': {
    name: 'Per USB-C aufladbare Stirnlampe, die auch Batterien nimmt',
    why: 'Im Alltag aufladbar und bei Stromausfall weiterhin mit Batterien nutzbar.',
  },
  'powerbank-20k': {
    name: 'Powerbank mit 20.000 mAh',
    why: 'Lädt ein Handy etwa viermal auf. Denk daran, sie alle drei Monate nachzuladen.',
  },
  powerstation: {
    name: 'Tragbare Powerstation (etwa 250 Wh)',
    why: 'Versorgt Handys, Radio und Lampen mehrere Tage lang; per Solarpanel aufladbar.',
  },
  'batteries-alkaline': {
    name: 'Alkaline-Batterien AA und AAA, lange haltbar',
    why: 'Wähl ein weit entferntes Haltbarkeitsdatum: Sie lagern lange im Vorrat.',
  },
  'batteries-lithium': {
    name: 'Lithium-Batterien AA (nicht aufladbar)',
    why: 'Bis zu 20 Jahre haltbar und kältebeständig; ideal für einen Vorrat, der auf dem Dachboden steht.',
  },
  'led-lantern': {
    name: 'LED-Laterne mit Batterien',
    why: 'Beleuchtet einen ganzen Raum und ist sicherer als eine Kerze.',
  },
  'solar-panel-21w': {
    name: 'Faltbares USB-Solarpanel, etwa 20 W',
    why: 'Lädt tagsüber eine Powerbank oder ein Handy, auch ohne Strom.',
  },
  // ── Wärme ──
  'sleeping-bag-comfort': {
    name: 'Schlafsack, Komforttemperatur um 10 °C',
    why: 'Reicht im Winter in einem ungeheizten Haus, zusammen mit einer Decke.',
  },
  'sleeping-bag-winter': {
    name: 'Schlafsack, Komforttemperatur um 0 °C',
    why: 'Für Häuser, die schnell auskühlen, oder für Menschen, die leicht frieren.',
  },
  'emergency-blanket': {
    name: 'Rettungsdecken (Set)',
    why: 'Winzig und leicht: eine pro Person in jedem Rucksack.',
  },
  // ── Gesundheit ──
  'first-aid-basic': {
    name: 'Erste-Hilfe-Set für die Familie',
    why: 'Prüf den Inhalt beim Kauf und ergänze ihn mit deinen gewohnten Medikamenten.',
  },
  'first-aid-din': {
    name: 'Erste-Hilfe-Koffer nach DIN 13157',
    why: 'Der Inhalt eines Betriebsverbandkastens: vollständiger und genormt.',
  },
  ffp2: {
    name: 'FFP2-Masken mit CE-Kennzeichnung (EN 149)',
    why: 'Nützlich bei Rauch, Staub oder einer Epidemie.',
  },
  // ── Informiert bleiben ──
  'radio-batteries': {
    name: 'UKW-Radio mit Batterien',
    why: 'Einfach und zuverlässig, um RTL und Radio 100,7 zu hören.',
  },
  'radio-crank': {
    name: 'Kurbel- und Solarradio mit Lampe und USB-Ausgang',
    why: 'Funktioniert ohne Batterien; lädt im Notfall auch das Handy ein wenig auf.',
  },
  'radio-dab': {
    name: 'DAB+- und UKW-Radio mit Kurbel und eingebautem Akku',
    why: 'Zusätzlich digitaler Empfang, für klaren Klang überall in Luxemburg.',
  },
  // ── Werkzeug ──
  'pocket-knife': {
    name: 'Taschenmesser mit mehreren Funktionen und Dosenöffner',
    why: 'Klinge, Schere und Dosenöffner in einem einzigen Gegenstand.',
  },
  multitool: {
    name: 'Multitool mit arretierbaren Werkzeugen',
    why: 'Zange, Schraubenzieher und Klinge feststellbar: robust für kleine Reparaturen.',
  },
  'duct-tape': {
    name: 'Gewebeklebeband (Duct Tape)',
    why: 'Repariert fast alles, von der Plane bis zum Schuh.',
  },
  paracord: {
    name: 'Paracord 550, 30 m',
    why: 'Dünn und sehr reißfest: zum Festbinden, Aufspannen und Reparieren.',
  },
  'smoke-detector': {
    name: 'Rauchmelder nach EN 14604, 10-Jahres-Batterie',
    why: 'Mindestens einer pro Stockwerk; die langlebige Batterie verhindert, dass du den Wechsel vergisst.',
  },
  'co-detector': {
    name: 'Kohlenmonoxidmelder nach EN 50291',
    why: 'Unverzichtbar, wenn du während eines Stromausfalls ein Zusatzheizgerät oder einen Ofen benutzt.',
  },
  'fire-blanket': {
    name: 'Löschdecke nach EN 1869',
    why: 'Erstickt einen beginnenden Topfbrand in wenigen Sekunden.',
  },
  extinguisher: {
    name: 'Schaumfeuerlöscher, 2 kg oder 2 L, nach EN 3',
    why: 'Für Küche und Wohnzimmer; regelmäßig prüfen lassen.',
  },
  whistle: {
    name: 'Notfallpfeife ohne Kugel',
    why: 'Ist von Weitem zu hören und blockiert nicht, auch nicht im nassen Zustand.',
  },
  // ── Der Rucksack ──
  'backpack-30l': {
    name: 'Rucksack mit 30 L und Hüftgurt',
    why: 'Groß genug für 72 Stunden, leicht genug für lange Fußwege.',
  },
  'dry-bags': {
    name: 'Wasserdichte Packsäcke in verschiedenen Größen',
    why: 'Schützen Dokumente, Kleidung und Elektronik vor Regen.',
  },
};
