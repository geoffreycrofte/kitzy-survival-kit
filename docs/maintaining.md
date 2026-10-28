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
| `KITZY_PUSH_URL`, `KITZY_VAPID_KEY` | Web Push service URL and its **public** VAPID key (see [Web Push service](#web-push-service)). Without them, Kitzy sends nothing to any server |

## Web Push service

Lets Kitzy remind people when the app is closed, iPhone included (app added to the home screen, iOS 16.4 or later). The code and its design are in [`services/push`](../services/push). It only ever stores push subscription addresses, alert dates and time zones.

A push subscription is tied to the site's address (`kitzy.lu`), like the user data: moving the app to another address would silently cut every subscription.

### 1. DNS (OVH)

Add an **A** record `push.kitzy.lu` pointing to the VPS IPv4 address (and **AAAA** to its IPv6 address, if it has one). Check with `dig push.kitzy.lu +short`.

### 2. Node on the VPS

The service needs Node 22.18 or later, and nothing else.

Check first: `node -v` and `readlink -f "$(which node)"`. If Node 22.18+ is already installed system-wide (`/usr/bin/node`, as on the current VPS), skip this. Otherwise:

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
```

### 3. Code and user

The code is a read-only copy of this repository, limited to the service.

```bash
sudo useradd --system --no-create-home --shell /usr/sbin/nologin kitzy
sudo git clone --filter=blob:none --sparse https://github.com/geoffreycrofte/kitzy-survival-kit /opt/kitzy-push
sudo git -C /opt/kitzy-push sparse-checkout set services/push
```

### 4. Keys and settings

```bash
node /opt/kitzy-push/services/push/scripts/generate-keys.ts
sudo install -m 600 -o root -g root /opt/kitzy-push/services/push/deploy/env.example /etc/kitzy-push.env
sudo nano /etc/kitzy-push.env   # paste the two key lines, check VAPID_SUBJECT and ALLOWED_ORIGIN
```

The **private** key stays in `/etc/kitzy-push.env` and nowhere else: not in the repository, not in GitHub. Keep a copy in your password manager: generating new keys later unsubscribes every device. `VAPID_SUBJECT` must be a working address (`mailto:notifications@kitzy.lu`): it is how Google, Apple or Mozilla would reach you about a problem.

### 5. systemd

```bash
sudo cp /opt/kitzy-push/services/push/deploy/kitzy-push.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now kitzy-push
systemctl status kitzy-push
curl -s http://127.0.0.1:8787/health   # {"ok":true}
```

### 6. HTTPS through WordOps

Create a reverse-proxy site with a Let's Encrypt certificate (check the exact options with `wo site create --help`, they vary between versions):

```bash
sudo wo site create push.kitzy.lu --proxy=127.0.0.1:8787 --letsencrypt
```

Then check the generated vhost (`/etc/nginx/sites-available/push.kitzy.lu`):

- **Visitor address**: the per-address rate limit needs `proxy_set_header X-Real-IP $remote_addr;`. WordOps 3.22 already has it through `include proxy_params;` in `location /` (check with `grep -rn X-Real-IP /etc/nginx/`).
- **No IP addresses kept**, as the privacy policy promises: replace the `access_log …;` line with `access_log off;`, and add `crit` at the end of the `error_log …;` line so only serious errors are logged. Then delete the log written so far: `sudo rm -f /var/log/nginx/push.kitzy.lu.access.log*`.

Apply with `sudo nginx -t && sudo systemctl reload nginx`.

Check from your own computer: `curl -s https://push.kitzy.lu/health`.

Firewall: only SSH, 80 and 443 open; port 8787 stays internal (`sudo ufw status`).

### 7. GitHub variables

**Settings › Secrets and variables › Actions › Variables**:

- `KITZY_PUSH_URL` = `https://push.kitzy.lu`
- `KITZY_VAPID_KEY` = the **public** key

Then redeploy (any push to `main`, or re-run the last `deploy.yml` run). The settings page now offers reminders when the app is closed, and the privacy page describes the service.

### 8. Test on real devices

1. Android (Chrome), an iPhone with Kitzy added to the home screen, and Firefox on a computer: Settings › Notifications › turn on.
2. On the VPS, send a test push to the device that subscribed last:
   ```bash
   sudo /opt/kitzy-push/services/push/deploy/send-test.sh
   ```
   The phone shows a Kitzy notification within seconds (“You have reminders for your kit”, or the actual reminders of the day).
3. Turn notifications off on the device: the subscription disappears from the database.

### Day to day

- Logs (counts only, never an address): `journalctl -u kitzy-push -f`.
- Update: `sudo git -C /opt/kitzy-push pull && sudo systemctl restart kitzy-push`.
- Backup: `/var/lib/kitzy-push/push.sqlite`. Losing it is not serious: each device sends its dates again the next time the app opens.
- Monitoring: an uptime check on `https://push.kitzy.lu/health` (UptimeRobot or similar) is enough.
