const CACHE_NAME = 'app-cache-v11';

const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo-192.png',
  '/logo-512.png',
  '/fcic logo.png',
];


// INSTALL
self.addEventListener('install', e => {
  self.skipWaiting(); // ✅ fixed typo (was 'seld')
  console.log('[ServiceWorker] Install event started');
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching assets');
        return cache.addAll(ASSETS);
      })
      .catch(err => console.error('[ServiceWorker] Cache add failed:', err))
  );
});

// ACTIVATE
self.addEventListener('activate', e => {
  console.log('[ServiceWorker] Activate event');
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => {
      console.log('[ServiceWorker] Old caches cleared');
      return self.clients.claim(); // ✅ moved inside .then
    })
  );
});

// FETCH
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(response => {
        // Serve from cache, or fetch if not cached
        return response || fetch(e.request);
      })
      .catch(err => {
        console.error('[ServiceWorker] Fetch failed:', err);
      })
  );
});
