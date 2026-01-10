const CACHE_NAME = "baat-seedhi-v1";
const urlsToCache = ["/", "/index.html"];

self.addEventListener("install", e => {
    // console.log("Service Worker: Installed");
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", e => {
    // console.log("Service Worker: Fetching", e.request.url);
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
