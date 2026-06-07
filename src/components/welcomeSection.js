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
                <p class="welcome-disclaimer"></p>
                    WARNING SOUNDS MAY PLAY AUTOMATICALLY ON SOME PAGES
                </p>
                <div class="welcome-dots">
                </div>
            </div>
        `;
    }
}

customElements.define("c-welcome-section", CWelcomeSection);
