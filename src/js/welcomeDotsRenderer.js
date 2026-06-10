function renderWelcomeDots() {
    fetch("./src/json/vocaloidNames.json")
        .then((response) => response.json())
        .then((data) => {
            const WELCOME_DOTS_CONTAINER =
                document.getElementsByClassName("welcome-dots")[0];
            if (!WELCOME_DOTS_CONTAINER) return;

            WELCOME_DOTS_CONTAINER.innerHTML = "";
            data.forEach((singerName) => {
                const WELCOME_DOT = document.createElement("c-welcome-dots");
                WELCOME_DOT.data = { name: singerName };
                WELCOME_DOTS_CONTAINER.appendChild(WELCOME_DOT);
            });

            if (typeof renderVocalistOfTheDay === "function") {
                renderVocalistOfTheDay(data);
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

renderWelcomeDots();
