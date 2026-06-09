class CNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav class="navbar">
            <div class="category-buttons-container">
                <button class="other-button" data-page="all">ALL</button>
                <button class="other-button" data-page="vocaloid">VOCALOID</button>
                <button class="other-button" data-page="utau">UTAU</button>
                <button class="other-button" data-page="vsynth">VSYNTH</button>
                <button class="other-button" data-page="other">OTHER</button>
            </div>

            <div class="other-buttons-container">

                <button class="sound-button" data-action="sound-toggle" title="Sound on">
                    <svg class="sound-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
                        <path d="M16 9a5 5 0 0 1 0 6"/>
                        <path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>
                    </svg>
                </button>

                <button class="theme-button" data-action="theme-toggle" title="Toggle theme">
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

        if (typeof initSoundButton === "function") initSoundButton();

        this.addEventListener("click", (event) => {
            const button = event.target.closest("button");
            if (!button) return;

            if (button.dataset.action === "sound-toggle") {
                if (typeof toggleSound === "function") toggleSound();
                return;
            }

            if (button.dataset.action === "theme-toggle") {
                if (typeof changeTheme === "function") changeTheme();
                return;
            }

            if (button.dataset.page) {
                this.querySelectorAll("button[data-page]").forEach((btn) =>
                    btn.classList.remove("active-button"),
                );
                button.classList.add("active-button");

                if (typeof playButtonSound === "function") {
                    playButtonSound(button.dataset.page);
                }
                window.location.hash = button.dataset.page;
            }
        });
    }
}

customElements.define("c-navbar", CNavbar);
