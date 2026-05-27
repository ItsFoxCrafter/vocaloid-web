class CMusicSection extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <section class= "music-section">
                <div class="search-container">
                    <input id="searchBar" placeholder="Search for music...">
                    <button id="searchButton">search</button>
                </div>
                <div id="musicOutputContainer">
                    <h2>HOW BOUT YOU SEARCH FOR SOMETHING?..</h2>
                </div>
            </section>
        `;
    }
}

customElements.define("c-music-section", CMusicSection);
