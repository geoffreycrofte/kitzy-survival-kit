# Kitzy push service

The small server that lets Kitzy remind people when the app is closed (iPhone included).

- **Knows nothing about the kit**: it stores a push subscription address, alert dates and a time zone. On an alert date, from 9 am in the device's time zone, it sends an **empty** push; the app's service worker wakes up and writes the reminder from the data on the device.
- **No dependencies**: Node 22.18 or later only (`node:http`, `node:sqlite`, `node:crypto`). Nothing to `npm install` on the server.
- **API**: `GET /health`, `POST /subscribe` `{ subscription, schedule: [{ id, date }], timezone }`, `DELETE /subscribe` `{ endpoint }`, `POST /test` `{ endpoint }` (an immediate test push to that device only, once a minute). Writes only from the allowed origin (CORS), small validated bodies, rate limited per address, only real browser push services accepted as endpoints.
- **Housekeeping**: subscriptions refused by the push service (404, 410) are deleted at once; past dates are dropped; a subscription with nothing ahead and no update for six months is deleted.

```bash
pnpm --filter @kitzy/push test        # unit and HTTP tests
pnpm --filter @kitzy/push keys        # print a new VAPID key pair
```

Deployment on the VPS (systemd, nginx through WordOps, keys, GitHub variables): see [`docs/maintaining.md`](../../docs/maintaining.md#web-push-service).
