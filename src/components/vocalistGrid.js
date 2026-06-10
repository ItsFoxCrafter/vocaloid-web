const vocalistCache = { names: null, vocalists: null };

class CVocalistGrid extends HTMLElement {
    set data(category) {
        this.category = category;
        this.allVocalists = [];
        this.mode = "square";
        this.render();
    }

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

    async fetchNames() {
        if (vocalistCache.names) return vocalistCache.names;
        const res = await fetch("./src/json/vocaloidNames.json");
        if (!res.ok) throw new Error("Failed to load vocaloidNames.json");
        vocalistCache.names = await res.json();
        return vocalistCache.names;
    }

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
                    songCount = music.length || 0;
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

    filterByCategory(vocalists) {
        if (this.category === "all") return vocalists;
        return vocalists.filter((v) => v.type === this.category);
    }

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

customElements.define("c-vocalist-grid", CVocalistGrid);
