/**
 * @file musicSearchHandler.js
 * @description Handles live search filtering and sort control for the music section.
 *              Filters the currentSongs array (owned by musicHandler.js)
 *              and triggers a re-render with the current sort applied.
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. filterSongs    — filters currentSongs by a search term
 *  2. initMusic      — attaches event listeners to search bar and sort select
 *  3. Auto-init      — watches for <c-music-section> to appear in the DOM
 *
 * Dependencies
 * ------------
 *  - currentSongs  (musicHandler.js) — the full songs array to filter
 *  - refreshMusic() (musicHandler.js) — re-filters, re-sorts, re-renders
 *  - parseSortValue() (musicHandler.js) — parses "key-order" sort strings
 *  - #searchBar and #sortSelect exist inside <c-music-section>
 *
 * How it works
 * ------------
 *  Both search and sort changes trigger refreshMusic(), which re-applies
 *  the current filter and sort together, keeping them in sync.
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

/* §2 initMusic ──────────────────────────────────────────────── */

/**
 * Attaches event listeners to #searchBar and #sortSelect.
 * Called once after <c-music-section> is confirmed to be in the DOM.
 */
function initMusic(signal) {
    const SEARCH_BAR = document.getElementById("searchBar");
    const SORT_SELECT = document.getElementById("sortSelect");

    if (SEARCH_BAR) {
        SEARCH_BAR.addEventListener(
            "input",
            () => {
                if (typeof refreshMusic === "function") refreshMusic();
            },
            { signal },
        );
    }

    if (SORT_SELECT) {
        SORT_SELECT.addEventListener(
            "change",
            () => {
                const { key, order } = parseSortValue(SORT_SELECT.value);
                currentSortKey = key;
                currentSortOrder = order;
                if (typeof refreshMusic === "function") refreshMusic();
            },
            { signal },
        );
    }
}

/* §3 Auto-init ──────────────────────────────────────────────── */

/**
 * <c-music-section> is injected dynamically on every vocalist click,
 * so we watch #content continuously and re-run initMusic() each time
 * a new #searchBar appears. abortController cleans up the old listeners
 * before attaching new ones so they don't stack up.
 */
let musicAbortController = null;

const musicObserver = new MutationObserver(() => {
    if (document.getElementById("searchBar")) {
        // cancel listeners from the previous vocalist before adding new ones
        if (musicAbortController) musicAbortController.abort();
        musicAbortController = new AbortController();
        initMusic(musicAbortController.signal);
    }
});

const CONTENT_ROOT = document.getElementById("content");
if (CONTENT_ROOT) {
    musicObserver.observe(CONTENT_ROOT, { childList: true, subtree: true });
}
