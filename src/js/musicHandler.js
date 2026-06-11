/**
 * @file musicHandler.js
 * @description Fetches and renders the music list for a given vocalist page.
 *              Handles YouTube URL normalization, sorting, and count badge display.
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. currentSongs        — shared songs array, read by musicSearchHandler.js
 *  2. Sort state          — current sort key, order, and helpers
 *  3. getMusicJsonPath    — builds the path to a vocalist's music JSON file
 *  4. getYoutubeEmbedUrl  — normalizes any YouTube URL to an embed URL
 *  5. updateCount         — updates the song count badge
 *  6. sortSongs           — sorts a songs array by the current sort state
 *  7. refreshMusic        — re-filters + re-sorts + re-renders
 *  8. renderSongs         — renders any songs array into #musicOutputContainer
 *  9. readMusicJSONFile   — fetches the JSON and renders the music list HTML
 *
 * Dependencies
 * ------------
 *  - <div id="musicOutputContainer"> must exist in the DOM (injected by musicSection.js)
 *  - ./src/json/ytmusic/<page>Music.json
 *
 * Adding music for a new vocalist
 * --------------------------------
 *  Create ./src/json/ytmusic/<name>Music.json with the structure:
 *  { "songs": [{ "title": "", "artist": "", "album": "", "ytlink": "" }] }
 */

/* §0 Pagination state ─────────────────────────────────────────── */

const PAGE_SIZE = 6;
let currentPage = 1;
let pagedSongs = [];

/* §1 currentSongs ───────────────────────────────────────────── */

/**
 * Stores the full song list for the currently open vocalist page.
 * musicSearchHandler.js reads and filters this array — do not rename it.
 * Reset to [] whenever a new vocalist page loads.
 */
let currentSongs = [];

/* §2 Sort state ─────────────────────────────────────────────── */

let currentSortKey = "newest";
let currentSortOrder = "desc";

function parseSortValue(value) {
    const parts = value.split("-");
    return { key: parts[0] || "newest", order: parts[1] || "desc" };
}

/* §3 getMusicJsonPath ───────────────────────────────────────── */

/**
 * Returns the path to a vocalist's YouTube music JSON file.
 * @param {string} page - Vocalist slug (e.g. "miku", "rin-len")
 * @returns {string} Relative path to the JSON file
 */
function getMusicJsonPath(page) {
    const NORMALIZED_PAGE = String(page || "").toLowerCase();
    return `./src/json/ytmusic/${NORMALIZED_PAGE}Music.json`;
}

/* §4 getYoutubeEmbedUrl ─────────────────────────────────────── */

/**
 * Converts any YouTube URL format into a /embed/ URL.
 * Supports: youtube.com/watch?v=, youtu.be/, and already-embedded URLs.
 *
 * @param {string} link - Raw YouTube link from the JSON data
 * @returns {string} A YouTube embed URL, or the original link if parsing fails
 */
function getYoutubeEmbedUrl(link) {
    try {
        const PARSED_URL = new URL(link);

        // handle youtu.be short links
        if (PARSED_URL.hostname.includes("youtu.be")) {
            return `https://www.youtube.com/embed/${PARSED_URL.pathname.slice(1)}`;
        }

        // handle standard youtube.com/watch?v= links
        const VIDEO_ID = PARSED_URL.searchParams.get("v");
        if (VIDEO_ID) {
            return `https://www.youtube.com/embed/${VIDEO_ID}`;
        }
    } catch (error) {
        // URL constructor failed — fall back to regex extraction
        const MATCH = link.match(
            /(?:youtu\.be\/|v=|\/embed\/)([A-Za-z0-9_-]{11})/,
        );
        if (MATCH) return `https://www.youtube.com/embed/${MATCH[1]}`;
    }

    // return the original link unchanged if nothing matched
    return link;
}

/* §5 updateCount ────────────────────────────────────────────── */

/**
 * Updates the .music-count badge with the number of visible songs
 * out of the total.
 *
 * @param {number} visible - Number of songs currently shown
 */
function updateCount(visible) {
    const COUNT = document.querySelector(".music-count");
    if (!COUNT) return;
    const TOTAL = currentSongs.length;
    if (visible === TOTAL) {
        COUNT.textContent = `${TOTAL} song${TOTAL === 1 ? "" : "s"}`;
    } else {
        COUNT.textContent = `${visible} of ${TOTAL} song${TOTAL === 1 ? "" : "s"}`;
    }
}

/* §6 sortSongs ──────────────────────────────────────────────── */

/**
 * Sorts a songs array by the current sort key and order.
 *
 * @param {Object[]} songs - Array of song objects to sort
 * @returns {Object[]} A new sorted array
 */
function sortSongs(songs) {
    const KEY = currentSortKey === "newest" ? "id" : currentSortKey;
    const SORTED = [...songs];
    SORTED.sort((a, b) => {
        let A_VAL = a[KEY] || "";
        let B_VAL = b[KEY] || "";
        if (KEY === "id") {
            A_VAL = Number(A_VAL);
            B_VAL = Number(B_VAL);
            return currentSortOrder === "asc" ? A_VAL - B_VAL : B_VAL - A_VAL;
        }
        A_VAL = String(A_VAL).toLowerCase();
        B_VAL = String(B_VAL).toLowerCase();
        const COMP = A_VAL.localeCompare(B_VAL);
        return currentSortOrder === "asc" ? COMP : -COMP;
    });
    return SORTED;
}

/* §7 refreshMusic ───────────────────────────────────────────── */

/**
 * Re-filters currentSongs by the current search term,
 * re-sorts, and re-renders. Called on search input and sort change.
 */
function refreshMusic() {
    currentPage = 1;
    const SEARCH_BAR = document.getElementById("searchBar");
    const TERM = SEARCH_BAR ? SEARCH_BAR.value : "";
    const FILTERED = typeof filterSongs === "function" ? filterSongs(TERM) : currentSongs;
    pagedSongs = sortSongs(FILTERED);
    renderSongs(pagedSongs);
}

/* §8 renderSongs ────────────────────────────────────────────── */

/**
 * Renders an array of song objects into #musicOutputContainer.
 * Used by readMusicJSONFile (full load), refreshMusic, and musicSearchHandler.
 * Updates the count badge automatically.
 *
 * @param {Object[]} songs        - Array of song objects to render
 * @param {string}   emptyMessage - Text shown when the songs array is empty
 */
function renderSongs(songs, emptyMessage = "No songs found.") {
    const MUSIC_OUTPUT = document.getElementById("musicOutputContainer");
    if (!MUSIC_OUTPUT) return;

    updateCount(songs.length);

    if (!songs.length) {
        MUSIC_OUTPUT.innerHTML = `<p>${emptyMessage}</p>`;
        return;
    }

    const END = currentPage * PAGE_SIZE;
    const PAGE_SONGS = songs.slice(0, END);
    const HAS_MORE = songs.length > END;

    MUSIC_OUTPUT.innerHTML = `
        <div class="music-list">
            ${PAGE_SONGS
                .map((SONG) => {
                    const EMBED_URL = getYoutubeEmbedUrl(SONG.ytlink);
                    return `
                <div class="music-item">
                    <div class="music-video">
                        <div class="music-embed-placeholder" data-src="${EMBED_URL}">
                            <div class="music-embed-loader"></div>
                        </div>
                    </div>
                    <div class="music-item-meta">
                        <h3>${SONG.title}</h3>
                        <p>${SONG.artist}</p>
                        <p class="music-album">${SONG.album || ""}</p>
                    </div>
                </div>`;
                })
                .join("")}
        </div>
        ${HAS_MORE ? `<button class="music-load-more">Show ${Math.min(PAGE_SIZE, songs.length - END)} more</button>` : ""}
    `;

    lazyLoadEmbeds(MUSIC_OUTPUT);

    if (HAS_MORE) {
        const LOAD_MORE = MUSIC_OUTPUT.querySelector(".music-load-more");
        LOAD_MORE.addEventListener("click", () => {
            currentPage++;
            renderSongs(songs);
        });
    }
}

function lazyLoadEmbeds(container) {
    if (!("IntersectionObserver" in window)) {
        container.querySelectorAll(".music-embed-placeholder").forEach((pl) => {
            const IFRAME = document.createElement("iframe");
            IFRAME.src = pl.dataset.src;
            IFRAME.title = "YouTube video";
            IFRAME.frameborder = "0";
            IFRAME.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            IFRAME.allowfullscreen = true;
            IFRAME.loading = "lazy";
            pl.replaceWith(IFRAME);
        });
        return;
    }

    const OBSERVER = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const PLACEHOLDER = entry.target;
                OBSERVER.unobserve(PLACEHOLDER);
                const IFRAME = document.createElement("iframe");
                IFRAME.src = PLACEHOLDER.dataset.src;
                IFRAME.title = "YouTube video";
                IFRAME.frameborder = "0";
                IFRAME.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                IFRAME.allowfullscreen = true;
                IFRAME.loading = "lazy";
                PLACEHOLDER.replaceWith(IFRAME);
            });
        },
        { rootMargin: "200px" },
    );

    container.querySelectorAll(".music-embed-placeholder").forEach((pl) => OBSERVER.observe(pl));
}

/* §9 readMusicJSONFile ──────────────────────────────────────── */

/**
 * Renders skeleton music card placeholders while data loads.
 */
function renderMusicSkeleton() {
    const MUSIC_OUTPUT = document.getElementById("musicOutputContainer");
    if (!MUSIC_OUTPUT) return;

    MUSIC_OUTPUT.innerHTML = `
        <div class="music-skeleton-list">
            ${Array.from({ length: 4 })
                .map(
                    () => `
                <div class="music-skeleton-item">
                    <div class="music-skeleton-video skeleton"></div>
                    <div class="music-skeleton-line skeleton"></div>
                    <div class="music-skeleton-line skeleton short"></div>
                </div>
            `,
                )
                .join("")}
        </div>
    `;
}

/**
 * Fetches the music JSON for a vocalist and renders the song grid into
 * #musicOutputContainer. Shows loading/error states as needed.
 *
 * @param {string} page - Vocalist slug (e.g. "miku", "teto")
 */
function readMusicJSONFile(page, signal) {
    const MUSIC_OUTPUT = document.getElementById("musicOutputContainer");
    if (!MUSIC_OUTPUT) return;

    MUSIC_OUTPUT.style.setProperty("--accent", `var(--${page}-color)`);

    const JSON_PATH = getMusicJsonPath(page);
    renderMusicSkeleton();

    // reset the shared songs array so search doesn't show stale results
    currentSongs = [];

    fetch(JSON_PATH, { signal })
        .then((RESPONSE) => {
            if (!RESPONSE.ok)
                throw new Error(
                    `Failed to load ${JSON_PATH} (status ${RESPONSE.status})`,
                );
            return RESPONSE.json();
        })
        .then((DATA) => {
            if (!DATA?.songs?.length) {
                MUSIC_OUTPUT.innerHTML = `<p>No music found for ${page}.</p>`;
                return;
            }

            // store songs globally so musicSearchHandler.js can filter them
            currentSongs = DATA.songs;
            currentPage = 1;
            pagedSongs = sortSongs(currentSongs);
            renderSongs(pagedSongs);
        })
        .catch((ERR) => {
            if (ERR.name === "AbortError") return;
            MUSIC_OUTPUT.innerHTML = `<p class="music-error">Unable to load music for ${page}. ${ERR.message}</p>`;
        });
}
