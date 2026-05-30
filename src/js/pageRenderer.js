/**
 * @file pageRenderer.js
 * @description Controls what gets rendered inside #content when a navbar
 *              button is clicked. Acts as the main router for the app.
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. CONTENT         — cached reference to the main content container
 *  2. checkClickedButton — routes a button click to the right handler
 *  3. renderPage         — fetches vocalist JSON and renders hero + music
 *  4. renderMusicSection — appends the music section component
 *
 * Dependencies
 * ------------
 *  - changeTheme()      (themeHandler.js)
 *  - generateError()    (errorHandler.js)
 *  - readMusicJSONFile() (musicHandler.js)
 *  - <c-hero-section>, <c-about-section>, <c-music-section> components
 *  - ./src/json/vocals/<page>.json
 */

/* §1 CONTENT ────────────────────────────────────────────────── */

const CONTENT = document.getElementById("content");

/* §2 checkClickedButton ─────────────────────────────────────── */

/**
 * Routes a navbar button click to the correct handler.
 * - "about"         → renders the about section directly
 * - "theme-changer" → toggles dark/light mode (no content change)
 * - anything else   → treated as a vocalist slug, fetches their page
 *
 * @param {string} page - The data-page value from the clicked button
 */
function checkClickedButton(page) {
    if (page == "about") {
        const ABOUT_SECTION = document.createElement("c-about-section");
        CONTENT.innerHTML = "";
        CONTENT.appendChild(ABOUT_SECTION);
    } else if (page == "theme-changer") {
        changeTheme();
    } else {
        renderPage(page);
    }
}

/* §3 renderPage ─────────────────────────────────────────────── */

/**
 * Fetches a vocalist's data JSON and renders their hero section.
 * On success also calls renderMusicSection to append the music grid.
 * On failure clears the content and calls generateError.
 *
 * @param {string} page - Vocalist slug matching a file in ./src/json/vocals/
 */
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

            renderMusicSection(page);
        })
        .catch((err) => {
            console.error(err);
            CONTENT.innerHTML = "";
            generateError(page, err);
        });
}

/* §4 renderMusicSection ─────────────────────────────────────── */

/**
 * Creates the music section shell component and triggers the music fetch.
 * Called after the hero section has been appended successfully.
 *
 * @param {string} page - Vocalist slug passed through to readMusicJSONFile
 */
function renderMusicSection(page) {
    const MUSIC_SECTION = document.createElement("c-music-section");
    CONTENT.appendChild(MUSIC_SECTION);
    readMusicJSONFile(page);
}
