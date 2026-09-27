const CACHE_NAME = "hauptstadt-quiz-v1";

const DATEIEN_ZUM_CACHEN = [
    "./",
    "index.html",
    "style.css",
    "app.js",
    "manifest.json",
    "countries.json",
    "maps/europe.svg",
    "maps/asia.svg",
    "maps/africa.svg",
    "maps/north-america.svg",
    "maps/south-america.svg",
    "maps/oceania.svg",
    "icons/icon-192.png",
    "icons/icon-512.png",
    "icons/icon-maskable-512.png",
    "icons/icon-180.png",
    "icons/favicon.ico"
];

self.addEventListener("install", function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(DATEIEN_ZUM_CACHEN);
        })
    );
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(namen) {
            return Promise.all(
                namen
                    .filter(function(name) { return name !== CACHE_NAME; })
                    .map(function(name) { return caches.delete(name); })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener("fetch", function(event) {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request)
            .then(function(antwort) {
                const kopie = antwort.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, kopie);
                });
                return antwort;
            })
            .catch(function() {
                return caches.match(event.request);
            })
    );
});