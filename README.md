![Kitzy · Three days ahead of the unexpected, your 72-hour emergency supply, sized for your household. Free, no accounts, works offline](https://github.com/geoffreycrofte/kitzy-survival-kit/blob/main/apps/web/landing/public/og/kitzy-og-en.png?raw=true)

# Kitzy

Kitzy helps households build, track and rotate a 72-hour emergency supply, based on Luxembourg's national resilience strategy “Lëtz prepare!”. If the power, water or network goes down, or you have to leave home in a hurry, Kitzy makes sure you already have what you need. It is a progressive web app (PWA) that works fully offline, with iOS and Android apps to follow.

Free, no account, no ads, no tracking: everything stays on your device.

## What it does

- **Sized for your household**: water, food, medicine and gear calculated for the adults, children, infants, dogs and cats you live with.
- **Home supply and grab bags**: one checklist per kit, with what to buy, what you already have and what is missing.
- **Expiry dates and reminders**: Kitzy tracks use-by dates and battery recharges, and reminds you through notifications or your calendar (.ics).
- **Shopping list**: built from what is missing, shareable by link, with transparent buying advice.
- **Pantry and recipes**: turn your supplies into meals and use them before they expire.
- **Personal emergency plan**: contacts, meeting points, health information, printable; encrypted on the device and opened with a code, fingerprint or face.
- **Essential actions and guides**: the steps to take before and during a crisis (LU-Alert, sirens, power cuts…), in plain language.
- **Activities**: monthly mini-check, yearly check-up, quiz and a 72-hour simulation to keep the kit alive.
- **Protected backups**: one tap to make a backup protected by a code, then send it or download it.
- **Five languages**: French, English, German, Luxembourgish and Portuguese.

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

Every push to `main` builds the site and deploys it to GitHub Pages. The one-time repository setup (Pages, domain, optional build variables) is described in [`docs/maintaining.md`](docs/maintaining.md). Without any of it, the app builds and works: optional features simply stay off.

## License

Kitzy is by Geoffrey Crofte, under [CC BY-NC-SA 4.0](LICENSE): you may share and adapt it with credit, not for commercial use, and under the same license. Third-party dependencies and the official “Lëtz prepare!” guide covers keep their own rights.
