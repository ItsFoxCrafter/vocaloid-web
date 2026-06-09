class CVocalistGrid extends HTMLElement {
    set data(category) {
        this.category = category;
        this.allVocalists = [];
        this.mode = "square";
        this.render();
    }

    async render() {
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

    async fetchNames() {
        const res = await fetch("./src/json/vocaloidNames.json");
        if (!res.ok) throw new Error("Failed to load vocaloidNames.json");
        return res.json();
    }

    async fetchAllVocalistData(names) {
        const results = await Promise.allSettled(
            names.map(async (slug) => {
                const res = await fetch(`./src/json/vocals/${slug}.json`);
                if (!res.ok) return null;
                const data = await res.json();
                return {
                    slug,
                    title: data.title,
                    type: data.type,
                    imageUrl: data.imageUrl,
                };
            }),
        );
        return results
            .filter((r) => r.status === "fulfilled" && r.value)
            .map((r) => r.value);
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
