/**
 * @file errorHandler.js
 * @description Handles rendering of the error UI when a page fails to load.
 *              Fetches a random error title and a random vocalist image to
 *              display alongside the error message.
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. fetchVocalNames  — loads vocaloidNames.json
 *  2. generateError    — builds and renders the <c-error-section> component
 *
 * Dependencies
 * ------------
 *  - CONTENT global (defined in pageRenderer.js)
 *  - <c-error-section> component (errorSection.js)
 *  - ./src/json/vocaloidNames.json
 *  - ./src/json/error/error.json
 */

/* §1 fetchVocalNames ────────────────────────────────────────── */

/**
 * Fetches the list of vocalist name strings from vocaloidNames.json.
 * @returns {Promise<string[]>} Array of vocalist name slugs (e.g. "miku", "teto")
 */
async function fetchVocalNames() {
    const VOCALS_NAMES_JSON_PATH = "./src/json/vocaloidNames.json";
    const response = await fetch(VOCALS_NAMES_JSON_PATH);

    if (!response.ok)
        throw new Error(
            `Failed to load vocal names (status ${response.status})`,
        );

    return await response.json();
}

/* §2 generateError ──────────────────────────────────────────── */

/**
 * Renders the error section into CONTENT.
 * Fetches vocal names and error titles in parallel, then picks one of each
 * at random to keep the error screen feeling fresh.
 *
 * @param {string} page  - The page slug that failed to load (e.g. "miku")
 * @param {Error}  error - The original error thrown by the failed fetch
 */
async function generateError(page, error) {
    const ERROR_JSON_PATH = `./src/json/error/error.json`;

    try {
        // fetch both data sources at the same time for speed
        const [VOCALS, errorData] = await Promise.all([
            fetchVocalNames(),
            fetch(ERROR_JSON_PATH).then((res) => {
                if (!res.ok)
                    throw new Error(
                        `Failed to load ${ERROR_JSON_PATH} (status ${res.status})`,
                    );
                return res.json();
            }),
        ]);

        const ERROR_SECTION = document.createElement("c-error-section");

        // pick a random error title and a random vocalist sign image
        const RANDOM_ERROR =
            errorData.title[Math.floor(Math.random() * errorData.title.length)];
        const RANDOM_VOCAL = VOCALS[Math.floor(Math.random() * VOCALS.length)];

        ERROR_SECTION.data = {
            title: RANDOM_ERROR,
            description: `Unable to load data for "${page}". ${error.message}`,
            vocal: RANDOM_VOCAL,
        };
        CONTENT.appendChild(ERROR_SECTION);
    } catch (err) {
        // last-resort fallback if even the error page assets fail to load
        console.error(err);
        CONTENT.innerHTML = `<p class="error-fallback">An unexpected error occurred while loading the error page.</p>`;
    }
}
