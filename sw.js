const CACHE_NAME = "vocaweb-v2";

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                "./",
                "./index.html",
                "./manifest.json",
                "./src/css/global.css",
                "./src/css/reset.css",
                "./src/css/variables.css",
                "./src/css/layout.css",
                "./src/css/welcome.css",
                "./src/css/navbar.css",
                "./src/css/hero.css",
                "./src/css/vocalists.css",
                "./src/css/singers.css",
                "./src/css/divider.css",
                "./src/css/error.css",
                "./src/css/music.css",
                "./src/css/responsive.css",
                "./src/css/animations.css",
                "./src/components/navbar.js",
                "./src/components/welcomeSection.js",
                "./src/components/heroSection.js",
                "./src/components/musicSection.js",
                "./src/components/aboutSection.js",
                "./src/components/errorSection.js",
                "./src/components/welcomeDots.js",
                "./src/components/shareModal.js",
                "./src/components/vocalistGrid.js",
                "./src/js/musicHandler.js",
                "./src/js/musicSearchHandler.js",
                "./src/js/soundHandler.js",
                "./src/js/errorHandler.js",
                "./src/js/themeHandler.js",
                "./src/js/welcomeDotsRenderer.js",
                "./src/js/pageRenderer.js",
                "./src/assets/img/icons/icon.svg",
            ]);
        }),
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request).then((response) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        }),
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key)),
            );
        }),
    );
});
