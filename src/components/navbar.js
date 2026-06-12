/**
 * @file navbar.js
 * @description Defines the <c-navbar> custom element.
 *              Renders the top navigation bar with category buttons,
 *              theme toggle, sound toggle, and about link.
 *              Handles click routing to pageRenderer.js.
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. CNavbar class
 *     1a. connectedCallback — renders HTML, attaches click handlers
 *  2. customElements.define
 */

class CNavbar extends HTMLElement {
    /* 1a. connectedCallback ───────────────────────────────────── */

    connectedCallback() {
        this.innerHTML = `
        <nav class="navbar">
        <div class="category-buttons-container">
                <button class="other-button" data-page="profile">PROFILE</button>
                <button class="other-button" data-page="all">ALL</button>
                <button class="other-button" data-page="vocaloid">VOCALOID</button>
                <button class="other-button" data-page="utau">UTAU</button>
                <button class="other-button" data-page="vsynth">VSYNTH</button>
                <button class="other-button" data-page="other">OTHER</button>
            </div>

            <div class="other-buttons-container">
                <span class="offline-indicator" title="You are offline">OFFLINE</span>

                <button class="dice-button" data-action="surprise" title="Surprise me!" aria-label="Random vocalist">
                    <span class="icon-wrap dice-icon" data-svg="./src/assets/img/icons/dice.svg"></span>
                </button>

                <button class="sound-button" data-action="sound-toggle" title="Sound on" aria-label="Toggle sound">
                    <span class="icon-wrap sound-icon" data-svg="./src/assets/img/icons/sound.svg"></span>
                </button>

                <button class="theme-button" data-action="theme-toggle" title="Toggle theme" aria-label="Toggle theme">
                    <span class="icon-wrap theme-changer-icon" data-svg="./src/assets/img/icons/sun-moon.svg"></span>
                </button>

                <button class="other-button" data-page="about">ABOUT</button>
            </div>
        `;

        if (typeof initSoundButton === "function") initSoundButton();

        this.querySelectorAll(".icon-wrap[data-svg]").forEach((wrap) => {
            if (typeof loadSVG === "function") loadSVG(wrap.dataset.svg, wrap);
        });

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

            if (button.dataset.action === "surprise") {
                fetch("./src/json/vocaloidNames.json")
                    .then((r) => r.json())
                    .then((names) => {
                        const slug = names[Math.floor(Math.random() * names.length)];
                        window.location.hash = slug;
                    })
                    .catch(() => {});
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

/* §2 customElements.define ──────────────────────────────────── */

customElements.define("c-navbar", CNavbar);
