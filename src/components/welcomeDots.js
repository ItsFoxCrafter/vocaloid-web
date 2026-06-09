class CWelcomeDots extends HTMLElement {
    set data({ name }) {
        this.innerHTML = `
            <span class="dot dot-${name}" data-page="${name}"></span>
        `;
        this.querySelector(".dot").addEventListener("click", () => {
            window.location.hash = name;
        });
    }
}

customElements.define("c-welcome-dots", CWelcomeDots);
