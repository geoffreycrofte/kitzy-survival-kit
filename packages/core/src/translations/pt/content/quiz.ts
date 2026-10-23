/** Quiz em português europeu. */
import type { ContentTranslation } from '../../types';

export const quiz: ContentTranslation['quiz'] = {
  'sirene-test': {
    prompt:
      'Primeira segunda-feira do mês, meio-dia: a sirene toca com um som contínuo durante um minuto. O que fazes?',
    options: {
      a: 'Nada: é o teste mensal.',
      b: 'Abrigo-me imediatamente.',
      c: 'Ligo para o 112 para saber o que se passa.',
    },
    explanation:
      'O teste é feito na primeira segunda-feira de cada mês, ao meio-dia: um som contínuo de um minuto. Se durar mais tempo, ou se tocar noutra altura, informa-te.',
  },
  'sirene-alerte': {
    prompt: 'A sirene emite um som contínuo, sempre no mesmo tom, durante dois minutos. É…',
    options: {
      a: 'O fim de um alarme.',
      b: 'O sinal de alerta: ponho-me em segurança e informo-me.',
      c: 'Um teste sem importância.',
    },
    explanation:
      'Dois minutos de som contínuo: põe-te em segurança, informa-te através do LU-Alert, do rádio ou da televisão e depois segue as instruções.',
  },
  'sirene-alarme': {
    prompt: 'Um som que sobe e desce, sem parar, durante um minuto. O que fazer?',
    options: {
      a: 'Sair para ver o que se passa lá fora.',
      b: 'Retomar as minhas atividades: o perigo passou.',
      c: 'Abrigar-me o mais depressa possível, num edifício sólido e fechado.',
    },
    explanation:
      'É o sinal nacional de alarme. O fim do alarme é parecido, mas é interrompido por pausas curtas.',
  },
  'sirene-doute': {
    prompt: 'Uma sirene toca e tens dúvidas. Qual é o reflexo certo?',
    options: {
      a: 'Ligar o rádio ou abrir o LU-Alert.',
      b: 'Ligar para o 112 ou o 113 para perguntar.',
      c: 'Perguntar nas redes sociais.',
    },
    explanation:
      'As linhas 112 e 113 têm de ficar livres para as urgências. O rádio e o LU-Alert dizem o que se passa.',
  },
  'vigilance-violet': {
    prompt: 'Que nível de vigilância quer dizer «perigo iminente, é preciso agir de imediato»?',
    options: {
      a: 'O nível vermelho.',
      b: 'O nível violeta.',
      c: 'O nível laranja.',
    },
    explanation:
      'Amarelo, laranja e vermelho acompanham uma situação que piora aos poucos. Já o violeta assinala um perigo muito próximo.',
  },
  radio: {
    prompt: 'Sem eletricidade nem rede móvel. Onde encontrar as informações oficiais?',
    options: {
      a: 'Nas mensagens reencaminhadas por amigos.',
      b: 'No rádio: RTL ou rádio 100,7, com um rádio a pilhas, a manivela ou o do carro.',
      c: 'Em lado nenhum: é preciso esperar que a eletricidade volte.',
    },
    explanation:
      'O rádio continua muitas vezes a funcionar quando tudo o resto está cortado. É o canal mais sólido.',
  },
  monoxyde: {
    prompt: 'A casa está a arrefecer. Podemos aquecer-nos com um grelhador ou um braseiro na sala?',
    options: {
      a: 'Sim, se abrirmos um pouco a janela.',
      b: 'Sim, durante uma hora no máximo.',
      c: 'Nunca: produzem monóxido de carbono, um gás invisível e mortal.',
    },
    explanation:
      'Os aparelhos feitos para o exterior nunca se usam no interior. Para guardar o calor: estores fechados, camisolas e cobertores.',
  },
  rumeur: {
    prompt:
      'Uma mensagem diz que a água da torneira está envenenada, sem dizer de onde vem. O que fazes?',
    options: {
      a: 'Partilho-a depressa para avisar os meus próximos.',
      b: 'Verifico junto das fontes oficiais antes de acreditar ou de partilhar.',
      c: 'Acredito nela se tiver uma fotografia.',
    },
    explanation:
      'Quem a publicou, quando, de onde vem, outras fontes fiáveis dizem o mesmo? Uma imagem pode ser fabricada. Sem confirmação oficial, não se partilha.',
  },
  iode: {
    prompt: 'Quando tomar os comprimidos de iodo?',
    options: {
      a: 'Só quando as autoridades o pedirem.',
      b: 'Assim que se ouve falar de um acidente, por precaução.',
      c: 'Uma vez por ano, para ficar protegido.',
    },
    explanation: 'Nunca antes, e nunca por precaução. Guarda-os no kit e espera pela instrução.',
  },
  cyber: {
    prompt: 'Uma mensagem do «teu banco» pede-te o teu código através de um link. O que fazer?',
    options: {
      a: 'Clicar e responder depressa para evitar um bloqueio.',
      b: 'Responder à mensagem para perguntar se é verdade.',
      c: 'Não clicar e contactar eu mesmo o banco através dos contactos oficiais.',
    },
    explanation:
      'Nunca se dão palavras-passe nem códigos. Em caso de dúvida, contacta-se diretamente a entidade.',
  },
};
