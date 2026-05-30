/**
 * @file navbar.js
 * @description Defines the <c-navbar> custom element.
 *              Renders the top navigation bar and handles all button click
 *              routing via a single delegated event listener.
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. CNavbar class
 *     1a. connectedCallback  — renders the navbar HTML
 *     1b. click listener     — handles active state and routing
 *  2. customElements.define
 *
 * Dependencies
 * ------------
 *  - playButtonSound()    (soundHandler.js)
 *  - checkClickedButton() (pageRenderer.js)
 *  - <c-virtual-singer-button> elements are injected by navbarButtonRenderer.js
 *
 * Note on button population
 * --------------------------
 *  The .virtual-singers-button-container is intentionally left empty here.
 *  navbarButtonRenderer.js fills it dynamically from vocaloidNames.json,
 *  so new vocalists only need a JSON entry — no HTML changes required.
 */

/* §1 CNavbar ────────────────────────────────────────────────── */

class CNavbar extends HTMLElement {
    /* §1a connectedCallback ─────────────────────────────────── */

    connectedCallback() {
        this.innerHTML = `
        <nav class="navbar">
            <!-- vocalist buttons are injected here by navbarButtonRenderer.js -->
            <div class="virtual-singers-button-container"></div>

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

        /* §1b click listener ────────────────────────────────── */

        // single delegated listener handles all buttons inside the navbar
        this.addEventListener("click", (event) => {
            const button = event.target.closest("button[data-page]");
            if (!button) return;

            // deactivate all buttons, then activate the clicked one
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

/* §2 customElements.define ──────────────────────────────────── */

customElements.define("c-navbar", CNavbar);
