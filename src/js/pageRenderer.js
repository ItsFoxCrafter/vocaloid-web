const CONTENT = document.getElementById("content");

function setMeta(name, content) {
    let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    if (el) { el.content = content; return; }
    el = document.createElement("meta");
    if (name.startsWith("og:")) el.setAttribute("property", name);
    else el.setAttribute("name", name);
    el.content = content;
    document.head.appendChild(el);
}

function updateSocialMeta(title, description) {
    setMeta("og:title", title);
    setMeta("twitter:title", title);
    setMeta("og:description", description);
    setMeta("twitter:description", description);
    document.title = title;
}

function loadPage(page) {
    if (page === "about") {
        const ABOUT_SECTION = document.createElement("c-about-section");
        CONTENT.innerHTML = "";
        CONTENT.appendChild(ABOUT_SECTION);
        updateSocialMeta("About — VocaWeb", "About VocaWeb — a community-driven Vocaloid fan site.");
    } else if (["all", "vocaloid", "utau", "vsynth", "other"].includes(page)) {
        renderGrid(page);
        const CATEGORY = page.toUpperCase();
        updateSocialMeta(`${CATEGORY} — VocaWeb`, `Browse ${CATEGORY} virtual singers.`);
    } else if (page) {
        renderPage(page);
    } else {
        CONTENT.innerHTML = "";
        const WELCOME = document.createElement("c-welcome-section");
        CONTENT.appendChild(WELCOME);
        if (typeof renderWelcomeDots === "function") renderWelcomeDots();
        updateSocialMeta("VocaWeb", "Explore your favorite Vocaloid virtual singers — Miku, Teto, Neru, Gumi, Luka and more.");
    }

    const NAVBAR = document.querySelector("c-navbar");
    if (NAVBAR) {
        NAVBAR.querySelectorAll("button[data-page]").forEach((btn) => {
            btn.classList.toggle("active-button", btn.dataset.page === page);
        });
    }
}

window.addEventListener("hashchange", () => {
    loadPage(window.location.hash.slice(1));
});

const INITIAL_PAGE = window.location.hash.slice(1);
if (INITIAL_PAGE) loadPage(INITIAL_PAGE);

function renderGrid(category) {
    CONTENT.innerHTML = "";
    const GRID = document.createElement("c-vocalist-grid");
    GRID.data = category;
    CONTENT.appendChild(GRID);
}

function renderPage(page) {
    const JSON_PATH = `./src/json/vocals/${page}.json`;

    fetch(JSON_PATH)
        .then((response) => {
            if (!response.ok)
                throw new Error(
                    `Failed to load ${JSON_PATH} (status ${response.status})`,
                );
            return response.json();
        })
        .then((data) => {
            CONTENT.innerHTML = "";

            const HERO_SECTION = document.createElement("c-hero-section");

            HERO_SECTION.data = {
                title: data.title,
                codename: data.codename,
                subtitle: data.subtitle,
                date: data.date,
                description: data.description,
                imageUrl: data.imageUrl,
                page,
                imageDividerUrl: data.imageDividerUrl,
            };
            CONTENT.appendChild(HERO_SECTION);

            updateSocialMeta(`${data.title} — VocaWeb`, data.description || data.subtitle || `Explore ${data.title} on VocaWeb.`);

            renderMusicSection(page);
        })
        .catch((err) => {
            console.error(err);
            CONTENT.innerHTML = "";
            generateError(page, err);
        });
}

function renderMusicSection(page) {
    const MUSIC_SECTION = document.createElement("c-music-section");
    CONTENT.appendChild(MUSIC_SECTION);
    readMusicJSONFile(page);
}
