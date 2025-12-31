/**
 * AK Golf Academy - Service Worker
 * Handles push notifications, caching, and offline support
 *
 * IMPORTANT: This SW prioritizes fresh content over caching.
 * Each deploy clears old caches to prevent stale UI.
 */

// Cache version - increment manually or use build system to inject BUILD_SHA
const CACHE_VERSION = 'v2';
const CACHE_NAME = `ak-golf-cache-${CACHE_VERSION}`;
const API_CACHE = `ak-golf-api-cache-${CACHE_VERSION}`;

// Minimal cache - only essential offline assets
const STATIC_CACHE_URLS = [
  '/logo192.png',
  '/logo512.png',
];

// =============================================================================
// INSTALL EVENT - Clear old caches and cache minimal assets
// =============================================================================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...', CACHE_VERSION);

  event.waitUntil(
    // First, delete ALL existing caches to ensure fresh content
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          console.log('[SW] Clearing old cache:', name);
          return caches.delete(name);
        })
      );
    }).then(() => {
      // Then cache only essential assets
      return caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching minimal assets');
        return cache.addAll(STATIC_CACHE_URLS);
      });
    })
  );

  // Activate immediately - don't wait for old SW to finish
  self.skipWaiting();
});

// =============================================================================
// ACTIVATE EVENT - Clean up old caches
// =============================================================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Claim all clients immediately
  self.clients.claim();
});

// =============================================================================
// FETCH EVENT - Network first, cache fallback
// =============================================================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API requests: network first, no cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // For GET API requests, we could cache if needed
          return new Response(
            JSON.stringify({ error: 'Offline', message: 'Ingen internettforbindelse' }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // HTML/Navigation: ALWAYS network first (critical for deploy updates)
  if (request.mode === 'navigate' || request.destination === 'document' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Static assets (JS, CSS, images): network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses for offline fallback
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// =============================================================================
// PUSH EVENT - Handle incoming push notifications
// =============================================================================

self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  let data = {
    title: 'AK Golf Academy',
    body: 'Du har en ny varsling',
    icon: '/logo192.png',
    badge: '/badge-icon.png',
    tag: 'default',
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/logo192.png',
    badge: data.badge || '/badge-icon.png',
    tag: data.tag || 'default',
    vibrate: data.vibrate || [200, 100, 200],
    requireInteraction: data.requireInteraction || false,
    data: {
      url: data.url || '/',
      ...data.data,
    },
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// =============================================================================
// NOTIFICATION CLICK EVENT - Handle notification clicks
// =============================================================================

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  // Handle action buttons
  if (event.action) {
    console.log('[SW] Action clicked:', event.action);
    // Handle specific actions here
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      // Open new window
      return clients.openWindow(urlToOpen);
    })
  );
});

// =============================================================================
// MESSAGE EVENT - Handle messages from main thread
// =============================================================================

self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'CLEAR_CACHE':
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      });
      break;

    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;

    default:
      console.log('[SW] Unknown message type:', type);
  }
});

console.log('[SW] Service worker loaded');
