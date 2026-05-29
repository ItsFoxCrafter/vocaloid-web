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
