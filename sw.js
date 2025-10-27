const CACHE_NAME = 'app-cache-v1';
const STATIC_EXT = ['.css', '.js', '.png', '.jpg', '.webp', '.svg', '.ico', '.html'];

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = req.url;

  // Do not cache Google Apps Script or dynamic user area
  if (url.includes('script.google.com') || url.includes('/User/')) {
    return; // let network handle it
  }

  // Only cache GET static assets
  if (req.method === 'GET' && STATIC_EXT.some(ext => url.endsWith(ext))) {
    event.respondWith(
      caches.match(req).then(cacheRes => {
        if (cacheRes) return cacheRes;
        return fetch(req).then(networkRes => {
          if (!networkRes || networkRes.status !== 200) return networkRes;
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          return networkRes;
        });
      })
    );
  }
});
