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
                <div class="profile-recent"></div>
            </section>
        `;

        const recent = JSON.parse(localStorage.getItem("recentVocalists") || "[]");
        const container = this.querySelector(".profile-recent");

        if (recent.length === 0) {
            container.innerHTML = `<p class="profile-empty">No recent vocalists yet. Start exploring!</p>`;
            return;
        }

        const vocalists = await Promise.all(
            recent.map((slug) =>
                fetch(`./src/json/vocals/${slug}.json`)
                    .then((r) => r.json())
                    .then((data) => ({ slug, title: data.title, imageUrl: data.imageUrl }))
                    .catch(() => null),
            ),
        );

        const valid = vocalists.filter(Boolean);
        if (valid.length === 0) {
            container.innerHTML = `<p class="profile-empty">No recent vocalists yet.</p>`;
            return;
        }

        container.innerHTML = `
            <p class="profile-recent-label">RECENTLY VIEWED</p>
            <div class="profile-recent-list">
                ${valid
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
