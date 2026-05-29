const CONTENT = document.getElementById("content");

function checkClickedButton(page) {
    if (page == "about") {
        const ABOUT_SECTION = document.createElement("c-about-section");
        CONTENT.innerHTML = "";
        CONTENT.appendChild(ABOUT_SECTION);
    } else if (page == "theme-changer") {
        changeTheme();
    } else {
        renderPage(page);
    }
}

function renderPage(page) {
    const JSON_PATH = `./src/json/vocals/${page}.json`;

    fetch(JSON_PATH)
        .then((response) => {
            if (!response.ok)
                throw new Error(
                    `Failed to load ${JSON_PATH} (status ${response.status})`,
                );
            return response.json();
        })
        .then((data) => {
            CONTENT.innerHTML = "";

            const HERO_SECTION = document.createElement("c-hero-section");

            HERO_SECTION.data = {
                title: data.title,
                codename: data.codename,
                subtitle: data.subtitle,
                date: data.date,
                description: data.description,
                imageUrl: data.imageUrl,
                page,
                imageDividerUrl: data.imageDividerUrl,
            };
            CONTENT.appendChild(HERO_SECTION);

            renderMusicSection(page);
        })
        .catch((err) => {
            console.error(err);
            CONTENT.innerHTML = "";
            generateError(page, err);
        });
}

function renderMusicSection(page) {
    const MUSIC_SECTION = document.createElement("c-music-section");
    CONTENT.appendChild(MUSIC_SECTION);
    readMusicJSONFile(page);
}
