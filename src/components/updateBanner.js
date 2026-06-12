class CUpdateBanner extends HTMLElement {
    connectedCallback() {
        const message = this.getAttribute("message") || "A new version of VocaWeb is available.";
        this.innerHTML = `
            <div class="update-banner">
                <span class="update-banner-message">${message}</span>
                <div class="update-banner-actions">
                    <button class="update-banner-btn primary" data-action="update">UPDATE</button>
                    <button class="update-banner-btn" data-action="dismiss">LATER</button>
                </div>
            </div>
        `;

        this.querySelector("[data-action='update']").addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("update-action", { detail: "update" }));
            this.close();
        });

        this.querySelector("[data-action='dismiss']").addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("update-action", { detail: "dismiss" }));
            this.close();
        });
    }

    close() {
        const banner = this.querySelector(".update-banner");
        banner.classList.add("closing");
        setTimeout(() => this.remove(), 200);
    }
}

customElements.define("c-update-banner", CUpdateBanner);
