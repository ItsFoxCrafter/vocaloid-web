/**
 * @file navbarButtonRenderer.js
 * @description Dynamically populates the navbar's vocalist button container
 *              by reading the list of names from vocaloidNames.json.
 *              This means adding a new vocalist only requires updating the JSON —
 *              no changes to this file or navbar.js are needed.
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. readVocaloidNamesJSON — fetches names and renders <c-virtual-singer-button> elements
 *
 * Dependencies
 * ------------
 *  - .virtual-singers-button-container element (rendered by navbar.js)
 *  - <c-virtual-singer-button> component (virtualSingerButton.js)
 *  - generateError() (errorHandler.js)
 *  - ./src/json/vocaloidNames.json
 *
 * Adding a new vocalist
 * ----------------------
 *  Add their slug to ./src/json/vocaloidNames.json and create matching
 *  JSON, image, and CSS variable files. This script handles the rest.
 */

/* §1 readVocaloidNamesJSON ──────────────────────────────────── */

/**
 * Fetches vocaloidNames.json and renders one <c-virtual-singer-button>
 * per name into the .virtual-singers-button-container element.
 */
function readVocaloidNamesJSON() {
    const JSON_PATH = `./src/json/vocaloidNames.json`;

    fetch(JSON_PATH)
        .then((response) => response.json())
        .then((data) => {
            const CONTAINER = document.getElementsByClassName(
                "virtual-singers-button-container",
            )[0];
            CONTAINER.innerHTML = "";

            data.forEach((singerName) => {
                const SINGER_BUTTON = document.createElement(
                    "c-virtual-singer-button",
                );
                SINGER_BUTTON.data = singerName;
                CONTAINER.appendChild(SINGER_BUTTON);
            });
        })
        .catch((error) => {
            generateError(error);
        });
}

readVocaloidNamesJSON();
