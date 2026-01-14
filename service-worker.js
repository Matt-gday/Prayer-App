// Service Worker for Prayer Companion PWA
// Update CACHE_NAME when you make changes to the app to force cache refresh
// Increment the version number (v1, v2, v3, etc.) each time you deploy updates
const CACHE_NAME = 'prayer-companion-v3';
const URLS_TO_CACHE = [
  './',
  './index.html'
];

// Install event - cache the app files
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Caching app files');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  // Do NOT call skipWaiting() here - wait for user to explicitly update via message
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      // Take control of all pages
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});

// Message event - handle update commands from the page
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Received SKIP_WAITING message');
    self.skipWaiting();
  }
});
