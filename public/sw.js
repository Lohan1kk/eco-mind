const CACHE_NAME = "ecomind-v4";
const PRECACHE = [
  "/",
  "/calculadora",
  "/quiz",
  "/alerta-queimadas",
  "/baixar",
  "/manifest.webmanifest",
  "/brand/icon-ecomind.png",
  "/brand/icon-ecomind-maskable.png",
  "/brand/logo-ecomind.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        PRECACHE.map((url) =>
          cache.add(url).catch(() => undefined),
        ),
      ),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Network-first for fire API so offline can still use last browser cache entry.
  if (url.origin === self.location.origin && url.pathname === "/api/fires") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || Response.error())),
    );
    return;
  }

  if (url.pathname.startsWith("/api/")) return;

  // Network-first for HTML navigations.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match("/")),
        ),
    );
    return;
  }

  // Cache-first for static assets (including /_next/static after first visit).
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (
            response.ok &&
            url.origin === self.location.origin &&
            (url.pathname.startsWith("/_next/static/") ||
              url.pathname.startsWith("/brand/") ||
              url.pathname.endsWith(".png") ||
              url.pathname.endsWith(".jpg") ||
              url.pathname.endsWith(".webp") ||
              url.pathname.endsWith(".woff2"))
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    }),
  );
});
