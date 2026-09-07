// Minimal offline-shell service worker for ChatFlow.
// Network-first for navigations (so fresh app + auth redirects work),
// falling back to a cached shell; cache-first for static assets.

const CACHE = "chatflow-v2";

// Only unguarded, same-origin assets belong here. /chat and /login are behind
// the auth proxy and answer 307 for one session state or the other — a
// redirected response can't be cached, and one rejection in addAll() would fail
// the whole install, leaving the worker permanently unregistered.
const SHELL = ["/manifest.webmanifest", "/logo.png", "/icon-192.png", "/icon-512.png"];

// Offline fallback for a navigation we have nothing cached for.
const OFFLINE_URL = "/login";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        // Per-item so a single failure can't abort the install.
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
  // never touch API / socket / cross-origin traffic
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          // Redirects are the auth proxy doing its job — pass them through
          // untouched rather than caching a response tied to session state.
          if (res.ok && res.type === "basic" && !res.redirected) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() =>
          caches
            .match(request)
            .then((r) => r || caches.match(OFFLINE_URL))
            .then(
              (r) =>
                r ||
                new Response("You're offline.", {
                  status: 503,
                  headers: { "Content-Type": "text/plain" },
                }),
            ),
        ),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        }),
    ),
  );
});
