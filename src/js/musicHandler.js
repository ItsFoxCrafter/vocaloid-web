function getMusicJsonPath(page) {
    const NORMALIZED_PAGE = String(page || "").toLowerCase();
    return `./src/json/ytmusic/${NORMALIZED_PAGE}Music.json`;
}

function getYoutubeEmbedUrl(link) {
    try {
        const PARSED_URL = new URL(link);
        if (PARSED_URL.hostname.includes("youtu.be")) {
            return `https://www.youtube.com/embed/${PARSED_URL.pathname.slice(1)}`;
        }
        const VIDEO_ID = PARSED_URL.searchParams.get("v");
        if (VIDEO_ID) {
            return `https://www.youtube.com/embed/${VIDEO_ID}`;
        }
    } catch (error) {
        const MATCH = link.match(
            /(?:youtu\.be\/|v=|\/embed\/)([A-Za-z0-9_-]{11})/,
        );
        if (MATCH) return `https://www.youtube.com/embed/${MATCH[1]}`;
    }
    return link;
}

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
