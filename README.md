# Kitzy

Kitzy aide à constituer, suivre et faire tourner sa réserve d’urgence de 72 heures, sur la base de la stratégie nationale de résilience luxembourgeoise « Lëtz prepare! ». Application web progressive (PWA) qui fonctionne entièrement hors-ligne, puis app iOS et Android.

- Plan complet du projet : [`PLAN.md`](PLAN.md)
- Poses de la mascotte : [`docs/mascotte-poses.md`](docs/mascotte-poses.md)
- Référentiel d’accessibilité : RAWeb 1.1 niveau AA (skills dans [`.claude/skills/`](.claude/skills/))

## Structure

```
packages/core   Logique partagée (jetons de couleur, calculs du foyer, lucioles, textes)
apps/web        PWA React + Vite, publiée sur GitHub Pages
assets/mascot   Le hérisson Kitzy, détouré (PNG et WebP)
```

L’app Expo (iOS et Android) viendra dans `apps/mobile` et réutilisera `packages/core`.

## Démarrer

Prérequis : Node 22 et pnpm 10 (`corepack enable`).

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

## Vérifier

```bash
pnpm lint         # ESLint, avec les règles d’accessibilité jsx-a11y
pnpm typecheck
pnpm test         # tests unitaires du cœur (dont les contrastes des deux thèmes)
pnpm e2e          # Playwright : parcours, axe-core, mouvement réduit, hors-ligne
```

Pour les tests de bout en bout avec un Chromium déjà installé : `PLAYWRIGHT_CHROMIUM_PATH=/chemin/vers/chrome pnpm e2e`.

## Publier

Chaque push sur `main` déploie sur GitHub Pages (workflow `deploy.yml`). À faire une fois dans les réglages du dépôt :

1. **Settings › Pages › Source : GitHub Actions**.
2. Pour le domaine `kitzy.lu` : variables de dépôt `KITZY_DOMAIN=kitzy.lu` et `KITZY_BASE=/`, puis configurer le DNS. À faire **avant** le lancement public : les données des utilisateurs sont liées à l’adresse du site.
