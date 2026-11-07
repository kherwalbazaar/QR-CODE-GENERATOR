/* UPI PYMT service worker — versioned offline cache */
const CACHE_VERSION = 'v3';
const SHELL_CACHE = `upi-pymt-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `upi-pymt-runtime-${CACHE_VERSION}`;

const SHELL_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png',
  '/og-image.png',
];

const STATIC_PATH = /^\/(?:_next\/static\/|.*\.(?:css|js|png|jpg|jpeg|svg|webp|avif|ico|woff2?)$)/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await Promise.all(
        SHELL_ASSETS.map(async (url) => {
          try {
            const response = await fetch(url, { cache: 'reload' });
            if (response.ok) await cache.put(url, response);
          } catch {
            // A missing optional asset must not block installation.
          }
        })
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== SHELL_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

function isCacheable(response) {
  return response && response.status === 200 && response.type !== 'opaque';
}

async function cacheResponse(cacheName, request, response) {
  if (!isCacheable(response)) return;
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cacheResponse(RUNTIME_CACHE, request, response);
      await cacheResponse(SHELL_CACHE, '/', response.clone());
      return response;
    }

    // Some offline/proxy failures resolve with a 5xx instead of rejecting.
    const fallback = (await caches.match(request)) || (await caches.match('/'));
    return fallback || response;
  } catch {
    return (
      (await caches.match(request)) ||
      (await caches.match('/')) ||
      new Response('<h1>You are offline</h1>', {
        status: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    );
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    await cacheResponse(RUNTIME_CACHE, request, response);
    return response;
  } catch {
    return new Response('', { status: 504, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const network = fetch(request)
    .then(async (response) => {
      await cacheResponse(RUNTIME_CACHE, request, response);
      return response;
    })
    .catch(() => null);

  return cached || (await network) || new Response('', { status: 504, statusText: 'Offline' });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || request.url.startsWith('chrome-extension://')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname === '/sw.js') return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (STATIC_PATH.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});
