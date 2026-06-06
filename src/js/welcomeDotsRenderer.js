function readVocaloidNamesJSON() {
    const JSON_PATH = `./src/json/vocaloidNames.json`;
    fetch(JSON_PATH)
        .then((response) => response.json())
        .then((data) => {
            handleWelcomeDots(data);
        })
        .catch((error) => {
            generateError(error);
        });
}

function handleWelcomeDots(data) {
    const WELCOME_DOTS_CONTAINER =
        document.getElementsByClassName("welcome-dots")[0];
    const VOCALOID_NAMES = data;

    WELCOME_DOTS_CONTAINER.innerHTML = "";
    VOCALOID_NAMES.forEach((singerName) => {
        const WELCOME_DOT = document.createElement("c-welcome-dots");
        WELCOME_DOT.data = { name: singerName };
        WELCOME_DOTS_CONTAINER.appendChild(WELCOME_DOT);
    });
}

readVocaloidNamesJSON();
