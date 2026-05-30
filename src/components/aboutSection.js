/**
 * @file aboutSection.js
 * @description Defines the <c-about-section> custom element.
 *              Renders static content: project info, credits, disclaimer,
 *              and contact links. Update the HTML below to edit any of these.
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. CAboutSection class
 *     1a. connectedCallback — renders the about page HTML
 *  2. customElements.define
 *
 * Contributing
 * ------------
 *  To add yourself to the credits, add a <p> entry under the CREDITS <h1>.
 *  Keep the format consistent: ROLE: DESCRIPTION: <a href="...">Name</a>
 */

/* §1 CAboutSection ──────────────────────────────────────────── */

class CAboutSection extends HTMLElement {
    /* §1a connectedCallback ─────────────────────────────────── */

    connectedCallback() {
        this.innerHTML = `
        <section class="about-section">
            <h1>About This Site</h1>
            <p>This website is a open-source, community-driven project dedicated to showcasing the music and information about various vocaloid characters. and having a one place to share your favorite vocaloids and their music.</p>
            <p>The site was created using HTML, CSS, and JavaScript, and it features a custom design inspired by the aesthetics of vocaloid culture. The content is sourced from publicly available information and fan contributions.</p>
            <p>This project was created by NeoVoid and is maintained by a community of volunteers.</p>
            <p>We hope you enjoy exploring the world of vocaloids through this site!</p>

            <h1>CREDITS</h1>
            <p>VOCALOID WIKI: FOR THE METADATA: <a href="https://vocaloid.fandom.com/">Vocaloid Wiki</a></p>
            <p>VIAMLION: FOR YI XI's DATA: <a href="https://vimalion.pro/">vimalion</a></p>
            <p>YOUTUBE: FOR THE MUSIC: <a href="https://www.youtube.com/">YouTube</a></p>
            <p>LUCIDE: FOR THE ICONS: <a href="https://lucide.dev/">Lucide</a></p>

            <h1>DISCLAIMER</h1>
            <p>All content on this site is for informational and entertainment purposes only. We do not claim ownership of any of the music, images, or information presented here. All rights belong to their respective creators and copyright holders.</p>
            <p>We do not host any of the music only the images; we simply provide links to publicly available content. If you are a copyright holder and have any concerns about the content on this site, please contact us and we will address the issue promptly.</p>

            <h1>CONTACTS</h1>
            <p>MY GITHUB: <a href="https://github.com/ItsFoxCrafter">NeoVoid(aka. ItsFoxCrafter)</a></p>
        </section>
        `;
    }
}

/* §2 customElements.define ──────────────────────────────────── */

customElements.define("c-about-section", CAboutSection);
