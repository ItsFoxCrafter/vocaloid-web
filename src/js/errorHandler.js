async function fetchVocalNames() {
    const VOCALS_NAMES_JSON_PATH = "./src/json/vocaloidNames.json";
    const response = await fetch(VOCALS_NAMES_JSON_PATH);

    if (!response.ok)
        throw new Error(
            `Failed to load vocal names (status ${response.status})`,
        );

    return await response.json();
}

async function generateError(page, error) {
    const ERROR_JSON_PATH = `./src/json/error/error.json`;

    try {
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
        console.error(err);
        CONTENT.innerHTML = `<p class="error-fallback">An unexpected error occurred while loading the error page.</p>`;
    }
}
