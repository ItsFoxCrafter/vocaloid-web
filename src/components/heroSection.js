/**
 * @file heroSection.js
 * @description Defines the <c-hero-section> custom element.
 *              Renders a vocalist's name, description, metadata, image,
 *              and their animated divider strip.
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. CHeroSection class
 *     1a. data setter  — receives vocalist data and renders the section
 *  2. customElements.define
 *
 * Expected data shape
 * --------------------
 *  {
 *    title:          string  — vocalist display name (e.g. "Hatsune Miku")
 *    codename:       string  — internal codename or voice bank name
 *    subtitle:       string  — short tagline or role
 *    date:           string  — release/debut date
 *    description:    string  — short bio shown as a heading
 *    imageUrl:       string  — path to the vocalist's main image
 *    page:           string  — slug used to apply the correct color class
 *    imageDividerUrl: string — path to the repeating divider strip image
 *  }
 */

/* §1 CHeroSection ───────────────────────────────────────────── */

class CHeroSection extends HTMLElement {
    /* §1a data setter ───────────────────────────────────────── */

    set data({
        title,
        codename,
        subtitle,
        date,
        description,
        imageUrl,
        page,
        imageDividerUrl,
        dykContent,
    }) {
        const isFav = typeof isFavorite === "function" && isFavorite(page);
        this.innerHTML = `
        <section class="hero-section">
            <div class="hero-text">
                <div class="hero-title-row">
                    <h1 class="hero-title" style="color: var(--${page}-color);">${title}</h1>
                    <button class="hero-fav-btn ${isFav ? "favorited" : ""}" data-slug="${page}" aria-label="${isFav ? "Remove from" : "Add to"} favorites">
                        <span class="icon-wrap star-icon" data-svg="./src/assets/img/icons/star.svg" data-fill="${isFav ? "currentColor" : "none"}"></span>
                    </button>
                    <button class="hero-share-btn" aria-label="Share ${title}">
                        <span class="icon-wrap share-icon" data-svg="./src/assets/img/icons/share.svg"></span>
                    </button>
                </div>
                <h2 class="hero-description">${description}</h2>
                <div class="hero-meta">
                    <div class="hero-meta-item">
                        <span class="hero-meta-label">CODE</span>
                        <span class="hero-meta-value">${codename}</span>
                    </div>
                    <div class="hero-meta-item">
                        <span class="hero-meta-label">ENGINE</span>
                        <span class="hero-meta-value">${subtitle}</span>
                    </div>
                    <div class="hero-meta-item">
                        <span class="hero-meta-label">RELEASED</span>
                        <span class="hero-meta-value">${date}</span>
                    </div>
                </div>
                <div class="did-you-know">
                    <h3>Did you know?</h3>
                    <p>${dykContent}</p>
                </div>
            </div>
            <div class="hero-image-wrap" style="border-color: var(--${page}-color);">
                <img src="${imageUrl}" alt="${title}" class="hero-image" />
            </div>
        </section>
        <div class="divider" style="background-image: url('${imageDividerUrl}')"></div>
        `;

        this.querySelectorAll(".icon-wrap[data-svg]").forEach((wrap) => {
            if (typeof loadSVG === "function") {
                loadSVG(wrap.dataset.svg, wrap);
                if (wrap.dataset.fill) {
                    const check = () => {
                        const svg = wrap.querySelector("svg");
                        if (svg) { svg.setAttribute("fill", wrap.dataset.fill); }
                        else { requestAnimationFrame(check); }
                    };
                    requestAnimationFrame(check);
                }
            }
        });

        this.querySelector(".hero-share-btn").addEventListener("click", () => {
            const MODAL = document.createElement("c-share-modal");
            MODAL.data = { title, description, imageUrl, page };
            document.body.appendChild(MODAL);
        });

        const favBtn = this.querySelector(".hero-fav-btn");
        if (favBtn) {
            favBtn.addEventListener("click", () => {
                if (typeof toggleFavorite === "function") {
                    const nowFav = toggleFavorite(page);
                    favBtn.classList.toggle("favorited", nowFav);
                    const star = favBtn.querySelector("svg");
                    if (star) star.setAttribute("fill", nowFav ? "currentColor" : "none");
                    favBtn.setAttribute("aria-label", (nowFav ? "Remove from" : "Add to") + " favorites");
                    favBtn.classList.remove("animate-fav");
                    void favBtn.offsetWidth;
                    favBtn.classList.add("animate-fav");
                }
            });
        }
    }
}

/* §2 customElements.define ──────────────────────────────────── */

customElements.define("c-hero-section", CHeroSection);
