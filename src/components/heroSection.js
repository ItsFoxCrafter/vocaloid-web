class CHeroSection extends HTMLElement {
    set data({
        title,
        codename,
        subtitle,
        date,
        description,
        imageUrl,
        page,
        imageDividerUrl,
    }) {
        const titleClass = page ? `hero-title ${page}-title` : "hero-title";

        this.innerHTML = `
        <section class="hero-section">
            <div class="hero-text">
                <h1 class="${titleClass}">${title}</h1>
                <h2 class="hero-description">${description}</h2>
                <div class="hero-meta">
                    <h4 class="hero-codename">${codename}</h4>
                    <h4 class="hero-subtitle">${subtitle}</h4>
                    <h4 class="hero-date">${date}</h4>
                </div>
            </div>
            <img src="${imageUrl}" alt="${title}" class="hero-image" />
        </section>
        <div class="divider" style="background-image: url('${imageDividerUrl}')"></div>
        `;
    }
}

customElements.define("c-hero-section", CHeroSection);
