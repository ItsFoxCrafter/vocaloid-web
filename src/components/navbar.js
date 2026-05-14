class CNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav class="navbar">
            <div class="virtual-singers-button-container">
                <button class="virtual-singers-button miku-button" onclick="">MIKU</button>
                <button class="virtual-singers-button teto-button" onclick="">TETO</button>
                <button class="virtual-singers-button neru-button" onclick="">NERU</button>
                <button class="virtual-singers-button gumi-button" onclick="">GUMI</button>
            </div>

            <div class="other-buttons-container">
                <button class="other-button" onclick="">SETTINGS</button>
                <button class="other-button" onclick="">ABOUT</button>
            </div>
        `;
    }
}

customElements.define("c-navbar", CNavbar);
