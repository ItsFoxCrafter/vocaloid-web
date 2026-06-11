# VocaWeb

A community-driven, open-source fan site for exploring your favorite Vocaloid virtual singers — their bios, music, and more.

Built with plain HTML, CSS, and JavaScript. No frameworks, no build tools — just serve it over HTTP and go.

---

## Features

- **Hash routing** — back/forward navigation and shareable URLs for every page
- **Category browsing** — filter vocalists by VOCALOID, UTAU, VSYNTH, or OTHER with a dynamic grid
- **Square & list layout modes** with real-time search filtering
- **Individual vocalist pages** with bios, embedded YouTube music, shareable links, and trivia
- **Profile page** — recently viewed vocalists shown as quick-access cards
- **Vocalist of the Day** — a daily featured vocalist on the welcome screen with animated bursting stars
- **Did You Know** — per-vocalist trivia box with accent branding
- **SURPRISE ME button** — jumps to a random vocalist
- **Clickable welcome dots** — navigate directly to any vocalist from the home screen
- **Music section** — sortable by title, artist, album, or date (newest / oldest first) with song count badge
- **Skeleton loading** — shimmer placeholders while data loads
- **Light / dark theme toggle** with localStorage persistence
- **Sound clips** on category button clicks
- **Share modal** — native Web Share API with clipboard fallback, social preview card, animated close
- **Social meta tags** — OG and Twitter cards update dynamically per page
- **PWA support** — installable as a standalone app with service worker caching
- **Custom scrollbar** — theme-aware with vocalist accent color on active drag
- **Per-vocalist selection highlight** — `::selection` color matches the current vocalist
- **Animated welcome screen**, section transitions, staggered card entrance, and modal close
- **Fully community-expandable** — new vocalists need a JSON entry, portrait and sign images, a divider strip, a CSS color variable, and a welcome dot rule

---

## Project Structure

```
vocaloid-web/
├── index.html
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── manifest.json                    # PWA manifest
├── sw.js                            # Service worker (cache-first)
├── sitemap.xml                      # SEO sitemap
└── src/
    ├── assets/
    │   ├── img/
    │   │   ├── <vocalist>.webp          # vocalist portrait images (yixi uses .png)
    │   │   ├── dividers/
    │   │   │   ├── divider-gumi.png
    │   │   │   ├── divider-miku.png
    │   │   │   ├── divider-neru.png
    │   │   │   └── divider-teto.png
    │   │   ├── signs/
    │   │   │   └── sign-<vocalist>.png  # error screen images
    │   │   └── icons/
    │   │       ├── icon.svg              # PWA icon, favicon, OG image
    │   │       ├── search.svg
    │   │       └── sun-moon.svg
    │   └── sound/
    │       ├── miku/                     # vocalist audio clips
    │       ├── neru/
    │       └── teto/
    ├── components/                       # custom HTML elements
    │   ├── aboutSection.js
    │   ├── errorSection.js
    │   ├── heroSection.js
    │   ├── musicSection.js
    │   ├── navbar.js
    │   ├── profileSection.js
    │   ├── shareModal.js
    │   ├── vocalistGrid.js
    │   ├── welcomeDots.js
    │   └── welcomeSection.js
    ├── css/
    │   ├── global.css           # manifest — imports all partial CSS files below
    │   ├── reset.css            # universal reset & box-sizing
    │   ├── variables.css        # light/dark theme CSS custom properties
    │   ├── layout.css           # body background, about section, scrollbar, ::selection
    │   ├── welcome.css          # welcome section, Vocalist of the Day with animated stars
    │   ├── navbar.css           # navbar, other/theme buttons
    │   ├── hero.css             # hero section, share button, share modal, Did You Know
    │   ├── vocalists.css        # vocalist-branded welcome dot rules
    │   ├── singers.css          # vocalist grid (square/list), search, skeleton, song count
    │   ├── profile.css          # profile page recently-viewed cards
    │   ├── divider.css          # animated divider strip
    │   ├── error.css            # error page
    │   ├── music.css            # music search, controls, cards, skeleton
    │   ├── responsive.css       # mobile/tablet breakpoints
    │   └── animations.css       # keyframe animations (staggered cards, modal, etc.)
    ├── js/
    │   ├── errorHandler.js      # error screen logic
    │   ├── musicHandler.js      # music fetch, sort, render, song count
    │   ├── musicSearchHandler.js  # search filtering + init listeners
    │   ├── pageRenderer.js      # hash-driven router, social meta, selection color, recently-viewed tracking
    │   ├── soundHandler.js      # audio clip playback
    │   ├── themeHandler.js      # dark/light theme toggle
    │   ├── vocalistOfTheDay.js  # deterministic daily vocalist picker + renderer
    │   └── welcomeDotsRenderer.js  # welcome dot population
    └── json/
        ├── vocaloidNames.json   # list of active vocalist slugs
        ├── error/
        │   └── error.json       # random error titles
        ├── vocals/              # per-vocalist bio data
        │   ├── gumi.json
        │   ├── luka.json
        │   ├── miku.json
        │   ├── neru.json
        │   ├── rin-len.json
        │   ├── teto.json
        │   ├── yixi.json
        │   └── yuki.json
        └── ytmusic/             # per-vocalist music playlists
            ├── gumiMusic.json
            ├── lukaMusic.json
            ├── mikuMusic.json
            ├── neruMusic.json
            ├── rin-lenMusic.json
            ├── tetoMusic.json
            ├── yixiMusic.json
            └── yukiMusic.json
```

---

## Running Locally

No install required. Just serve the folder over HTTP — opening `index.html` directly as a `file://` URL will cause CORS errors on the JSON fetches.

**Option 1 — VS Code Live Server** _(easiest)_
Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, right-click `index.html` → **Open with Live Server**.

**Option 2 — Node.js**

```bash
npx serve .
```

**Option 3 — Python**

```bash
python -m http.server 8080
```

Then open `http://localhost:<port>` in your browser.

---

## Adding a New Vocalist

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide. The short version:

1. Add the slug to `src/json/vocaloidNames.json`
2. Create `src/json/vocals/<slug>.json` (include `"type"`: `"vocaloid"`, `"utau"`, `"vsynth"`, or `"other"`; optionally add `"dyk"` trivia text)
3. Create `src/json/ytmusic/<slug>Music.json`
4. Add the vocalist's portrait image to `src/assets/img/`
5. Add the divider strip image to `src/assets/img/dividers/`
6. Add the error screen sign image to `src/assets/img/signs/`
7. Add a CSS color variable in `src/css/variables.css` (both light and dark themes) and a welcome dot rule in `src/css/vocalists.css`

---

## Tech Stack

| Layer     | What's used                                                                 |
| --------- | --------------------------------------------------------------------------- |
| Structure | Vanilla HTML5 with custom elements (`customElements.define`)                |
| Styling   | Vanilla CSS with custom properties (CSS variables)                          |
| Logic     | Vanilla JavaScript (no frameworks)                                          |
| Fonts     | [Bebas Neue](https://fonts.google.com/specimen/Bebas+Neue) via Google Fonts |
| Icons     | [Lucide](https://lucide.dev/)                                               |
| Data      | Local JSON files                                                            |
| PWA       | Service worker with cache-first strategy, Web App Manifest                  |

---

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

---

## Credits

| Source                                        | Used for          |
| --------------------------------------------- | ----------------- |
| [Vocaloid Wiki](https://vocaloid.fandom.com/) | Vocalist metadata |
| [Vimalion](https://vimalion.pro/)             | Yi Xi's data      |
| [YouTube](https://www.youtube.com/)           | Music embeds      |
| [Lucide](https://lucide.dev/)                 | Icons             |

---

## Disclaimer

All content is for informational and entertainment purposes only. We do not claim ownership of any music, images, or information presented here. All rights belong to their respective creators and copyright holders. We do not host music — we link to publicly available content on YouTube.

---

## License

This project is open source. See `LICENSE` for details.

Created by [NeoVoid (ItsFoxCrafter)](https://github.com/ItsFoxCrafter) and maintained by the community.
