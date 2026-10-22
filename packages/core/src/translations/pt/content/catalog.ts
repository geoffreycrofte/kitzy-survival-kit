import type { ContentTranslation } from '../../types';

export const catalog: ContentTranslation['catalog'] = {
  items: {
    // Água
    'drinking-water': {
      name: 'Água potável engarrafada',
      hint: 'Conta com 3 L por pessoa e por dia, mais a água dos animais.',
    },
    'empty-water-containers': {
      name: 'Recipientes vazios para água',
      hint: 'Garrafas ou jerricã dobrável: enche-os na torneira assim que for dado um alerta.',
    },
    'water-purification': {
      name: 'Pastilhas de purificação ou filtro de água',
      hint: 'A tua solução de recurso se as garrafas acabarem.',
    },
    bucket: {
      name: 'Balde de 10 L',
      hint: 'Para ir buscar água ou improvisar uma sanita de emergência.',
    },

    // Refeições
    'non-perishable-food': {
      name: 'Alimentos não perecíveis',
      hint: 'Escolhe primeiro comida pronta a comer: cerca de 2000 kcal por adulto e por dia.',
    },
    'snacks-energy-bars': {
      name: 'Bolachas, frutos secos e barras',
      hint: 'Leves e prontos a comer, safam-te sem cozinhar nem lavar loiça.',
    },
    'pet-food': {
      name: 'Comida para animais',
      hint: 'Prevê a ração habitual de cada animal, conforme a espécie e o peso.',
    },
    'canned-meals': {
      name: 'Conservas',
      hint: 'Pratos cozinhados, legumes, peixe ou leguminosas: comem-se mesmo frios.',
    },
    'pasta-rice': {
      name: 'Massa, arroz ou flocos de aveia',
      hint: 'Lembra-te de guardar água extra para os cozinhar.',
    },
    'long-life-milk': {
      name: 'Leite UHT ou em pó',
      hint: 'Conserva-se meses sem frigorífico, enquanto o pacote estiver fechado.',
    },
    'fruit-pouches': {
      name: 'Pacotes de fruta para espremer',
      hint: 'Práticos para as crianças: sem colher, sem loiça.',
    },
    'comfort-pantry': {
      name: 'Café, chá, açúcar, sal e chocolate',
      hint: 'Uma bebida quente ou um quadradinho de chocolate ajudam a manter o ânimo.',
    },
    'baby-food': {
      name: 'Leite para bebé e boiões',
      hint: 'Mantém a marca habitual do teu bebé e água para preparar os biberões.',
    },
    'special-diet-food': {
      name: 'Alimentos para dietas específicas',
      hint: 'Sem glúten, para diabéticos… conforme as necessidades de saúde da casa.',
    },

    // Cozinhar
    'camping-stove': {
      name: 'Fogareiro de campismo a gás',
      hint: 'Permite aquecer um prato ou água quando o fogão deixa de funcionar.',
      safety:
        'Risco de monóxido de carbono: usa-o lá fora ou numa divisão muito arejada, nunca para aquecer a casa.',
    },
    'gas-cartridges': {
      name: 'Cartuchos de gás',
      hint: 'Um ou dois chegam para 72 h: verifica-os uma vez por ano.',
    },
    'manual-can-opener': {
      name: 'Abre-latas manual',
      hint: 'Sem ele, as tuas conservas ficam fechadas: o elétrico não serve de nada sem corrente.',
    },
    cookware: {
      name: 'Tacho, talheres e copo',
      hint: 'Basta um tacho pequeno que caiba no fogareiro.',
    },
    'foil-freezer-bags': {
      name: 'Papel de alumínio e sacos de congelação',
      hint: 'Para tapar, embrulhar e guardar as sobras de forma limpa.',
    },
    'reusable-dishes': {
      name: 'Pratos e copos reutilizáveis',
      hint: 'Leves e inquebráveis, evitam gastar água com loiça frágil.',
    },
    'dish-soap-sponge': {
      name: 'Detergente da loiça e esponja',
      hint: 'Um frasco pequeno chega para lavar com muito pouca água.',
    },

    // Luz e energia
    flashlight: {
      name: 'Lanterna e 2 conjuntos de pilhas',
      hint: 'Ou uma lanterna de manivela, que funciona sem pilhas.',
    },
    headlamp: {
      name: 'Lanterna de cabeça',
      hint: 'Deixa-te as duas mãos livres para cozinhar ou tratar de alguém.',
    },
    'candles-matches': {
      name: 'Velas e fósforos ou isqueiro',
      hint: 'Uma luz suave que não depende de pilhas nem de corrente.',
      safety:
        'Nunca deixes uma vela acesa sem vigilância; mantém-na longe das cortinas e das crianças.',
    },
    'power-bank': {
      name: 'Bateria externa e cabos',
      hint: 'Para carregar o telemóvel: mantém-na carregada e recarrega-a de 3 em 3 meses.',
    },
    'device-chargers': {
      name: 'Carregadores do telemóvel e do computador',
      hint: 'Guarda-os com o kit para não teres de os procurar no dia.',
    },
    'spare-batteries': {
      name: 'Pilhas de reserva',
      hint: 'AA, AAA e os formatos dos teus aparelhos: verifica a data na embalagem.',
    },
    'storm-matches': {
      name: 'Fósforos à prova de vento em caixa estanque',
      hint: 'Acendem-se mesmo com vento ou chuva.',
    },
    'spare-lighter': {
      name: 'Isqueiro de reserva',
      hint: 'Pequeno e leve, substitui os fósforos se estiverem molhados.',
    },
    'led-lantern': {
      name: 'Lanterna LED de mesa',
      hint: 'Ilumina uma divisão inteira e é bem mais segura do que uma vela.',
    },
    'light-sticks': {
      name: 'Bastões luminosos',
      hint: 'Sem pilhas nem chama: tranquilizam as crianças à noite.',
    },
    'solar-panel': {
      name: 'Painel solar USB dobrável',
      hint: 'Útil se o corte durar: carrega o telemóvel e a bateria ao sol.',
    },

    // Calor e roupa
    'sleeping-bags-blankets': {
      name: 'Saco-cama ou cobertor',
      hint: 'Sem aquecimento, a casa arrefece depressa: um por pessoa.',
    },
    'change-of-clothes': {
      name: 'Roupa e calçado de muda',
      hint: 'Adapta-os à estação e ao tamanho atual das crianças.',
    },
    'warm-clothes': {
      name: 'Gorro, luvas e polar',
      hint: 'Perde-se muito calor pela cabeça e pelas mãos.',
    },
    'emergency-blanket': {
      name: 'Manta térmica de emergência',
      hint: 'Pesa poucos gramas e conserva o calor do corpo.',
    },
    'rain-poncho': {
      name: 'Poncho ou casaco impermeável',
      hint: 'Manter-se seco é manter-se quente.',
    },
    'walking-shoes': {
      name: 'Calçado de caminhada resistente',
      hint: 'Escolhe um par já usado, para evitar bolhas.',
    },
    'hand-warmers': {
      name: 'Aquecedores de mãos',
      hint: 'Um calor instantâneo para as mãos ou os pés.',
    },

    // Cuidados
    'first-aid-kit': {
      name: 'Estojo de primeiros socorros',
      hint: 'Pensos, compressas, desinfetante e paracetamol, no mínimo.',
    },
    'prescription-medication': {
      name: 'Medicamentos do tratamento em curso',
      hint: 'Guarda alguns dias de reserva e uma cópia da receita.',
      safety: 'Constitui a tua reserva com o conselho do teu médico ou farmacêutico.',
    },
    'potassium-iodide': {
      name: 'Comprimidos de iodo',
      hint: 'Estão disponíveis gratuitamente na tua câmara municipal (comuna).',
      safety:
        'Toma-os apenas por indicação das autoridades, em geral para pessoas com menos de 45 anos.',
    },
    'bandages-tape': {
      name: 'Ligadura elástica e adesivo',
      hint: 'Para segurar uma entorse ou um penso compressivo.',
    },
    'tweezers-tick-remover': {
      name: 'Pinça e tira-carraças',
      hint: 'As carraças são frequentes nas florestas do país: retira-as depressa.',
    },
    thermometer: {
      name: 'Termómetro',
      hint: 'Para vigiar uma febre quando é difícil ver um médico.',
    },
    'oral-rehydration-salts': {
      name: 'Sais de reidratação oral',
      hint: 'Em caso de diarreia ou vómitos, sobretudo nas crianças.',
    },
    'ffp2-masks': {
      name: 'Máscaras FFP2',
      hint: 'Protegem de poeiras, fumos e vírus.',
    },
    'disposable-gloves': {
      name: 'Luvas descartáveis de nitrilo',
      hint: 'Para tratar uma ferida ou mexer em lixo sem riscos.',
    },
    'spare-glasses': {
      name: 'Óculos de reserva ou lentes de contacto',
      hint: 'Um par antigo com a tua graduação serve, com o líquido para as lentes.',
    },
    'otc-medication': {
      name: 'Anti-histamínico e antidiarreico',
      hint: 'Para pequenos problemas comuns, quando a farmácia está fechada.',
      safety: 'Pede conselho ao teu farmacêutico antes de os escolher.',
    },
    'medical-device-batteries': {
      name: 'Pilhas para aparelho auditivo e equipamento médico',
      hint: 'Pensa em todos os aparelhos de saúde que nunca podem parar.',
    },
    'sunscreen-insect-repellent': {
      name: 'Protetor solar e repelente de mosquitos',
      hint: 'Útil se tiveres de ficar muito tempo ao ar livre depois de uma evacuação.',
    },

    // Higiene
    'wet-wipes': {
      name: 'Toalhitas húmidas',
      hint: 'Para te lavares sem água quando a torneira está cortada.',
    },
    'toilet-paper': {
      name: 'Papel higiénico',
      hint: 'Conta com cerca de dois rolos por pessoa para 72 h.',
    },
    'hand-sanitizer': {
      name: 'Gel desinfetante',
      hint: 'Para manter as mãos limpas antes de comer ou de tratar de alguém.',
    },
    toiletries: {
      name: 'Sabonete e desodorizante',
      hint: 'Os formatos de viagem chegam e ocupam pouco espaço.',
    },
    'toothbrush-kit': {
      name: 'Escova e pasta de dentes',
      hint: 'Uma escova por pessoa, com um tubo pequeno de pasta.',
    },
    'menstrual-products': {
      name: 'Produtos de higiene menstrual',
      hint: 'Leva-os mesmo fora do período: o stress pode antecipar a menstruação.',
    },
    'emergency-toilet': {
      name: 'Sanita de emergência',
      hint: 'Um balde, sacos e areia para gatos: o autoclismo pode deixar de funcionar.',
    },
    'diapers-baby-wipes': {
      name: 'Fraldas e toalhitas para bebé',
      hint: 'Leva o tamanho atual e confirma-o a cada verificação do kit.',
    },
    'microfiber-towel': {
      name: 'Toalha de microfibra',
      hint: 'Leve, compacta e seca depressa.',
    },
    'unscented-bleach': {
      name: 'Lixívia sem perfume',
      hint: 'Para desinfetar superfícies e a sanita de emergência.',
    },

    // Documentos e dinheiro
    'document-copies': {
      name: 'Cópias dos documentos importantes',
      hint: 'Identificação, passaporte, carta de condução e seguros, numa bolsa estanque.',
    },
    cash: {
      name: 'Dinheiro vivo',
      hint: 'Em notas pequenas e moedas: multibancos e terminais de pagamento vão abaixo com a corrente.',
    },
    wallet: {
      name: 'Carteira com documentos e cartões',
      hint: 'Documentos de identificação, cartões e algum dinheiro, para levar ao sair.',
    },
    'spare-keys': {
      name: 'Cópia das chaves de casa e do carro',
      hint: 'Para não ficares trancado do lado de fora se saíres à pressa.',
    },
    'medical-records': {
      name: 'Receitas e boletim de vacinas',
      hint: 'Anota também o grupo sanguíneo e as alergias de cada um.',
    },
    'family-photos': {
      name: 'Fotos recentes da família e dos animais',
      hint: 'Ajudam a encontrar uma pessoa ou um animal perdido.',
    },
    'encrypted-usb-backup': {
      name: 'Pen USB encriptada com os teus documentos',
      hint: 'Uma cópia digital protegida por uma palavra-passe forte.',
    },
    'pet-documents': {
      name: 'Boletim sanitário do animal',
      hint: 'Com o número do microchip, útil se for preciso confiá-lo a alguém ou encontrá-lo.',
    },

    // Informar-se
    'crank-radio': {
      name: 'Rádio a pilhas ou de manivela',
      hint: 'Em FM ou DAB+: numa crise, ouve a RTL ou a rádio 100,7. Testa-o todos os meses.',
    },
    'emergency-contacts-paper': {
      name: 'Lista de números úteis em papel',
      hint: 'O telemóvel pode desligar-se: revê a lista uma vez por ano.',
    },
    'emergency-plan': {
      name: 'Plano pessoal de emergência impresso',
      hint: 'Quem faz o quê, onde se encontrar: o Kitzy ajuda-te a preenchê-lo.',
    },
    'mobile-phone': {
      name: 'Telemóvel e respetivo carregador',
      hint: 'Com a LU-Alert instalada, para receberes os alertas da tua zona.',
    },

    // Ferramentas
    'pocket-knife': {
      name: 'Canivete multifunções',
      hint: 'Um canivete suíço resolve a maioria das pequenas necessidades.',
    },
    scissors: {
      name: 'Tesoura',
      hint: 'Para cortar ligaduras, fita adesiva ou embalagens.',
    },
    'pen-pencil-notebook': {
      name: 'Caneta, lápis e caderno',
      hint: 'O lápis escreve mesmo em papel molhado.',
    },
    multitool: {
      name: 'Alicate multifunções',
      hint: 'Alicate, chave de fendas e lâmina reunidos numa só ferramenta.',
    },
    'duct-tape': {
      name: 'Fita adesiva reforçada',
      hint: 'Para reparar, tapar buracos ou vedar uma janela.',
    },
    paracord: {
      name: 'Corda fina (paracord)',
      hint: 'Cerca de 15 m: para atar, pendurar ou esticar uma lona.',
    },
    'zip-ties': {
      name: 'Abraçadeiras',
      hint: 'Práticas para fixar depressa e com firmeza.',
    },
    'work-gloves': {
      name: 'Luvas de trabalho',
      hint: 'Para desimpedir ou mexer em destroços sem te magoares.',
    },
    'plastic-tarp': {
      name: 'Lona de plástico',
      hint: 'Para um abrigo, uma janela partida ou proteger material da chuva.',
    },
    'heavy-duty-trash-bags': {
      name: 'Sacos do lixo resistentes',
      hint: 'Lixo, sanita de emergência ou poncho improvisado.',
    },
    'utility-shutoff-key': {
      name: 'Chave para cortar o gás e a água',
      hint: 'Localiza já as tuas válvulas e anota-as no teu plano.',
    },
    'fire-extinguisher-blanket': {
      name: 'Extintor e manta corta-fogo',
      hint: 'Guarda-os perto da cozinha e manda verificar o extintor.',
    },
    'smoke-co-detector': {
      name: 'Detetor de fumo e de CO',
      hint: 'Acorda-te em caso de incêndio ou de monóxido de carbono.',
    },
    whistle: {
      name: 'Apito',
      hint: 'Ouve-se ao longe e cansa menos do que gritar.',
    },
    'paper-map-compass': {
      name: 'Mapa em papel da região e bússola',
      hint: 'O GPS e a rede podem falhar, o papel não.',
    },
    'thick-rope': {
      name: 'Corda grossa',
      hint: 'Cerca de 10 m, para puxar ou amarrar uma carga pesada.',
    },
    carabiners: {
      name: 'Mosquetões',
      hint: 'Para prender cantil, lanterna ou saco por fora da mochila.',
    },
    'sewing-kit': {
      name: 'Kit de costura',
      hint: 'Linha, agulhas e alfinetes de dama para remendar uma peça de roupa ou uma mochila.',
    },

    // Ânimo e família
    'games-books': {
      name: 'Baralhos de cartas, jogos de tabuleiro e livros',
      hint: 'Sem ecrãs, o tempo passa melhor em conjunto, sobretudo para as crianças.',
    },
    'comfort-toy': {
      name: 'Peluche ou brinquedo preferido',
      hint: 'Um objeto familiar tranquiliza muito uma criança longe de casa.',
    },
    treats: {
      name: 'Guloseimas',
      hint: 'Um pequeno mimo faz bem quando o dia é longo.',
    },

    // A mochila
    backpack: {
      name: 'Mochila resistente',
      hint: 'Uma por cada pessoa capaz de a carregar: mantém-na leve e fácil de transportar.',
    },
    'storage-bin': {
      name: 'Caixa etiquetada para a reserva',
      hint: 'Guarda-a num local seguro, acessível e conhecido por toda a casa.',
    },
    'dry-bags': {
      name: 'Sacos estanques ou sacos com fecho zip',
      hint: 'Para manter secos os documentos, os fósforos e os aparelhos eletrónicos.',
    },
  },
  categories: {
    water: 'Água',
    food: 'Refeições',
    cooking: 'Cozinhar',
    light: 'Luz e energia',
    warmth: 'Calor e roupa',
    care: 'Cuidados de saúde',
    hygiene: 'Higiene',
    documents: 'Documentos e dinheiro',
    info: 'Informar-se',
    tools: 'Ferramentas',
    morale: 'Ânimo e família',
    bag: 'A mochila',
  },
};
