class CHeroSection extends HTMLElement {
    set data({ title, description, imageUrl }) {
        this.innerHTML = `
        <section class="hero-section">
            <h1 class="hero-title">${title}</h1>
            <p class="hero-description">${description}</p>
            <img src="${imageUrl}" alt="${title}" class="hero-image" />
        </section>
        `;
    }
}

customElements.define("c-hero-section", CHeroSection);
