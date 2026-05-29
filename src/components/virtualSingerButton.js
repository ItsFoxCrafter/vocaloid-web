class CVirtualSingerButton extends HTMLElement {
    set data(singerName) {
        this.innerHTML = `
        <button class="virtual-singers-button ${singerName}-button" data-page="${singerName}">${singerName.toUpperCase()}</button>
        `;
    }
}

customElements.define("c-virtual-singer-button", CVirtualSingerButton);
