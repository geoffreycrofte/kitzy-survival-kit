/** Simulatioun 72 Stonnen op Lëtzebuergesch. */
import type { ContentTranslation } from '../../types';

export const simulation: ContentTranslation['simulation'] = {
  steps: {
    'jour1-travail': {
      when: 'Dag 1, 10 Auer',
      story: [
        'E Méindeg am Januar. Du bass op der Aarbecht, wéi op eemol alles ausgeet: d’Schiermer, d’Liicht, d’Heizung.',
        'Däin Handy weist nach Netz un, mee d’Uriff ginn net duerch: d’Linne sinn iwwerlaascht.',
      ],
      question: 'Wéi fënns du eraus, wat lass ass?',
      options: {
        a: {
          text: 'Ech ruffen den 112 un, fir ze froen.',
          feedback:
            'Den 112 muss fir Noutfäll fräi bleiwen. D’Informatioune kommen iwwer LU-Alert an de Radio.',
        },
        b: {
          text: 'Ech kucken op LU-Alert a lauschteren de Radio.',
          feedback:
            'Gutt esou. E LU-Alert-Message rot genee dat: RTL oder radio 100,7 lauschteren.',
        },
        c: {
          text: 'Ech gleewen deen éischte Message, deen an engem Chat weidergeschéckt gëtt.',
          feedback:
            'Während enger Kris si vill Message falsch. Ee kuckt als Éischt bei offizielle Quellen no.',
        },
      },
    },
    'jour1-retour': {
      when: 'Dag 1, 15 Auer',
      story: [
        'Et fiert keen Zuch méi. Eng Kolleegin bitt dir un, dech mam Auto heemzebréngen.',
        'De Rescht vum Haushalt ass vläicht an der Schoul oder op der Aarbecht, ouni dech z’erreechen.',
      ],
      question: 'Wéi fannt dir iech erëm?',
      options: {
        a: {
          text: 'Jiddereen geet bei den Treffpunkt, deen mir zesumme gewielt hunn.',
          feedback:
            'Genee dofir ass den Noutfallplang do: eng Plaz, déi jiddereen kennt, an een, deen d’Kanner ofhëlt.',
        },
        b: {
          text: 'Ech waarden an der Gare, bis d’Zich erëm fueren.',
          feedback:
            'Keen weess, wéi laang dat dauert. Et ass besser, heemzegoen an den Haushalt erëmzefannen.',
        },
        c: {
          text: 'Ech probéieren, jiddereen ëmmer erëm unzeruffen.',
          feedback:
            'D’Linne sinn iwwerlaascht an d’Batterie geet eidel. En Treffpunkt, deen am Viraus ofgemaach ass, verhënnert dat.',
        },
      },
    },
    'jour1-soir': {
      when: 'Dag 1, 18 Auer',
      story: [
        'Am Januar gëtt et fréi däischter. Doheem ass alles schwaarz an den elektreschen Hiert funktionéiert net méi.',
      ],
      question: 'Wéi kriss du Liicht a wéi kriss du eppes Waarmes z’iessen?',
      options: {
        a: {
          text: 'Ech stellen de Barbecue an d’Stuff.',
          feedback:
            'Ni: e Barbecue oder e Feierkuerf dobannen produzéiert Kuelemonoxid, e Gas, deen een net gesäit an deen déidlech ass.',
        },
        b: {
          text: 'Kapplamp, an de Rechaud an engem gutt gelëfte Raum.',
          feedback:
            'Perfekt. Eng Lamp fir all Persoun, an eng Konserv, déi een och kal iesse kann, wann de Gas ausgeet.',
        },
        c: {
          text: 'Käerzen an all de Raim.',
          feedback:
            'Käerzen hëllefen eng Zäit, mee eng Lamp ass méi sécher. Looss ni eng brennend Käerz ouni Opsiicht.',
        },
      },
    },
    'jour2-eau': {
      when: 'Dag 2',
      story: [
        'Wéi s du erwechs, kënnt näischt méi aus dem Krunn. D’Haus ass an der Nuecht kal ginn.',
      ],
      question: 'Wéi kënns du duerch den Dag?',
      options: {
        a: {
          text: 'Ech waarden, bis d’Waasser erëm do ass, ier ech mech organiséieren.',
          feedback:
            'Keen weess, wéini et erëmkënnt. Et ass besser, deng Reserve direkt anzedeelen.',
        },
        b: {
          text: 'Ech drénke meng Reserve, maachen d’Luede zou an huele Pulloveren an Decken eraus.',
          feedback: 'Jo. Rechen ongeféier 3 L pro Persoun an Dag, an haal d’Wäermt dobannen.',
        },
      },
    },
    'jour2-rumeur': {
      when: 'Dag 2, 14 Auer',
      story: [
        'E Message geet ronderëm: „D’Waasser aus dem Krunn ass vergëft, schéckt et weider!“ Et steet keng Quell a keen Datum dran.',
      ],
      question: 'Wat méchs du mat dësem Message?',
      options: {
        a: {
          text: 'Ech deelen en, fir meng Léiwen ze warnen.',
          feedback:
            'Och fir „ze warnen“ deelt een keng Warnung, déi vu kenger offizieller Quell bestätegt gëtt.',
        },
        b: {
          text: 'Ech kucken am Radio oder op LU-Alert no, an ech deele just dat Offiziellt.',
          feedback:
            'Genee. Wien huet en publizéiert, wéini, vu wou kënnt en? Soen aner zouverlässeg Quellen datselwecht?',
        },
      },
    },
    'jour3-entraide': {
      when: 'Dag 3',
      story: [
        'De Quartier organiséiert sech. D’Gemeng mécht e geheizte Sall op, wou ee waarm drénke kann, sech informéieren an den Handy oplueden.',
        'Deng eeler Nopesch wunnt eleng. Du hues se zanter dem Ufank vum Stroumausfall net méi gesinn.',
      ],
      question: 'Wat méchs du?',
      options: {
        a: {
          text: 'Ech klappe bei hir, fir ze kucken, wéi et hir geet.',
          feedback:
            'Dat ass d’Häerz vun der géigesäiteger Hëllef: als Éischt d’Leit, déi eleng oder fragil sinn.',
        },
        b: {
          text: 'Ech stéieren se net: een anere wäert sech ëm hatt këmmeren.',
          feedback:
            'D’Rettungsdéngschter kënnen net iwwerall sinn. En opmierksamen Noper mécht dacks den Ënnerscheed.',
        },
      },
    },
  },
  checks: {
    'task-lu-alert': 'D’LU-Alert-App installéiert',
    'item-crank-radio': 'E Radio mat Batterien oder mat Kurbel',
    'plan-meeting': 'En Treffpunkt an dengem Plang opgeschriwwen',
    'plan-urgence': 'De Schrëtt „Am Noutfall“ vum Plang ofgeschloss',
    'essential-light': 'D’Liicht (Liichtwiermchen un)',
    'item-camping-stove': 'E Campingrechaud',
    'essential-food': 'D’Iesse fir 72 Stonnen (Liichtwiermchen un)',
    'essential-water': 'D’Waasser fir 72 Stonnen (Liichtwiermchen un)',
    'essential-warmth': 'D’Wäermt (Liichtwiermchen un)',
    'item-power-bank': 'Eng geluede extern Batterie',
    'plan-quartier': 'D’Leit, deenen s du hëllefe kanns, an dengem Plang opgeschriwwen',
  },
};
