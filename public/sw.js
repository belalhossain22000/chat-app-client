// Production-grade offline-shell service worker for ChatFlow.
// Network-first for navigations (so fresh app + auth redirects work),
// Stale-While-Revalidate for static assets with safe error catching.

const CACHE = "chatflow-v3";

// "/" is the landing page and the offline fallback below; unlike /chat and
// /login it isn't behind the auth proxy, so it always answers 200 and is safe
// to pre-cache.
const SHELL = [
  "/",
  "/manifest.webmanifest",
  "/logo.png",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        Promise.all(SHELL.map((url) => cache.add(url).catch(() => {}))),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Never intercept API, socket, or cross-origin traffic
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/socket.io")) return;

  // 1. Page Navigations: Network-first with cache fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          // A redirect here is the auth proxy doing its job, and its target
          // depends on session state. cache.put() also rejects outright on a
          // redirected response, so pass those straight through.
          if (res.ok && res.type === "basic" && !res.redirected) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const rootCached = await caches.match("/");
          return (
            rootCached ||
            new Response("You are currently offline.", {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            })
          );
        }),
    );
    return;
  }

  // 2. Static Assets: Cache-first with safe Network fallback and background update (Stale-While-Revalidate)
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.ok &&
            networkResponse.type === "basic"
          ) {
            const copy = networkResponse.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => cached); // Gracefully handle network drops without throwing unhandled rejections

      return cached || fetchPromise;
    }),
  );
});
