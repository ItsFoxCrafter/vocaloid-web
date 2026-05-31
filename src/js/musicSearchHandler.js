/**
 * @file musicSearchHandler.js
 * @description Handles live search filtering for the music section.
 *              Filters the currentSongs array (owned by musicHandler.js)
 *              and re-renders only the matching results.
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. filterSongs    — filters currentSongs by a search term
 *  2. initSearch     — attaches event listeners to the search bar and button
 *  3. Auto-init      — watches for <c-music-section> to appear in the DOM
 *
 * Dependencies
 * ------------
 *  - currentSongs  (musicHandler.js) — the full songs array to filter
 *  - renderSongs() (musicHandler.js) — renders a songs array into the DOM
 *  - #searchBar and #searchButton exist inside <c-music-section>
 *
 * How it works
 * ------------
 *  Search fires on button click AND on every keystroke (live search).
 *  It searches across title, artist, and album fields — all case-insensitive.
 *  Clearing the input restores the full song list automatically.
 */

/* §1 filterSongs ────────────────────────────────────────────── */

/**
 * Filters the currentSongs array against a search term.
 * Matches against title, artist, and album — all case-insensitive.
 *
 * @param {string} term - The search string typed by the user
 * @returns {Object[]} Filtered array of song objects
 */
function filterSongs(term) {
    const NORMALIZED_TERM = term.toLowerCase().trim();

    // empty search = show everything
    if (!NORMALIZED_TERM) return currentSongs;

    return currentSongs.filter((song) => {
        return (
            song.title?.toLowerCase().includes(NORMALIZED_TERM) ||
            song.artist?.toLowerCase().includes(NORMALIZED_TERM) ||
            song.album?.toLowerCase().includes(NORMALIZED_TERM)
        );
    });
}

/* §2 initSearch ─────────────────────────────────────────────── */

/**
 * Attaches event listeners to #searchBar and #searchButton.
 * Called once after <c-music-section> is confirmed to be in the DOM.
 */
function initSearch() {
    const SEARCH_BAR = document.getElementById("searchBar");
    const SEARCH_BUTTON = document.getElementById("searchButton");

    if (!SEARCH_BAR || !SEARCH_BUTTON) return;

    // live search — filters on every keystroke
    SEARCH_BAR.addEventListener("input", () => {
        const RESULTS = filterSongs(SEARCH_BAR.value);
        renderSongs(
            RESULTS,
            `No songs found for "${SEARCH_BAR.value}". Add them by contributing to the JSON file!`,
        );
    });

    // also fires on button click for users who don't expect live search
    SEARCH_BUTTON.addEventListener("click", () => {
        const RESULTS = filterSongs(SEARCH_BAR.value);
        renderSongs(
            RESULTS,
            `No songs found for "${SEARCH_BAR.value}". Add them by contributing to the JSON file!`,
        );
    });

    // pressing Enter in the search bar triggers the button
    SEARCH_BAR.addEventListener("keydown", (e) => {
        if (e.key === "Enter") SEARCH_BUTTON.click();
    });
}

/* §3 Auto-init ──────────────────────────────────────────────── */

/**
 * <c-music-section> is injected dynamically by pageRenderer.js, so
 * #searchBar doesn't exist on page load. MutationObserver watches #content
 * and calls initSearch() the moment the music section appears.
 */
const searchObserver = new MutationObserver(() => {
    if (document.getElementById("searchBar")) {
        initSearch();
        // stop watching once the elements are found
        searchObserver.disconnect();
    }
});

// start watching as soon as the script loads
const CONTENT_ROOT = document.getElementById("content");
if (CONTENT_ROOT) {
    searchObserver.observe(CONTENT_ROOT, { childList: true, subtree: true });
}
