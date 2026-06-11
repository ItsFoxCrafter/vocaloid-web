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
        this.innerHTML = `
        <section class="hero-section">
            <div class="hero-text">
                <div class="hero-title-row">
                    <h1 class="hero-title" style="color: var(--${page}-color);">${title}</h1>
                    <button class="hero-share-btn" aria-label="Share ${title}">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                            <polyline points="16 6 12 2 8 6"/>
                            <line x1="12" y1="2" x2="12" y2="15"/>
                        </svg>
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

        this.querySelector(".hero-share-btn").addEventListener("click", () => {
            const MODAL = document.createElement("c-share-modal");
            MODAL.data = { title, description, imageUrl, page };
            document.body.appendChild(MODAL);
        });
    }
}

/* §2 customElements.define ──────────────────────────────────── */

customElements.define("c-hero-section", CHeroSection);
