class CNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav class="navbar">
            <div class="virtual-singers-button-container">
                <button class="virtual-singers-button miku-button" data-page="miku">MIKU</button>
                <button class="virtual-singers-button teto-button" data-page="teto">TETO</button>
                <button class="virtual-singers-button neru-button" data-page="neru">NERU</button>
                <button class="virtual-singers-button gumi-button" data-page="gumi">GUMI</button>
                <button class="virtual-singers-button luka-button" data-page="luka">LUKA</button>
                <button class="virtual-singers-button rin-len-button" data-page="rin-len">RIN/LIN</button>
                <button class="virtual-singers-button yixi-button" data-page="yixi">YI-XI</button>
            </div>

            <div class="other-buttons-container">
                <button class="theme-button" data-page="theme-changer">
                    <svg class="theme-changer-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2v2"/>
                        <path d="M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715"/>
                        <path d="M16 12a4 4 0 0 0-4-4"/>
                        <path d="m19 5-1.256 1.256"/>
                        <path d="M20 12h2"/>
                    </svg>
                </button>
                <button class="other-button" data-page="about">ABOUT</button>
            </div>
        `;

        this.addEventListener("click", (event) => {
            const button = event.target.closest("button[data-page]");
            if (!button) return;

            this.querySelectorAll("button[data-page]").forEach((btn) =>
                btn.classList.remove("active-button"),
            );
            button.classList.add("active-button");

            if (typeof playButtonSound === "function") {
                playButtonSound(button.dataset.page);
            }
            if (typeof checkClickedButton === "function") {
                checkClickedButton(button.dataset.page);
            }
        });
    }
}

customElements.define("c-navbar", CNavbar);
