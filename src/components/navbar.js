class CNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav class="navbar">
            <div class="virtual-singers-button-container">
                <button class="virtual-singers-button miku-button" data-page="miku">MIKU</button>
                <button class="virtual-singers-button teto-button" data-page="teto">TETO</button>
                <button class="virtual-singers-button neru-button" data-page="neru">NERU</button>
                <button class="virtual-singers-button gumi-button" data-page="gumi">GUMI</button>
            </div>

            <div class="other-buttons-container">
                <button class="other-button" data-page="settings">SETTINGS</button>
                <button class="other-button" data-page="about">ABOUT</button>
            </div>
        `;

        const buttons = this.querySelectorAll("button[data-page]");
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                buttons.forEach((btn) => btn.classList.remove("active-button"));
                button.classList.add("active-button");
                if (typeof playButtonSound === "function") {
                    playButtonSound(button.dataset.page);
                }
                if (typeof renderPage === "function") {
                    renderPage(button.dataset.page);
                }
            });
        });
    }
}

customElements.define("c-navbar", CNavbar);
