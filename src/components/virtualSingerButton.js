/**
 * @file virtualSingerButton.js
 * @description Defines the <c-virtual-singer-button> custom element.
 *              Renders a single vocalist nav button. Created dynamically
 *              by navbarButtonRenderer.js — one instance per entry in
 *              vocaloidNames.json.
 *
 * Expected data
 * -------------
 *  singerName: string — vocalist slug (e.g. "miku", "rin-len")
 *  The slug is used for the button's CSS class, data-page attribute,
 *  and display label (uppercased automatically).
 */

class CVirtualSingerButton extends HTMLElement {
    set data(singerName) {
        this.innerHTML = `
        <button class="virtual-singers-button ${singerName}-button" data-page="${singerName}">
            ${singerName.toUpperCase()}
        </button>
        `;
    }
}

customElements.define("c-virtual-singer-button", CVirtualSingerButton);
