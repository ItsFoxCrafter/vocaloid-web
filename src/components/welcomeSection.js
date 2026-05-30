class CWelcomeSection extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="welcome-section">
                <p class="welcome-eyebrow">VOCAWEB</p>
                <h1 class="welcome-title">
                    YOUR FAVORITE<br /><span class="welcome-highlight"
                        >VIRTUAL SINGER</span
                    >
                </h1>
                <p class="welcome-subtitle">
                    Select a vocalist from the nav to explore their world
                </p>
                <div class="welcome-dots">
                    <span class="dot dot-miku"></span>
                    <span class="dot dot-teto"></span>
                    <span class="dot dot-neru"></span>
                    <span class="dot dot-gumi"></span>
                    <span class="dot dot-luka"></span>
                    <span class="dot dot-rin-len"></span>
                    <span class="dot dot-yixi"></span>
                </div>
            </div>
        `;
    }
}

customElements.define("c-welcome-section", CWelcomeSection);
