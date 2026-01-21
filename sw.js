const CACHE_NAME = 'app-cache-v3';

const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo-192.png',    // main icon
  '/logo-512.png',    // high-res icon
  '/fcic-logo.png'    // any other assets
];

// ----------------- INSTALL -----------------
self.addEventListener('install', e => {
  console.log('[ServiceWorker] Install event started');
  self.skipWaiting(); // activate new SW immediately

  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching assets');
        return cache.addAll(ASSETS);
      })
      .catch(err => console.error('[ServiceWorker] Cache add failed:', err))
  );
});

// ----------------- ACTIVATE -----------------
self.addEventListener('activate', e => {
  console.log('[ServiceWorker] Activate event');

  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ----------------- FETCH -----------------
self.addEventListener('fetch', e => {
  // Network-first for logos so they always update
  if (e.request.url.endsWith('logo-192.png') || e.request.url.endsWith('logo-512.png')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // Cache-first for other assets
    e.respondWith(
      caches.match(e.request)
        .then(response => response || fetch(e.request))
        .catch(err => console.error('[ServiceWorker] Fetch failed:', err))
    );
  }
});
