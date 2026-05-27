function getMusicJsonPath(page) {
    const normalizedPage = String(page || "").toLowerCase();
    return `./src/json/ytmusic/${normalizedPage}Music.json`;
}

function getYoutubeEmbedUrl(link) {
    try {
        const url = new URL(link);
        if (url.hostname.includes("youtu.be")) {
            return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
        }
        const videoId = url.searchParams.get("v");
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
    } catch (error) {
        const match = link.match(
            /(?:youtu\.be\/|v=|\/embed\/)([A-Za-z0-9_-]{11})/,
        );
        if (match) return `https://www.youtube.com/embed/${match[1]}`;
    }
    return link;
}

function readMusicJSONFile(page) {
    const musicOutput = document.getElementById("musicOutputContainer");
    if (!musicOutput) return;

    const JSON_PATH = getMusicJsonPath(page);
    musicOutput.innerHTML = `<p>Loading music for ${page}...</p>`;

    fetch(JSON_PATH)
        .then((response) => {
            if (!response.ok)
                throw new Error(
                    `Failed to load ${JSON_PATH} (status ${response.status})`,
                );
            return response.json();
        })
        .then((data) => {
            if (!data?.songs?.length) {
                musicOutput.innerHTML = `<p>No music found for ${page}.</p>`;
                return;
            }

            musicOutput.innerHTML = `
                <div class="music-list">
                    ${data.songs
                        .map((song) => {
                            const embedUrl = getYoutubeEmbedUrl(song.ytlink);
                            return `
                        <div class="music-item">
                            <div class="music-video">
                                <iframe
                                    src="${embedUrl}"
                                    title="${song.title} video"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowfullscreen
                                ></iframe>
                            </div>
                            <div class="music-item-meta">
                                <h3>${song.title}</h3>
                                <p>${song.artist}</p>
                                <p class="music-album">${song.album || ""}</p>
                            </div>
                        </div>`;
                        })
                        .join("")}
                </div>
            `;
        })
        .catch((err) => {
            musicOutput.innerHTML = `<p class="music-error">Unable to load music for ${page}. ${err.message}</p>`;
        });
}
