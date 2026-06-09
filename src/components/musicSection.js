/**
 * @file musicSection.js
 * @description Defines the <c-music-section> custom element.
 *              Renders the search bar, sort controls, count badge,
 *              and the output container that musicHandler.js populates.
 *
 * Note: #musicOutputContainer is the injection target for readMusicJSONFile().
 *       Do not rename or remove it without updating musicHandler.js.
 */

class CMusicSection extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <section class="music-section">
                <div class="music-controls">
                    <div class="search-container">
                        <input id="searchBar" placeholder="Search for music, artist or album..." />
                        <span class="music-count"></span>
                    </div>
                    <div class="sort-container">
                        <select id="sortSelect">
                            <option value="newest-desc">Newly Added</option>
                            <option value="newest-asc">Oldest First</option>
                            <option value="title-asc">Title A-Z</option>
                            <option value="title-desc">Title Z-A</option>
                            <option value="artist-asc">Artist A-Z</option>
                            <option value="artist-desc">Artist Z-A</option>
                            <option value="album-asc">Album A-Z</option>
                            <option value="album-desc">Album Z-A</option>
                        </select>
                    </div>
                </div>
                <div id="musicOutputContainer">
                    <h2>HOW BOUT YOU SEARCH FOR SOMETHING?..</h2>
                </div>
            </section>
        `;
    }
}

customElements.define("c-music-section", CMusicSection);
