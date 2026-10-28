# Maintaining Kitzy

Notes for the people who run the repository. Nothing here is secret: the build variables below end up in the public site (an Amazon tag is visible in every shopping link, a VAPID public key is public by design). Private keys and tokens never belong in this repository or in its variables; if one is ever needed, store it as an encrypted **secret** in the repository settings.

## Deployment

Every push to `main` deploys to GitHub Pages (`deploy.yml` workflow). The published site holds the landing page at the root (`apps/web/landing`) and the app in `app/`; the installed app starts directly in `app/`.

One-time setup in the repository settings:

1. **Settings › Pages › Source: GitHub Actions**.
2. **Custom domain**: set the repository variables for the domain and the base path, then configure DNS. Do this **before** the public launch: user data is tied to the site's address, so changing it later means people lose what they saved.
3. **Link monitoring** (`link-check.yml`, every Monday): tick **Settings › Actions › General › Allow GitHub Actions to create and approve pull requests** so the bot can propose status updates.

## Optional build variables

All are repository **variables** (not secrets), read by `deploy.yml`. When one is missing, the matching feature stays off.

| Variable | Purpose |
| --- | --- |
| `KITZY_DOMAIN`, `KITZY_BASE` | Custom domain and base path (`/` on a custom domain) |
| `KITZY_AMAZON_TAG_FR`, `KITZY_AMAZON_TAG_DE` | Amazon Associates IDs. Without them, shopping links are direct and earn nothing |
| `KITZY_PUSH_URL`, `KITZY_VAPID_KEY` | Web Push service URL and its **public** VAPID key. Without them, Kitzy sends nothing to any server |
