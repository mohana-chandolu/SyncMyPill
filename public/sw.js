/* global self, registration */
/* public/sw.js */

// Make the new SW control pages immediately
self.addEventListener('install', (event) => {
  // console.log('SW install');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // console.log('SW activate');
  event.waitUntil(self.clients.claim());
});

// Handle push from your server
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data?.json() || {};
  } catch {
    data = { title: 'SheSync', body: 'Reminder' };
  }

  const title = data.title || 'SheSync';
  const options = {
    body: data.body || 'Time to take your pill 💊',
    icon: '/logo-transparent.png',
    badge: '/logo-transparent.png', // OK for now (ideally a monochrome badge)
    data: data.data || {},          // e.g. { url: '/authed/cycle' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Focus an existing tab or open a new one when the user clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification?.data?.url || '/authed/cycle';

  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });

    // Prefer an already-open authed tab
    for (const client of allClients) {
      if ('focus' in client && client.url.includes('/authed')) {
        return client.focus();
      }
    }

    // Or open the target URL
    if (self.clients.openWindow) {
      return self.clients.openWindow(targetUrl);
    }
  })());
});
