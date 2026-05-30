/**
 * @file errorSection.js
 * @description Defines the <c-error-section> custom element.
 *              Displays a random vocalist sign image alongside an error title
 *              and description. Data is provided by errorHandler.js.
 *
 * Expected data shape
 * --------------------
 *  {
 *    title:       string — random error heading from error.json
 *    description: string — details about what failed and why
 *    vocal:       string — vocalist slug used to pick the sign image
 *  }
 */

class ErrorSection extends HTMLElement {
    set data({ title, description, vocal }) {
        this.innerHTML = `
        <section class="error-section">
            <img class="error-img" src="./src/assets/img/signs/sign-${vocal}.png" alt="${vocal} error sign">
            <h1 class="error-title">ERROR</h1>
            <h1 class="error-subtitle">${title}</h1>
            <p class="error-description">${description}</p>
        </section>
        `;
    }
}

customElements.define("c-error-section", ErrorSection);
