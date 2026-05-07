// Change this version number (e.g., v2, v3) to force an update on all devices
const CACHE_NAME = 'voucher-app-v2'; 
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Install and cache files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
    // Force the new version to take over immediately
    self.skipWaiting(); 
});

// Clean up old caches when the version number changes
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Tell the active service worker to take control of the page immediately
    self.clients.claim(); 
});

// Serve cached files when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
