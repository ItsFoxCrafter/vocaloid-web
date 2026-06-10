function getVocalistOfTheDay(names) {
    const today = new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
        hash = ((hash << 5) - hash) + today.charCodeAt(i);
        hash |= 0;
    }
    return names[Math.abs(hash) % names.length];
}

function renderVocalistOfTheDay(names) {
    const container = document.querySelector(".welcome-votd");
    if (!container) return;
    const slug = getVocalistOfTheDay(names);
    fetch(`./src/json/vocals/${slug}.json`)
        .then((r) => r.json())
        .then((data) => {
            container.innerHTML = `
                <a class="votd-link" href="#${slug}">
                    <span class="votd-label">VOCALIST OF THE DAY</span>
                    <span class="votd-name" style="color: var(--${slug}-color);">${data.title}</span>
                </a>
            `;
        })
        .catch(() => {});
}

function renderRecentlyViewed() {
    const container = document.querySelector(".welcome-recent");
    if (!container) return;
    const recent = JSON.parse(localStorage.getItem("recentVocalists") || "[]");
    if (recent.length === 0) return;
    Promise.all(
        recent.map((slug) =>
            fetch(`./src/json/vocals/${slug}.json`)
                .then((r) => r.json())
                .then((data) => ({ slug, title: data.title }))
                .catch(() => null),
        ),
    ).then((vocalists) => {
        const valid = vocalists.filter(Boolean);
        if (valid.length === 0) return;
        container.innerHTML = `
            <p class="recent-label">RECENTLY VIEWED</p>
            <div class="recent-list">
                ${valid
                    .map(
                        (v) => `
                    <a class="recent-link" href="#${v.slug}">
                        <span class="recent-dot" style="background: var(--${v.slug}-color);"></span>
                        ${v.title}
                    </a>
                `,
                    )
                    .join("")}
            </div>
        `;
    });
}

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

            renderVocalistOfTheDay(data);
            renderRecentlyViewed();
        })
        .catch((error) => {
            console.error(error);
        });
}

renderWelcomeDots();
