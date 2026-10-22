/** Simulação de 72 horas em português europeu. */
import type { ContentTranslation } from '../../types';

export const simulation: ContentTranslation['simulation'] = {
  steps: {
    'jour1-travail': {
      when: 'Dia 1, 10h',
      story: [
        'Uma segunda-feira de janeiro. Estás no trabalho quando tudo se apaga: os ecrãs, a luz, o aquecimento.',
        'O teu telemóvel ainda mostra rede, mas as chamadas não passam: as linhas estão saturadas.',
      ],
      question: 'Como saber o que se passa?',
      options: {
        a: {
          text: 'Ligo para o 112 para perguntar.',
          feedback:
            'O 112 tem de ficar livre para as urgências. As informações passam pelo LU-Alert e pelo rádio.',
        },
        b: {
          text: 'Vejo o LU-Alert e ouço o rádio.',
          feedback:
            'Bem pensado. Uma mensagem LU-Alert aconselha precisamente a ouvir a RTL ou a rádio 100,7.',
        },
        c: {
          text: 'Confio na primeira mensagem reencaminhada numa aplicação de mensagens.',
          feedback:
            'Durante uma crise, muitas mensagens são falsas. Primeiro verifica-se junto das fontes oficiais.',
        },
      },
    },
    'jour1-retour': {
      when: 'Dia 1, 15h',
      story: [
        'Já não há comboios. Uma colega oferece-se para te levar a casa de carro.',
        'O resto da família está talvez na escola ou no trabalho, sem forma de te contactar.',
      ],
      question: 'Como se reencontrarem?',
      options: {
        a: {
          text: 'Cada um vai para o ponto de encontro que escolhemos juntos.',
          feedback:
            'É exatamente esse o papel do plano de emergência: um sítio que todos conhecem, e alguém para ir buscar as crianças.',
        },
        b: {
          text: 'Espero na estação que os comboios voltem a circular.',
          feedback:
            'Ninguém sabe quanto tempo isto vai durar. Mais vale voltar para casa e juntar-te à família.',
        },
        c: {
          text: 'Tento ligar a toda a gente, sem parar.',
          feedback:
            'As linhas estão saturadas e a bateria gasta-se. Um ponto de encontro decidido com antecedência evita isso.',
        },
      },
    },
    'jour1-soir': {
      when: 'Dia 1, 18h',
      story: [
        'Em janeiro, a noite cai cedo. Em casa, está tudo às escuras e o fogão elétrico já não funciona.',
      ],
      question: 'Para teres luz e comeres quente?',
      options: {
        a: {
          text: 'Levo o grelhador para a sala.',
          feedback:
            'Nunca: um grelhador ou um braseiro no interior produz monóxido de carbono, um gás invisível e mortal.',
        },
        b: {
          text: 'Lanterna frontal, e o fogareiro numa divisão bem arejada.',
          feedback:
            'Perfeito. Uma lanterna para cada pessoa, e uma conserva que se come mesmo fria se faltar o gás.',
        },
        c: {
          text: 'Velas em todas as divisões.',
          feedback:
            'As velas desenrascam, mas uma lanterna é mais segura. Nunca deixes uma vela acesa sem vigilância.',
        },
      },
    },
    'jour2-eau': {
      when: 'Dia 2',
      story: ['Ao acordar, a torneira já não deita nada. A casa arrefeceu durante a noite.'],
      question: 'Como aguentar o dia?',
      options: {
        a: {
          text: 'Espero que a água volte antes de me organizar.',
          feedback: 'Ninguém sabe quando vai voltar. Mais vale organizar já a tua reserva.',
        },
        b: {
          text: 'Bebo da minha reserva, fecho os estores e tiro camisolas e cobertores.',
          feedback:
            'Sim. Conta com cerca de 3 L por pessoa e por dia, e guarda o calor dentro de casa.',
        },
      },
    },
    'jour2-rumeur': {
      when: 'Dia 2, 14h',
      story: [
        'Circula uma mensagem: «A água da torneira está envenenada, passa a palavra!» Não tem fonte nem data.',
      ],
      question: 'O que fazes com esta mensagem?',
      options: {
        a: {
          text: 'Partilho-a para avisar os meus próximos.',
          feedback:
            'Mesmo para «avisar», não se partilha um alerta que nenhuma fonte oficial confirma.',
        },
        b: {
          text: 'Verifico no rádio ou no LU-Alert, e só partilho o que é oficial.',
          feedback:
            'Exatamente. Quem a publicou, quando, de onde vem? Outras fontes fiáveis dizem o mesmo?',
        },
      },
    },
    'jour3-entraide': {
      when: 'Dia 3',
      story: [
        'O bairro organiza-se. A comuna abre uma sala aquecida para beber algo quente, obter informações e carregar os telemóveis.',
        'A tua vizinha idosa vive sozinha. Não a vês desde o início do corte.',
      ],
      question: 'O que fazes?',
      options: {
        a: {
          text: 'Bato-lhe à porta para saber como está.',
          feedback: 'É o coração da entreajuda: primeiro as pessoas sozinhas ou frágeis.',
        },
        b: {
          text: 'Não a incomodo: outra pessoa vai tratar disso.',
          feedback:
            'Os serviços de socorro não podem estar em todo o lado. Um vizinho atento faz muitas vezes a diferença.',
        },
      },
    },
  },
  checks: {
    'task-lu-alert': 'A aplicação LU-Alert instalada',
    'item-crank-radio': 'Um rádio a pilhas ou a manivela',
    'plan-meeting': 'Um ponto de encontro anotado no teu plano',
    'plan-urgence': 'A etapa «Em caso de emergência» do plano concluída',
    'essential-light': 'A luz (pirilampo aceso)',
    'item-camping-stove': 'Um fogareiro de campismo',
    'essential-food': 'As refeições para 72 h (pirilampo aceso)',
    'essential-water': 'A água para 72 h (pirilampo aceso)',
    'essential-warmth': 'O calor (pirilampo aceso)',
    'item-power-bank': 'Uma bateria externa carregada',
    'plan-quartier': 'As pessoas a ajudar anotadas no teu plano',
  },
};
