# Kitzy, le hérisson : descriptions des poses

Descriptions à donner au modèle d'images (celui qui a produit `assets/mascot/kitzy-hedgehog.png`) pour obtenir les autres poses de la mascotte, toutes cohérentes entre elles.

## Mode d'emploi

1. **Joins toujours l'image de référence** (`assets/mascot/kitzy-hedgehog.png`, ou l'original avec son fond) en précisant qu'il s'agit du même personnage.
2. **Copie le bloc « Personnage »** au début de chaque demande, puis ajoute le bloc de la pose.
3. **Garde le même format** : portrait 2:3 (1024 × 1536), personnage entier, centré, avec de la marge autour.
4. **Fond uni gris clair**, sans décor : je détoure ensuite automatiquement, et le hérisson s'intègre aussi bien au thème sombre qu'au thème clair.
5. Si une pose ne ressemble pas assez au personnage, régénère en insistant sur la phrase « same character as the reference image ».

Les descriptions sont en anglais : les modèles d'images suivent généralement mieux les consignes dans cette langue.

## Bloc « Personnage » (à copier à chaque fois)

```text
Same character as the reference image: Kitzy, a small cute hedgehog mascot, 3D animated-film style, soft plush-like fur.
Rounded light beige face and belly, big glossy dark brown eyes with a white highlight, small dark brown nose, rosy cheeks, small round ears with pink inside.
Brown spines that look soft and rounded, never sharp.
Wears the same knitted bandana around the neck: orange and cream horizontal stripes, tied on the side.
Friendly, calm, reassuring expression. Short legs, small brown paws.
Soft warm studio lighting with a gentle golden rim light.
Full body, centered, plain flat light grey background (#D9D9D9), no scenery, no text, no logo, no extra characters.
Portrait format 2:3.
```

## Les poses

### 1. Bonjour (accueil, onboarding)
Usage : premier écran, écran de bienvenue, « Moien ! ».
```text
Pose: standing, waving hello with the right paw raised at head height, the other paw on the belly. Big warm open smile, head slightly tilted.
```

### 2. Endormi en boule (tout est à jour)
Usage : états vides (« Rien à faire aujourd'hui »), nuit, kit complet au repos.
```text
Pose: curled up in a ball, sleeping peacefully on a small pile of autumn leaves (orange, brown, ochre). Eyes closed with a gentle content smile, cheeks rosy. The striped bandana is still visible. Seen from a three-quarter front view.
```

### 3. Avec sa lanterne (coupure de courant)
Usage : guide « Coupure d'électricité », mission « Lumière », la veillée.
```text
Pose: standing, holding a small old-fashioned metal lantern with both paws in front of the chest. The lantern glows warm amber and lights the face from below with a soft cozy glow. Calm, confident little smile.
```

### 4. Compte ses provisions (inventaire)
Usage : inventaire, liste de courses, rotation des stocks.
```text
Pose: standing, holding a small clipboard with a checklist in one paw and a pencil in the other, ticking a box. Looking at the clipboard with a focused, satisfied expression, tongue slightly out. At the paws: two glass jars with golden lids, a tin can and a water bottle.
```

### 5. Fête (kit complet, palier atteint)
Usage : les six lucioles allumées, badge, fin d'onboarding.
```text
Pose: jumping slightly off the ground with both paws raised in joy, eyes squeezed shut with happiness, wide open smile. Six tiny glowing yellow fireflies float around the body.
```

### 6. Lit le guide (aide, guide officiel)
Usage : pages du guide, explications, « Pourquoi 72 heures ? ».
```text
Pose: sitting on the ground, holding an open small book with a green cover on the lap, reading attentively. Small round reading glasses on the nose. Curious, thoughtful expression, one eyebrow slightly raised.
```

### 7. Sac sur le dos (évacuation)
Usage : sac d'évacuation, « En cas d'évacuation, je pense à prendre… ».
```text
Pose: walking towards the viewer with a small dark green backpack on the back, both paws holding the shoulder straps. A water bottle sticks out of a side pocket. Determined but cheerful expression, mid-step.
```

### 8. Écoute la radio (s'informer)
Usage : LU-Alert, radios RTL et 100,7, « Comment serez-vous alerté ? ».
```text
Pose: standing, holding a small retro hand-crank radio close to the ear with both paws, the crank handle visible on the side. Listening carefully, eyes looking up and to the side, small attentive smile.
```

### 9. La bouteille d'eau (mission eau)
Usage : catégorie Eau, mission « Ajoute 4,5 L d'eau ».
```text
Pose: standing, hugging a large clear water bottle (about as tall as the hedgehog) with both arms, cheek pressed against it. Happy, proud expression.
```

### 10. Le plan d'urgence (mission plan)
Usage : plan personnel d'urgence, contacts, points de rendez-vous.
```text
Pose: standing, holding up a folded paper map with both paws, a small red heart drawn on it marking a meeting point. Pointing at the heart with one paw, encouraging smile.
```

### 11. Curieux, sort la tête (hors-ligne, erreur douce)
Usage : hors-ligne, page introuvable, lien cassé. Sans dramatiser.
```text
Pose: only the head and front paws peeking out from behind a mossy rock, looking curious and slightly puzzled, one ear tilted. Gentle, reassuring expression, not sad.
```

### 12. Portrait pour l'icône de l'app
Usage : icône d'app, avatar du foyer, favicon.
```text
Pose: close-up portrait of the head and the top of the bandana only, facing the viewer straight on, perfectly centered, big friendly smile. Square format 1:1, plain flat light grey background (#D9D9D9). Leave generous space around the head.
```
Pour l'icône, remplace « Portrait format 2:3 » par « Square format 1:1 » dans le bloc « Personnage ».

## Après la génération

Envoie-moi les images : je les détoure, les recadre et les exporte pour le web (WebP transparent) et pour React Native (PNG 1x, 2x et 3x). Elles seront rangées dans `assets/mascot/` sous la forme `kitzy-<pose>.webp`, par exemple `kitzy-lanterne.webp`.

| N° | Fichier | Pose |
|---|---|---|
| 0 | `kitzy-hedgehog` | Pose principale (déjà fournie) |
| 1 | `kitzy-bonjour` | Bonjour |
| 2 | `kitzy-endormi` | Endormi en boule |
| 3 | `kitzy-lanterne` | Avec sa lanterne |
| 4 | `kitzy-inventaire` | Compte ses provisions |
| 5 | `kitzy-fete` | Fête |
| 6 | `kitzy-lecture` | Lit le guide |
| 7 | `kitzy-sac` | Sac sur le dos |
| 8 | `kitzy-radio` | Écoute la radio |
| 9 | `kitzy-eau` | La bouteille d'eau |
| 10 | `kitzy-plan` | Le plan d'urgence |
| 11 | `kitzy-curieux` | Curieux, sort la tête |
| 12 | `kitzy-icone` | Portrait pour l'icône |

Dans l'app, ces images sont décoratives (`alt=""`) sauf quand elles portent un sens, et elles ne sont jamais le seul moyen de transmettre une information.
