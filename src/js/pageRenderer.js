/**
 * @file pageRenderer.js
 * @description Hash-driven router and page renderer for VocaWeb.
 *              Handles social meta tags, recently-viewed tracking,
 *              and orchestrates the rendering of all page sections.
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. setMeta          — updates or creates a meta tag
 *  2. updateSocialMeta — sets OG and Twitter card meta tags
 *  3. renderWelcome    — renders the welcome screen
 *  4. trackRecentlyViewed — persists recently viewed vocalists
 *  5. loadPage          — hash-driven router
 *  6. renderGrid        — renders the category grid
 *  7. renderPage        — fetches vocalist data and renders hero
 *  8. renderMusicSection — renders the music section
 *
 * Dependencies
 * ------------
 *  - <div id="content"> root container in index.html
 *  - Custom elements from components/ directory
 *  - JS modules: errorHandler.js, musicHandler.js
 */

const CONTENT = document.getElementById("content");
let pageAbortController = null;

/* §1 setMeta ─────────────────────────────────────────────────── */

function setMeta(name, content) {
    let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    if (el) { el.content = content; return; }
    el = document.createElement("meta");
    if (name.startsWith("og:")) el.setAttribute("property", name);
    else el.setAttribute("name", name);
    el.content = content;
    document.head.appendChild(el);
}

/* §2 updateSocialMeta ───────────────────────────────────────── */

function updateSocialMeta(title, description) {
    setMeta("og:title", title);
    setMeta("twitter:title", title);
    setMeta("og:description", description);
    setMeta("twitter:description", description);
    document.title = title;
}

/* §3 renderWelcome ───────────────────────────────────────────── */

function renderWelcome() {
    CONTENT.innerHTML = "";
    const WELCOME = document.createElement("c-welcome-section");
    CONTENT.appendChild(WELCOME);
    if (typeof renderWelcomeDots === "function") renderWelcomeDots();
    updateSocialMeta("VocaWeb", "Explore your favorite Vocaloid virtual singers — Miku, Teto, Neru, Gumi, Luka and more.");
}

/* §4 trackRecentlyViewed ─────────────────────────────────────── */

function trackRecentlyViewed(slug) {
    let recent = JSON.parse(localStorage.getItem("recentVocalists") || "[]");
    recent = recent.filter((s) => s !== slug);
    recent.unshift(slug);
    if (recent.length > 5) recent.length = 5;
    localStorage.setItem("recentVocalists", JSON.stringify(recent));
}

/* §5 loadPage ────────────────────────────────────────────────── */

function loadPage(page) {
    if (pageAbortController) pageAbortController.abort();
    pageAbortController = new AbortController();
    const SIGNAL = pageAbortController.signal;

    document.documentElement.style.removeProperty("--selection-color");
    if (page === "profile") {
        CONTENT.innerHTML = "";
        const PROFILE = document.createElement("c-profile-section");
        CONTENT.appendChild(PROFILE);
        updateSocialMeta("Profile — VocaWeb", "Your recently viewed vocalists.");
    } else if (!page || page === "welcome") {
        renderWelcome();
    } else if (page === "about") {
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

/* §6 renderGrid ──────────────────────────────────────────────── */

function renderGrid(category) {
    CONTENT.innerHTML = "";
    const GRID = document.createElement("c-vocalist-grid");
    GRID.data = category;
    CONTENT.appendChild(GRID);
}

/* §7 renderPage ──────────────────────────────────────────────── */

function renderPage(page) {
    const SIGNAL = pageAbortController ? pageAbortController.signal : null;
    const JSON_PATH = `./src/json/vocals/${page}.json`;

    fetch(JSON_PATH, { signal: SIGNAL })
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
                dykContent: data.dyk,
            };
            CONTENT.appendChild(HERO_SECTION);

            document.documentElement.style.setProperty("--selection-color", `var(--${page}-color)`);
            trackRecentlyViewed(page);

            updateSocialMeta(`${data.title} — VocaWeb`, data.description || data.subtitle || `Explore ${data.title} on VocaWeb.`);

            if (typeof playButtonSound === "function") playButtonSound(page);
            renderMusicSection(page, SIGNAL);
        })
        .catch((err) => {
            if (err.name === "AbortError") return;
            console.error(err);
            CONTENT.innerHTML = "";
            generateError(page, err, SIGNAL);
        });
}

/* §8 renderMusicSection ─────────────────────────────────────── */

function renderMusicSection(page, signal) {
    const MUSIC_SECTION = document.createElement("c-music-section");
    CONTENT.appendChild(MUSIC_SECTION);
    readMusicJSONFile(page, signal);
}
