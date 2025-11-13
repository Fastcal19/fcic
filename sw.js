const CACHE_NAME = 'app-cache-v2';
const ASSETS = [
  '/',              // root
  '/index.html',
  '/manifest.json',
  '/fcic.png',      // optional: your main icon
  '/fcic logo.png', // optional: add more static files
  '/Updating.html'
];

self.addEventListener('install', e => {
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

self.addEventListener('activate', e => {
  console.log('[ServiceWorker] Activate event');
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
});

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
