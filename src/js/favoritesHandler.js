(function () {
    const KEY = "vocaweb-favorites";

    window.getFavorites = function () {
        return JSON.parse(localStorage.getItem(KEY) || "[]");
    };

    window.toggleFavorite = function (slug) {
        let favs = getFavorites();
        const idx = favs.indexOf(slug);
        if (idx === -1) {
            favs.push(slug);
        } else {
            favs.splice(idx, 1);
        }
        localStorage.setItem(KEY, JSON.stringify(favs));
        return favs.indexOf(slug) !== -1;
    };

    window.isFavorite = function (slug) {
        return getFavorites().includes(slug);
    };
})();
