/** Guia em português europeu (tradução do guia francês, mesmas páginas e mesmos links). */
import type { ContentTranslation } from '../../types';

const OFFICIAL_GUIDE = {
  label: 'O guia oficial Lëtz prepare!',
  url: 'https://letzprepare.public.lu/fr/guide.html',
};

export const guide: ContentTranslation['guide'] = [
  {
    slug: 'pourquoi-72-heures',
    title: 'Porquê 72 horas?',
    summary:
      'Três dias de autonomia: é o tempo de que os serviços de socorro precisam para se organizarem.',
    chapter: 'comprendre',
    pose: 'lecture',
    blocks: [
      {
        type: 'p',
        text: 'Uma tempestade, uma inundação, um grande corte de energia ou um ciberataque podem mudar o teu dia a dia. Pode faltar a água, a eletricidade, o telefone ou a Internet.',
      },
      {
        type: 'p',
        text: 'Ninguém sabe de antemão quanto tempo isso pode durar. Por isso é útil preparares-te, com calma e sem te preocupares.',
      },
      { type: 'h2', text: 'Porquê três dias?' },
      {
        type: 'p',
        text: 'As primeiras horas de uma crise são muitas vezes as mais difíceis. Os serviços de socorro têm primeiro de perceber a situação e de se organizar. Ajudam primeiro as pessoas mais frágeis.',
      },
      {
        type: 'p',
        text: 'Com reservas para 72 horas, cobres as tuas necessidades básicas durante esse tempo: beber, comer, ter luz, tratar de ti e manter-te informado.',
      },
      {
        type: 'p',
        text: 'Muitos países europeus aconselham esta mesma duração. Ela vem da experiência das crises recentes.',
      },
      { type: 'h2', text: 'Uma responsabilidade partilhada' },
      {
        type: 'p',
        text: 'O Estado e as comunas trabalham em conjunto para proteger a população. Mas não conseguem fazer tudo sozinhos. Cada pessoa pode ajudar, à sua medida.',
      },
      {
        type: 'p',
        text: 'Em 2025, o Luxemburgo lançou a estratégia nacional de resiliência «Lëtz prepare!». A resiliência é a capacidade de enfrentar uma dificuldade e depois voltar a uma vida normal.',
      },
      { type: 'h2', text: 'O que a preparação muda' },
      {
        type: 'list',
        items: [
          'Reages mais depressa e com mais calma.',
          'Proteges a tua família e a tua casa.',
          'Podes ajudar os teus próximos e os teus vizinhos.',
          'Os serviços de socorro podem concentrar-se nos casos mais urgentes.',
        ],
      },
      {
        type: 'p',
        text: 'Bastam alguns gestos simples. Não precisas de fazer tudo num dia: avança passo a passo.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'Lëtz prepare!, a estratégia nacional', url: 'https://letzprepare.public.lu' },
    ],
  },
  {
    slug: 'a-quoi-se-preparer',
    title: 'Para que te preparar?',
    summary: 'Os principais riscos no Luxemburgo e os reflexos certos para cada um.',
    chapter: 'comprendre',
    pose: 'lecture',
    blocks: [
      {
        type: 'p',
        text: 'No Luxemburgo, vários tipos de crise podem afetar o teu dia a dia. Aqui estão os principais, com os gestos úteis para cada um.',
      },
      { type: 'h2', text: 'Meteorologia: tempestade, neve, gelo, onda de calor' },
      {
        type: 'list',
        items: [
          'Fica dentro de casa e limita as tuas deslocações.',
          'Se tiveres de sair, diz a alguém próximo para onde vais.',
          'Procura saber notícias dos teus próximos.',
          'Em caso de tempestade, arruma ou prende o que possa voar.',
          'Em caso de onda de calor, segue os conselhos de saúde de santesecu.public.lu.',
        ],
      },
      { type: 'h2', text: 'Inundações' },
      {
        type: 'list',
        items: [
          'Não corras nenhum risco.',
          'Verifica se a tua casa está em zona inundável (inondations.lu, eau.geoportail.lu).',
          'Mantém as caleiras, as valetas e os escoamentos bem desobstruídos.',
          'Leva os aparelhos elétricos e os produtos poluentes para um sítio mais alto do que a cave.',
          'Se ainda tiveres tempo, afasta o teu carro e corta a eletricidade nas divisões em risco.',
          'Evita as estradas inundadas, as margens dos rios, as caves e os parques de estacionamento subterrâneos.',
          'Nunca andes em água que possa estar em contacto com a eletricidade.',
        ],
      },
      { type: 'h2', text: 'Ciberataques' },
      {
        type: 'list',
        items: [
          'Um pedido estranho? Contacta tu mesmo a pessoa ou a entidade, através dos contactos oficiais.',
          'Não cliques nos links de mensagens suspeitas: vai diretamente ao site.',
          'Nunca dês as tuas palavras-passe, os teus códigos ou os teus dados bancários.',
          'Usa uma palavra-passe longa e diferente para cada conta, e a autenticação de dois fatores.',
          'Faz as atualizações e guarda cópias dos teus documentos e fotografias.',
        ],
      },
      {
        type: 'p',
        text: 'Se fores vítima: guarda as provas, muda as tuas palavras-passe, liga para o teu banco em caso de fraude e desliga da rede o aparelho afetado.',
      },
      { type: 'h2', text: 'Ameaça terrorista' },
      {
        type: 'list',
        items: [
          'Mantém-te atento nos sítios onde há muita gente.',
          'Comunica à polícia um objeto ou um comportamento suspeito, sem te aproximares.',
          'Em caso de ataque, afasta-te se puderes. Se não, abriga-te e mantém-te discreto.',
          'Liga para os serviços de socorro assim que o puderes fazer sem perigo e depois segue as instruções deles.',
        ],
      },
      { type: 'h2', text: 'Acidente nuclear' },
      {
        type: 'p',
        text: 'Este risco é muito pouco provável. Os gestos a conhecer estão explicados na página «Acidente nuclear».',
      },
      { type: 'h2', text: 'Grande corte de eletricidade' },
      {
        type: 'p',
        text: 'Teria efeitos em muitos serviços ao mesmo tempo. A página «Grande corte de eletricidade» explica-te o que fazer.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: alertas oficiais', url: 'https://lu-alert.lu' },
      { label: 'MeteoLux: previsões e alertas meteorológicos', url: 'https://www.meteolux.lu' },
      { label: 'Inundações: informações sobre as cheias', url: 'https://www.inondations.lu' },
      {
        label: 'Saúde e segurança: ondas de calor e urgências',
        url: 'https://santesecu.public.lu',
      },
      { label: 'Cibersegurança: conselhos práticos', url: 'https://www.cybersecurity.lu' },
    ],
  },
  {
    slug: 'coupure-electricite',
    title: 'Grande corte de eletricidade',
    summary: 'O que pode parar, os gestos certos e um exemplo de três dias sem eletricidade.',
    chapter: 'comprendre',
    pose: 'lanterne',
    blocks: [
      {
        type: 'p',
        text: 'Um corte de energia em todo o país é pouco provável. Mas teria grandes consequências, porque quase tudo depende da eletricidade.',
      },
      { type: 'h2', text: 'O que pode parar' },
      {
        type: 'list',
        items: [
          'Casa: deixa de haver luz, frigorífico, fogão, aquecimento e elevador.',
          'Telefone e Internet: redes instáveis, chamadas difíceis, serviços de socorro difíceis de contactar.',
          'Água: a torneira, a sanita e o duche podem deixar de funcionar.',
          'Transportes: semáforos apagados, comboios e autocarros com perturbações, bombas de gasolina avariadas.',
          'Dinheiro e compras: multibancos e cartões bancários fora de serviço, lojas fechadas.',
          'Saúde: hospitais e serviços de socorro mais lentos.',
          'Águas residuais e lixo: possíveis transbordos em caso de chuva forte, recolha atrasada.',
        ],
      },
      { type: 'h2', text: 'Os reflexos certos' },
      {
        type: 'list',
        items: [
          'Enche garrafas e recipientes enquanto a água ainda corre.',
          'Abre o frigorífico e o congelador o menos possível.',
          'Fecha os estores para guardar o calor.',
          'Põe o telemóvel em modo de poupança de energia. Carrega-o com uma bateria externa.',
          'Ouve o rádio a pilhas, a manivela ou o do teu carro: RTL e rádio 100,7.',
          'Limita as tuas deslocações e fica perto de casa.',
          'Antes de a eletricidade voltar, desliga o frigorífico, o congelador, a televisão, o computador e o carro elétrico.',
          'Vai ver os teus vizinhos, sobretudo os mais frágeis.',
        ],
      },
      {
        type: 'note',
        text: 'Nunca uses um grelhador, um braseiro, um gerador ou outro aparelho feito para o exterior num espaço fechado. Produzem monóxido de carbono: um gás invisível, sem cheiro e mortal.',
      },
      { type: 'h2', text: 'E se fosses tu? Três dias sem eletricidade' },
      {
        type: 'p',
        text: 'Dia 1. Numa segunda-feira de janeiro, a eletricidade vai-se enquanto estás no trabalho. As linhas telefónicas estão saturadas. Uma mensagem LU-Alert aconselha a ouvir a RTL e a rádio 100,7. Já não há comboios: uma colega leva-te a casa de carro. À noite, tiras a lanterna, os cobertores e o fogareiro a gás.',
      },
      {
        type: 'p',
        text: 'Dia 2. A água deixa de correr e a casa arrefece. Usas as tuas reservas, poupas a bateria e ouves o rádio. Circulam boatos: partilhas apenas as informações oficiais. Os teus vizinhos convidam-te a aquecer-te junto à lareira deles.',
      },
      {
        type: 'p',
        text: 'Dia 3. O bairro organiza-se para se entreajudar. A comuna abre uma sala aquecida para beber algo quente, obter informações e carregar os telemóveis. Depois, o rádio anuncia o regresso da eletricidade, zona a zona. De volta a casa, fazes o balanço. O que te faltou? O que vais ter de completar?',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'infocrise.lu: informações em caso de crise', url: 'https://infocrise.lu' },
      { label: 'LU-Alert: alertas oficiais', url: 'https://lu-alert.lu' },
    ],
  },
  {
    slug: 'alerte-lu-alert',
    title: 'LU-Alert, o alerta oficial',
    summary: 'Como as autoridades te alertam e o que significam os níveis de vigilância.',
    chapter: 'alerte',
    pose: 'radio',
    blocks: [
      {
        type: 'p',
        text: 'O LU-Alert é o sistema nacional de alerta e de informação. As autoridades usam-no para te avisar depressa em caso de perigo.',
      },
      {
        type: 'p',
        text: 'O LU-Alert informa-te antes de um acontecimento, para que te possas preparar. Ajuda-te durante, para te protegeres. Às vezes, também te diz quando o perigo já passou.',
      },
      { type: 'h2', text: 'Vários canais ao mesmo tempo' },
      {
        type: 'p',
        text: 'A mesma mensagem passa por vários canais. Assim, tem mais hipóteses de chegar até ti.',
      },
      {
        type: 'list',
        items: [
          'O site lu-alert.lu: todas as mensagens são publicadas lá.',
          'A aplicação LU-Alert, gratuita: escolhes os temas, os níveis e as zonas. Os alertas menos graves, por exemplo sobre a alimentação, passam em geral só pela aplicação.',
          'O SMS geolocalizado: é enviado a todas as pessoas presentes na zona em perigo, seja qual for o operador.',
          'O Cell Broadcast: uma mensagem prioritária em todos os telemóveis compatíveis da zona, com som e vibração, mesmo em modo silencioso.',
          'As sirenes, para um perigo importante ou iminente.',
          'Os meios de comunicação: rádio, televisão, imprensa e sites de informação.',
        ],
      },
      { type: 'h2', text: 'Os 4 níveis de vigilância' },
      {
        type: 'p',
        text: 'Quando uma situação piora aos poucos, fala-se de cenário progressivo. Tem três níveis:',
      },
      {
        type: 'list',
        items: [
          'Nível amarelo, «Estejam atentos»: risco baixo, perigo possível.',
          'Nível laranja, «Sejam prudentes»: risco médio, há um perigo.',
          'Nível vermelho, «Vigilância absoluta»: risco elevado, perigo importante.',
        ],
      },
      {
        type: 'p',
        text: 'Quando o perigo está muito próximo, fala-se de cenário iminente. Tem um só nível: o nível violeta, perigo iminente. É preciso agir de imediato.',
      },
      {
        type: 'p',
        text: 'O nível e o canal são escolhidos pela autoridade responsável, consoante a gravidade. Por exemplo a MeteoLux, a Polícia, o CGDIS ou a Administração da Gestão da Água.',
      },
      { type: 'h2', text: 'O rádio, o canal mais sólido' },
      {
        type: 'p',
        text: 'Se a eletricidade ou a rede móvel falharem, o rádio continua muitas vezes a funcionar. Tem um rádio a pilhas ou a manivela. O rádio do teu carro também pode servir. Ouve a RTL ou a rádio 100,7.',
      },
      {
        type: 'p',
        text: 'Conselho: instala já a aplicação LU-Alert. É gratuita na App Store e no Google Play.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: alertas oficiais', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu: informações em caso de crise', url: 'https://infocrise.lu' },
    ],
  },
  {
    slug: 'sirenes',
    title: 'Os sinais das sirenes',
    summary: 'Reconhecer os quatro sinais das sirenes e saber o que fazer em cada caso.',
    chapter: 'alerte',
    pose: 'bonjour',
    blocks: [
      {
        type: 'p',
        text: 'As sirenes servem para avisar de um perigo importante ou iminente. Podem tocar numa zona específica ou em todo o país.',
      },
      {
        type: 'p',
        text: 'Existem quatro sinais. Cada um tem um som diferente e uma instrução precisa.',
      },
      { type: 'h2', text: 'Teste mensal' },
      {
        type: 'p',
        text: 'O som: um som contínuo, sempre no mesmo tom, durante 60 s.',
      },
      { type: 'p', text: 'O que fazer: nada. É apenas um teste.' },
      { type: 'h2', text: 'Sinal de alerta' },
      {
        type: 'p',
        text: 'O som: um som contínuo, sempre no mesmo tom, durante 2 min.',
      },
      {
        type: 'p',
        text: 'O que fazer: põe-te em segurança e informa-te através do LU-Alert, do rádio ou da televisão. Depois segue as instruções das autoridades.',
      },
      { type: 'h2', text: 'Sinal nacional de alarme' },
      {
        type: 'p',
        text: 'O som: um som que sobe e desce, sem parar, durante 60 s.',
      },
      {
        type: 'p',
        text: 'O que fazer: abriga-te o mais depressa possível, num edifício sólido e fechado.',
      },
      { type: 'h2', text: 'Fim do alarme' },
      {
        type: 'p',
        text: 'O som: um som que sobe e desce, interrompido por pausas curtas, durante 60 s.',
      },
      {
        type: 'p',
        text: 'O que fazer: o perigo passou. Podes retomar as tuas atividades normalmente.',
      },
      {
        type: 'note',
        text: 'O teste é feito na primeira segunda-feira de cada mês, ao meio-dia. Um som contínuo de um minuto a essa hora é, portanto, normal. Se durar mais tempo, ou se tocar noutra altura, informa-te.',
      },
      { type: 'h2', text: 'Tens dúvidas?' },
      {
        type: 'p',
        text: 'Liga o rádio ou abre o LU-Alert. Não ligues para o 112 ou o 113 para perguntar o que se passa: estas linhas têm de ficar livres para as urgências.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: alertas oficiais', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu: informações em caso de crise', url: 'https://infocrise.lu' },
    ],
  },
  {
    slug: 'bien-s-informer',
    title: 'Informar-se bem',
    summary: 'Encontrar as fontes certas e evitar partilhar informações falsas.',
    chapter: 'alerte',
    pose: 'radio',
    blocks: [
      {
        type: 'p',
        text: 'Durante uma crise, circulam muitas mensagens. Algumas são falsas. Outras contradizem-se. Alguns reflexos simples ajudam-te a separar o verdadeiro do falso.',
      },
      { type: 'h2', text: 'Os reflexos certos' },
      {
        type: 'list',
        items: [
          'Segue as instruções das autoridades.',
          'Informa-te junto das fontes oficiais e dos meios de comunicação conhecidos.',
          'Verifica uma informação antes de a partilhar.',
          'Telefona o menos possível, para deixar as linhas livres para os serviços de socorro.',
        ],
      },
      { type: 'h2', text: 'Antes de acreditar ou de partilhar' },
      { type: 'p', text: 'Faz a ti mesmo estas quatro perguntas:' },
      {
        type: 'list',
        items: [
          'Quem publicou esta informação?',
          'Quando foi publicada?',
          'De onde vem?',
          'Outras fontes fiáveis dizem o mesmo?',
        ],
      },
      { type: 'h2', text: 'Cuidado com as imagens falsas' },
      {
        type: 'p',
        text: 'Fotografias e vídeos podem ser fabricados com inteligência artificial (IA). Às vezes parecem muito reais. Uma imagem impressionante não é uma prova.',
      },
      {
        type: 'note',
        text: 'Se nenhuma fonte oficial confirmar um alerta, não o partilhes. Nem mesmo para «avisar» os teus próximos.',
      },
      { type: 'h2', text: 'Onde verificar?' },
      {
        type: 'list',
        items: [
          'lu-alert.lu, para os alertas.',
          'infocrise.lu, para a gestão de crises.',
          'O rádio: RTL e rádio 100,7.',
          'A tua comuna: site, afixação, boletim, reuniões e aplicações.',
        ],
      },
      {
        type: 'p',
        text: 'Em caso de dúvida, volta sempre a estes canais oficiais.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: alertas oficiais', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu: informações em caso de crise', url: 'https://infocrise.lu' },
    ],
  },
  {
    slug: 'accident-nucleaire',
    title: 'Acidente nuclear',
    summary: 'Um risco muito baixo, mas instruções simples que convém conhecer com antecedência.',
    chapter: 'comprendre',
    pose: 'lanterne',
    blocks: [
      {
        type: 'p',
        text: 'Um acidente nuclear é muito pouco provável. Mas as suas consequências podem ser graves para a saúde e para o ambiente.',
      },
      {
        type: 'p',
        text: 'Conhecer as instruções com antecedência ajuda-te a proteger-te melhor, sem entrar em pânico.',
      },
      { type: 'h2', text: 'Os gestos certos' },
      {
        type: 'list',
        items: [
          'Informa-te através do LU-Alert, do rádio e dos meios de comunicação.',
          'Abriga-te dentro de casa se as autoridades o pedirem.',
          'Fecha as portas, as janelas e os estores.',
          'Desliga a ventilação, o ar condicionado e os sistemas de arejamento.',
          'Tira os teus comprimidos de iodo e mantém-nos à mão.',
        ],
      },
      { type: 'h2', text: 'Os comprimidos de iodo' },
      {
        type: 'p',
        text: 'São comprimidos de iodeto de potássio. Podes obtê-los na tua comuna. Guarda-os no teu kit.',
      },
      {
        type: 'p',
        text: 'Em geral, destinam-se a pessoas com menos de 45 anos. Acima dessa idade, em geral não são aconselhados.',
      },
      {
        type: 'note',
        text: 'Toma os comprimidos de iodo apenas quando as autoridades o pedirem. Nunca antes, e nunca «por precaução».',
      },
      { type: 'h2', text: 'Saber mais' },
      {
        type: 'p',
        text: 'A brochura «O que fazer em caso de alerta nuclear?» está disponível em infocrise.lu.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      {
        label: 'infocrise.lu: o que fazer em caso de alerta nuclear',
        url: 'https://infocrise.lu',
      },
      { label: 'LU-Alert: alertas oficiais', url: 'https://lu-alert.lu' },
    ],
  },
  {
    slug: 'kit-et-plan',
    title: 'O teu kit e o teu plano',
    summary: 'Preparar-te em três etapas: o kit, o plano de emergência e falar disso à tua volta.',
    chapter: 'preparer',
    pose: 'plan',
    blocks: [
      {
        type: 'p',
        text: 'Preparares-te ajuda-te a manter a calma e a reagir bem. Podes começar já hoje, em três etapas.',
      },
      {
        type: 'steps',
        items: [
          'Prepara o teu kit para 72 horas.',
          'Preenche o teu plano pessoal de emergência.',
          'Fala disso à tua volta e oferece a tua ajuda.',
        ],
      },
      { type: 'h2', text: '1. O teu kit' },
      {
        type: 'p',
        text: 'O kit contém o necessário para viveres em casa alguns dias, se as lojas ou os serviços deixarem de funcionar.',
      },
      {
        type: 'list',
        items: [
          'Vê primeiro o que já tens em casa.',
          'Acrescenta aquilo de que a tua casa precisa: produtos para bebé ou criança, comida para animais, medicamentos.',
          'Guarda o kit num sítio seguro, de fácil acesso e que todos em casa conheçam.',
          'Verifica as datas pelo menos duas vezes por ano.',
          'Prepara também uma mochila para levar se tiveres de sair de casa.',
        ],
      },
      {
        type: 'p',
        text: 'Esta mochila deve ser leve e fácil de transportar. Põe lá o essencial: água, medicamentos e receitas médicas, snacks, telemóvel e bateria externa, documentos, dinheiro em notas e moedas, chaves e estojo de primeiros socorros.',
      },
      { type: 'h2', text: '2. O teu plano pessoal de emergência' },
      {
        type: 'p',
        text: 'Este plano organiza a tua casa com antecedência. Preenche-o com todas as pessoas que vivem contigo. Contém:',
      },
      {
        type: 'list',
        items: [
          'as pessoas da casa, as suas necessidades de saúde e os teus animais;',
          'onde ficam as torneiras de corte da água e do gás, o contador, o disjuntor e o kit;',
          'as pessoas que te podem ajudar, e aquelas que tu podes ajudar;',
          'dois sítios onde se reencontrarem se estiverem separados;',
          'como dar notícias sem telefone;',
          'quem pode ir buscar as crianças à escola;',
          'os números úteis.',
        ],
      },
      {
        type: 'note',
        text: 'Guarda sempre uma cópia em papel do teu plano. Sem eletricidade, o teu telemóvel pode ficar sem bateria.',
      },
      { type: 'h2', text: '3. Fala disso' },
      {
        type: 'p',
        text: 'Isto diz respeito a todos nós. Fala da tua preparação com os teus próximos e os teus vizinhos. Incentiva-os a fazerem o seu kit.',
      },
      {
        type: 'p',
        text: 'Pensa nas pessoas sozinhas ou frágeis. E se tu precisares de ajuda, pede a alguém próximo ou a um vizinho.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'Lëtz prepare!, a estratégia nacional', url: 'https://letzprepare.public.lu' },
    ],
  },
  {
    slug: 'entraide',
    title: 'Entreajudar-se',
    summary: 'Ajudar os vizinhos, aprender primeiros socorros e cuidar uns dos outros.',
    chapter: 'preparer',
    pose: 'fete',
    blocks: [
      {
        type: 'p',
        text: 'Durante uma crise, os laços entre vizinhos contam muito. As primeiras horas podem ser difíceis, mesmo que os serviços de socorro estejam bem preparados. A ajuda de cada um completa o trabalho deles.',
      },
      { type: 'h2', text: 'Cada um tem um papel' },
      {
        type: 'p',
        text: 'Conheces o teu bairro e as pessoas que podem precisar de ajuda. Mantém-te atento a elas.',
      },
      {
        type: 'list',
        items: [
          'Ajuda alguém próximo a preparar o seu kit.',
          'Partilha o que sabes fazer, ou o teu material.',
          'Procura saber notícias das pessoas idosas, sozinhas ou doentes.',
          'Anota no teu plano quem te pode ajudar e quem tu podes ajudar.',
        ],
      },
      {
        type: 'p',
        text: 'A solidariedade constrói-se todos os dias, não só durante uma crise.',
      },
      { type: 'h2', text: 'Aprender primeiros socorros' },
      {
        type: 'p',
        text: 'Em poucas horas, podes aprender os gestos que salvam uma vida. A Cruz Vermelha luxemburguesa e o CGDIS oferecem formações em todo o país.',
      },
      {
        type: 'p',
        text: 'Queres envolver-te mais? Podes tornar-te bombeiro voluntário no CGDIS, na tua comuna.',
      },
      { type: 'h2', text: 'Precisas de falar?' },
      {
        type: 'p',
        text: 'Durante uma crise, é normal sentir stress, medo ou sentir-se isolado.',
      },
      { type: 'p', text: 'Para apoiar alguém, alguns gestos simples ajudam:' },
      {
        type: 'list',
        items: [
          'ouvir com gentileza, sem julgar;',
          'tranquilizar;',
          'ajudar a pessoa a recuperar as suas referências habituais;',
          'se for preciso, encaminhá-la para alguém próximo, um profissional ou um serviço de apoio.',
        ],
      },
      {
        type: 'p',
        text: 'Passar por casa de um vizinho ou ficar perto de uma pessoa em dificuldade já faz uma verdadeira diferença. E se és tu que não estás bem, não hesites em falar disso. O serviço de escuta SOS Détresse também te pode ajudar.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'Cruz Vermelha luxemburguesa', url: 'https://www.croix-rouge.lu' },
      { label: 'Cursos de primeiros socorros do CGDIS', url: 'https://cours.cgdis.lu' },
    ],
  },
  {
    slug: 'contacts-utiles',
    title: 'Contactos úteis',
    summary: 'Os números de emergência e os sites oficiais para ter sempre à mão.',
    chapter: 'preparer',
    pose: 'bonjour',
    blocks: [
      { type: 'h2', text: 'Números de emergência' },
      {
        type: 'list',
        items: [
          '112: socorro do CGDIS (bombeiros, ambulância).',
          '113: Polícia.',
          '8002 7788: número verde gratuito, que pode ser aberto durante uma crise.',
        ],
      },
      {
        type: 'note',
        text: 'Liga para o 112 ou o 113 só em caso de verdadeira urgência. Nunca os marques para experimentar.',
      },
      {
        type: 'p',
        text: 'Durante uma crise, telefona o menos possível. Assim, deixas as linhas livres para os serviços de socorro.',
      },
      { type: 'h2', text: 'Anota-os em papel' },
      {
        type: 'p',
        text: 'Escreve também os números dos teus próximos, do teu médico, da escola e do teu trabalho. Acrescenta os dos teus fornecedores: eletricidade, gás, água, telefone, seguro e banco. Guarda esta lista no teu kit.',
      },
      { type: 'h2', text: 'A tua comuna' },
      {
        type: 'p',
        text: 'A tua comuna também te informa: site, afixação, boletim, reuniões e aplicações. Prepara um plano adaptado aos riscos do teu território.',
      },
      { type: 'h2', text: 'Os sites oficiais' },
      {
        type: 'p',
        text: 'Confia apenas nas fontes oficiais. Encontras as principais aqui em baixo.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert: alertas e instruções', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu: gestos certos e gestão de crises', url: 'https://infocrise.lu' },
      {
        label: 'Lëtz prepare!: a estratégia nacional de resiliência',
        url: 'https://letzprepare.public.lu',
      },
      { label: '112.lu: urgências, conselhos e serviços de turno', url: 'https://112.lu' },
      { label: 'police.lu: Polícia Grão-Ducal', url: 'https://police.lu' },
      { label: 'inondations.lu: informações sobre as cheias', url: 'https://www.inondations.lu' },
      { label: 'seveso.lu: instalações industriais de risco', url: 'https://www.seveso.lu' },
      { label: 'meteolux.lu: previsões e alertas meteorológicos', url: 'https://www.meteolux.lu' },
      { label: 'cours.cgdis.lu: cursos de primeiros socorros', url: 'https://cours.cgdis.lu' },
      {
        label: 'santesecu.public.lu: urgências, serviços de turno, ondas de calor',
        url: 'https://santesecu.public.lu',
      },
    ],
  },
];
