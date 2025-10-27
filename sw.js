const CACHE_NAME = 'app-cache-v1';

self.addEventListener('install', event => {
  // Skip waiting so new SW activates immediately
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Claim clients so it works without reload
  clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      // If in cache → serve it
      if (cacheRes) return cacheRes;

      // Else fetch from network and cache it
      return fetch(event.request).then(networkRes => {
        // Avoid caching non-GET or failed responses
        if (!networkRes || event.request.method !== 'GET' || networkRes.status !== 200) {
          return networkRes;
        }

        // Save copy to cache
        let responseClone = networkRes.clone();
        caches.open(CCACHE_NAME).then(cache => cache.put(event.request, responseClone));

        return networkRes;
      }).catch(() => {
        // Optional: handle offline fallback here
        // return caches.match('/offline.html');
      });
    })
  );
});
