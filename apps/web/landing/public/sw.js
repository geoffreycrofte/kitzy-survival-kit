/*
 * Ancien service worker de Kitzy, quand l'app vivait à la racine du site.
 * Il se remplace par celui-ci, efface ses anciens caches, se désinscrit et recharge
 * les pages ouvertes : l'app tourne ensuite depuis app/, avec son propre service worker.
 * Les données (IndexedDB) ne sont pas touchées : elles restent sur le même site.
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const scope = self.registration.scope;
      const keys = await caches.keys();
      // Seuls les caches de l'ancienne version (portée racine) partent ; ceux d'app/ restent.
      await Promise.all(keys.filter((key) => key.endsWith(scope)).map((key) => caches.delete(key)));
      await self.registration.unregister();
      const windows = await self.clients.matchAll({ type: 'window' });
      for (const client of windows) client.navigate(client.url);
    })(),
  );
});
