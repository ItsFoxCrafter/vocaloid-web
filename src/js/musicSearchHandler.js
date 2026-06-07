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
 *  - #searchBar exists inside <c-music-section>
 *
 * How it works
 * ------------
 *  Search fires on every keystroke (live search).
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
 * Attaches event listeners to #searchBar.
 * Called once after <c-music-section> is confirmed to be in the DOM.
 */
function initSearch(signal) {
    const SEARCH_BAR = document.getElementById("searchBar");

    if (!SEARCH_BAR) return;

    SEARCH_BAR.addEventListener(
        "input",
        () => {
            const RESULTS = filterSongs(SEARCH_BAR.value);
            renderSongs(RESULTS, `No songs found for "${SEARCH_BAR.value}".`);
        },
        { signal },
    );
}

/* §3 Auto-init ──────────────────────────────────────────────── */

/**
 * <c-music-section> is injected dynamically on every vocalist click,
 * so we watch #content continuously and re-run initSearch() each time
 * a new #searchBar appears. abortController cleans up the old listeners
 * before attaching new ones so they don't stack up.
 */
let searchAbortController = null;

const searchObserver = new MutationObserver(() => {
    if (document.getElementById("searchBar")) {
        // cancel listeners from the previous vocalist before adding new ones
        if (searchAbortController) searchAbortController.abort();
        searchAbortController = new AbortController();
        initSearch(searchAbortController.signal);
    }
});

const CONTENT_ROOT = document.getElementById("content");
if (CONTENT_ROOT) {
    searchObserver.observe(CONTENT_ROOT, { childList: true, subtree: true });
}
