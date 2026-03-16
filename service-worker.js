const CACHE_NAME = 'field-job-sheet-v2';

const FILES_TO_CACHE = [
  '/',
  'index.html',
  'style.css',
  'app.js',
  'manifest.json',
  'jspdf.umd.min.js',
  'jspdf.plugin.autotable.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {

  if (event.request.mode === 'navigate') {
    event.respondWith(caches.match('index.html'));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});