/**
 * @file musicHandler.js
 * @description Fetches and renders the music list for a given vocalist page.
 *              Handles YouTube URL normalization so both youtu.be short links
 *              and full youtube.com/watch?v= links produce valid embed URLs.
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. getMusicJsonPath    — builds the path to a vocalist's music JSON file
 *  2. getYoutubeEmbedUrl  — normalizes any YouTube URL to an embed URL
 *  3. readMusicJSONFile   — fetches the JSON and renders the music list HTML
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

/* §1 getMusicJsonPath ───────────────────────────────────────── */

/**
 * Returns the path to a vocalist's YouTube music JSON file.
 * @param {string} page - Vocalist slug (e.g. "miku", "rin-len")
 * @returns {string} Relative path to the JSON file
 */
function getMusicJsonPath(page) {
    const NORMALIZED_PAGE = String(page || "").toLowerCase();
    return `./src/json/ytmusic/${NORMALIZED_PAGE}Music.json`;
}

/* §2 getYoutubeEmbedUrl ─────────────────────────────────────── */

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

/* §3 readMusicJSONFile ──────────────────────────────────────── */

/**
 * Fetches the music JSON for a vocalist and renders the song grid into
 * #musicOutputContainer. Shows loading/error states as needed.
 *
 * @param {string} page - Vocalist slug (e.g. "miku", "teto")
 */
function readMusicJSONFile(page) {
    const MUSIC_OUTPUT = document.getElementById("musicOutputContainer");
    if (!MUSIC_OUTPUT) return;

    const JSON_PATH = getMusicJsonPath(page);
    MUSIC_OUTPUT.innerHTML = `<p>Loading music for ${page}...</p>`;

    fetch(JSON_PATH)
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

            // build the song grid — each song gets a card with an embedded video
            MUSIC_OUTPUT.innerHTML = `
                <div class="music-list">
                    ${DATA.songs
                        .map((SONG) => {
                            const EMBED_URL = getYoutubeEmbedUrl(SONG.ytlink);
                            return `
                        <div class="music-item">
                            <div class="music-video">
                                <iframe
                                    src="${EMBED_URL}"
                                    title="${SONG.title} video"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowfullscreen
                                ></iframe>
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
            `;
        })
        .catch((ERR) => {
            MUSIC_OUTPUT.innerHTML = `<p class="music-error">Unable to load music for ${page}. ${ERR.message}</p>`;
        });
}
