class CShareModal extends HTMLElement {
    set data({ title, description, imageUrl, page }) {
        const URL = `${window.location.origin}${window.location.pathname}#${page}`;

        this.innerHTML = `
            <div class="share-overlay">
                <div class="share-modal">
                    <div class="share-modal-header">
                        <span class="share-modal-title">SHARE</span>
                        <button class="share-close-btn" aria-label="Close share modal">&times;</button>
                    </div>
                    <div class="share-preview">
                        <div class="share-preview-img-wrapper">
                            <img class="share-preview-img" src="${imageUrl}" alt="${title}" loading="lazy" />
                        </div>
                        <div class="share-preview-body">
                            <span class="share-preview-site">VocaWeb</span>
                            <strong class="share-preview-title">${title}</strong>
                            <p class="share-preview-desc">${description || ""}</p>
                            <span class="share-preview-url">${URL}</span>
                        </div>
                    </div>
                    <div class="share-modal-actions">
                        <button class="share-action-btn share-copy-btn">COPY LINK</button>
                        <button class="share-action-btn share-native-btn">SHARE</button>
                    </div>
                </div>
            </div>
        `;

        const close = () => {
            const overlay = this.querySelector(".share-overlay");
            const modal = this.querySelector(".share-modal");
            overlay.classList.add("closing");
            modal.classList.add("closing");
            setTimeout(() => this.remove(), 150);
        };

        this.querySelector(".share-close-btn").addEventListener("click", close);
        this.querySelector(".share-overlay").addEventListener("click", (e) => {
            if (e.target === e.currentTarget) close();
        });

        this.querySelector(".share-copy-btn").addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(URL);
                const BTN = this.querySelector(".share-copy-btn");
                BTN.textContent = "COPIED!";
                setTimeout(() => BTN.textContent = "COPY LINK", 2000);
            } catch {
                const BTN = this.querySelector(".share-copy-btn");
                BTN.textContent = "FAILED";
                setTimeout(() => BTN.textContent = "COPY LINK", 2000);
            }
        });

        this.querySelector(".share-native-btn").addEventListener("click", async () => {
            if (navigator.share) {
                try {
                    await navigator.share({ title, text: description || title, url: URL });
                } catch { /* user cancelled */ }
            } else {
                try {
                    await navigator.clipboard.writeText(URL);
                    const BTN = this.querySelector(".share-native-btn");
                    BTN.textContent = "LINK COPIED!";
                    setTimeout(() => BTN.textContent = "SHARE", 2000);
                } catch {
                    const BTN = this.querySelector(".share-native-btn");
                    BTN.textContent = "FAILED";
                    setTimeout(() => BTN.textContent = "SHARE", 2000);
                }
            }
        });
    }
}

customElements.define("c-share-modal", CShareModal);
