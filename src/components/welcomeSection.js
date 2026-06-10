/**
 * @file welcomeSection.js
 * @description Defines the <c-welcome-section> custom element.
 *              Renders the landing screen shown before any vocalist is selected.
 *              The animated dots use each vocalist's brand color from global.css.
 *
 * To update the welcome copy, edit the strings inside connectedCallback below.
 * To add a new vocalist dot, add a <span class="dot dot-<slug>"></span>
 * and a matching .dot-<slug> rule in global.css.
 */

class CWelcomeSection extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="welcome-section">
                <p class="welcome-eyebrow">VOCAWEB</p>
                <h1 class="welcome-title">
                    CHOOSE YOUR<br /><span class="welcome-highlight">VIRTUAL SINGER</span>
                </h1>
                <p class="welcome-subtitle">
                    Select a type from the nav to explore their world
                </p>
                <p class="welcome-disclaimer">
                    WARNING SOUNDS MAY PLAY AUTOMATICALLY ON SOME PAGES
                </p>
                <div class="welcome-votd"></div>
                <button class="welcome-surprise-btn">SURPRISE ME</button>
                <div class="welcome-dots"></div>
                <div class="welcome-recent"></div>
            </div>
        `;

        this.querySelector(".welcome-surprise-btn").addEventListener("click", async () => {
            try {
                const res = await fetch("./src/json/vocaloidNames.json");
                const names = await res.json();
                const randomSlug = names[Math.floor(Math.random() * names.length)];
                window.location.hash = randomSlug;
            } catch (err) {
                console.error(err);
            }
        });
    }
}

customElements.define("c-welcome-section", CWelcomeSection);
