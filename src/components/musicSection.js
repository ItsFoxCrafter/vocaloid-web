/**
 * @file musicSection.js
 * @description Defines the <c-music-section> custom element.
 *              Renders the search bar and the output container that
 *              musicHandler.js populates with song cards.
 *
 * Note: #musicOutputContainer is the injection target for readMusicJSONFile().
 *       Do not rename or remove it without updating musicHandler.js.
 */

class CMusicSection extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <section class="music-section">
                <div class="search-container">
                    <input id="searchBar" placeholder="Search for music...">
                    <button id="searchButton">
                        <img class="theme-changer-icon" src="./src/assets/img/icons/search.svg" alt="Search">
                    </button>
                </div>
                <div id="musicOutputContainer">
                    <h2>HOW BOUT YOU SEARCH FOR SOMETHING?..</h2>
                </div>
            </section>
        `;
    }
}

customElements.define("c-music-section", CMusicSection);
