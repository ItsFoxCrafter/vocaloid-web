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
            <div class="about-block">
                <h1>ABOUT THIS SITE</h1>
                <p>An open-source, community-driven project dedicated to Vocaloid music and virtual singers — a single place to discover, share, and explore your favorites.</p>
                <p>Built with plain HTML, CSS, and JavaScript. Designed with the aesthetics of Vocaloid culture in mind. Content sourced from publicly available information and fan contributions.</p>
                <p>Created by NeoVoid and maintained by a community of volunteers.</p>
            </div>

            <div class="about-block">
                <h1>CREDITS</h1>
                <p>VOCALOID WIKI — <a href="https://vocaloid.fandom.com/">Metadata &amp; references</a></p>
                <p>VIAMLION — <a href="https://vimalion.pro/">Yi Xi data</a></p>
                <p>YOUTUBE — <a href="https://www.youtube.com/">Music hosting</a></p>
                <p>LUCIDE — <a href="https://lucide.dev/">Open-source icons</a></p>
            </div>

            <div class="about-block">
                <h1>DISCLAIMER</h1>
                <p>All content is for informational and entertainment purposes only. We do not claim ownership of any music, images, or information presented. All rights belong to their respective creators and copyright holders.</p>
                <p>We do not host any media files — only links to publicly available content. If you are a copyright holder with concerns, please reach out and we will address them promptly.</p>
            </div>

            <div class="about-block">
                <h1>CONTACT</h1>
                <p>GitHub — <a href="https://github.com/ItsFoxCrafter">NeoVoid (ItsFoxCrafter)</a></p>
            </div>
        </section>
        `;
    }
}

/* §2 customElements.define ──────────────────────────────────── */

customElements.define("c-about-section", CAboutSection);
