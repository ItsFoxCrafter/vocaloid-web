const CACHE_NAME = "vocaweb-v5";

const DATA_PATTERN = /(\/src\/json\/|\/version\.json$|\/sw\.js|\/src\/js\/swManager\.js)/;

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                "./",
                "./index.html",
                "./manifest.json",
                "./version.json",
                "./src/css/global.css",
                "./src/css/reset.css",
                "./src/css/variables.css",
                "./src/css/layout.css",
                "./src/css/welcome.css",
                "./src/css/navbar.css",
                "./src/css/hero.css",
                "./src/css/vocalists.css",
                "./src/css/singers.css",
                "./src/css/profile.css",
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
                "./src/js/swManager.js",
                "./src/js/svgLoader.js",
                "./src/js/favoritesHandler.js",
                "./src/js/offlineHandler.js",
                "./src/js/scrollToTop.js",
                "./src/components/updateBanner.js",
                "./src/css/update-banner.css",
                "./src/assets/img/icons/icon.svg",
                "./src/assets/img/icons/search.svg",
                "./src/assets/img/icons/sun-moon.svg",
                "./src/assets/img/icons/dice.svg",
                "./src/assets/img/icons/sound.svg",
                "./src/assets/img/icons/star.svg",
                "./src/assets/img/icons/share.svg",
                "./src/assets/img/icons/chevron-up.svg",
                "./src/assets/img/icons/votd-star.svg",
                "./src/json/vocaloidNames.json",
                "./src/json/error/error.json",
                "./src/json/vocals/gumi.json",
                "./src/json/vocals/luka.json",
                "./src/json/vocals/miku.json",
                "./src/json/vocals/neru.json",
                "./src/json/vocals/rin-len.json",
                "./src/json/vocals/teto.json",
                "./src/json/vocals/yixi.json",
                "./src/json/vocals/yuki.json",
                "./src/json/ytmusic/gumiMusic.json",
                "./src/json/ytmusic/lukaMusic.json",
                "./src/json/ytmusic/mikuMusic.json",
                "./src/json/ytmusic/neruMusic.json",
                "./src/json/ytmusic/rin-lenMusic.json",
                "./src/json/ytmusic/tetoMusic.json",
                "./src/json/ytmusic/yixiMusic.json",
                "./src/json/ytmusic/yukiMusic.json",
                "./src/assets/img/gumi.webp",
                "./src/assets/img/luka.webp",
                "./src/assets/img/miku.webp",
                "./src/assets/img/neru.webp",
                "./src/assets/img/rin-len.webp",
                "./src/assets/img/teto.webp",
                "./src/assets/img/yixi.png",
                "./src/assets/img/yuki.webp",
                "./src/assets/img/dividers/divider-gumi.png",
                "./src/assets/img/dividers/divider-miku.png",
                "./src/assets/img/dividers/divider-neru.png",
                "./src/assets/img/dividers/divider-teto.png",
                "./src/assets/img/dividers/divider-luka.png",
                "./src/assets/img/dividers/divider-yixi.png",
                "./src/assets/img/dividers/divider-yuki.png",
                "./src/assets/img/signs/sign-gumi.png",
                "./src/assets/img/signs/sign-luka.png",
                "./src/assets/img/signs/sign-miku.png",
                "./src/assets/img/signs/sign-neru.png",
                "./src/assets/img/signs/sign-rin-len.png",
                "./src/assets/img/signs/sign-teto.png",
                "./src/assets/img/signs/sign-yixi.png",
                "./src/assets/img/signs/sign-yuki.png",
            ]);
        }),
    );
    self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    if (DATA_PATTERN.test(url.pathname)) {
        event.respondWith(
            fetch(event.request).then((response) => {
                if (response.ok) {
                    caches.open(CACHE_NAME).then((cache) =>
                        cache.put(event.request, response.clone())
                    );
                }
                return response;
            }).catch(() => caches.match(event.request)),
        );
        return;
    }

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
        }).then(() => self.clients.claim()),
    );
});

self.addEventListener("message", (event) => {
    if (event.data === "skip-waiting") {
        self.skipWaiting();
    }
});
