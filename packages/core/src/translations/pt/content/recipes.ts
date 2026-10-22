import type { ContentTranslation } from '../../types';

export const recipes: ContentTranslation['recipes'] = {
  'chili-express': {
    title: 'Chili expresso da toca',
    summary: 'Feijão vermelho, tomate e milho, bem temperados num quarto de hora.',
    ingredients: [
      '1 lata de feijão vermelho, escorrido',
      '1 lata de tomate triturado',
      '1 lata pequena de milho',
      '1 pitada de sal, cominhos ou colorau',
      'Arroz, se tiveres',
    ],
    steps: [
      'Deita o tomate no tacho e aquece-o durante 5 minutos.',
      'Junta o feijão, o milho e as especiarias.',
      'Deixa cozinhar em lume brando 10 minutos, mexendo de vez em quando.',
      'Serve assim mesmo, com arroz ou bolachas de água e sal.',
    ],
    tip: 'Guarda o líquido do feijão e do milho para uma sopa no dia seguinte: é menos água a gastar.',
  },
  'pates-sardines': {
    title: 'Massa com sardinhas e tomate',
    summary: 'O clássico da despensa, pronto em 15 minutos.',
    ingredients: [
      '200 g de massa curta',
      '1 lata de sardinhas em óleo',
      '1 lata de tomate triturado',
      'Sal, pimenta',
    ],
    steps: [
      'Coze a massa em 1 L de água, só o suficiente para a cobrir. Tapa o tacho: ferve mais depressa e poupa gás.',
      'Escorre, guardando um pouco da água da cozedura.',
      'Junta o tomate e as sardinhas desfeitas com o óleo e aquece mais 2 minutos.',
    ],
    tip: 'A massa fina coze mais depressa: menos gás, menos água.',
  },
  'salade-lentilles': {
    title: 'Salada de lentilhas, sem cozinhar',
    summary: 'Sem fogareiro, sem água: abre-se, mistura-se e come-se.',
    ingredients: [
      '1 lata de lentilhas cozidas, escorridas',
      '1 lata de atum ou de cavala',
      '1 lata pequena de milho ou de ervilhas',
      'Um fio de azeite e de vinagre, sal',
    ],
    steps: [
      'Escorre as lentilhas e o milho.',
      'Mistura-os com o peixe desfeito.',
      'Tempera com o azeite, o vinagre e o sal.',
    ],
    tip: 'Também resulta com grão-de-bico ou feijão branco.',
  },
  porridge: {
    title: 'Papas de aveia da manhã',
    summary: 'Flocos de aveia, leite e puré de fruta: quentes ou preparadas na véspera.',
    ingredients: [
      '80 g de flocos de aveia',
      '40 cl de leite UHT, ou de leite em pó misturado com água',
      '2 pacotes de puré de fruta',
      '1 colher de açúcar ou alguns frutos secos',
    ],
    steps: [
      'Aquece o leite com os flocos durante 5 minutos, sempre a mexer.',
      'Fora do lume, junta o puré de fruta e o açúcar.',
      'Sem fogareiro: mistura os flocos e o leite na véspera à noite, tapa e deixa inchar durante a noite.',
    ],
  },
  'soupe-pois-chiches': {
    title: 'Sopa de grão-de-bico com tomate',
    summary: 'Uma sopa que aquece quando a casa arrefece.',
    ingredients: [
      '1 lata de grão-de-bico',
      '1 lata de tomate triturado',
      '1 cubo de caldo e 50 cl de água',
      'Uma mão-cheia de massa miúda, se quiseres',
    ],
    steps: [
      'Leva a água a ferver com o cubo de caldo.',
      'Junta o tomate, o grão-de-bico e a massa.',
      'Deixa cozer 10 minutos e depois esmaga algum grão para engrossar.',
    ],
  },
  'tartines-croustillantes': {
    title: 'Tostas estaladiças',
    summary: 'Bolachas, pasta de peixe e frutos secos: um jantar sem cozinhar.',
    ingredients: [
      'Bolachas de água e sal ou tostas',
      '1 lata de atum ou de sardinhas',
      '1 colher de mostarda ou de maionese em bisnaga',
      'Frutos secos para a sobremesa',
    ],
    steps: [
      'Esmaga o peixe com um garfo, juntamente com a mostarda.',
      'Barra as bolachas mesmo antes de comer, para que fiquem estaladiças.',
      'Termina com os frutos secos.',
    ],
  },
  'riz-au-lait': {
    title: 'Arroz-doce reconfortante',
    summary: 'A sobremesa de conforto, com o que sobra do leite UHT.',
    ingredients: [
      '60 g de arroz carolino',
      '50 cl de leite UHT',
      '2 colheres de açúcar, um quadradinho de chocolate',
    ],
    steps: [
      'Aquece o leite até quase ferver e depois junta o arroz.',
      'Deixa cozer em lume brando 20 minutos, mexendo com frequência.',
      'Junta o açúcar e depois o quadradinho de chocolate para derreter por cima.',
    ],
    tip: 'O arroz-doce também se come frio no dia seguinte.',
  },
  'couscous-express': {
    title: 'Cuscuz expresso',
    summary: 'Basta água quente: a sêmola coze sozinha.',
    ingredients: [
      '150 g de sêmola de cuscuz',
      '1 lata de legumes (ratatouille, ervilhas com cenoura)',
      '1 lata de grão-de-bico',
      'Sal, um fio de azeite',
    ],
    steps: [
      'Aquece 30 cl de água. Fora do lume, deita a sêmola, tapa e espera 5 minutos.',
      'Entretanto, aquece os legumes e o grão-de-bico.',
      'Solta a sêmola com um garfo e o azeite e serve com os legumes.',
    ],
  },
};
