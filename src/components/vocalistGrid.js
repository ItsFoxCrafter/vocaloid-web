/**
 * @file vocalistGrid.js
 * @description Defines the <c-vocalist-grid> custom element.
 *              Renders the category grid with search filtering,
 *              square/list mode toggle, and skeleton loading.
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. CVocalistGrid class
 *     1a. data setter
 *     1b. render           — orchestrates skeleton, fetch, and render
 *     1c. renderSkeleton   — shows shimmer placeholders
 *     1d. fetchNames       — loads vocaloidNames.json
 *     1e. fetchAllVocalistData — loads all vocalist bios + song counts
 *     1f. filterByCategory — filters by grid category
 *     1g. renderGrid       — builds the grid HTML
 *     1h. attachToggleHandler — square/list mode switching
 *     1i. attachSearchHandler  — real-time search filtering
 *     1j. attachCardHandlers   — click navigation
 *  2. customElements.define
 */

const vocalistCache = { names: null, vocalists: null };

class CVocalistGrid extends HTMLElement {
    set data(category) {
        this.category = category;
        this.allVocalists = [];
        this.mode = "square";
        this.render();
    }

    /* 1b. render ─────────────────────────────────────────────── */

    async render() {
        this.renderSkeleton();
        try {
            const names = await this.fetchNames();
            this.allVocalists = await this.fetchAllVocalistData(names);
            this.renderGrid(this.allVocalists);
            this.attachSearchHandler();
            this.attachToggleHandler();
            this.attachCardHandlers();
        } catch (err) {
            console.error(err);
            this.innerHTML = "";
            if (typeof generateError === "function") generateError(this.category, err);
        }
    }

    /* 1c. renderSkeleton ─────────────────────────────────────── */

    renderSkeleton() {
        this.innerHTML = `
            <div class="vocalist-grid-container skeleton-grid">
                <div class="vocalist-search">
                    <input class="vocalist-search-input" type="text" placeholder="Search vocalists..." disabled />
                </div>
                <div class="vocalist-mode-toggle">
                    <button class="mode-btn mode-btn-square active">SQUARE</button>
                    <button class="mode-btn mode-btn-list">LIST</button>
                </div>
                <div class="vocalist-grid mode-square">
                    ${Array.from({ length: 8 })
                        .map(
                            () => `
                        <div class="vocalist-card skeleton-card">
                            <div class="skeleton skeleton-img"></div>
                            <div class="skeleton skeleton-name"></div>
                        </div>
                    `,
                        )
                        .join("")}
                </div>
            </div>
        `;
    }

    /* 1d. fetchNames ─────────────────────────────────────────── */

    async fetchNames() {
        if (vocalistCache.names) return vocalistCache.names;
        const res = await fetch("./src/json/vocaloidNames.json");
        if (!res.ok) throw new Error("Failed to load vocaloidNames.json");
        vocalistCache.names = await res.json();
        return vocalistCache.names;
    }

    /* 1e. fetchAllVocalistData ───────────────────────────────── */

    async fetchAllVocalistData(names) {
        if (vocalistCache.vocalists) return vocalistCache.vocalists;
        const results = await Promise.allSettled(
            names.map(async (slug) => {
                const [vocRes, musicRes] = await Promise.all([
                    fetch(`./src/json/vocals/${slug}.json`),
                    fetch(`./src/json/ytmusic/${slug}Music.json`),
                ]);
                if (!vocRes.ok) return null;
                const data = await vocRes.json();
                let songCount = 0;
                if (musicRes.ok) {
                    const music = await musicRes.json();
                    songCount = (music.songs && music.songs.length) || 0;
                }
                return {
                    slug,
                    title: data.title,
                    type: data.type,
                    imageUrl: data.imageUrl,
                    songCount,
                };
            }),
        );
        vocalistCache.vocalists = results
            .filter((r) => r.status === "fulfilled" && r.value)
            .map((r) => r.value);
        return vocalistCache.vocalists;
    }

    /* 1f. filterByCategory ───────────────────────────────────── */

    filterByCategory(vocalists) {
        if (this.category === "all") return vocalists;
        return vocalists.filter((v) => v.type === this.category);
    }

    /* 1g. renderGrid ─────────────────────────────────────────── */

    renderGrid(vocalists) {
        const filtered = this.filterByCategory(vocalists);

        this.innerHTML = `
            <div class="vocalist-grid-container">
                <div class="vocalist-search">
                    <input class="vocalist-search-input" type="text" placeholder="Search vocalists..." />
                </div>
                <div class="vocalist-mode-toggle">
                    <button class="mode-btn mode-btn-square active" data-mode="square">SQUARE</button>
                    <button class="mode-btn mode-btn-list" data-mode="list">LIST</button>
                </div>
                <div class="vocalist-grid mode-${this.mode}">
                    ${filtered
                        .map(
                            (v) => `
                        <div class="vocalist-card" data-page="${v.slug}" style="--accent: var(--${v.slug}-color);">
                            <img class="vocalist-card-img" src="${v.imageUrl}" alt="${v.title}" loading="lazy" />
                            <span class="vocalist-card-name">${v.slug.toUpperCase()}</span>
                            <span class="vocalist-card-count">${v.songCount} songs</span>
                        </div>
                    `,
                        )
                        .join("")}
                </div>
            </div>
        `;
    }

    /* 1h. attachToggleHandler ────────────────────────────────── */

    attachToggleHandler() {
        const btns = this.querySelectorAll(".mode-btn");
        btns.forEach((btn) => {
            btn.addEventListener("click", () => {
                btns.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                this.mode = btn.dataset.mode;

                const grid = this.querySelector(".vocalist-grid");
                grid.className = `vocalist-grid mode-${this.mode}`;
            });
        });
    }

    /* 1i. attachSearchHandler ────────────────────────────────── */

    attachSearchHandler() {
        const input = this.querySelector(".vocalist-search-input");
        if (!input) return;

        input.addEventListener("input", () => {
            const query = input.value.toLowerCase().trim();
            const filtered = this.allVocalists.filter(
                (v) =>
                    v.slug.includes(query) ||
                    v.title.toLowerCase().includes(query),
            );
            const grid = this.querySelector(".vocalist-grid");
            const categoryFiltered = this.filterByCategory(filtered);

            grid.innerHTML = categoryFiltered
                .map(
                    (v) => `
                <div class="vocalist-card" data-page="${v.slug}" style="--accent: var(--${v.slug}-color);">
                    <img class="vocalist-card-img" src="${v.imageUrl}" alt="${v.title}" loading="lazy" />
                    <span class="vocalist-card-name">${v.slug.toUpperCase()}</span>
                    <span class="vocalist-card-count">${v.songCount} songs</span>
                </div>
            `,
                )
                .join("");

            this.attachCardHandlers();
        });
    }

    /* 1j. attachCardHandlers ─────────────────────────────────── */

    attachCardHandlers() {
        this.querySelectorAll(".vocalist-card").forEach((card) => {
            card.addEventListener("click", () => {
                const page = card.dataset.page;
                if (!page) return;

                window.location.hash = page;
            });
        });
    }
}

/* §2 customElements.define ──────────────────────────────────── */

customElements.define("c-vocalist-grid", CVocalistGrid);
