const CONTENT = document.getElementById("content");
const VOCALS = ["miku", "teto", "neru", "gumi"];

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
            };
            CONTENT.appendChild(HERO_SECTION);
        })
        .catch((err) => {
            console.error(err);
            CONTENT.innerHTML = "";
            generateError(page, err);
        });
}

function generateError(page, error) {
    const ERROR_JSON_PATH = `./src/json/error/error.json`;
    fetch(ERROR_JSON_PATH)
        .then((response) => {
            if (!response.ok)
                throw new Error(
                    `Failed to load ${ERROR_JSON_PATH} (status ${response.status})`,
                );
            return response.json();
        })
        .then((errorData) => {
            const ERROR_SECTION = document.createElement("c-error-section");
            const RANDOM_ERROR =
                errorData.title[
                    Math.floor(Math.random() * errorData.title.length)
                ];
            const RANDOM_VOCAL =
                VOCALS[Math.floor(Math.random() * VOCALS.length)];

            ERROR_SECTION.data = {
                title: RANDOM_ERROR,
                description: `Unable to load data for "${page}". ${error.message}`,
                vocal: RANDOM_VOCAL,
            };
            CONTENT.appendChild(ERROR_SECTION);
        })
        .catch((err) => {
            console.error(err);
            CONTENT.innerHTML = `<p class="error-fallback">An unexpected error occurred while loading the error page.</p>`;
        });
}

const SOUND_MAP = {
    miku: ["./src/assets/sound/miku/Mikudayo.mp3"],
    teto: [
        "./src/assets/sound/teto/awesommeee-teto.mp3",
        "./src/assets/sound/teto/i-hate-miku-teto.mp3",
        "./src/assets/sound/teto/teetoo.mp3",
        "./src/assets/sound/teto/teto-ahhhh.mp3",
        "./src/assets/sound/teto/teto-cursing-for-some-reason.mp3",
        "./src/assets/sound/teto/teto-wav.mp3",
    ],
    neru: ["./src/assets/sound/neru/neru-phone.mp3"],
};

const audioCache = {};
const audioState = {};

function getSoundSrc(page) {
    const sounds = SOUND_MAP[page];
    if (!Array.isArray(sounds) || sounds.length === 0) return null;
    if (sounds.length === 1) return sounds[0];
    return sounds[Math.floor(Math.random() * sounds.length)];
}

function playButtonSound(page) {
    const soundSrc = getSoundSrc(page);
    if (!soundSrc) return;

    if (audioState[page]?.playing) {
        return;
    }

    let audio = audioCache[page];
    if (!audio || audio.ended) {
        audio = new Audio(soundSrc);
        audioCache[page] = audio;
    }

    audioState[page] = { playing: false };
    audio.onplay = () => {
        audioState[page].playing = true;
    };
    audio.onended = () => {
        audioState[page].playing = false;
    };

    audio.currentTime = 0;
    audio.play().catch((err) => {
        console.warn("Unable to play audio:", err);
        audioState[page].playing = false;
    });
}
