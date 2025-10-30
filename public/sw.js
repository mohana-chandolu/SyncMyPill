/* global self, registration */
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data?.json() || {}; } catch { data = { title: 'SheSync', body: 'Reminder' }; }

  const title = data.title || 'SheSync';
  const options = {
    body: data.body || 'Time to take your pill 💊',
    icon: '/logo-transparent.png',
    badge: '/logo-transparent.png',
    data: data.data || {},
  };
  event.waitUntil(registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/authed/cycle';
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
    for (const client of clientList) { if (client.url.includes('/authed')) return client.focus(); }
    return clients.openWindow(url);
  }));
});
