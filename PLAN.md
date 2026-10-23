# Plan projet — Kitzy

> **Kitzy** : application web progressive (PWA) 100 % hors-ligne, puis app native iOS/Android, pour constituer, suivre et faire tourner sa réserve d'urgence de 72 heures, sur la base de la stratégie nationale de résilience luxembourgeoise « Lëtz prepare! » et des listes de référence internationales.

- Statut : **plan v0.3**. Nom, stack et périmètre validés ; reste à choisir la piste graphique (§ 11) et quelques points au [§ 15](#15-questions-ouvertes)

### Décisions validées

| Sujet | Décision |
|---|---|
| Nom | **Kitzy**, avec un **hérisson** pour mascotte (Igel et Prett étaient pris). Dépôt de marque EUIPO et noms sur les stores à vérifier. |
| Hébergement | **GitHub Pages**, 100 % statique, sur **kitzy.lu** (DNS chez OVH) : page de présentation à la racine, app dans `/app/` ; le VPS OVH servira seulement au service Web Push |
| Serveur | **Aucun pour l'instant**. Le VPS personnel est disponible plus tard pour le Web Push (§ 6.4) |
| Langues | **FR, EN, LB (luxembourgeois), DE, PT** (§ 12.1) |
| Stack | **Validé** : **React** pour la PWA + **React Native (Expo)** pour les stores, avec un **cœur TypeScript partagé** (§ 5) |
| Périmètre | **Luxembourg d'abord, compatible avec toute l'Europe** : profils par pays (§ 12.4) |
| Partage | **QR code et URL** partageable par email (§ 3.9) |
| Contenu officiel | Repris **reformulé, simplifié et résumé**, avec un lien vers la source (§ 12.2) |
| Durée cible | **72 h** par défaut, réglable (3 à 14 jours) dans les réglages |
| Plan d'urgence | Le « plan en ligne » officiel n'est que le PDF : on reprend ses champs à l'identique, avec une bien meilleure expérience (§ 3.6) |
| Budget produits | Marqueurs **€ / €€ / €€€** uniquement, sans prix affiché |
| Affiliation | Amazon (compte existant), AliExpress (compte existant, usage très limité), plus des marchands réputés FR/DE à ouvrir (§ 8.3) |
| Dons | **PayPal.me/Crofte** et **Revolut.me/crofte** sur la PWA (§ 8.5) |
| Design | **« La Veillée »** : terrier éclairé et lucioles, thème sombre et thème clair, animations douces respectant le mouvement réduit ([maquettes](https://claude.ai/artifact/Sg3NGkrGHWi7xQpJ3iVhvB), § 11) |
| Ordinateur | **Version bureau** de la même PWA, installable depuis Chrome et Edge, navigation latérale à partir de 960 px (§ 3.10) |
| Synchronisation | **Sur le cloud de la personne** (Google Drive, Dropbox, OneDrive, iCloud ou dossier synchronisé), **chiffrée de bout en bout**, sans compte ni serveur Kitzy (§ 7.1, phase 6) |
- Langue de travail : français
- Référentiel d'accessibilité : **RAWeb 1.1, niveau AA** (skills `raweb-code` / `raweb-audit` de [luxembourg-accessibility-skillset](https://github.com/geoffreycrofte/luxembourg-accessibility-skillset)), puis **RAAM 1.1** si on publie des apps natives (skills `raam-code` / `raam-audit`)

---

## Sommaire

1. [Vision et principes](#1-vision-et-principes)
2. [Liste exhaustive du kit](#2-liste-exhaustive-du-kit)
3. [Fonctionnalités](#3-fonctionnalités)
4. [Rendre la préparation « fun » et normale](#4-rendre-la-préparation-fun-et-normale)
5. [Architecture technique](#5-architecture-technique)
6. [Hors-ligne et notifications : contraintes et stratégie](#6-hors-ligne-et-notifications--contraintes-et-stratégie)
7. [Modèle de données et synchronisation](#7-modèle-de-données-et-synchronisation)
8. [Affiliation et catalogue produits](#8-affiliation-et-catalogue-produits)
9. [Surveillance des liens](#9-surveillance-des-liens)
10. [Accessibilité](#10-accessibilité)
11. [Design](#11-design)
12. [Contenu, langues et aspects légaux](#12-contenu-langues-et-aspects-légaux)
13. [Publication sur les stores](#13-publication-sur-les-stores)
14. [Feuille de route](#14-feuille-de-route)
15. [Questions ouvertes](#15-questions-ouvertes)

---

## 1. Vision et principes

**Promesse utilisateur** : « Ton kit 72 h, prêt et à jour, sans y penser. »

L'app ne vend pas la peur. Elle s'occupe de la partie fastidieuse : quoi acheter et en quelle quantité, ce qui va périmer, ce qu'il faut recharger, à quel moment refaire un point.

Principes directeurs :

| Principe | Conséquence concrète |
|---|---|
| **Offline-first** | Toutes les fonctionnalités marchent sans réseau. Le réseau ne sert qu'à mettre à jour le catalogue et les liens. |
| **Local-first et vie privée** | Les données (inventaire, foyer, plan d'urgence) restent sur l'appareil. Pas de compte. Export/import manuel. |
| **Rotation plutôt que stockage** | Le stock s'intègre aux courses habituelles : on consomme le plus ancien (FIFO) et on rachète. |
| **Ton rassurant** | Vocabulaire de camping, de pique-nique, de check-up. Pas de « survie », de « catastrophe » ou d'apocalypse dans l'interface. |
| **Accessible par défaut** | RAWeb AA dès le premier composant, pas en correction à la fin. |
| **Sources citées** | Chaque recommandation affiche sa source : officielle LU, recommandée par des listes expertes, ou optionnelle. |

---

## 2. Liste exhaustive du kit

### 2.1 Légende

- **[OFF]** : présent dans la checklist officielle luxembourgeoise « Ma checklist pour 72 heures »
- **[REC]** : recommandé par des listes de référence : Croix-Rouge, Ready.gov (FEMA), BBK (Allemagne), OFAE/« Notvorrat » (Suisse), MSB (Suède), stratégie européenne « Preparedness Union » (2025)
- **[OPT]** : confort, ou utile selon le profil du foyer
- **Kits** : 🏠 Réserve maison (mise à l'abri) · 🎒 Sac d'évacuation (léger, par personne) · 🚗 Kit voiture (optionnel)
- **Suivi** : 📅 date de péremption · 🔋 recharge ou piles · 🔄 rotation conseillée · 👤 quantité calculée par personne

### 2.2 Remarques sur ta liste de départ

1. **Eau : 6 bouteilles, c'est trop juste.** La norme officielle est de **3 L par personne et par jour**, soit **9 L par personne pour 72 h**. 6 × 1,5 L = 9 L, ce qui couvre **une seule personne**. L'app calculera la quantité selon la composition du foyer, animaux compris.
2. **Pâtes et riz** demandent de l'eau et du combustible pour cuire. On garde, mais on privilégie des aliments **prêts à manger** (conserves de plats cuisinés, poisson en boîte, compotes, barres) et on compte l'eau de cuisson en plus.
3. **Radio** : au Luxembourg, la radio de crise passe par **FM (UKW) et DAB+**. Les ondes courtes n'apportent rien ici. Cible : radio **FM/DAB+** à **dynamo, solaire et piles**, avec sortie USB pour recharger un téléphone.
4. **Réchaud à gaz** : la mise en garde officielle sur le **monoxyde de carbone** doit apparaître dans l'app. Utilisation en extérieur ou dans une pièce très ventilée, jamais pour chauffer.
5. **Tes idées complémentaires** (cordes, fil et aiguilles, cash, frontale) sont toutes reprises ci-dessous.

### 2.3 Eau et alimentation

| Élément | Source | Kit | Suivi | Détail |
|---|---|---|---|---|
| Eau potable en bouteille | [OFF] | 🏠 | 📅👤🔄 | 3 L/pers/jour, soit 9 L par personne. Ajouter l'eau des animaux. |
| 1 à 2 bouteilles d'eau | [OFF] | 🎒 | 📅 | Dans le sac d'évacuation |
| Pastilles de purification ou filtre à eau | [REC] | 🏠🎒 | 📅 | Solution de secours si les bouteilles sont épuisées |
| Récipients vides (bouteilles, jerrican pliable) | [OFF] | 🏠 | | Pour stocker de l'eau du robinet dès qu'une alerte tombe |
| Seau (10 L) | [REC] | 🏠 | | Puiser l'eau, toilettes de secours |
| Nourriture non périssable, facile à consommer | [OFF] | 🏠 | 📅👤🔄 | Environ 2 000 kcal/adulte/jour. Prêt à manger en priorité. |
| Conserves (plats cuisinés, légumes, poisson, légumineuses) | [REC] | 🏠 | 📅🔄 | |
| Féculents (pâtes, riz, semoule, flocons d'avoine) | [REC] | 🏠 | 📅🔄 | Prévoir l'eau de cuisson |
| Biscuits, noix, fruits secs, barres énergétiques | [OFF] | 🏠🎒 | 📅🔄 | |
| Compotes, purées en gourde | [OPT] | 🏠🎒 | 📅 | Pratique pour les enfants |
| Café/thé soluble, sucre, sel, chocolat | [OPT] | 🏠 | 📅 | Pour le moral |
| Lait UHT ou en poudre | [REC] | 🏠 | 📅 | |
| Nourriture et eau pour animaux | [OFF] | 🏠🎒 | 📅👤 | Par animal, selon l'espèce et le poids |
| Alimentation bébé (lait infantile, petits pots) | [OPT] | 🏠🎒 | 📅👤 | Si nourrisson dans le foyer |
| Aliments pour régimes spécifiques (sans gluten, diabète…) | [OPT] | 🏠 | 📅 | Selon le profil santé |

### 2.4 Cuisiner et manger

| Élément | Source | Kit | Suivi |
|---|---|---|---|
| Réchaud, de préférence à gaz | [OFF] | 🏠 | |
| Cartouches de gaz (1 à 2 pour 72 h) | [OFF] | 🏠 | 🔄 contrôle annuel |
| Ouvre-boîte manuel | [OFF] | 🏠🎒 | |
| Popote ou casserole, couverts, gobelet | [REC] | 🏠 | |
| Assiettes et gobelets réutilisables | [OPT] | 🏠 | |
| Papier aluminium, sacs congélation | [REC] | 🏠 | |
| Liquide vaisselle, éponge | [OPT] | 🏠 | |

### 2.5 Outils

| Élément | Source | Kit | Remarque |
|---|---|---|---|
| Couteau de poche multifonction / couteau suisse | [OFF] | 🏠🎒 | |
| Ciseaux | [OFF] | 🏠 | |
| Stylo à bille, crayon, carnet | [OFF] | 🏠🎒 | Le crayon écrit même mouillé |
| Pince multifonction (multitool) | [REC] | 🏠 | |
| Ruban adhésif renforcé (duct tape) | [REC] | 🏠 | Réparations, calfeutrage |
| Corde fine (paracorde, environ 15 m) | [REC] | 🏠🎒 | Ta suggestion |
| Corde épaisse (environ 10 m) | [OPT] | 🏠 | Ta suggestion |
| Colliers de serrage (Rilsan) | [REC] | 🏠 | |
| Mousquetons | [OPT] | 🎒 | |
| Gants de travail | [REC] | 🏠🎒 | |
| Bâche plastique | [REC] | 🏠 | Abri, fenêtre cassée, imperméabilisation |
| Sacs-poubelle résistants | [REC] | 🏠🎒 | Déchets, toilettes, poncho improvisé |
| Clé pour couper le gaz et l'eau | [REC] | 🏠 | Savoir où sont les vannes : à noter dans le plan |
| Sifflet | [REC] | 🎒 | Se signaler |
| Extincteur et couverture anti-feu | [REC] | 🏠 | 📅 contrôle |
| Détecteur de fumée et de CO | [REC] | 🏠 | 🔋 piles |
| Kit de couture (fil, aiguilles, épingles à nourrice) | [OPT] | 🏠 | Ta suggestion |
| Carte papier de la région et boussole | [REC] | 🎒🚗 | GPS et réseau peuvent tomber |

### 2.6 Lumière et énergie

| Élément | Source | Kit | Suivi |
|---|---|---|---|
| Lampe de poche + 2 jeux de piles **ou** lampe à manivelle (dynamo) | [OFF] | 🏠🎒 | 🔋 |
| Lampe frontale | [OFF] | 🏠🎒 | 🔋 Ta suggestion, citée dans le texte officiel |
| Bougies + allumettes ou briquet | [OFF] | 🏠 | Utilisation responsable et sûre |
| Allumettes tempête dans une boîte étanche | [REC] | 🏠🎒 | |
| Briquet de rechange | [REC] | 🏠🎒 | |
| Bâtons lumineux (light sticks) | [OPT] | 🎒 | 📅 |
| Lanterne LED (éclairer une pièce) | [OPT] | 🏠 | 🔋 |
| Piles de rechange AA/AAA (et formats spécifiques) | [REC] | 🏠 | 📅 péremption |
| Batterie externe (power bank) et câbles | [OFF] | 🏠🎒 | 🔋 recharge tous les 3 mois |
| Chargeurs de téléphone et d'ordinateur | [OFF] | 🏠 | |
| Panneau solaire USB pliable | [OPT] | 🏠 | |
| Adaptateur allume-cigare USB | [OPT] | 🚗 | |

### 2.7 S'informer et rester en contact

| Élément | Source | Kit | Suivi |
|---|---|---|---|
| Radio à piles ou à manivelle (FM/UKW et/ou DAB+) ; la radio de la voiture peut servir. Stations officielles en crise : **RTL** et **radio 100,7** | [OFF] | 🏠 | 🔋 test mensuel |
| Application LU-Alert installée, notifications réglées | [OFF] | téléphone | Action de configuration |
| Téléphone portable avec chargeur | [OFF] | 🎒 | |
| Liste des numéros utiles sur papier | [OFF] | 🏠🎒 | 🔄 revue annuelle |
| Plan personnel d'urgence | [OFF] | 🏠🎒 | L'app le génère, voir § 3.6 |

### 2.8 Documents et argent

| Élément | Source | Kit | Suivi |
|---|---|---|---|
| Copies des pièces d'identité, passeport, permis, assurances dans une pochette étanche | [OFF] | 🏠 | 📅 validité des pièces |
| Portefeuille : pièces d'identité, cash, cartes, papiers importants | [OFF] | 🎒 | |
| Argent liquide en petites coupures et pièces | [OFF] | 🏠🎒 | Distributeurs et terminaux de paiement tombent avec le courant |
| Copie numérique chiffrée (clé USB) | [OPT] | 🎒 | |
| Ordonnances, carnet de vaccination, groupe sanguin | [REC] | 🎒 | |
| Photos récentes des membres du foyer et des animaux | [REC] | 🎒 | Retrouver une personne perdue |
| Clés de la maison et de la voiture (double) | [OFF] | 🎒 | |
| Carnet de santé et puce de l'animal | [OPT] | 🎒 | |

### 2.9 Rester au chaud et habillé

| Élément | Source | Kit |
|---|---|---|
| Sacs de couchage et/ou couvertures | [OFF] | 🏠 |
| Couverture de survie (isotherme) | [REC] | 🎒🚗 |
| Vêtements et chaussures de rechange (selon la saison) | [OFF] | 🏠🎒 |
| Vêtements chauds : bonnet, gants, polaire | [REC] | 🏠🎒 |
| Poncho ou veste de pluie | [REC] | 🎒 |
| Chaussures de marche solides | [REC] | 🎒 |
| Chaufferettes chimiques | [OPT] | 🎒 📅 |

### 2.10 Se soigner

| Élément | Source | Kit | Suivi |
|---|---|---|---|
| Trousse de premiers soins : pansements, compresses, désinfectant, paracétamol | [OFF] | 🏠🎒 | 📅 |
| Médicaments prescrits (traitement en cours) + ordonnances | [OFF] | 🏠🎒 | 📅 |
| Comprimés d'iode (iodure de potassium), disponibles auprès de la commune. **À prendre uniquement sur instruction des autorités**, en général pour les moins de 45 ans. | [OFF] | 🏠 | 📅 |
| Bande élastique, sparadrap, pansements compressifs | [REC] | 🏠 | |
| Pince à épiler et **tire-tique** (forêts luxembourgeoises) | [REC] | 🏠🎒 | |
| Thermomètre | [REC] | 🏠 | 🔋 |
| Sels de réhydratation orale | [REC] | 🏠 | 📅 |
| Antihistaminique, anti-diarrhéique (sur avis de ton pharmacien) | [OPT] | 🏠 | 📅 |
| Masques FFP2 | [REC] | 🏠🎒 | 📅 |
| Gants jetables (nitrile) | [REC] | 🏠 | |
| Lunettes de rechange, lentilles et produit | [REC] | 🎒 | |
| Piles pour appareil auditif, matériel médical spécifique | [OPT] | 🏠🎒 | 🔋 |
| Crème solaire, anti-moustiques | [OPT] | 🎒 | 📅 |

### 2.11 Hygiène

| Élément | Source | Kit | Suivi |
|---|---|---|---|
| Lingettes humides, papier toilette, gel désinfectant | [OFF] | 🏠🎒 | 📅 gel |
| Produits d'hygiène personnelle : savon, brosse et dentifrice, déodorant | [OFF] | 🏠🎒 | |
| Protections hygiéniques | [REC] | 🏠🎒 | |
| Couches et lingettes bébé | [OPT] | 🏠🎒 | 👤 |
| Toilettes de secours : seau, sacs, litière ou sciure | [REC] | 🏠 | La chasse d'eau peut ne plus fonctionner |
| Serviette microfibre | [OPT] | 🎒 | |
| Eau de Javel non parfumée (désinfection) | [OPT] | 🏠 | 📅 |

### 2.12 Moral et vie de famille

| Élément | Source | Kit |
|---|---|---|
| Jeux de cartes, jeux de société, livres, carnet de coloriage | [REC] | 🏠 |
| Doudou ou jouet favori de l'enfant | [OPT] | 🎒 |
| Friandises | [OPT] | 🏠🎒 |

### 2.13 Le sac lui-même

| Élément | Source | Remarque |
|---|---|---|
| Sac à dos solide, un par personne capable de le porter | [REC] | « Veillez à ce que votre sac d'évacuation reste léger et facilement transportable » [OFF] |
| Bac ou caisse étiquetée pour la réserve maison | [REC] | Lieu sûr, accessible et connu de tout le foyer [OFF] |
| Sacs étanches (dry bags) / sacs zip | [REC] | Documents, allumettes, électronique |

### 2.14 Gestes et actions (hors objets)

L'app les suivra comme des **tâches**, pas comme des objets :

- Installer **LU-Alert** et régler les notifications par zone [OFF]
- Remplir son **plan personnel d'urgence** [OFF]
- Savoir couper **gaz, eau et électricité** [REC]
- Repérer les **zones inondables** sur eau.geoportail.lu [OFF]
- Repérer un **point de rendez-vous** familial près de chez soi et un autre hors du quartier [REC]
- Garder le **réservoir de la voiture au moins à moitié plein** [REC]
- Copies de sauvegarde des documents et photos [OFF, cyber]
- Gestionnaire de mots de passe et double authentification [OFF, cyber]
- Reconnaître les **signaux des sirènes** (test chaque premier lundi du mois à midi) [OFF]
- Vérifier le kit **au moins deux fois par an** [OFF]
- Identifier le **CIS, le commissariat et l'hôpital** les plus proches de la maison et du travail [OFF]
- Connaître les **radios officielles de crise : RTL et radio 100,7** (noter leurs fréquences locales) [OFF]
- Savoir **ouvrir la porte du garage sans électricité**, prévoir une **sortie de secours** [OFF, plan]
- Recenser les **personnes aidantes et les personnes à aider** dans le quartier [OFF, plan]
- Suivre un **cours de premiers secours** (Croix-Rouge luxembourgeoise, cours.cgdis.lu) [OFF]
- Parler du kit à ses proches, surtout les plus vulnérables (« Parlez-en autour de vous ») [OFF]
- Préparer un **sac vide prêt à remplir** en cas d'évacuation [OFF]

**Réflexes « pendant » à afficher dans le guide (scénario coupure)** [OFF] : faire des réserves d'eau tant qu'elle coule ; ouvrir le moins possible le frigo et le congélateur ; fermer les volets pour garder la chaleur ; mode économie d'énergie du téléphone ; **jamais** de barbecue, brasero ou groupe électrogène à l'intérieur (monoxyde de carbone) ; avant le retour du courant, **débrancher** frigo, congélateur, TV, ordinateurs et voiture électrique ; après, faire le point : « De quoi avons-nous manqué ? »

### 2.15 Quantités : règles de calcul (par défaut, modifiables)

| Règle | Adulte | Enfant | Nourrisson | Chien moyen | Chat |
|---|---|---|---|---|---|
| Eau/jour | 3 L | 3 L | 1 L + préparation du lait | 1 L | 0,3 L |
| kcal/jour | 2 000 | 1 400 | — | selon fabricant | selon fabricant |
| Durée | 72 h, réglable (3, 7, 10, 14 jours) pour qui veut aller plus loin |

Décision : **72 h par défaut**. Le nombre de jours est un réglage, car certains pays (Allemagne, Suède, Suisse) recommandent jusqu'à 7 à 10 jours.

---

## 3. Fonctionnalités

### 3.1 Onboarding (≈ 2 minutes, chaque étape peut être passée)

1. **Ton foyer** : adultes, enfants, nourrissons, seniors, animaux (espèce), besoins particuliers (traitement, mobilité, régime)
2. **Tes kits** : réserve maison (par défaut), sacs d'évacuation (un par personne, proposé), voiture (optionnel)
3. **Ton point de départ** : « J'ai déjà des choses » (on coche) ou « Je pars de zéro » (liste de courses générée)
4. **Rappels** : choix des canaux (notifications, calendrier .ics, rappel à l'ouverture de l'app)

### 3.2 Tableau de bord

- **Niveau de préparation** par kit : jauge accessible (`<meter>` avec texte explicite, pas seulement une couleur)
- **À faire bientôt** : ce qui périme, ce qui doit être rechargé, la prochaine revue
- **Prochaine action conseillée**, une seule à la fois (« Ajoute 6 L d'eau pour atteindre 72 h »)
- Raccourcis : ajouter un article, liste de courses, guide
- **Où j'en suis** (fait) : trois jauges sous la prochaine action, chacune menant à sa page. *Courses* (articles réunis dans tous les kits), *Mon plan* (étapes faites, une étape commencée compte pour moitié), *Mes gestes*. Puis un lien « Mes succès : 2 sur 12 »

### 3.2 bis Menu

Le cinquième onglet de la barre du bas (ou de la colonne sur bureau) est **Menu**, à la place de Guide. Il ouvre un menu plein écran (`<dialog>` modal : reste de la page inerte, Échap ferme, le focus revient au bouton) avec :
- le choix de l'ambiance (Auto, Veillée, Jour), en interrupteur à trois positions ;
- Succès, Guide, Mes gestes, Réglages, chacun avec une ligne d'explication ;
- en pied, Transparence et Confidentialité.

Le thème et les réglages quittent l'en-tête, qui ne garde que le nom Kitzy. Le bouton Menu s'allume quand la page affichée vient du menu. Avec les animations d'ambiance, le panneau monte et les entrées arrivent l'une après l'autre.

### 3.3 Inventaire

- Vue par **catégorie** (eau, nourriture, lumière…) et par **kit**
- Chaque article : quantité possédée / quantité cible, état (OK, bientôt, expiré, manquant), texte et icône en plus de la couleur
- **Lots** : un même article peut avoir plusieurs dates de péremption (6 bouteilles achetées à des dates différentes)
- **DLC et DDM** : distinguer « à consommer jusqu'au » (date stricte, alerte rouge) et « à consommer de préférence avant » (date indicative, alerte douce)
- **Consommation FIFO** : un bouton « J'en ai utilisé 1 » retire du lot le plus ancien et propose de l'ajouter à la liste de courses
- **Batteries** : date de dernière recharge et intervalle (par défaut tous les 3 mois pour une power bank, test mensuel pour la radio)
- Articles **personnalisés** (« Mes objets personnels » de la checklist officielle)
- Ajout rapide : recherche dans le catalogue, **scan de code-barres** (API `BarcodeDetector` sur Chrome/Android, repli `zxing-wasm`, saisie manuelle toujours possible), saisie de la date au clavier (jamais uniquement via un sélecteur)

### 3.4 Liste de courses

> Organisation d'une carte (retour utilisateur) : 1. ce qu'on achète (nom, quantité totale) ; 2. une remarque éventuelle (quantité à remplacer) ; 3. **où le ranger**, kit par kit, chaque destination ouvrant la page de l'article dans ce kit pour y noter l'achat et ses dates. Le mot « Ranger » est remplacé par ces destinations explicites.

- Générée automatiquement : manquants, expirés et à remplacer
- Cochable en magasin, hors-ligne
- Pour chaque article, des **suggestions produit** à plusieurs budgets (voir § 8)
- Partage en texte (API Web Share), en QR code ou par URL (§ 3.9)

### 3.5 « À consommer bientôt » (rotation)

- Liste des articles qui arrivent à échéance dans N jours (réglable, 30 par défaut)
- Idées de recettes à partir de ces articles (catalogue local de recettes simples), voir § 4

### 3.6 Plan personnel d'urgence

Le « plan à compléter en ligne » officiel n'est qu'un **PDF remplissable** (le même que dans le guide). Kitzy en fait un vrai parcours guidé, sauvegardé et partageable : c'est l'un des arguments forts de l'app.

Version numérique **fidèle au formulaire officiel** (guide p. 43-50), sous forme d'assistant en 5 étapes, chacune pouvant être sauvegardée et reprise plus tard. Le guide insiste : *« Je garde le formulaire en digital et en imprimé au cas où je n'aurais plus de batterie. »*

| Section officielle | Champs |
|---|---|
| **En-tête** | Ce plan appartient à (nom, prénom), adresse, ville, complété le, mis à jour le |
| **1. Habitants du foyer** | Nombre d'adultes et d'enfants. Par personne : nom, prénom, tél., groupe sanguin, matricule, langues |
| | Limitations physiques / besoin d'aide technique au quotidien : nature du handicap (fauteuil, prothèse…) |
| | **Informations médicales** : allergies et intolérances (aliments, médicaments) ; médicaments pris régulièrement (nom, posologie, mode d'administration) ; remarques |
| | **Animaux domestiques** : espèce, nom, informations (comportement, handicap, maladie, traitement) |
| **2. Le foyer** | Emplacement et commentaires pour : extincteurs, robinet d'arrivée d'eau, robinet de gaz, compteur électrique, disjoncteur, chaudière/climatisation, centrale photovoltaïque, documents d'identité, kit de préparation |
| | Par où sortir si la sortie principale est bloquée ? Comment ouvrir la porte du garage sans électricité ? Une clé supplémentaire est-elle nécessaire ? Autres informations |
| **3. Le quartier** | **Personnes aidantes** (nom, prénom, type d'aide apportée, tél., adresse : bricolage, premiers secours, équipement, cave…) |
| | **Personnes à aider** (nom, prénom, type d'aide sollicitée, tél., adresse) |
| **4. En cas d'urgence** | Centre d'incendie et de secours (CIS) de proximité (lien 112.public.lu) |
| | Lieux de retrouvailles 1 et 2 si séparation et foyer inaccessible |
| | Comment informer les proches sans téléphone : choix 1 et 2 |
| | Contacts 1 et 2 à joindre si on ne parvient pas à se joindre |
| | **Situation personnelle** : qui va chercher les enfants à l'école (contacts 1 et 2) ; alternatives pour rentrer du travail sans voiture ni transports en commun ; autre situation ; chez qui aller en cas d'urgence (lieux 1 et 2 avec nom, tél., adresse) |
| **5. Numéros importants** | 112 (CGDIS), 113 (Police) : *à n'utiliser qu'en cas de réelle urgence, jamais à titre d'essai* |
| | Fournisseurs (nom/société, n° client, tél.) : opérateur télécom, électricité, gaz, eau, assurance, médecin traitant, médecin spécialiste, école, travail, banque ; commentaires |

Fonctionnalités associées :

- **Pré-remplissage** depuis le foyer saisi à l'onboarding (membres, animaux, emplacement du kit) : on ne saisit rien deux fois.
- **Import de contacts** via la Contact Picker API quand elle est disponible (Chrome Android), sinon saisie manuelle.
- Données de santé et matricule : **consentement explicite**, stockage local uniquement, avec un avertissement à l'export (fichier sensible).
- **Impression / PDF accessible** reproduisant la structure officielle (feuille de style print soignée) : le papier est indispensable quand il n'y a plus de batterie. Bouton « Imprimer en 2 exemplaires : un pour le kit, un pour le sac ».
- Rappel de **mise à jour annuelle** et à chaque changement (nouveau membre, déménagement).
- Pages « Situation personnelle » liées au **scénario du guide** (« Vous êtes au travail à Luxembourg-Ville, vous habitez dans le sud… »).

### 3.7 Guide (contenu officiel, disponible hors-ligne)

Pages d'aide reprenant et résumant le guide officiel avec liens vers la source :

- Pourquoi 72 h ?
- À quoi se préparer : phénomènes météo, inondations, attaques cyber, menace terroriste, accident nucléaire, coupure d'électricité généralisée et effet cascade
- Comment je serai alerté : LU-Alert, niveaux de vigilance (jaune, orange, rouge, violet), canaux (app, site, SMS, Cell Broadcast, sirènes, médias)
- **Signaux des sirènes**, avec description textuelle de chaque signal en plus de l'éventuel audio
- Bonnes pratiques d'information (vérifier qui, quand, d'où ; ne pas diffuser une alerte non confirmée ; attention aux fausses images et vidéos générées par IA)
- Simulation « 72 h sans électricité » (jours 1, 2, 3), en version interactive (voir § 4)
- Que font les autorités ? Plan « Rupture d'énergie », cellule de crise, plans locaux de résilience, centres d'accueil des communes (RESILIENZBONUS), réserve RESC-LU, rétablissement zone par zone
- Se préparer en 3 étapes : kit, plan, en parler autour de soi
- Plus forts ensemble : entraide, premiers secours, soutien psychologique (SOS Détresse)
- **Contacts utiles** : 112 (CGDIS), 113 (Police), **8002 7788** (numéro vert, peut être activé en cas de crise), et les sites lu-alert.lu, infocrise.lu, letzprepare.lu, 112.lu (gardes : hôpitaux, maisons médicales, pharmacies), police.lu, inondations.lu, seveso.lu, meteolux.lu, cours.cgdis.lu, santesecu.public.lu ; plus les canaux de sa commune

Structure officielle du guide, reprise pour l'arborescence de l'aide : **1. Comprendre & anticiper** · **2. L'alerte & l'information** · **3. L'action des autorités** · **4. Mon kit & mon plan personnel d'urgence**.
- Chaque article du catalogue renvoie vers la page du guide qui explique **pourquoi** il est utile

### 3.8 Réglages

- Langue, thème (clair, sombre, système), taille de texte
- **Langue** (fait) : par défaut celle de l'appareil si Kitzy la parle, sinon le français ; choix gardé sur l'appareil et copié dans la base locale pour que les notifications suivent. Chaque langue est écrite dans sa propre langue (`lang`). Lien « Demander une langue » vers le profil LinkedIn de l'auteur
- **Animations d'ambiance** : activées ou non (désactivées par défaut si le système demande moins de mouvement)
- Notifications : canaux, délais d'alerte (J-30, J-7, J0), heures calmes
- Durée cible (72 h par défaut)
- **Export / import** JSON (sauvegarde, changement de téléphone), export CSV de l'inventaire
- Réinitialiser
- À propos, sources, mentions d'affiliation, déclaration d'accessibilité, confidentialité
- **Organisation** (fait) : un sommaire en pastilles, puis quatre groupes titrés en jaune. *Affichage* (thème, animations, langue), *Kits et rappels* (niveau, notifications, agenda), *Cet appareil et mes données* (installer, sauvegarde, puis « Repartir de zéro » dans une carte à part, bordée de rouge), *Kitzy* (soutenir, à propos)

### 3.9 Partage par QR code ou URL

Sans serveur, sans compte : **les données voyagent dans le lien lui-même**.

- Format : `https://<domaine>/partage#<données>`. Les données sont dans le **fragment** (après `#`), qui n'est **jamais envoyé au serveur** : GitHub Pages ne voit rien, et aucun journal ne contient les données.
- Encodage : JSON minimal, puis compression `deflate-raw` (API `CompressionStream`, ou `pako` en repli), puis base64url. Le schéma est versionné (`v=1`).
- **Chiffrement optionnel** par phrase de passe (WebCrypto : PBKDF2 + AES-GCM), recommandé dès que le contenu est sensible. La phrase de passe se transmet par un autre canal (oral, SMS).

| Ce qu'on partage | Contenu | Chiffrement |
|---|---|---|
| **Liste de courses** | Articles manquants et quantités | Non (rien de sensible) |
| **Plan d'urgence « famille »** | Contacts, lieux de retrouvailles, emplacements du foyer | Proposé par défaut |
| Plan complet avec santé | Plus les allergies, traitements, groupe sanguin, matricule | **Obligatoire**, avec avertissement explicite |
| **Inventaire du foyer** (synchroniser un 2e téléphone) | Kits, articles, lots, dates | Proposé |

- **Canaux** : QR code affiché à l'écran (scanné par l'autre téléphone), bouton « Envoyer par email » (`mailto:` avec le lien), Web Share API (WhatsApp, Signal, SMS…), copier le lien.
- **Taille** : un QR code reste lisible jusqu'à environ 1 à 2 Ko de données compressées. Au-delà, on propose plutôt le lien par email ou le fichier d'export. Une liste de courses ou un plan sans santé tiennent dans un QR code.
- **Import** : à l'ouverture du lien, aperçu de ce qui sera importé, puis « Fusionner » ou « Remplacer ». Rien n'est importé sans confirmation.
- **Accessibilité** : le QR code n'est jamais le seul moyen (lien textuel et bouton de copie juste à côté) ; texte alternatif « QR code du lien de partage de ta liste de courses ».

---

### 3.10 Version bureau (ordinateur portable, grand écran)

> Note sur l'installation : tant que Kitzy est servie depuis `geoffreycrofte.github.io/survival-kit/`, une autre app web installée depuis `geoffreycrofte.github.io` dont la portée (`scope`) couvre tout le site peut faire croire à Chrome que Kitzy est « déjà installée ». Le domaine propre (kitzy.lu) supprime ce conflit : c'est une raison de plus de basculer avant le lancement.

La même PWA, installable depuis Chrome ou Edge sur Windows, macOS et Linux (fenêtre dédiée, icône dans le dock ou le menu Démarrer). Le stockage local (IndexedDB) et les notifications fonctionnent comme sur mobile ; la vérification quotidienne en arrière-plan (Periodic Background Sync) marche sur Chrome et Edge une fois l'app installée. Safari et Firefox : rappels à l'ouverture et export agenda `.ics`.

Mise en page à partir de 960 px de large :

- **Navigation latérale** à gauche (les mêmes cinq entrées), placée avant le contenu dans le code : même ordre au clavier sur mobile et sur bureau.
- **Accueil en deux colonnes** : la fenêtre du terrier et ses lucioles à gauche (fixe au défilement), la mission, « Les prochains jours » et la suite à droite.
- **Grilles** à deux colonnes pour le guide, les kits et les gestes ; largeur de lecture limitée (≈ 52 rem) pour les pages de texte et les formulaires.
- Le reste de l'expérience est identique : pas de fonction réservée au bureau, pas de survol indispensable.

Plus tard, si besoin : raccourcis clavier (ajout rapide d'un article), impression du plan et de la liste de courses mises en avant, glisser-déposer d'une sauvegarde. Une app de bureau empaquetée (Tauri) n'apporterait rien de plus pour l'instant.

## 4. Rendre la préparation « fun » et normale

L'idée générale : traiter le kit comme **une habitude de foyer**, au même titre que la trousse de pharmacie ou le sac de camping, et pas comme un abri antiatomique.

| Idée | Description | Priorité |
|---|---|---|
| **Vocabulaire « camping/pique-nique »** | « Ton kit », « check-up », « rotation », « soirée conserves ». Pas de « survie » dans l'UI. | MVP |
| **Progression positive** | Jauge par kit et paliers : *Débutant·e → Prêt·e pour un week-end → Prêt·e 72 h → Voisin·e ressource*. On valorise ce qui est fait, pas ce qui manque. | MVP |
| **Une seule prochaine action** | Le tableau de bord propose une petite étape, pas 60 manques d'un coup. | MVP |
| **Soirée « conserves »** | Quand des articles approchent de leur date : « Ce soir, chili aux haricots de ta réserve ? » avec une recette simple. Ça transforme la rotation en moment sympa. | v1 |
| **Le rendez-vous du premier lundi** | Le test mensuel des sirènes (premier lundi du mois à midi) devient le rappel « mini-check » : 2 minutes, 3 questions. Un rituel national déjà existant. | v1 |
| **Le grand check-up de l'heure d'été/hiver** | La revue semestrielle recommandée officiellement est calée sur les changements d'heure (on change aussi les piles du détecteur de fumée). | v1 |
| **Défi « soirée sans électricité »** | Mode jeu en famille : on coupe tout pendant une soirée en n'utilisant que le kit. Petite checklist d'observations (« Qu'est-ce qui nous a manqué ? ») ajoutée à la liste de courses. | v1 |
| **Simulation 72 h interactive** | Le scénario officiel (janvier, un lundi, au travail, coupure générale ; jour 1 retour à la maison, jour 2 l'eau ne coule plus, jour 3 entraide et retour du courant) raconté en histoire « dont tu es le héros ». À chaque étape : « As-tu ce qu'il faut ? », relié à ton inventaire et à ton plan. Le guide le dit lui-même : *« Les enfants vivent la situation comme une grande aventure. »* La simulation se termine sur la question officielle « De quoi avez-vous manqué ? » et alimente la liste de courses. | v2 |
| **Quiz** | Signaux des sirènes, niveaux de vigilance, bons réflexes cyber : courts, sans chronomètre (accessibilité). | v2 |
| **Succès** | Fait : 12 succès en trois groupes (réserves, plan, gestes), de « Bienvenue au terrier » à « Nuit étoilée » et « Bons réflexes ». Calculés à partir des données, datés au premier déblocage et gardés même si une date passe ensuite (sauvegardés dans l'export). Un bandeau dans le flux de la page, sans rien masquer, annonce chaque déblocage. Ceux qui restent à débloquer disent comment les obtenir. À venir : « 1 an de rotation », premiers secours. | v2 |
| **Mode foyer partagé** | Partager la liste de courses, l'inventaire ou le plan par QR code ou par URL (§ 3.9). La synchronisation automatique viendra éventuellement plus tard, via le VPS. | v1 |
| **Voisinage** | Fiche imprimable « Je suis votre voisin·e, voici mon numéro » à glisser dans les boîtes aux lettres. Elle alimente la section « Le quartier » du plan (personnes aidantes et à aider). Étape 3 officielle : « Parlez-en autour de vous et proposez votre aide ». | v2 |
| **« Aide un proche à faire son kit »** | Générer une checklist imprimable ou partageable, pré-remplie pour un parent âgé (le guide insiste sur les plus vulnérables). | v2 |
| **Compétences** | Badge « Premiers secours » quand on a suivi un cours (liens Croix-Rouge / CGDIS). | v2 |

Garde-fous : pas de compte à rebours anxiogène, pas de notifications culpabilisantes, ni de streak qui « casse ». Les animations respectent `prefers-reduced-motion`.

---

## 5. Architecture technique

### 5.1 Pourquoi React + React Native (et pas une seule base de code)

Deux façons de faire du React Native pour le web et les stores :

| Option | Principe | Avantages | Inconvénients |
|---|---|---|---|
| **A. Expo « universel »** (`react-native-web`) | Une seule UI pour iOS, Android et le web | Une seule base de code d'interface | Sur le web, le rendu est fait de `<div>` avec des rôles ARIA au lieu de HTML sémantique (titres, listes, formulaires, landmarks) : beaucoup plus difficile de tenir **RAWeb AA**. La PWA hors-ligne (service worker) est à bricoler soi-même. |
| **B. Monorepo, cœur partagé** ✅ recommandé | `packages/core` en TypeScript pur, partagé entre une **PWA React** (HTML sémantique) et une **app Expo** (composants natifs) | Accessibilité native de chaque côté (RAWeb pour le web, RAAM pour le mobile) ; vraies notifications locales et SQLite sur mobile ; les builds iOS se font dans le cloud avec **EAS** (pas besoin de Mac) | L'interface est écrite deux fois (mêmes écrans, mêmes noms de composants), mais **toute la logique est partagée** : calculs, rappels, catalogue, i18n, format d'export et de partage |

**Choix : option B.** L'accessibilité est un critère non négociable du projet, et la logique (la partie difficile) n'est écrite qu'une fois.

Ordre de travail : **la PWA d'abord** (GitHub Pages, phases 0 à 4), l'app Expo ensuite (phase 5), qui réutilise `core` tel quel.

### 5.2 Stack

| Couche | Choix | Pourquoi |
|---|---|---|
| Monorepo | **pnpm workspaces** (+ Turborepo si besoin) | Partage de `core` entre web et mobile |
| Langage | **TypeScript** strict partout | |
| **Cœur partagé** `packages/core` | TS pur, sans dépendance UI : modèles, quantités, statuts, FIFO, moteur de rappels, score, schémas (Zod), format de partage et d'export, messages i18n | Testé une fois avec Vitest, utilisé par les deux apps |
| Web : UI | **React 19** + **Vite**, React Router en mode statique | HTML sémantique, composants accessibles maison selon les patterns APG du skillset |
| Web : PWA | **vite-plugin-pwa** (Workbox) | Precache complet, mise à jour contrôlée |
| Web : stockage | **IndexedDB** via **Dexie** | |
| Mobile : app | **Expo** (React Native), Expo Router | Builds iOS/Android dans le cloud (EAS), mises à jour OTA |
| Mobile : stockage | **expo-sqlite** | Même interface « dépôt » que Dexie, définie dans `core` |
| Mobile : notifications | **expo-notifications** : notifications **locales planifiées, hors-ligne**, sans serveur | Règle le problème du § 6 sur les stores |
| Mobile : scan | **expo-camera** (lecture de codes-barres) | |
| i18n | **i18next** (+ `react-i18next`), messages JSON dans `core`, format ICU pour les pluriels | Même bibliothèque et mêmes fichiers sur web et mobile |
| État | **Zustand** (hooks identiques web et mobile) | Léger |
| Tests | **Vitest** (core et web), **Playwright** (E2E web et hors-ligne), **axe-core** (pré-filtrage), **Jest + React Native Testing Library** (mobile), audits manuels RAWeb et RAAM | |
| CI/CD | **GitHub Actions** : lint, tests, build, déploiement Pages, vérification des liens ; **EAS Build** pour les stores | |

**Spécificités GitHub Pages** :

- `base` Vite configuré sur `/survival-kit/` (ou `/` avec un domaine personnalisé) ; scope et `start_url` du manifest alignés.
- Routes pré-générées ou repli `404.html` qui recharge l'app (pas de réécriture serveur).
- Fichier `.nojekyll` ; déploiement par l'action officielle `actions/deploy-pages`.
- Pas d'en-têtes HTTP personnalisés : la CSP passe par une balise `<meta http-equiv>`.
- **Domaine personnalisé** : **kitzy.lu**, réservé chez OVH et branché sur GitHub Pages (enregistrements A/AAAA vers GitHub, `www` en CNAME, domaine vérifié sur le compte GitHub, variables `KITZY_DOMAIN=kitzy.lu` et `KITZY_BASE=/`). Il doit être branché **avant** la mise en production publique : IndexedDB est liée à l'origine, et changer de domaine ensuite ferait perdre leurs données aux utilisateurs. Avec le domaine, `base` passe à `/` et un fichier `CNAME` est ajouté au déploiement.

### 5.3 Structure du dépôt

```
/
├─ PLAN.md
├─ packages/
│  └─ core/                     # TS pur, partagé
│     ├─ src/domain/            # quantités, statuts, FIFO, score
│     ├─ src/reminders/         # moteur de rappels (pur, testable)
│     ├─ src/share/             # encodage QR/URL, chiffrement, export/import
│     ├─ src/schema/            # Zod : catalogue, inventaire, plan, pays
│     ├─ src/repo/              # interfaces de stockage (implémentées par web et mobile)
│     └─ i18n/{fr,en,lb,de,pt}.json
├─ apps/
│  ├─ web/                      # PWA React + Vite (GitHub Pages)
│  │  ├─ src/components/        # composants accessibles (Button, Disclosure, Dialog, Meter…)
│  │  ├─ src/notify/            # in-app, .ics, Periodic Background Sync, Web Push (désactivé)
│  │  └─ src/db/                # Dexie
│  └─ mobile/                   # Expo (phase 5)
│     ├─ app/                   # Expo Router
│     └─ src/notify/            # expo-notifications
├─ data/
│  ├─ countries/{lu,fr,de,be,…}.json   # profils pays (§ 12.4)
│  ├─ catalog/items.json
│  ├─ catalog/products.json
│  ├─ guide/{fr,en,lb,de,pt}/*.md
│  └─ recipes/*.json
├─ scripts/check-links.ts
└─ .github/workflows/{deploy,link-check}.yml
```

### 5.4 Données dynamiques et mises à jour

- `items.json` (catalogue d'articles) et le guide sont **embarqués dans le precache** : l'app est complète dès la première visite.
- `products.json` (liens affiliés) suit une stratégie **stale-while-revalidate** : la dernière version connue reste toujours affichée, et la mise à jour se fait en arrière-plan quand le réseau revient.
- Chaque fichier porte un `version` et un `updatedAt`. L'app affiche « Catalogue mis à jour le … ».
- Mise à jour de l'app : bandeau « Nouvelle version disponible : recharger » (jamais de rechargement forcé pendant une saisie).

---

## 6. Hors-ligne et notifications : contraintes et stratégie

### 6.1 Le point dur

Tu veux des notifications **générées localement selon des dates, sans serveur**. Sur le web en 2026 :

| Mécanisme | Fonctionne hors-ligne, app fermée ? | Support |
|---|---|---|
| Notification planifiée locale (Notification Triggers API) | — | **Abandonnée**, non disponible |
| **Periodic Background Sync** | Oui, mais l'OS décide quand (au plus une fois par jour environ) | Chrome/Edge Android et desktop, **PWA installée** uniquement. Ni iOS, ni Firefox, ni Safari. |
| **Web Push** (serveur → appareil) | Il faut un serveur qui envoie au bon moment | Tous les navigateurs modernes ; sur **iOS, uniquement si la PWA est ajoutée à l'écran d'accueil** (iOS 16.4+) |
| Notification à l'ouverture de l'app | Oui | Partout |
| **Fichier calendrier .ics** (rappels exportés dans le calendrier du téléphone) | **Oui, 100 % local et fiable** | Partout |
| **Notifications locales natives** (expo-notifications) | **Oui, totalement** | Uniquement en app native (stores) |

**Conclusion** : avec un hébergement purement statique (GitHub Pages), on ne peut **pas** garantir une notification push à date fixe sur tous les appareils, notamment iPhone.

### 6.2 Stratégie proposée (par couches)

Un **moteur de rappels unique**, pur et testé, calcule la liste des rappels à partir de l'inventaire. Plusieurs **adaptateurs** les délivrent :

1. **In-app** (toujours) : badge, bandeau et liste « À faire » à chaque ouverture.
2. **Export calendrier .ics** (toujours, recommandé) : un clic ajoute les échéances et les revues semestrielles au calendrier du téléphone. Fonctionne hors-ligne, sans serveur, sur iOS comme sur Android. Possibilité de régénérer après chaque modification.
3. **Periodic Background Sync** (Chromium installé) : vérification quotidienne en arrière-plan, puis `showNotification()` locale. Aucun serveur, aucune donnée envoyée.
4. **Web Push via un mini-serveur** (**plus tard**, sur ton VPS, voir § 6.4). Respect de la vie privée : l'app n'envoie **que** l'abonnement push et une liste de dates/identifiants opaques (« rappel #a1b2 le 2027-03-01 »), **jamais** le contenu de l'inventaire. Le texte de la notification reste générique (« Tu as 2 rappels pour ton kit ») ; le détail s'affiche à l'ouverture.
5. **Notifications locales natives** (app Expo sur les stores) : même moteur de rappels (`core`), adaptateur `expo-notifications`. C'est la solution complète.

### 6.3 Décision : 100 % sans serveur au lancement

Le MVP utilise les couches 1, 2 et 3. Conséquences assumées :

- **iPhone** : pas de notification si l'app est fermée. On compense par l'**export calendrier** (mis en avant dans l'onboarding iOS) et les rappels à l'ouverture.
- **Android/Chrome** : Periodic Background Sync, si l'app est installée.
- On mesure le besoin (retours utilisateurs) avant d'ajouter le serveur.

### 6.4 Plus tard : service Web Push sur le VPS

Prévu dès maintenant pour ne rien casser au moment de l'ajouter :

- Petit service **Node** (ou Bun) : bibliothèque `web-push` avec clés VAPID, **SQLite**, tâche cron toutes les heures.
- API minimale : `POST /subscribe` (abonnement + liste `{id opaque, date}`), `DELETE /subscribe`. CORS limité au domaine de l'app.
- **Aucune donnée d'inventaire** côté serveur : uniquement des identifiants aléatoires et des dates. Le contenu de la notification est générique, le détail s'affiche à l'ouverture.
- Purge automatique des abonnements expirés (HTTP 404/410 renvoyé par le service push).
- L'adaptateur `apps/web/src/lib/webpush.ts` existe, désactivé tant que `VITE_KITZY_PUSH_URL` et `VITE_KITZY_VAPID_KEY` ne sont pas fournis au build.
- Contrat attendu : `POST /subscribe` avec `{ subscription, schedule: [{ id, date }], timezone }`, `DELETE /subscribe` avec `{ endpoint }`. Le calendrier ne contient qu'**une entrée par jour d'alerte** (identifiant FNV-1a salé par appareil), jamais un nom d'article. Le service envoie un push vide de contenu ce jour-là, vers 9 h dans le fuseau indiqué ; le service worker calcule et affiche le détail localement.
- Mise à jour de la politique de confidentialité au moment de l'activation.
- **Le VPS (OVH)** : Ubuntu, nginx, vhosts gérés avec **WordOps**. Déploiement prévu :
  - DNS : `push.kitzy.lu` en A (et AAAA) vers l'IP du VPS ;
  - le service écoute en local (ex. `127.0.0.1:8787`), lancé par **systemd** (redémarrage automatique, utilisateur dédié sans droits) ;
  - un vhost WordOps en proxy inverse vers ce port avec certificat Let's Encrypt (WordOps sait créer un site « proxy » ; syntaxe exacte à vérifier au moment de l'installation) ;
  - SQLite dans un dossier du service, sauvegardé avec le reste du VPS ;
  - clés VAPID générées une fois sur le VPS ; la clé publique va dans la variable de dépôt `KITZY_VAPID_KEY`, l'adresse dans `KITZY_PUSH_URL`.

### 6.5 Règles de rappel par défaut

| Type | Déclencheurs |
|---|---|
| Péremption DLC | J-30, J-7, J0 |
| Péremption DDM | J-30, J+0 (ton doux : « à consommer bientôt ») |
| Batterie / power bank | Tous les 3 mois après la dernière recharge |
| Test radio et lampe | Mensuel (premier lundi, avec le test des sirènes) |
| Piles stockées | Selon la date imprimée |
| Revue complète du kit | 2 fois par an (changements d'heure) |
| Documents d'identité | J-60 avant l'expiration |
| Plan d'urgence | Revue annuelle |

Tout est modifiable. Les rappels du même jour sont **regroupés** (une seule notification, pas dix).

---

## 7. Modèle de données et synchronisation

```ts
// Foyer
Household {
  id; durationDays: number /* 3 par défaut */;
  members: Member[];
}
Member {
  id; name?: string;
  type: 'adult' | 'child' | 'infant' | 'senior' | 'pet';
  petSpecies?: 'dog' | 'cat' | 'other'; petWeightKg?: number;
  needs?: string[];          // 'medication', 'mobility', 'gluten-free'...
  hasGoBag: boolean;
}

// Kits
Kit { id; type: 'home' | 'go-bag' | 'car' | 'custom'; name; ownerMemberId?; location?: string }

// Catalogue (données livrées, versionnées)
ItemTemplate {
  id; category: CategoryId;
  name: I18nString; description: I18nString; whyLink?: GuidePageId;
  source: 'official-lu' | 'recommended' | 'optional';
  kitTypes: KitType[];
  quantityRule?: { perMemberType: Record<MemberType, number>; perDay: boolean; unit: 'L' | 'kcal' | 'pcs' | ... };
  tracking: { expiry?: 'dlc' | 'ddm'; battery?: { intervalDays: number }; reviewIntervalDays?: number };
  safetyNote?: I18nString;   // ex. monoxyde de carbone, iode
  productIds: string[];      // offres associées (§ 8)
}

// Inventaire (données utilisateur)
InventoryItem {
  id; kitId; templateId?: string; customName?: string;
  targetQuantity?: number;   // surcharge de la règle
  lots: Lot[];
  battery?: { lastChargedAt: ISODate; intervalDays: number };
  notes?: string;
}
Lot { id; quantity: number; unit; expiryDate?: ISODate; expiryType?: 'dlc' | 'ddm'; addedAt: ISODate; barcode?: string }

Task { id; templateId; doneAt?: ISODate }       // gestes (§ 2.14)
EmergencyPlan { contacts[]; meetingPoints[]; utilityShutoffs; medicalInfo[]; updatedAt }
ActivityLog { id; type; at; payload }           // progression, badges
Settings { locale; theme; textScale; reminderOffsets; channels; quietHours }
```

- **Migrations** Dexie versionnées dès la v1.
- L'**export** JSON reprend tout (`schemaVersion` inclus) ; l'import valide le schéma et propose « fusionner » ou « remplacer ».

---

### 7.1 Synchronisation entre appareils (à venir)

Objectif : retrouver son kit sur le téléphone, la tablette et l'ordinateur, sans compte Kitzy et **sans serveur Kitzy**, en s'appuyant sur le cloud que la personne utilise déjà. Le cloud ne voit jamais les données en clair.

**Fournisseurs et techniques (toutes côté navigateur, compatibles avec un hébergement statique)**

| Fournisseur | Technique | Accès demandé | Remarques |
|---|---|---|---|
| **Google Drive** | OAuth 2.0 PKCE (Google Identity Services) + API Drive | `drive.appdata` : un dossier caché propre à Kitzy, invisible du reste du Drive | Écran de consentement Google à faire valider |
| **Dropbox** | OAuth PKCE (sans secret) + API Dropbox | « App folder » : `Applications/Kitzy` seulement | Le plus simple à mettre en place |
| **OneDrive** | MSAL.js (PKCE) + Microsoft Graph | Dossier spécial `approot` | Comptes personnels et professionnels |
| **iCloud** | CloudKit JS (web) ; iCloud natif dans l'app Expo | Base privée de la personne | Demande un compte Apple Developer et un conteneur CloudKit ; prévu d'abord dans l'app native |
| **Dossier synchronisé** (tout cloud) | File System Access API : la personne choisit un fichier dans son dossier iCloud Drive, Dropbox, OneDrive ou Google Drive installé sur l'ordinateur | Ce seul fichier | Chrome et Edge sur ordinateur ; zéro OAuth |
| Partout | Export / import du fichier de sauvegarde (déjà disponible) | — | Solution de secours |

**Principes**

- **Chiffrement de bout en bout** : une phrase secrète choisie par la personne, dérivée par PBKDF2 (ou Argon2 en WebAssembly), chiffrement AES-GCM avec WebCrypto. Le fichier `kitzy-sync.enc` contient la sauvegarde chiffrée et un en-tête minimal (version, sel, appareil). Phrase oubliée = données du cloud illisibles (avertissement clair) ; les données locales restent intactes.
- **Données de santé** du plan d'urgence : synchronisées seulement chiffrées, et avec un consentement distinct.
- **Fusion** par enregistrement, « le plus récent gagne » : chaque kit, article, ajout de courses, geste et étape du plan porte un `updatedAt` ; les suppressions laissent une **pierre tombale** (`deletedAt`) gardée 90 jours. Le plan fusionne étape par étape (`mergePlanStep` existe déjà). Le moteur de fusion est pur et testé dans `core`, partagé avec l'app Expo.
- **Quand** : à l'ouverture, 10 s après une modification, au retour sur l'onglet ; hors-ligne, la synchro attend la connexion. Jamais de blocage de l'app pendant une synchro.
- **Jetons** OAuth gardés dans IndexedDB, révocables depuis les réglages (« Déconnecter Google Drive ») ; portées minimales.
- **Prérequis** : le domaine définitif (kitzy.lu) pour déclarer les adresses de retour OAuth ; mise à jour de la page de confidentialité avant l'activation.

**Ordre proposé** : moteur de fusion et chiffrement (`core`) → Dropbox et dossier synchronisé → Google Drive → OneDrive → iCloud (app Expo, puis CloudKit JS si la demande existe).

## 8. Affiliation et catalogue produits

### 8.1 Principe

Pour chaque modèle d'article, **2 à 4 offres** à différents niveaux de budget, affichés **uniquement** par des marqueurs : **€** Essentiel · **€€** Équilibré · **€€€** Durable. Et si possible plusieurs marchands par offre.

Accessibilité des marqueurs : le symbole est accompagné d'un texte (« € – Budget essentiel ») ou d'un texte visuellement masqué. Un lecteur d'écran ne doit pas lire « euro euro euro ».

```jsonc
// data/catalog/products.json
{
  "version": 12, "updatedAt": "2026-10-14",
  "products": [{
    "id": "swiss-knife-basic",
    "itemTemplateIds": ["multitool-knife"],
    "name": "Couteau suisse 12 fonctions",
    "brand": "…",
    "tier": 1,                              // 1 = essentiel, 2 = équilibré, 3 = premium
    "why": { "fr": "Lame + ouvre-boîte + ciseaux en un seul objet" },
    "offers": [
      { "merchant": "amazon-fr", "url": "https://…?tag=XXXX-21", "status": "ok", "lastChecked": "2026-10-13" },
      { "merchant": "amazon-de", "url": "…", "status": "ok" }
    ]
  }]
}
```

### 8.2 Règles

- **Aucun prix affiché** (décision validée) : seulement les marqueurs €, €€, €€€. Ça évite les prix périmés et les contraintes des programmes sur l'affichage des prix. Le palier est déterminé à la main, par catégorie (un « € » de lampe frontale n'est pas un « € » de radio).
- Le **Luxembourg n'a pas d'Amazon local** : on proposera amazon.fr et amazon.de (le programme Partenaires est souscrit par marketplace ; voir OneLink pour la redirection selon le pays). On pourra ajouter des réseaux d'affiliation européens (Awin, Tradedoubler, programmes directs de marques ou d'enseignes outdoor), selon disponibilité au Luxembourg.
- **Transparence** : mention claire sur chaque bloc produit (« Lien affilié : je touche une petite commission, sans surcoût pour toi »), et page dédiée.
- Les liens s'ouvrent avec `rel="sponsored noopener"` et un texte de lien explicite (« Voir le couteau suisse 12 fonctions sur Amazon.fr », nouvelle fenêtre signalée).
- **La recommandation ne dépend jamais de l'affiliation** : l'article reste conseillé même sans offre disponible.
- Hors-ligne, les offres restent visibles (dernière version connue) ; les liens sont simplement inactifs avec un message.

### 8.3 Marchands et réseaux d'affiliation

Le **Luxembourg n'a pratiquement pas de programmes d'affiliation locaux** : les résident·es achètent surtout sur des sites français, allemands et belges qui livrent au Luxembourg. La stratégie consiste donc à couvrir **FR + DE**, avec une vérification systématique de la livraison au Luxembourg.

| Marchand | Pertinence pour le kit | Réseau (à confirmer à l'inscription) | Priorité |
|---|---|---|---|
| **Amazon.fr / Amazon.de** | Tout le catalogue | Amazon Partenaires (compte existant) ; **un compte par marketplace**, à relier via OneLink | ✅ déjà actif |
| **Decathlon.fr** | Réchauds, cartouches, frontales, sacs, couchage, couvertures de survie, trousses | Rakuten Advertising (programme « Decathlon National », d'après la page officielle) ; Decathlon DE est sur Awin | Haute |
| **Bergfreunde.de / .eu** | Outdoor de qualité : frontales, popotes, filtres à eau, paracorde, dry bags | Awin (DE) ou programme direct | Haute |
| **ManoMano.fr** | Outils, ruban adhésif, bâche, extincteur, détecteurs, seaux | Awin | Moyenne |
| **Darty / Fnac** | Radios FM/DAB+, power banks, piles, lampes | Awin | Moyenne |
| **Conrad** (DE/BE) | Radios, piles, panneaux solaires, électronique | Awin | Moyenne |
| Pharmacies en ligne (Shop Apotheke / Redcare, etc.) | Trousse de secours, sels de réhydratation, tire-tique, masques | Awin (à vérifier, ainsi que la livraison au LU) | Basse |
| **AliExpress** | Voir ci-dessous | Compte existant | Très limitée |

**Inscription conseillée** : un compte **Awin** (éditeur) ouvre la plupart des marchands FR et DE d'un coup, plus **Rakuten Advertising** pour Decathlon France. L'acceptation se fait marchand par marchand : un site en ligne, une page de transparence et une politique de confidentialité sont généralement demandés. Il faut donc les avoir dès la phase 3.

**Règle AliExpress** : **exclu** pour tout ce qui touche à la sécurité ou à la santé (batteries lithium et power banks, réchauds et gaz, détecteurs, extincteurs, trousses et produits médicaux, filtres à eau, radios) : conformité CE incertaine, contrefaçons possibles, délais de livraison de plusieurs semaines. Toléré au mieux pour des accessoires sans risque (mousquetons non porteurs, sacs zip, organisateurs), et jamais comme offre unique.

**Critères de sélection d'une offre** (documentés dans le JSON) : marchand réputé, livraison au Luxembourg, conformité CE ou norme pertinente, bons avis, retour possible, disponibilité stable.

### 8.4 Édition du catalogue

- Phase 1 : édition directe des JSON dans le dépôt (PR → CI valide le schéma via JSON Schema → déploiement).
- Phase 2 (si besoin) : petit back-office statique, ou un CMS Git (Decap CMS, Pages CMS) pour éditer sans toucher au JSON.

### 8.5 Dons

- **Web (PWA)** : page « Soutenir Kitzy » et lien discret dans « À propos », avec deux boutons : **PayPal** (<https://paypal.me/Crofte>) et **Revolut** (<https://revolut.me/crofte?note=Donation%20Kitzy.lu>). Jamais de pop-up, jamais pendant une tâche. Liens ouverts dans un nouvel onglet, signalé aux lecteurs d'écran ; ils sont aussi surveillés par le workflow de vérification des liens (§ 9).
- **Stores** : Apple impose l'**achat intégré** pour les pourboires versés au développeur, et Google Play a des règles similaires pour les contenus numériques. Dans l'app native, on propose donc soit un « pot à pourboires » en achat intégré (3 montants), soit on masque le lien externe. Règles à revérifier au moment de la publication.
- Les liens PayPal.me et Revolut.me **ne peuvent pas figurer tels quels dans l'app iOS** (règle 3.1.1 d'Apple : les pourboires au développeur passent par l'achat intégré) : version store = achat intégré ou pas de lien de don. La PWA n'est pas concernée.
- Ton : « Kitzy est gratuit et sans pub. Si l'app t'aide, tu peux offrir une pomme au hérisson. »

---

## 9. Surveillance des liens

### 9.1 Pipeline

`.github/workflows/link-check.yml` : **cron hebdomadaire** et déclenchement manuel.

1. `scripts/check-links.ts` parcourt `products.json` et les liens sortants du guide.
2. Pour chaque URL :
   - code HTTP (404, 410, 5xx), redirections vers une page de recherche ou d'accueil (signe d'un produit retiré) ;
   - pour les marchands où c'est **autorisé**, détection « indisponible » (marqueurs comme `"availability":"OutOfStock"` en JSON-LD, ou « Actuellement indisponible ») ;
   - pour **Amazon**, ne pas scraper (c'est interdit par les conditions du programme, et Amazon bloque les robots). Utiliser l'**API officielle** pour la disponibilité dès que le compte y est éligible (Amazon conditionne l'accès à l'API à un minimum de ventes qualifiées). En attendant, contrôle du code HTTP et revue manuelle trimestrielle.
3. Résultat :
   - mise à jour automatique du `status` (`ok` | `unavailable` | `broken` | `unknown`) et de `lastChecked` dans une PR générée par le bot ;
   - **issue GitHub** récapitulative listant les liens à corriger (une seule issue mise à jour, pas une par lien) ;
   - l'app **masque** les offres `broken`/`unavailable` et remonte l'offre suivante du même palier.
4. Liens du guide officiel (letzprepare.public.lu, lu-alert.lu, infocrise.lu…) : même contrôle, sans les masquer automatiquement.

### 9.2 Garde-fous

- Limite de requêtes, User-Agent honnête, respect de `robots.txt`.
- Un échec isolé passe en `unknown`, pas en `broken` (on confirme sur deux passages consécutifs).

---

## 10. Accessibilité

**Cible : RAWeb 1.1 niveau AA** (EN 301 549 / WCAG 2.1), avec le skill `raweb-code` pendant le développement et `raweb-audit` avant chaque release. Ensuite **RAAM 1.1** pour les versions natives.

### 10.1 Points d'attention spécifiques à cette app

| Sujet | Exigence | Critères RAWeb concernés (à confirmer via `raweb-lookup.sh`) |
|---|---|---|
| Statuts d'articles (OK, bientôt, expiré) | Jamais par la couleur seule : texte + icône + info dans le code | 3.1 |
| Contrastes | Texte 4,5:1, composants et icônes 3:1, en thème clair **et** sombre | 3.2, 3.3 |
| Jauges de préparation | `<meter>` ou équivalent, avec valeur textuelle visible | 7.1 |
| Cases à cocher (inventaire, courses) | `<input type="checkbox">` natif + `<label>` | 11.1, 11.2 |
| Formulaires (ajout, dates, foyer) | Étiquettes visibles, erreurs liées au champ, format de date indiqué, `autocomplete` sur les champs personnels du plan | 11.x |
| Messages de statut (« Ajouté », « 1 retiré ») | Région live (`role="status"`) | 7.5 |
| Navigation SPA | Mise à jour du `<title>`, focus déplacé vers le `<h1>` de la nouvelle page, lien d'évitement | 8.6, 12.x |
| Modales (confirmation, scan) | Pattern dialog APG : focus piégé, `Échap`, retour du focus | 7.1, 12.x |
| Scan code-barres | Alternative de saisie manuelle toujours disponible | 7.x |
| Zoom et reflow | Aucune perte de contenu à 200 %, puis 320 px de large | 10.4, 10.11 |
| Espacement du texte | Compatible avec les surcharges utilisateur | 10.12 |
| Animations et badges | `prefers-reduced-motion`, aucune animation essentielle | 13.x |
| Langues | `lang` sur `<html>` et sur tout passage dans une autre langue | 8.3, 8.7 |
| Audio des sirènes | Description textuelle de chaque signal ; aucun son en lecture automatique | 4.x |
| Quiz | Pas de limite de temps | 13.1 |
| Liens affiliés | Intitulé explicite, nouvelle fenêtre signalée | 6.1, 13.2 |
| Impression du plan | Styles print lisibles ; PDF généré balisé | — |
| Notifications | Texte autoporteur, sans emoji seul porteur de sens | — |

### 10.2 Process

- **Bibliothèque de composants accessibles** dès le premier sprint (bouton, disclosure, dialog, tabs, meter, toast/status, combobox de recherche du catalogue), basée sur les patterns APG du skillset.
- Checklist pré-commit du skill `raweb-code`.
- Automatisé : axe-core dans Playwright à chaque PR (pré-filtrage seulement).
- Manuel avant chaque release : clavier seul, NVDA + Firefox, VoiceOver iOS, TalkBack Android, zoom 200 %, contraste forcé Windows.
- **Déclaration d'accessibilité** publiée dans l'app (bonne pratique, même si l'obligation légale vise le secteur public).
- Tests utilisateurs avec au moins une personne utilisatrice de lecteur d'écran avant la v1.

---

## 11. Design

### 11.1 Direction retenue : « La Veillée »

Maquettes animées (thème sombre, thème clair, principes de mouvement) : **[Kitzy — pistes graphiques](https://claude.ai/artifact/Sg3NGkrGHWi7xQpJ3iVhvB)**, page « La Veillée ». Les pistes écartées (1 Douillet, 2 Affiche, 3 L'Étagère) restent consultables dans les autres pages.

**Concept** : le terrier du hérisson un soir d'automne. La fenêtre ronde du terrier, éclairée comme une lanterne, montre Kitzy. **Six lucioles** l'entourent, une par essentiel (Eau, Repas, Lumière, Chaleur, Soins, Mon plan) : se préparer, c'est les allumer. Ton de livre d'histoires, jamais d'alerte.

**Typographie** : **Young Serif** (titres, phrases du hérisson) + **Figtree** (interface, listes, dates, quantités ; graisse 400 minimum sur fond sombre).

**Couleurs** (jetons communs, deux thèmes) :

| Jeton | Sombre « Veillée » | Clair « Petit matin » | Usage |
|---|---|---|---|
| `bg` | `#12302B` forêt de nuit | `#E7F0EC` brume | Fond |
| `surface` | `#1C4139` mousse | `#FFFFFF` | Cartes |
| `text` | `#FFF4E2` bougie (13:1) | `#12302B` (12,2:1) | Texte principal |
| `muted` | `#B9CBC2` (8,4:1) | `#47665D` (5,4:1) | Texte secondaire |
| `label` | `#9CCB98` fougère | `#2E6B3A` | Réussi, libellés |
| `btn` / `btnText` | `#F4B860` / `#12302B` (8:1) | identique | Action principale |
| `fly` | `#FFE08A` + halo | `#F2A93B` cerclé `#8A5300` | Luciole allumée |
| `flyOff` | `#6E9C90` | `#5E7E74` | Luciole à allumer |
| `dotA` | `#F59A6A` bandana | `#C9602B` | À consommer |
| `line` | `#3E6B60` | `#9DB8AF` | Séparateurs (décor) |
| `glow` | lanterne ambre vers mousse | soleil levant vers brume | Fenêtre du terrier |

Le thème suit `prefers-color-scheme` et reste modifiable dans l'app (bouton soleil/lune, réglages).

### 11.2 Mouvement

Lent comme une flamme : une mise en scène à l'ouverture, des boucles d'ambiance à peine perceptibles, une récompense quand on agit.

| Animation | Déclencheur | Paramètres | Mouvement réduit |
|---|---|---|---|
| La lanterne s'allume | Ouverture, une fois | 1,1 s, échelle 0,9 → 1 et opacité | Déjà affichée |
| Les lucioles apparaissent | Ouverture | 0,5 s chacune, décalage 120 ms | Affichées directement |
| **Histoire des lucioles** (foyer pas encore présenté) | Accueil, une fois par session | Les six lucioles s'allument, puis s'éteignent une à une (0,6 s chacune, décalage 300 ms, à partir de 1,8 s), la fenêtre faiblit, puis le texte apparaît (3,9 s) et la carte « Présenter mon foyer » (4,3 s) ; moins de 5 s au total | Lucioles déjà éteintes, texte affiché d'emblée |
| La lanterne respire | Boucle | 7 s, ±4 % | Halo fixe |
| Le hérisson respire | Boucle | 4,5 s, 1 px | Immobile |
| Les lucioles flottent et scintillent | Boucle | 8 à 11 s, ±4 px ; éclat 82 → 100 % en 3,6 s | Immobiles, pleinement allumées |
| Une luciole s'allume | Action terminée | 0,7 s d'éclosion + onde de 0,9 s + message `role="status"` | Fondu 0,25 s, même message |
| Les six lucioles brillent | Kit complet, une fois | Vague en cascade de 1,3 s | Message seul |
| Changement de thème | Bouton ou système | Fondu des couleurs 0,5 s | Instantané |
| Appui | Bouton | Échelle 0,97, 150 ms | Aucun |

Règles :

- Une seule courbe : `cubic-bezier(.2, .8, .2, 1)`, sans rebond. Seulement `transform` et `opacity` (fluidité sur petits téléphones).
- Aucun mouvement ne porte seul une information : chaque changement a son texte, annoncé aux lecteurs d'écran.
- Pas de clignotement (RAWeb 13.7) : variation d'éclat lente, très en dessous de 3 fois par seconde.
- **Deux interrupteurs** : `prefers-reduced-motion` coupe tout par défaut, **et** un réglage « Animations d'ambiance » permet d'arrêter et de relancer les boucles, quel que soit le système (RAWeb 13.8 : tout mouvement automatique de plus de 5 s doit être contrôlable).
- React Native : mêmes durées et courbes avec `react-native-reanimated`, en lisant `AccessibilityInfo.isReduceMotionEnabled()`.
- Texte de l'histoire des lucioles : « Six lucioles veillent sur ton terrier : l'eau, les repas, la lumière, la chaleur, les soins et ton plan. Quand une réserve manque, sa luciole s'éteint. Prépare les réserves de ton foyer pour les rallumer, une à une. **Tant qu'elles brillent toutes, tout va bien.** » Le texte est dans la page dès le départ (lecteurs d'écran), seule son apparition visuelle est différée ; un élément qui reçoit le focus pendant l'animation s'affiche aussitôt.

### 11.3 Le hérisson

- Descriptions des 12 poses à générer : [`docs/mascotte-poses.md`](docs/mascotte-poses.md).
- **Poses intégrées** (`apps/web/public/mascot/`) : bonjour, endormi, lanterne, provisions, fête, lecture, **sac sur le dos** (page de présentation, partie maison et sacs) ; la lanterne ouvre la page de présentation, en entier et sans cadre, son halo part de la lanterne. **À générer** : 8. écoute la radio, 9. la bouteille d'eau, 10. le plan d'urgence, 11. curieux qui sort la tête (hors-ligne, erreur douce), 12. portrait pour l'icône de l'app (l'icône actuelle part de l'image de référence).
- Mascotte **générée par IA** (modèle d'OpenAI), fournie par Geoffrey, **détourée** automatiquement (rembg, modèle isnet) : `assets/mascot/kitzy-hedgehog.{png,webp}` (fond transparent, 640 px de large).
- Pour les autres poses (endormi, content, pensif, avec une lampe frontale, en boule), régénérer avec **le même modèle et la même description** (bandana rayé orange et blanc, pelage brun, ventre crème, style 3D doux), puis détourer de la même façon. Garder une feuille de référence pour la cohérence.
- Formats : WebP transparent pour le web (≈ 100 Ko), PNG pour les stores et l'icône d'app ; versions 1x, 2x et 3x pour React Native.
- Droits : les conditions d'OpenAI attribuent les images générées à l'utilisateur, mais une image générée par IA est difficilement protégeable par le droit d'auteur. Le **nom « Kitzy »** et le logo, eux, peuvent être déposés comme marque.
- Le hérisson reste décoratif (`alt=""`) sauf quand il porte un sens ; jamais seul porteur d'une information.

### 11.4 Livrables design

1. Design tokens (couleurs clair/sombre, typo, espacements, rayons) dans `core`, exportés en variables CSS (web) et en thème (React Native)
2. Maquettes des écrans clés : onboarding, tableau de bord, inventaire, fiche article, liste de courses, partage QR, guide, plan d'urgence
3. Planche du hérisson (6 poses) et icône d'app (formats PWA, iOS, Android)

---

## 12. Contenu, langues et aspects légaux

### 12.1 Langues

**Langues validées : FR, EN, LB, DE, PT.**

| Langue | Code | Remarques |
|---|---|---|
| Français | `fr` | Langue source, rédigée en premier |
| English | `en` | |
| Lëtzebuergesch | `lb` | Relecture par une personne de langue maternelle indispensable (orthographe officielle). Peu de navigateurs ou systèmes ont des données `Intl` complètes pour `lb` : formats de date avec repli sur `de-LU` si besoin. Il n'existe presque pas de voix de synthèse luxembourgeoise ; on garde quand même `lang="lb"` (exigence RAWeb 8.3) |
| Deutsch | `de` | Variante `de-LU` pour les formats |
| Português | `pt` | **Portugais européen (`pt-PT`)**, celui de la communauté au Luxembourg |

- Langue proposée par défaut selon `navigator.languages`, changeable à tout moment (sélecteur accessible, chaque langue écrite dans sa propre langue avec son `lang`).
- Les contenus longs (guide, recettes) sont en Markdown par langue ; l'UI passe par les messages i18next de `core`.
- **Ordre de production** : FR complet, puis EN et DE, puis PT et LB. Une langue n'est publiée qu'**entièrement traduite et relue** : pas de mélange de langues dans l'interface (RAWeb 8.7).
- Récupérer les versions officielles du guide dans ces langues pour reprendre la terminologie (LU-Alert, niveaux de vigilance, noms des signaux de sirène).
- Les liens affiliés peuvent varier selon la langue (Amazon.de pour DE et LB, Amazon.fr pour FR) : OneLink ou choix du marchand dans les réglages.

### 12.2 Contenu du guide

- Source de référence : **« Mon guide 72h d'autonomie »**, version PDF accessible (balisée), 50 pages, septembre 2026 (HCPN, campagne 2026). Le plan reprend désormais l'intégralité de ses 4 chapitres, de la checklist et du formulaire du plan d'urgence.
- **Décision** : le contenu officiel est **reformulé, simplifié et résumé**, jamais copié tel quel, avec un lien vers la source. Pas de reprise des illustrations officielles.
- Cible de lisibilité : **langage clair** (phrases courtes, un message par paragraphe, vocabulaire courant, niveau B1 environ), ce qui est aussi un plus pour l'accessibilité cognitive et pour les personnes qui lisent dans une langue qui n'est pas la leur. Le PDF n'est **pas** versionné dans le dépôt public pour l'instant (droits à confirmer).
- Chaque page d'aide affiche « Source : Lëtz prepare! – Gouvernement du Grand-Duché de Luxembourg » avec un lien.
- Le guide existe « en plusieurs langues et en versions accessibles » : récupérer les versions DE, EN (et autres) pour aligner les traductions de l'app sur la terminologie officielle.

### 12.3 Juridique (à faire valider)

- **Pas d'usurpation d'identité officielle** : ni logo du gouvernement, ni lion rouge, ni nom « Lëtz prepare » dans le nom de l'app. Mention claire : « Application indépendante, non affiliée au Gouvernement du Luxembourg ».
- **RGPD** : données locales uniquement, donc une politique de confidentialité simple. Si le serveur Web Push est ajouté : minimisation des données, base légale, durée de conservation.
- **Données de santé** (plan d'urgence) : stockées localement, avec consentement explicite et suppression facile.
- **Affiliation** : mention obligatoire (pratiques commerciales loyales, conditions des programmes partenaires).
- **Avertissements santé et sécurité** : iode uniquement sur instruction des autorités, monoxyde de carbone, bougies, médicaments sur avis médical. L'app ne remplace pas les consignes officielles.
- **Analytics** : aucun par défaut. Si besoin, une solution sans cookie et respectueuse de la vie privée (Plausible ou Umami auto-hébergé), avec opt-in.

### 12.4 Luxembourg d'abord, compatible avec l'Europe

Tout ce qui dépend du pays est isolé dans un **profil pays** (`data/countries/<code>.json`). Le Luxembourg est le seul profil complet au lancement ; les autres peuvent s'ajouter sans toucher au code.

| Élément du profil | Exemple LU |
|---|---|
| Source officielle et lien du guide | Lëtz prepare! (HCPN) |
| Liste officielle (identifiants d'articles marqués « officiel » pour ce pays) | Checklist 72 h |
| Numéros d'urgence | 112 (secours), 113 (police), numéro vert 8002 7788 |
| Système d'alerte et lien vers l'app | LU-Alert |
| Test des sirènes (pour le rituel mensuel) | Premier lundi du mois, à midi |
| Radios de crise | RTL, radio 100,7 |
| Sites utiles | infocrise.lu, 112.lu, inondations.lu, meteolux.lu… |
| Marchands affiliés pertinents | Amazon.fr/.de, Decathlon FR, Bergfreunde… |
| Langues proposées par défaut | FR, LB, DE, EN, PT |

Candidats suivants (à documenter et vérifier un par un, avec leurs sources officielles) : **France** (FR-Alert), **Belgique** (BE-Alert), **Allemagne** (NINA, Cell Broadcast DE-Alert), **Pays-Bas** (NL-Alert). Le **112** fonctionne dans toute l'UE et reste le numéro affiché par défaut pour un pays sans profil.

- Le pays est demandé à l'onboarding (par défaut d'après la langue et le fuseau, toujours modifiable) ; un mode « Europe générique » s'appuie sur les recommandations européennes (72 h, 112).
- Le rituel « premier lundi » devient « le jour du test des sirènes de ton pays », ou un jour choisi s'il n'y a pas de test régulier.

---

## 13. Publication sur les stores

Oui, c'est possible :

| Plateforme | Méthode | Remarques |
|---|---|---|
| **Android (Google Play)** | App **Expo** buildée avec **EAS Build** | Compte développeur Google (frais uniques). Alternative express possible avant l'app Expo : publier la PWA en **TWA** (Bubblewrap/PWABuilder). |
| **iOS (App Store)** | App **Expo**, EAS Build et EAS Submit (pas besoin de Mac) | Compte Apple Developer (abonnement annuel). Une vraie app native passe sans difficulté la règle 4.2 (fonctionnalité minimale) qui pose problème aux sites web emballés. |

Préparé dès le départ :

- toute la logique dans `packages/core`, sans dépendance au DOM ;
- interface de stockage abstraite (Dexie côté web, SQLite côté mobile) ;
- **même format d'export et de partage** : un utilisateur passe de la PWA à l'app native en scannant un QR code ou en important son fichier ;
- audit **RAAM 1.1** (skills `raam-code` / `raam-audit`) pour l'app Expo.

---

## 14. Feuille de route

### Phase 0 : Fondations ✅

- [x] Valider le plan (v0.3) et le nom **Kitzy**
- [x] Piste graphique : **La Veillée** (sombre + clair, mouvement)
- [x] **Domaine** kitzy.lu réservé et branché sur GitHub Pages
- [ ] Vérifier la marque « Kitzy » (EUIPO, stores)
- [x] Monorepo pnpm : `packages/core` (TS, Vitest) et `apps/web` (React 19, Vite 8, vite-plugin-pwa, React Router, i18next, Playwright), ESLint avec jsx-a11y, Prettier
- [x] Jetons de couleur des deux thèmes dans `core`, avec **test automatique des contrastes** (4,5:1 minimum)
- [x] Préférences : thème (système, sombre, clair) et animations d'ambiance (système, activées, désactivées)
- [x] Coquille de l'app : en-tête, navigation du bas, lien d'évitement, focus sur le titre à chaque navigation, titre de page, page introuvable, bandeau de mise à jour sans rechargement forcé
- [x] Accueil « La Veillée » : fenêtre du terrier, six lucioles, première mission ; animations désactivées par défaut si le système demande moins de mouvement
- [x] Polices auto-hébergées (Young Serif, Figtree) et 6 poses du hérisson mises en cache pour le hors-ligne
- [x] Manifest PWA, icônes (dont maskable), service worker avec precache ; `404.html` pour les routes sur GitHub Pages
- [x] Tests de bout en bout : parcours, axe-core dans les deux thèmes, focus, lien d'évitement, mouvement réduit, **hors-ligne**
- [x] CI GitHub Actions (format, lint, types, tests, e2e) et déploiement GitHub Pages (`/survival-kit/`, ou `kitzy.lu` via variables de dépôt)
- [x] Skills d'accessibilité installés dans `.claude/skills/` (raweb-code, raweb-audit, raam-code, raam-audit)
- [ ] Activer GitHub Pages dans les réglages du dépôt (Source : GitHub Actions)
- [ ] Profil pays `lu.json` et schéma des profils (reporté en phase 1, avec le catalogue)
- [ ] Dexie et Zod : arrivent en phase 1 avec les premières données

### Phase 1 : MVP hors-ligne ✅

- [x] Composants accessibles de base : compteur, jauge (`role="meter"` avec valeur textuelle), pastilles d'état (texte + icône), champs avec erreurs liées (`aria-invalid`, `aria-describedby`), zone d'annonce `role="status"`, cases et boutons radio redessinés
- [x] Catalogue complet (98 articles : 34 officiels, 41 conseillés, 23 confort) en TypeScript typé dans `core`, avec tests d'intégrité ; profil pays `lu`
- [x] Onboarding du foyer (personnes, animaux, durée de 3 à 14 jours, nombre de sacs) et calcul des quantités
- [x] Kits (réserve maison et un sac par personne, renommables), inventaire par lots, DLC/DDM, consommation FIFO, objets personnels
- [x] Suivi des batteries (recharge notée, échéance calculée)
- [x] Terrier : lucioles calculées sur les articles officiels, prochaine action, « Les prochains jours »
- [x] Liste de courses fusionnée entre kits, cases à cocher, ajouts manuels
- [x] Moteur de rappels (péremptions, recharges, mini-check mensuel, check-ups aux changements d'heure) et export **.ics** avec alarmes
- [x] Sauvegarde et restauration JSON validées (Zod), effacement complet
- [x] Partage de la liste de courses par QR code, lien, e-mail ou partage natif ; import sur `/partage`
- [x] Dons (PayPal, Revolut) dans les réglages
- [x] Guide : 10 pages en langage clair (72 h, risques, coupure d'électricité, LU-Alert, sirènes, s'informer, nucléaire, kit et plan, entraide, contacts)
- [x] Audit automatisé axe-core sur tous les écrans dans les deux thèmes ; corrections : focus masqué par la barre du bas (`scroll-padding`), cases à cocher à mise à jour immédiate, bandeau hors-ligne qui s'efface
- [ ] Audit RAWeb manuel complet (lecteurs d'écran NVDA, VoiceOver, TalkBack ; zoom 200 % ; contraste forcé)

Décision prise pendant la phase : le niveau de kit par défaut est **l'essentiel officiel** (34 articles). Le niveau « conseillé » affichait plus de 60 articles dès le départ, ce qui allait à l'encontre du principe « une seule prochaine action, sans anxiété ». La personne élargit le niveau dans les réglages.

### Phase 2 : Notifications et plan (≈ 2 semaines)

- [x] Service worker personnalisé (Workbox `injectManifest`) : **Periodic Background Sync** sur Chrome et Edge installés, une seule notification regroupée par jour, jamais entre 21 h et 8 h, rappel hebdomadaire de ce qui est en retard ; réglage « Me prévenir sur cet appareil » qui dit honnêtement ce qui marchera (arrière-plan, à l'ouverture seulement, iPhone : agenda), notification d'essai
- [x] Adaptateur **Web Push** prêt mais désactivé (`VITE_KITZY_PUSH_URL` et `VITE_KITZY_VAPID_KEY` au build) : n'envoie que des dates et des identifiants opaques salés par appareil ; le service worker affiche le détail localement
- [x] **Plan personnel d'urgence** : assistant en 5 étapes fidèle au formulaire officiel, pré-rempli depuis le foyer, enregistrement automatique, consentement explicite pour la santé et le matricule (retrait = effacement), version imprimable (cases vides à compléter au stylo ; « Enregistrer en PDF » du navigateur), revue annuelle dans les rappels et l'agenda
- [x] **Scan de codes-barres** : `BarcodeDetector` natif, sinon ZXing en WebAssembly servi par Kitzy et précaché (hors-ligne, aucun CDN) ; saisie manuelle toujours possible ; un code inconnu est associé une fois à un article, puis reconnu
- [x] **Gestes** (§ 2.14) : 16 gestes à cocher, avec lien vers le guide, l'écran du plan ou le site officiel
- [x] Sauvegarde v2 (plan, gestes, codes-barres) ; les sauvegardes v1 restent lisibles
- [x] « Mon plan » rejoint la barre de navigation
- [x] Tests : 10 tests unitaires de plus ; e2e du plan, des gestes, du scan, des notifications (dont un vrai déclenchement de la vérification en arrière-plan via DevTools) et axe-core sur les 11 nouveaux écrans dans les deux thèmes

Pas fait dans cette phase : l'import de contacts (Contact Picker API) et le service Web Push lui-même sur le VPS. La luciole « Mon plan » reste calculée sur les articles (documents, informations) : la lier au plan rempli est une décision produit à prendre.

### Phase 3 : Affiliation (≈ 1 à 2 semaines)

- [x] Conseils d'achat dans `core` (`data/products.ts`) : 38 conseils sur 30 articles, en paliers €, €€, €€€ décrits par leurs caractéristiques (pas de marque imposée, aucun prix), avec les normes pour la sécurité (EN 14604, EN 50291, EN 1869, EN 3, DIN 13157, EN 149)
- [x] Liens vers une recherche chez Amazon.fr, Amazon.de et Decathlon.fr ; une page produit précise peut remplacer la recherche (`url`) une fois choisie et vérifiée
- [x] Affiliation Amazon activée seulement si `KITZY_AMAZON_TAG_FR` / `KITZY_AMAZON_TAG_DE` sont fournis au build ; sinon liens directs, sans mention trompeuse
- [x] Bloc « Où l'acheter » accessible sur la page article : palier dit en toutes lettres (le symbole € est décoratif), lien explicite (« Chercher « … » sur Amazon.fr (nouvelle fenêtre) »), `rel="sponsored"` sur les liens affiliés, mention d'affiliation et texte obligatoire du programme Partenaires Amazon, avertissement hors-ligne
- [x] Pages « Liens d'achat et transparence » et « Confidentialité » (demandées par les réseaux d'affiliation), liées depuis les réglages
- [x] Workflow `link-check` (chaque lundi et à la demande) : robots.txt respecté, User-Agent honnête, une requête à la fois par site, deux passages avant de conclure ; PR du bot avec `link-status.json`, issue récapitulative unique ; l'app masque les offres cassées ou indisponibles
- [x] Hiérarchie visuelle (retour utilisateur) : titres de section ambrés (jeton `heading`, contraste testé dans les deux thèmes), sections du guide détachées en cartes, termes clés en gras, jours du scénario repérés, « Les prochains jours » en carte, gestes regroupés par thème, noms d'articles mis en avant dans les courses
- [ ] Inscription : Awin (éditeur), Rakuten Advertising (Decathlon FR), compte Amazon.de en plus d'Amazon.fr, OneLink (à faire de ton côté)
- [ ] Remplacer progressivement les recherches par des pages produits choisies (et suivies par la surveillance des liens)

Limites connues : Amazon interdit aux robots ses pages de recherche (robots.txt) ; ces liens ne sont donc pas visités automatiquement et restent à revoir à la main chaque trimestre, comme prévu au § 9.1. L'API officielle d'Amazon ne sera accessible qu'après les premières ventes qualifiées.

### Retouches après la phase 3 ✅

- [x] Histoire des lucioles à l'accueil quand le foyer n'est pas encore présenté (§ 11.2)
- [x] Version bureau à partir de 960 px : navigation latérale, accueil en deux colonnes, grilles (§ 3.10)
- [x] Synchronisation cloud cadrée (§ 7.1), à réaliser dans une phase dédiée
- [x] Page Confidentialité : chaque bloc dit où vont les données, lien vers le projet
- [x] Bloc « Installer Kitzy » dans les réglages (bouton quand le navigateur le permet, « déjà installée sur cet appareil » détecté via `getInstalledRelatedApps`, consignes iPhone et autres navigateurs) ; `id` explicite et `related_applications` dans le manifeste
- [x] Correctifs après test sur Android : barre du bas toujours au premier plan ; base locale libérée quand Android met un onglet en pause (`freeze`) ; chargement bloqué expliqué avec un bouton « Recharger Kitzy » et le détail technique, au lieu d'un « Chargement » sans fin
- [x] Cartes de la liste de courses repensées : nom et quantité en tête (lisibles en magasin), remarque éventuelle, puis « Où le ranger » avec une destination par kit (« Maison », « Sac 1 · 1,5 L »…) menant chacune à la page de l'article dans ce kit ; une fois coché, « Acheté ! Range-le pour suivre ses dates »
- [x] Accueil : tableau de bord « Où j'en suis » (courses, plan, gestes) (§ 3.2)
- [x] Menu plein écran à la place de l'onglet Guide : ambiance, succès, guide, gestes, réglages (§ 3.2 bis)
- [x] Succès à débloquer (§ 4)
- [x] Réglages regroupés et titrés, avec un sommaire (§ 3.8)
- [x] Cartes des gestes : case, titre et origine du conseil en tête, explication, puis « Pour passer à l'action » avec des pastilles à icône (guide, écran de l'app, site externe affiché par son domaine)

### Phase 4 : Le côté fun ✅

Tout est réuni dans **Activités** (menu), en trois groupes : les rituels, en famille, s'entraîner. Chaque activité garde la date de la dernière fois et débloque un succès (6 de plus, 18 au total).

- [x] **Paliers de progression** sur la page des succès : Débutant → En route (1 luciole) → Prêt pour un week-end (4) → Prêt pour 72 h (6) → Voisin ressource (6 lucioles, quartier noté dans le plan et tous les gestes « avec mes proches »)
- [x] **Soirée conserves** : 8 recettes écrites pour Kitzy (peu d'eau, peu de vaisselle, avec ou sans réchaud), reliées au catalogue. Les aliments qui approchent de leur date (30 jours) sont listés avec les recettes qui les utilisent ; « On l'a cuisinée ! » renvoie vers les articles utilisés pour noter la consommation
- [x] **Rendez-vous du premier lundi** : 3 questions pendant le test des sirènes ; « oui » aux batteries note la recharge de tous les appareils suivis
- [x] **Grand check-up de saison** : dates des six prochains mois, batteries, tour du kit (foyer, vêtements de saison, détecteur de fumée, documents, médicaments, plan)
- [x] L'accueil propose **un moment pour le terrier** : le check-up pendant 3 semaines après un changement d'heure, sinon le mini-check pendant la semaine du premier lundi, sinon une soirée conserves si des aliments approchent de leur date. Les rappels de la frise y mènent aussi
- [x] **Défi « soirée sans électricité »** : 7 missions, consignes de sécurité (frigo et chauffage restent branchés), puis « Qu'est-ce qui nous a manqué ? » : une ligne = un article ajouté à la liste de courses
- [x] **Simulation 72 h** : le scénario officiel en 6 étapes (jour 1 au travail, le retour, le soir ; jour 2 l'eau, la rumeur ; jour 3 l'entraide). À chaque étape un choix expliqué, puis « Et chez toi ? » relié aux lucioles, aux articles, au plan et aux gestes. Bilan : bons réflexes, ce qui aurait manqué (objets ajoutables d'un geste à la liste de courses)
- [x] **Quiz des bons réflexes** : 10 questions (sirènes, vigilance, radio, monoxyde de carbone, rumeurs, iode, hameçonnage), sans chronomètre, chaque réponse expliquée avec un lien vers la page du guide
- [x] Accessibilité : une question = un groupe de boutons radio, le focus va sur la question puis sur le retour ; la bonne réponse est dite en texte, pas seulement en couleur

Reste pour plus tard : recettes et défi saisonniers, « 1 an de rotation », fiche voisinage imprimable (§ 4).

### Retouches : page de présentation ✅

- [x] **kitzy.lu** : une page de présentation (ce qu'est Kitzy, ce qu'elle fait, la confidentialité, comment l'installer sur Android, iPhone et ordinateur, l'appareil de la personne en premier), dans les cinq langues, avec la même langue et le même thème que l'app
- [x] L'app déménage dans **`/app/`** : `start_url` et `scope` y pointent, l'identité de l'app installée (`id: /`) ne change pas. Une app installée ouverte à la racine, ou une ancienne adresse (lien de partage…), mène à la même page dans `/app/`
- [x] L'ancien service worker de la racine est remplacé par un `sw.js` qui efface ses caches, se désinscrit et recharge la page ; les données (même site) ne bougent pas
- [x] Tests sur un serveur qui imite GitHub Pages (`scripts/serve-dist.mjs` : 404.html, statut 404)

### Phase 5 : International et stores

- [x] **Traductions EN, LB, DE, PT** de toute l'app : interface, catalogue, guide, gestes, recettes, quiz, simulation, conseils d'achat, notifications, fichier agenda. Le français reste la source ; un texte manquant retombe sur le français, et un test vérifie pour chaque langue que toutes les clés, tous les `{{…}}` et tous les contenus sont là
- [ ] Relecture native des quatre langues (traductions faites par l'IA ; le luxembourgeois en priorité)
- [ ] App **Expo** (`apps/mobile`) branchée sur `core` : SQLite, notifications locales, scan
- [ ] Pot à pourboires en achat intégré (ou lien masqué)
- [ ] EAS Build et Submit (Google Play, App Store)
- [ ] Audit RAAM
- [ ] Profils pays supplémentaires (FR, BE, DE, NL)

---

### Phase 6 : Synchronisation entre appareils (§ 7.1)

- [ ] `updatedAt` et pierres tombales sur tous les enregistrements, moteur de fusion testé dans `core`
- [ ] Chiffrement de bout en bout (phrase secrète, AES-GCM)
- [ ] Adaptateurs Dropbox et dossier synchronisé, puis Google Drive, OneDrive, iCloud (Expo)
- [ ] Réglages « Synchroniser mes appareils », page de confidentialité mise à jour

## 15. Questions ouvertes

### Réglées

Hébergement (GitHub Pages) · Serveur (aucun, VPS plus tard) · Langues (FR, EN, LB, DE, PT) · Nom (**Kitzy**) · Mascotte (hérisson) · Stack (React + Expo, cœur partagé) · Périmètre (LU d'abord, compatible Europe) · Partage (QR et URL) · Contenu officiel (reformulé) · Plan d'urgence (champs officiels) · Prix (€ / €€ / €€€) · Dons (oui)

### Encore ouvertes

1. **Domaine** : ~~réserver **kitzy.lu**~~ fait ; éventuellement kitzy.eu en redirection.
2. **Marque** : vérifier « Kitzy » sur EUIPO (classe 9, logiciels) et sur les stores.
3. **Poses du hérisson** : à générer d'après [`docs/mascotte-poses.md`](docs/mascotte-poses.md), puis à détourer.

---

### Sources et références

- Lëtz prepare! — Guide et checklist 72 h : <https://letzprepare.public.lu/fr/guide.html>
- Guide PDF : « Mon guide 72h d'autonomie », Lëtz prepare!, HCPN, campagne 2026 (version accessible FR)
- Formulaire PDF : « Mon plan personnel d'urgence », HCPN, campagne 2026 (version accessible FR, formulaire remplissable de 6 pages)
- Affiliation : [Programme Decathlon France](https://www.decathlon.fr/affiliation_lp-PBUQMW) · [Darty sur Awin](https://ui.awin.com/merchant-profile/7735) · [ManoMano](https://www.manomano.co.uk/lp/affiliation-program-6078) · [Bergfreunde sur Awin](https://affi.io/m/bergfreunde) · [Fnac](https://affi.io/m/fnac) · [Conrad BE](https://www.affilitizer.com/programs/conrad.be)
- LU-Alert : <https://lu-alert.lu> · Infocrise : <https://infocrise.lu> · Zones inondables : <https://eau.geoportail.lu> · <https://inondations.lu>
- Secours et gardes : <https://112.lu> · CIS de proximité : <https://112.public.lu/fr/organisation/secours.html> · Premiers secours : <https://cours.cgdis.lu> · <https://croix-rouge.lu> · Météo : <https://meteolux.lu> · <https://seveso.lu>
- Cybersécurité : <https://cybersecurity.lu> · <https://cyberfraud.lu> · BEE SECURE <https://bee-secure.lu> (helpline 8002 1234)
- RAWeb 1.1 : <https://accessibilite.public.lu/fr/raweb1.1/> · RAAM 1.1 : <https://accessibilite.public.lu/fr/raam1.1/>
- Skillset accessibilité : <https://github.com/geoffreycrofte/luxembourg-accessibility-skillset>
- Listes de référence consultées pour les compléments [REC] : Croix-Rouge, Ready.gov (FEMA), BBK « Ratgeber für Notfallvorsorge », OFAE « Notvorrat » (Suisse), MSB « Om krisen eller kriget kommer » (Suède), Commission européenne « Preparedness Union Strategy » (2025)
