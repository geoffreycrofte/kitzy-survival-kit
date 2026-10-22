/** Quiz op Lëtzebuergesch. */
import type { ContentTranslation } from '../../types';

export const quiz: ContentTranslation['quiz'] = {
  'sirene-test': {
    prompt:
      'Éischte Méindeg vum Mount, 12 Auer mëttes: d’Sirene mécht eng Minutt laang en duerchgoenden Toun. Wat méchs du?',
    options: {
      a: 'Näischt: dat ass den Test vum Mount.',
      b: 'Ech sichen direkt Schutz.',
      c: 'Ech ruffen den 112 un, fir ze wëssen, wat lass ass.',
    },
    explanation:
      'Den Test ass all éischte Méindeg vum Mount um 12 Auer mëttes: en duerchgoenden Toun vun enger Minutt. Wann e méi laang dauert, oder zu enger anerer Zäit kënnt, informéier dech.',
  },
  'sirene-alerte': {
    prompt:
      'D’Sirene mécht zwou Minutte laang en duerchgoenden Toun, ëmmer op der selwechter Héicht. Dat ass…',
    options: {
      a: 'D’Enn vun engem Alarm.',
      b: 'D’Warnsignal: ech brénge mech a Sécherheet an informéiere mech.',
      c: 'En Test ouni Bedeitung.',
    },
    explanation:
      'Zwou Minutten duerchgoenden Toun: bréng dech a Sécherheet, informéier dech iwwer LU-Alert, de Radio oder de Fernseh, a folleg dann den Uweisungen.',
  },
  'sirene-alarme': {
    prompt: 'En Toun, deen ouni Paus erop an erof geet, eng Minutt laang. Wat maachen?',
    options: {
      a: 'Erausgoen a kucken, wat dobausse lass ass.',
      b: 'Mat menge gewinnten Aktivitéite weidermaachen: d’Gefor ass eriwwer.',
      c: 'Sou séier wéi méiglech Schutz sichen, an engem stabillen, zouene Gebai.',
    },
    explanation:
      'Dat ass dat nationalt Alarmsignal. D’Enn vum Alarm kléngt ähnlech, mee et gëtt vu kuerze Pausen ënnerbrach.',
  },
  'sirene-doute': {
    prompt: 'Eng Sirene geet an du bass net sécher. Wat ass de richtege Reflex?',
    options: {
      a: 'De Radio umaachen oder LU-Alert opmaachen.',
      b: 'Den 112 oder den 113 uruffen, fir ze froen.',
      c: 'Op de soziale Netzwierker froen.',
    },
    explanation:
      'D’Linnen 112 an 113 musse fir Noutfäll fräi bleiwen. De Radio an LU-Alert soen, wat lass ass.',
  },
  'vigilance-violet': {
    prompt: 'Wéi e Vigilanzniveau bedeit „imminent Gefor, du muss direkt handelen“?',
    options: {
      a: 'De roude Niveau.',
      b: 'De vioulette Niveau.',
      c: 'Den orange Niveau.',
    },
    explanation:
      'Giel, orange a rout begleeden eng Situatioun, déi sech lues a lues verschlechtert. Vioulett weist dogéint op eng Gefor, déi ganz no ass.',
  },
  radio: {
    prompt: 'Kee Stroum a keen Handysnetz méi. Wou fënns du déi offiziell Informatiounen?',
    options: {
      a: 'An de Messagen, déi Frënn weiderschécken.',
      b: 'Am Radio: RTL oder radio 100,7, mat engem Radio mat Batterien, mat Kurbel oder am Auto.',
      c: 'Néierens: du muss waarden, bis de Stroum erëm do ass.',
    },
    explanation:
      'De Radio funktionéiert dacks weider, wann alles anescht ausgefall ass. Et ass de robusteste Kanal.',
  },
  monoxyde: {
    prompt:
      'D’Haus gëtt kal. Däerf een sech mat engem Barbecue oder engem Feierkuerf an der Stuff hëtzen?',
    options: {
      a: 'Jo, wann een d’Fënster e bëssen opmécht.',
      b: 'Jo, awer héchstens eng Stonn laang.',
      c: 'Ni: si produzéiere Kuelemonoxid, e Gas, deen een net gesäit an deen déidlech ass.',
    },
    explanation:
      'Apparater fir dobausse kommen ni eran. Fir d’Wäermt ze halen: Luede zou, Pulloveren an Decken.',
  },
  rumeur: {
    prompt:
      'E Message seet, d’Waasser aus dem Krunn wär vergëft, ouni ze soen, vu wou en hierkënnt. Wat méchs du?',
    options: {
      a: 'Ech deelen e séier, fir meng Léiwen ze warnen.',
      b: 'Ech iwwerpréiwen et bei offizielle Quellen, ier ech et gleewen oder deelen.',
      c: 'Ech gleewen et, wann eng Foto dobäi ass.',
    },
    explanation:
      'Wien huet en publizéiert, wéini, vu wou kënnt en, soen aner zouverlässeg Quellen datselwecht? E Bild ka gefälscht sinn. Ouni offiziell Bestätegung gëtt näischt gedeelt.',
  },
  iode: {
    prompt: 'Wéini soll een d’Jodtabletten huelen?',
    options: {
      a: 'Nëmmen, wann d’Autoritéiten dat froen.',
      b: 'Soubal ee vun engem Accident héiert, aus Virsiicht.',
      c: 'Eemol am Joer, fir geschützt ze sinn.',
    },
    explanation: 'Ni virdrun, an ni aus Virsiicht. Haal se am Kit a waard op d’Uweisung.',
  },
  cyber: {
    prompt: 'E Message vun „denger Bank“ freet dech iwwer e Link no dengem Code. Wat maachen?',
    options: {
      a: 'Klicken a séier äntweren, fir datt näischt gespaart gëtt.',
      b: 'Op de Message äntweren a froen, ob et stëmmt.',
      c: 'Net klicken an d’Bank selwer iwwer hir offiziell Kontaktdate kontaktéieren.',
    },
    explanation:
      'Ee gëtt ni seng Passwierder oder seng Coden eraus. Am Zweiwelsfall kontaktéiert een d’Organisatioun selwer.',
  },
};
