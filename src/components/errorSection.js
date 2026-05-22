class ErrorSection extends HTMLElement {
    set data({ title, description }) {
        this.innerHTML = `
        <section class="error-section">
            <h1 class="error-title">ERROR</h1>
            <h1 class="error-subtitle">${title}</h1>
            <p class="error-description">${description}</p>
        </section>
        `;
    }
}

customElements.define("c-error-section", ErrorSection);
