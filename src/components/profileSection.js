/**
 * @file profileSection.js
 * @description Defines the <c-profile-section> custom element.
 *              Displays recently viewed vocalists from localStorage
 *              as quick-access cards.
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. CProfileSection class
 *     1a. connectedCallback — triggers render on mount
 *     1b. render            — builds the profile page HTML
 *  2. customElements.define
 */

class CProfileSection extends HTMLElement {
    /* 1a. connectedCallback ──────────────────────────────────── */

    connectedCallback() {
        this.render();
    }

    /* 1b. render ─────────────────────────────────────────────── */

    async render() {
        this.innerHTML = `
            <section class="profile-section">
                <h1 class="profile-title">PROFILE</h1>
                <div class="profile-favs"></div>
                <div class="profile-recent"></div>
            </section>
        `;

        const favContainer = this.querySelector(".profile-favs");
        const recentContainer = this.querySelector(".profile-recent");

        const favSlugs = typeof getFavorites === "function" ? getFavorites() : [];
        const favVocalists = favSlugs.length
            ? (await Promise.all(
                  favSlugs.map((slug) =>
                      fetch(`./src/json/vocals/${slug}.json`)
                          .then((r) => r.json())
                          .then((data) => ({ slug, title: data.title, imageUrl: data.imageUrl }))
                          .catch(() => null),
                  ),
              )).filter(Boolean)
            : [];

        if (favVocalists.length) {
            favContainer.innerHTML = `
                <p class="profile-fav-label">⭐ FAVORITES</p>
                <div class="profile-fav-list">
                    ${favVocalists
                        .map(
                            (v) => `
                        <a class="profile-fav-card" href="#${v.slug}" style="--accent: var(--${v.slug}-color);">
                            <span class="profile-fav-name">${v.title}</span>
                            <img class="profile-fav-img" src="${v.imageUrl}" alt="${v.title}" loading="lazy" />
                        </a>
                    `,
                        )
                        .join("")}
                </div>
                <hr class="profile-divider">
            `;
        }

        const recent = JSON.parse(localStorage.getItem("recentVocalists") || "[]");
        if (recent.length === 0) {
            recentContainer.innerHTML = `<p class="profile-empty">No recent vocalists yet. Start exploring!</p>`;
            return;
        }

        const recentVocalists = (await Promise.all(
            recent.map((slug) =>
                fetch(`./src/json/vocals/${slug}.json`)
                    .then((r) => r.json())
                    .then((data) => ({ slug, title: data.title, imageUrl: data.imageUrl }))
                    .catch(() => null),
            ),
        )).filter(Boolean);

        if (recentVocalists.length === 0) {
            recentContainer.innerHTML = `<p class="profile-empty">No recent vocalists yet.</p>`;
            return;
        }

        recentContainer.innerHTML = `
            <p class="profile-recent-label">RECENTLY VIEWED</p>
            <div class="profile-recent-list">
                ${recentVocalists
                    .map(
                        (v) => `
                    <a class="profile-recent-card" href="#${v.slug}" style="--accent: var(--${v.slug}-color);">
                        <span class="profile-recent-name">${v.title}</span>
                        <img class="profile-recent-img" src="${v.imageUrl}" alt="${v.title}" loading="lazy" />
                    </a>
                `,
                    )
                    .join("")}
            </div>
        `;
    }
}

/* §2 customElements.define ──────────────────────────────────── */

customElements.define("c-profile-section", CProfileSection);
