![Kitzy · Three days ahead of the unexpected, your 72-hour emergency supply, sized for your household. Free, no accounts, works offline](https://github.com/geoffreycrofte/kitzy-survival-kit/blob/main/apps/web/landing/public/og/kitzy-og-en.png?raw=true)

# Kitzy

Kitzy helps households build, track and rotate a 72-hour emergency supply, based on Luxembourg's national resilience strategy “Lëtz prepare!”. It is a progressive web app (PWA) that works fully offline, with iOS and Android apps to follow.

- Full project plan: [`PLAN.md`](PLAN.md)
- Accessibility: RAWeb 1.1 level AA, with [CheckFox.eu](https://checkfox.eu); statement and problem reporting in [`ACCESSIBILITY.md`](ACCESSIBILITY.md) (skills in [`.claude/skills/`](.claude/skills/))

## Structure

```
packages/core   Shared logic (colour tokens, household calculations, fireflies, texts)
apps/web        React + Vite PWA, published on GitHub Pages
assets/mascot   Kitzy the hedgehog, cut out (PNG and WebP)
```

The Expo app (iOS and Android) will live in `apps/mobile` and reuse `packages/core`.

## Getting started

Requirements: Node 22 and pnpm 10 (`corepack enable`).

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

## Checks

```bash
pnpm lint         # ESLint, with the jsx-a11y accessibility rules
pnpm typecheck
pnpm test         # core unit tests (including contrast checks for both themes)
pnpm e2e          # Playwright: user journeys, axe-core, reduced motion, offline
```

To run the end-to-end tests with an already installed Chromium: `PLAYWRIGHT_CHROMIUM_PATH=/path/to/chrome pnpm e2e`.

## Publishing

Every push to `main` deploys to GitHub Pages (`deploy.yml` workflow). One-time setup in the repository settings:

1. **Settings › Pages › Source: GitHub Actions**.
2. For the `kitzy.lu` domain: repository variables `KITZY_DOMAIN=kitzy.lu` and `KITZY_BASE=/`, then configure DNS. Do this **before** the public launch: user data is tied to the site's address.
   The published site holds the landing page at the root (`apps/web/landing`) and the app in `app/`. The installed app starts directly in `app/`.
3. Amazon affiliation: variables `KITZY_AMAZON_TAG_FR` and `KITZY_AMAZON_TAG_DE` (Associates IDs, for example `kitzy-21`). Without them, shopping links are direct and earn nothing.
4. Link monitoring (`link-check.yml`, every Monday): tick **Settings › Actions › General › Allow GitHub Actions to create and approve pull requests** so the bot can propose status updates.
5. Later, for Web Push notifications through the VPS: variables `KITZY_PUSH_URL` (service URL) and `KITZY_VAPID_KEY` (public VAPID key). Without them, Kitzy sends nothing to any server.
