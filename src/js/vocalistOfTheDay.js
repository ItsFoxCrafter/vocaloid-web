/**
 * @file vocalistOfTheDay.js
 * @description Determines and renders a daily featured vocalist.
 *              Uses a date-based hash to pick consistently so the
 *              same vocalist is shown all day for all visitors.
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. getVocalistOfTheDay    — date-based deterministic pick
 *  2. renderVocalistOfTheDay — fetches data and renders the VOTD card
 */

/* §1 getVocalistOfTheDay ────────────────────────────────────── */

function getVocalistOfTheDay(names) {
    const today = new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
        hash = (hash << 5) - hash + today.charCodeAt(i);
        hash |= 0;
    }
    return names[Math.abs(hash) % names.length];
}

/* §2 renderVocalistOfTheDay ──────────────────────────────────── */

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
                    <div class="votd-name-wrap" style="color: var(--${slug}-color);">
                        <span class="votd-star votd-star-1" data-svg="./src/assets/img/icons/votd-star.svg"></span>
                        <span class="votd-star votd-star-2" data-svg="./src/assets/img/icons/votd-star.svg"></span>
                        <span class="votd-star votd-star-3" data-svg="./src/assets/img/icons/votd-star.svg"></span>
                        <span class="votd-star votd-star-4" data-svg="./src/assets/img/icons/votd-star.svg"></span>
                        <span class="votd-name">${data.title}</span>
                    </div>
                    <div class="votd-img-wrap">
                        <img class="votd-img" src="${data.imageUrl}" alt="${data.title}" loading="lazy" />
                    </div>
                </a>
            `;
            container.querySelectorAll(".votd-star[data-svg]").forEach((wrap) => {
                if (typeof loadSVG === "function") {
                    loadSVG(wrap.dataset.svg, wrap);
                }
            });
        })
        .catch(() => {});
}
