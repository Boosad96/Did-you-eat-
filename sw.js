
const CACHE_NAME = 'did-you-eat-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Handle notification click: Open the app or perform action
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Determine where to send the user based on the button clicked
  let targetUrl = './index.html';
  if (event.action === 'yes') {
    targetUrl += '?action=checkin';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if the app is already open
      for (const client of clientList) {
        if (client.url.includes('index.html')) {
          // If already open and 'yes' was clicked, navigate to trigger the check-in logic
          if (event.action === 'yes') {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // If not open, launch a new window with the target URL
      return clients.openWindow(targetUrl);
    })
  );
});
