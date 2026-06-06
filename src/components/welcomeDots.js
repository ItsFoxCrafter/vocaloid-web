class CWelcomeDots extends HTMLElement {
    set data({ name }) {
        this.innerHTML = `
            <span class="dot dot-${name}"></span>
        `;
    }
}

customElements.define("c-welcome-dots", CWelcomeDots);
