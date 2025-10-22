const CACHE_NAME = 'reportes-v10';
const FILES_TO_CACHE = [
  '/testing/',
  '/testing/index.html',
  '/testing/manifest.json',
  '/testing/icon-192.png',
  '/testing/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
      .catch(err => console.error('Error caching files during install:', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(resp =>
        resp || caches.match('/testing/index.html')
      )
    )
  );
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

