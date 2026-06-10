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
