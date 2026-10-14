import type { GuidePage } from '../guide';

/**
 * Guide pratique de Kitzy.
 *
 * Contenu reformulé, simplifié et résumé à partir du guide officiel
 * « Mon guide 72h d’autonomie » (Lëtz prepare!, HCPN, 2026).
 * Ce n’est pas une copie du texte officiel : en cas de doute, la source officielle fait foi.
 */

const OFFICIAL_GUIDE = {
  label: 'Le guide officiel Lëtz prepare!',
  url: 'https://letzprepare.public.lu/fr/guide.html',
};

export const GUIDE: readonly GuidePage[] = [
  {
    slug: 'pourquoi-72-heures',
    title: 'Pourquoi 72 heures ?',
    summary: 'Trois jours d’autonomie, c’est le temps qu’il faut aux secours pour s’organiser.',
    chapter: 'comprendre',
    pose: 'lecture',
    blocks: [
      {
        type: 'p',
        text: 'Une tempête, une inondation, une grande coupure de courant ou une cyberattaque peuvent changer ton quotidien. L’eau, l’électricité, le téléphone ou Internet peuvent alors manquer.',
      },
      {
        type: 'p',
        text: 'Personne ne sait à l’avance combien de temps cela peut durer. C’est pour cela qu’il est utile de se préparer, calmement et sans s’inquiéter.',
      },
      { type: 'h2', text: 'Pourquoi trois jours ?' },
      {
        type: 'p',
        text: 'Les premières heures d’une crise sont souvent les plus difficiles. Les secours doivent d’abord comprendre la situation et s’organiser. Ils aident en priorité les personnes les plus fragiles.',
      },
      {
        type: 'p',
        text: 'Avec des réserves pour 72 heures, tu couvres tes besoins de base pendant ce temps : boire, manger, t’éclairer, te soigner et rester informé.',
      },
      {
        type: 'p',
        text: 'Beaucoup de pays européens conseillent cette même durée. Elle vient de l’expérience des crises récentes.',
      },
      { type: 'h2', text: 'Une responsabilité partagée' },
      {
        type: 'p',
        text: 'L’État et les communes travaillent ensemble pour protéger la population. Mais ils ne peuvent pas tout faire seuls. Chaque personne peut aider, à son niveau.',
      },
      {
        type: 'p',
        text: 'En 2025, le Luxembourg a lancé la stratégie nationale de résilience « Lëtz prepare! ». La résilience, c’est la capacité à faire face à une difficulté, puis à revenir à une vie normale.',
      },
      { type: 'h2', text: 'Ce que la préparation change' },
      {
        type: 'list',
        items: [
          'Tu réagis plus vite et avec plus de calme.',
          'Tu protèges ta famille et ton logement.',
          'Tu peux aider tes proches et tes voisins.',
          'Les secours peuvent se concentrer sur les cas les plus urgents.',
        ],
      },
      {
        type: 'p',
        text: 'Quelques gestes simples suffisent. Tu n’as pas besoin de tout faire en un jour : avance pas à pas.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'Lëtz prepare!, la stratégie nationale', url: 'https://letzprepare.public.lu' },
    ],
  },
  {
    slug: 'a-quoi-se-preparer',
    title: 'À quoi se préparer ?',
    summary: 'Les principaux risques au Luxembourg et les bons réflexes pour chacun.',
    chapter: 'comprendre',
    pose: 'lecture',
    blocks: [
      {
        type: 'p',
        text: 'Au Luxembourg, plusieurs types de crises peuvent toucher ton quotidien. Voici les principales, avec les gestes utiles pour chacune.',
      },
      { type: 'h2', text: 'Météo : tempête, neige, verglas, canicule' },
      {
        type: 'list',
        items: [
          'Reste à l’intérieur et limite tes déplacements.',
          'Si tu dois sortir, dis à un proche où tu vas.',
          'Prends des nouvelles de tes proches.',
          'En cas de tempête, range ou attache ce qui peut s’envoler.',
          'En cas de canicule, suis les conseils de santé de santesecu.public.lu.',
        ],
      },
      { type: 'h2', text: 'Inondations' },
      {
        type: 'list',
        items: [
          'Ne prends aucun risque.',
          'Vérifie si ton logement est en zone inondable (inondations.lu, eau.geoportail.lu).',
          'Garde les gouttières, les fossés et les évacuations bien dégagés.',
          'Monte les appareils électriques et les produits polluants plus haut que la cave.',
          'Si tu as encore le temps, éloigne ta voiture et coupe le courant dans les pièces à risque.',
          'Évite les routes inondées, les berges, les sous-sols et les parkings souterrains.',
          'Ne marche jamais dans une eau qui peut être en contact avec l’électricité.',
        ],
      },
      { type: 'h2', text: 'Cyberattaques' },
      {
        type: 'list',
        items: [
          'Une demande étrange ? Contacte toi-même la personne ou l’organisme, avec ses coordonnées officielles.',
          'Ne clique pas sur les liens des messages suspects : va directement sur le site.',
          'Ne donne jamais tes mots de passe, tes codes ou tes données bancaires.',
          'Utilise un mot de passe long et différent pour chaque compte, et la double authentification.',
          'Fais les mises à jour et garde des copies de tes documents et photos.',
        ],
      },
      {
        type: 'p',
        text: 'Si tu es victime : garde les preuves, change tes mots de passe, appelle ta banque en cas de fraude et débranche l’appareil touché du réseau.',
      },
      { type: 'h2', text: 'Menace terroriste' },
      {
        type: 'list',
        items: [
          'Reste attentif dans les lieux où il y a beaucoup de monde.',
          'Signale un objet ou un comportement suspect à la police, sans t’en approcher.',
          'En cas d’attaque, éloigne-toi si tu peux. Sinon, mets-toi à l’abri et reste discret.',
          'Appelle les secours dès que tu peux le faire sans danger, puis suis leurs consignes.',
        ],
      },
      { type: 'h2', text: 'Accident nucléaire' },
      {
        type: 'p',
        text: 'Ce risque est très peu probable. Les gestes à connaître sont expliqués dans la page « Accident nucléaire ».',
      },
      { type: 'h2', text: 'Grande coupure d’électricité' },
      {
        type: 'p',
        text: 'Elle aurait des effets sur beaucoup de services à la fois. La page « Grande coupure d’électricité » t’explique quoi faire.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert : alertes officielles', url: 'https://lu-alert.lu' },
      { label: 'MeteoLux : prévisions et alertes météo', url: 'https://www.meteolux.lu' },
      { label: 'Inondations : informations sur les crues', url: 'https://www.inondations.lu' },
      { label: 'Santé et sécurité : canicule et urgences', url: 'https://santesecu.public.lu' },
      { label: 'Cybersécurité : conseils pratiques', url: 'https://www.cybersecurity.lu' },
    ],
  },
  {
    slug: 'coupure-electricite',
    title: 'Grande coupure d’électricité',
    summary: 'Ce qui peut s’arrêter, les bons gestes et un exemple de trois jours sans courant.',
    chapter: 'comprendre',
    pose: 'lanterne',
    blocks: [
      {
        type: 'p',
        text: 'Une coupure de courant dans tout le pays est peu probable. Mais elle aurait de grandes conséquences, car presque tout dépend de l’électricité.',
      },
      { type: 'h2', text: 'Ce qui peut s’arrêter' },
      {
        type: 'list',
        items: [
          'Logement : plus de lumière, de frigo, de cuisson, de chauffage ni d’ascenseur.',
          'Téléphone et Internet : réseaux instables, appels difficiles, secours difficiles à joindre.',
          'Eau : le robinet, les WC et la douche peuvent ne plus fonctionner.',
          'Transports : feux éteints, trains et bus perturbés, pompes à essence en panne.',
          'Argent et courses : distributeurs et cartes bancaires hors service, magasins fermés.',
          'Santé : hôpitaux et secours ralentis.',
          'Eaux usées et déchets : débordements possibles en cas de forte pluie, collecte retardée.',
        ],
      },
      { type: 'h2', text: 'Les bons réflexes' },
      {
        type: 'list',
        items: [
          'Remplis des bouteilles et des récipients tant que l’eau coule encore.',
          'Ouvre le moins possible le frigo et le congélateur.',
          'Ferme les volets pour garder la chaleur.',
          'Mets ton téléphone en mode économie d’énergie. Recharge-le avec une batterie externe.',
          'Écoute la radio à piles, à manivelle ou celle de ta voiture : RTL et radio 100,7.',
          'Limite tes déplacements et reste près de chez toi.',
          'Avant le retour du courant, débranche frigo, congélateur, télévision, ordinateur et voiture électrique.',
          'Va voir tes voisins, surtout les plus fragiles.',
        ],
      },
      {
        type: 'note',
        text: 'N’utilise jamais de barbecue, de brasero, de groupe électrogène ou d’autre appareil prévu pour l’extérieur dans un lieu fermé. Ils produisent du monoxyde de carbone : un gaz invisible, sans odeur et mortel.',
      },
      { type: 'h2', text: 'Et si c’était toi ? Trois jours sans courant' },
      {
        type: 'p',
        text: 'Jour 1. Un lundi de janvier, le courant s’arrête pendant que tu es au travail. Les lignes de téléphone sont saturées. Un message LU-Alert conseille d’écouter RTL et la radio 100,7. Il n’y a plus de train : une collègue te ramène en voiture. Le soir, tu sors ta lampe, tes couvertures et ton réchaud à gaz.',
      },
      {
        type: 'p',
        text: 'Jour 2. L’eau ne coule plus et la maison se refroidit. Tu utilises tes réserves, tu économises ta batterie et tu écoutes la radio. Des rumeurs circulent : tu partages seulement les informations officielles. Tes voisins t’invitent à te réchauffer près de leur cheminée.',
      },
      {
        type: 'p',
        text: 'Jour 3. Le quartier s’organise pour s’entraider. La commune ouvre une salle chauffée pour boire chaud, s’informer et recharger les téléphones. Puis la radio annonce le retour du courant, zone par zone. De retour chez toi, tu fais le point. De quoi as-tu manqué ? Que faudra-t-il compléter ?',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'infocrise.lu : informations en cas de crise', url: 'https://infocrise.lu' },
      { label: 'LU-Alert : alertes officielles', url: 'https://lu-alert.lu' },
    ],
  },
  {
    slug: 'alerte-lu-alert',
    title: 'LU-Alert, l’alerte officielle',
    summary: 'Comment les autorités t’alertent et ce que veulent dire les niveaux de vigilance.',
    chapter: 'alerte',
    pose: 'bonjour',
    blocks: [
      {
        type: 'p',
        text: 'LU-Alert est le système national d’alerte et d’information. Les autorités l’utilisent pour te prévenir vite en cas de danger.',
      },
      {
        type: 'p',
        text: 'LU-Alert t’informe avant un événement, pour que tu puisses te préparer. Il t’aide pendant, pour te protéger. Parfois, il te dit aussi quand le danger est passé.',
      },
      { type: 'h2', text: 'Plusieurs canaux en même temps' },
      {
        type: 'p',
        text: 'Le même message passe par plusieurs canaux. Comme ça, il a plus de chances d’arriver jusqu’à toi.',
      },
      {
        type: 'list',
        items: [
          'Le site lu-alert.lu : tous les messages y sont publiés.',
          'L’application LU-Alert, gratuite : tu choisis les sujets, les niveaux et les zones. Les alertes moins graves, par exemple sur l’alimentation, passent en général seulement par l’application.',
          'Le SMS géolocalisé : il est envoyé à toutes les personnes présentes dans la zone en danger, quel que soit leur opérateur.',
          'Le Cell Broadcast : un message prioritaire sur tous les téléphones compatibles de la zone, avec un son et une vibration, même en mode silencieux.',
          'Les sirènes, pour un danger important ou imminent.',
          'Les médias : radio, télévision, presse et sites d’information.',
        ],
      },
      { type: 'h2', text: 'Les 4 niveaux de vigilance' },
      {
        type: 'p',
        text: 'Quand une situation s’aggrave peu à peu, on parle de scénario progressif. Il a trois niveaux :',
      },
      {
        type: 'list',
        items: [
          'Niveau jaune, « Soyez attentifs » : risque faible, danger possible.',
          'Niveau orange, « Soyez prudents » : risque moyen, il y a un danger.',
          'Niveau rouge, « Vigilance absolue » : risque élevé, danger important.',
        ],
      },
      {
        type: 'p',
        text: 'Quand le danger est tout proche, on parle de scénario imminent. Il a un seul niveau : le niveau violet, danger imminent. Il faut agir tout de suite.',
      },
      {
        type: 'p',
        text: 'Le niveau et le canal sont choisis par l’autorité concernée selon la gravité. Par exemple MeteoLux, la Police, le CGDIS ou l’Administration de la gestion de l’eau.',
      },
      { type: 'h2', text: 'La radio, le canal le plus solide' },
      {
        type: 'p',
        text: 'Si le courant ou le réseau mobile est coupé, la radio continue souvent de fonctionner. Garde une radio à piles ou à manivelle. La radio de ta voiture peut aussi servir. Écoute RTL ou la radio 100,7.',
      },
      {
        type: 'p',
        text: 'Conseil : installe l’application LU-Alert dès maintenant. Elle est gratuite sur l’App Store et sur Google Play.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert : alertes officielles', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu : informations en cas de crise', url: 'https://infocrise.lu' },
    ],
  },
  {
    slug: 'sirenes',
    title: 'Les signaux des sirènes',
    summary: 'Reconnaître les quatre signaux des sirènes et savoir quoi faire pour chacun.',
    chapter: 'alerte',
    pose: 'bonjour',
    blocks: [
      {
        type: 'p',
        text: 'Les sirènes servent à prévenir d’un danger important ou imminent. Elles peuvent sonner dans une zone précise ou dans tout le pays.',
      },
      {
        type: 'p',
        text: 'Il existe quatre signaux. Chacun a un son différent et une consigne précise.',
      },
      { type: 'h2', text: 'Test mensuel' },
      {
        type: 'p',
        text: 'Le son : un son continu, toujours à la même hauteur, pendant 60 s.',
      },
      { type: 'p', text: 'Que faire : rien. C’est seulement un essai.' },
      { type: 'h2', text: 'Signal d’alerte' },
      {
        type: 'p',
        text: 'Le son : un son continu, toujours à la même hauteur, pendant 2 min.',
      },
      {
        type: 'p',
        text: 'Que faire : mets-toi en sécurité et informe-toi avec LU-Alert, la radio ou la télévision. Puis suis les consignes des autorités.',
      },
      { type: 'h2', text: 'Signal national d’alarme' },
      {
        type: 'p',
        text: 'Le son : un son qui monte et qui descend, sans arrêt, pendant 60 s.',
      },
      {
        type: 'p',
        text: 'Que faire : mets-toi à l’abri le plus vite possible, dans un bâtiment solide et fermé.',
      },
      { type: 'h2', text: 'Fin d’alarme' },
      {
        type: 'p',
        text: 'Le son : un son qui monte et qui descend, coupé par de courtes pauses, pendant 60 s.',
      },
      {
        type: 'p',
        text: 'Que faire : le danger est écarté. Tu peux reprendre tes activités normalement.',
      },
      {
        type: 'note',
        text: 'Le test a lieu chaque premier lundi du mois à midi. Un son continu d’une minute à ce moment-là est donc normal. S’il dure plus longtemps, ou à un autre moment, informe-toi.',
      },
      { type: 'h2', text: 'Tu as un doute ?' },
      {
        type: 'p',
        text: 'Allume la radio ou ouvre LU-Alert. N’appelle pas le 112 ou le 113 pour demander ce qui se passe : ces lignes doivent rester libres pour les urgences.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert : alertes officielles', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu : informations en cas de crise', url: 'https://infocrise.lu' },
    ],
  },
  {
    slug: 'bien-s-informer',
    title: 'Bien s’informer',
    summary: 'Trouver les bonnes sources et éviter de partager de fausses informations.',
    chapter: 'alerte',
    pose: 'lecture',
    blocks: [
      {
        type: 'p',
        text: 'Pendant une crise, beaucoup de messages circulent. Certains sont faux. D’autres se contredisent. Quelques réflexes simples t’aident à faire le tri.',
      },
      { type: 'h2', text: 'Les bons réflexes' },
      {
        type: 'list',
        items: [
          'Suis les consignes des autorités.',
          'Informe-toi auprès des sources officielles et des médias connus.',
          'Vérifie une information avant de la partager.',
          'Téléphone le moins possible, pour laisser les lignes libres aux secours.',
        ],
      },
      { type: 'h2', text: 'Avant de croire ou de partager' },
      { type: 'p', text: 'Pose-toi ces quatre questions :' },
      {
        type: 'list',
        items: [
          'Qui a publié cette information ?',
          'Quand a-t-elle été publiée ?',
          'D’où vient-elle ?',
          'D’autres sources fiables disent-elles la même chose ?',
        ],
      },
      { type: 'h2', text: 'Attention aux fausses images' },
      {
        type: 'p',
        text: 'Des photos et des vidéos peuvent être fabriquées avec l’intelligence artificielle (IA). Elles ont parfois l’air très réelles. Une image impressionnante n’est pas une preuve.',
      },
      {
        type: 'note',
        text: 'Si aucune source officielle ne confirme une alerte, ne la partage pas. Même pour « prévenir » tes proches.',
      },
      { type: 'h2', text: 'Où vérifier ?' },
      {
        type: 'list',
        items: [
          'lu-alert.lu, pour les alertes.',
          'infocrise.lu, pour la gestion de crise.',
          'La radio : RTL et radio 100,7.',
          'Ta commune : site internet, affichage, bulletin, réunions et applications.',
        ],
      },
      {
        type: 'p',
        text: 'En cas de doute, reviens toujours vers ces canaux officiels.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert : alertes officielles', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu : informations en cas de crise', url: 'https://infocrise.lu' },
    ],
  },
  {
    slug: 'accident-nucleaire',
    title: 'Accident nucléaire',
    summary: 'Un risque très faible, mais des consignes simples à connaître à l’avance.',
    chapter: 'comprendre',
    pose: 'lanterne',
    blocks: [
      {
        type: 'p',
        text: 'Un accident nucléaire est très peu probable. Mais ses conséquences peuvent être graves pour la santé et l’environnement.',
      },
      {
        type: 'p',
        text: 'Connaître les consignes à l’avance t’aide à mieux te protéger, sans paniquer.',
      },
      { type: 'h2', text: 'Les bons gestes' },
      {
        type: 'list',
        items: [
          'Informe-toi avec LU-Alert, la radio et les médias.',
          'Mets-toi à l’abri à l’intérieur si les autorités le demandent.',
          'Ferme les portes, les fenêtres et les volets.',
          'Arrête la ventilation, la climatisation et les systèmes d’aération.',
          'Sors tes comprimés d’iode et garde-les à portée de main.',
        ],
      },
      { type: 'h2', text: 'Les comprimés d’iode' },
      {
        type: 'p',
        text: 'Ce sont des comprimés d’iodure de potassium. Tu peux les obtenir auprès de ta commune. Range-les dans ton kit.',
      },
      {
        type: 'p',
        text: 'Ils sont prévus en général pour les personnes de moins de 45 ans. Après cet âge, ils ne sont en général pas conseillés.',
      },
      {
        type: 'note',
        text: 'Prends les comprimés d’iode seulement quand les autorités le demandent. Jamais avant, et jamais « par précaution ».',
      },
      { type: 'h2', text: 'En savoir plus' },
      {
        type: 'p',
        text: 'La brochure « Que faire en cas d’alerte nucléaire ? » est disponible sur infocrise.lu.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'infocrise.lu : que faire en cas d’alerte nucléaire', url: 'https://infocrise.lu' },
      { label: 'LU-Alert : alertes officielles', url: 'https://lu-alert.lu' },
    ],
  },
  {
    slug: 'kit-et-plan',
    title: 'Ton kit et ton plan',
    summary: 'Se préparer en trois étapes : le kit, le plan d’urgence et en parler autour de soi.',
    chapter: 'preparer',
    pose: 'provisions',
    blocks: [
      {
        type: 'p',
        text: 'Te préparer t’aide à rester calme et à bien réagir. Tu peux commencer dès aujourd’hui, en trois étapes.',
      },
      {
        type: 'steps',
        items: [
          'Prépare ton kit pour 72 heures.',
          'Remplis ton plan personnel d’urgence.',
          'Parles-en autour de toi et propose ton aide.',
        ],
      },
      { type: 'h2', text: '1. Ton kit' },
      {
        type: 'p',
        text: 'Le kit contient ce qu’il faut pour vivre chez toi quelques jours, si les magasins ou les services ne fonctionnent plus.',
      },
      {
        type: 'list',
        items: [
          'Regarde d’abord ce que tu as déjà à la maison.',
          'Ajoute ce dont ton foyer a besoin : produits pour bébé ou enfant, nourriture pour animaux, médicaments.',
          'Range le kit dans un endroit sûr, facile d’accès et connu de tout le foyer.',
          'Vérifie les dates au moins deux fois par an.',
          'Prévois aussi un sac à emporter si tu dois quitter ton logement.',
        ],
      },
      {
        type: 'p',
        text: 'Ce sac doit rester léger et facile à porter. Mets-y l’essentiel : eau, médicaments et ordonnances, en-cas, téléphone et batterie externe, papiers, argent liquide, clés et trousse de secours.',
      },
      { type: 'h2', text: '2. Ton plan personnel d’urgence' },
      {
        type: 'p',
        text: 'Ce plan organise ton foyer à l’avance. Remplis-le avec toutes les personnes qui vivent avec toi. Il contient :',
      },
      {
        type: 'list',
        items: [
          'les personnes du foyer, leurs besoins de santé et tes animaux ;',
          'où se trouvent les robinets d’eau et de gaz, le compteur, le disjoncteur et le kit ;',
          'les personnes qui peuvent t’aider, et celles que tu peux aider ;',
          'deux lieux où vous retrouver si vous êtes séparés ;',
          'comment donner des nouvelles sans téléphone ;',
          'qui peut aller chercher les enfants à l’école ;',
          'les numéros utiles.',
        ],
      },
      {
        type: 'note',
        text: 'Garde toujours une copie papier de ton plan. Sans courant, ton téléphone peut s’éteindre.',
      },
      { type: 'h2', text: '3. Parles-en' },
      {
        type: 'p',
        text: 'Nous sommes tous concernés. Parle de ta préparation avec tes proches et tes voisins. Encourage-les à faire leur kit.',
      },
      {
        type: 'p',
        text: 'Pense aux personnes seules ou fragiles. Et si toi, tu as besoin d’aide, demande à un proche ou à un voisin.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'Lëtz prepare!, la stratégie nationale', url: 'https://letzprepare.public.lu' },
    ],
  },
  {
    slug: 'entraide',
    title: 'S’entraider',
    summary:
      'Aider ses voisins, apprendre les premiers secours et prendre soin les uns des autres.',
    chapter: 'preparer',
    pose: 'fete',
    blocks: [
      {
        type: 'p',
        text: 'Pendant une crise, les liens entre voisins comptent beaucoup. Les premières heures peuvent être difficiles, même si les secours sont bien préparés. L’aide de chacun complète leur travail.',
      },
      { type: 'h2', text: 'Chacun a un rôle' },
      {
        type: 'p',
        text: 'Tu connais ton quartier et les personnes qui pourraient avoir besoin d’aide. Reste attentif à elles.',
      },
      {
        type: 'list',
        items: [
          'Aide un proche à préparer son kit.',
          'Partage ce que tu sais faire, ou ton matériel.',
          'Prends des nouvelles des personnes âgées, seules ou malades.',
          'Note dans ton plan qui peut t’aider et qui tu peux aider.',
        ],
      },
      {
        type: 'p',
        text: 'La solidarité se construit chaque jour, pas seulement pendant une crise.',
      },
      { type: 'h2', text: 'Apprendre les premiers secours' },
      {
        type: 'p',
        text: 'En quelques heures, tu peux apprendre les gestes qui sauvent une vie. La Croix-Rouge luxembourgeoise et le CGDIS proposent des formations partout dans le pays.',
      },
      {
        type: 'p',
        text: 'Tu veux t’engager plus ? Tu peux devenir pompier volontaire au CGDIS, dans ta commune.',
      },
      { type: 'h2', text: 'Besoin de parler ?' },
      {
        type: 'p',
        text: 'Pendant une crise, il est normal de ressentir du stress, de la peur ou de se sentir isolé.',
      },
      { type: 'p', text: 'Pour soutenir quelqu’un, quelques gestes simples aident :' },
      {
        type: 'list',
        items: [
          'écouter avec gentillesse, sans juger ;',
          'rassurer ;',
          'aider la personne à retrouver ses repères habituels ;',
          'si besoin, l’orienter vers un proche, un professionnel ou un service d’aide.',
        ],
      },
      {
        type: 'p',
        text: 'Passer voir un voisin ou rester près d’une personne en difficulté fait déjà une vraie différence. Et si c’est toi qui ne vas pas bien, n’hésite pas à en parler. Le service d’écoute SOS Détresse peut aussi t’aider.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'Croix-Rouge luxembourgeoise', url: 'https://www.croix-rouge.lu' },
      { label: 'Cours de premiers secours du CGDIS', url: 'https://cours.cgdis.lu' },
    ],
  },
  {
    slug: 'contacts-utiles',
    title: 'Contacts utiles',
    summary: 'Les numéros d’urgence et les sites officiels à garder sous la main.',
    chapter: 'preparer',
    pose: 'bonjour',
    blocks: [
      { type: 'h2', text: 'Numéros d’urgence' },
      {
        type: 'list',
        items: [
          '112 : secours du CGDIS (pompiers, ambulance).',
          '113 : Police.',
          '8002 7788 : numéro vert gratuit, qui peut être ouvert pendant une crise.',
        ],
      },
      {
        type: 'note',
        text: 'Appelle le 112 ou le 113 seulement en cas de vraie urgence. Ne les compose jamais pour essayer.',
      },
      {
        type: 'p',
        text: 'Pendant une crise, téléphone le moins possible. Tu laisses ainsi les lignes libres pour les secours.',
      },
      { type: 'h2', text: 'Note-les sur papier' },
      {
        type: 'p',
        text: 'Écris aussi les numéros de tes proches, de ton médecin, de l’école et de ton travail. Ajoute ceux de tes fournisseurs : électricité, gaz, eau, téléphone, assurance et banque. Range cette liste dans ton kit.',
      },
      { type: 'h2', text: 'Ta commune' },
      {
        type: 'p',
        text: 'Ta commune t’informe aussi : site internet, affichage, bulletin, réunions et applications. Elle prépare un plan adapté aux risques de ton territoire.',
      },
      { type: 'h2', text: 'Les sites officiels' },
      {
        type: 'p',
        text: 'Fais confiance seulement aux sources officielles. Tu trouveras les principales ci-dessous.',
      },
    ],
    links: [
      OFFICIAL_GUIDE,
      { label: 'LU-Alert : alertes et consignes', url: 'https://lu-alert.lu' },
      { label: 'infocrise.lu : bons gestes et gestion de crise', url: 'https://infocrise.lu' },
      {
        label: 'Lëtz prepare! : la stratégie nationale de résilience',
        url: 'https://letzprepare.public.lu',
      },
      { label: '112.lu : urgences, conseils et services de garde', url: 'https://112.lu' },
      { label: 'police.lu : Police grand-ducale', url: 'https://police.lu' },
      { label: 'inondations.lu : informations sur les crues', url: 'https://www.inondations.lu' },
      { label: 'seveso.lu : sites industriels à risque', url: 'https://www.seveso.lu' },
      { label: 'meteolux.lu : prévisions et alertes météo', url: 'https://www.meteolux.lu' },
      { label: 'cours.cgdis.lu : cours de premiers secours', url: 'https://cours.cgdis.lu' },
      {
        label: 'santesecu.public.lu : urgences, gardes, canicule',
        url: 'https://santesecu.public.lu',
      },
    ],
  },
];
