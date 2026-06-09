# VocaWeb

A community-driven, open-source fan site for exploring your favorite Vocaloid virtual singers — their bios, music, and more.

Built with plain HTML, CSS, and JavaScript. No frameworks, no build tools, just open it and go.

---

## Features

- **Hash routing** — back/forward navigation and shareable URLs for every page
- **Category browsing** — filter vocalists by VOCALOID, UTAU, VSYNTH, or OTHER with a dynamic grid
- **Square & list layout modes** with real-time search filtering
- **Individual vocalist pages** with bios, embedded YouTube music, and shareable links
- **SURPRISE ME button** — jumps to a random vocalist
- **Clickable welcome dots** — navigate directly to any vocalist from the home screen
- **Music section** — sortable by title, artist, album, or date (newest / oldest first) with song count badge
- **Skeleton loading** — shimmer placeholders while data loads
- **Light / dark theme toggle** with localStorage persistence
- **Sound clips** on category button clicks
- **Share modal** — native Web Share API with clipboard fallback, social preview card
- **Social meta tags** — OG and Twitter cards update dynamically per page
- **PWA support** — installable as a standalone app with service worker caching
- **Custom scrollbar** — theme-aware with vocalist accent color on active drag
- **Per-vocalist selection highlight** — `::selection` color matches the current vocalist
- **Animated welcome screen**, section transitions, and staggered card entrance
- **Fully community-expandable** — new vocalists only need a JSON entry and a color variable

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
└── src/
    ├── assets/
    │   ├── img/
    │   │   ├── <vocalist>.webp          # vocalist portrait images
    │   │   ├── dividers/
    │   │   │   └── divider-<vocalist>.png  # animated divider strip per vocalist
    │   │   └── icons/
    │   │       ├── icon.svg              # PWA icon, favicon, OG image
    │   │       ├── search.svg
    │   │       └── sun-moon.svg
    │   └── sound/
    │       └── <vocalist>/               # vocalist audio clips
    ├── components/                       # custom HTML elements
    │   ├── aboutSection.js
    │   ├── errorSection.js
    │   ├── heroSection.js
    │   ├── musicSection.js
    │   ├── navbar.js
    │   ├── shareModal.js
    │   ├── vocalistGrid.js
    │   ├── welcomeDots.js
    │   └── welcomeSection.js
    ├── css/
    │   ├── global.css           # manifest — imports all partial CSS files below
    │   ├── reset.css            # universal reset & box-sizing
    │   ├── variables.css        # light/dark theme CSS custom properties
    │   ├── layout.css           # body background, about section, scrollbar, ::selection
    │   ├── welcome.css          # welcome section
    │   ├── navbar.css           # navbar, other/theme buttons
    │   ├── hero.css             # hero section layout, share button, share modal
    │   ├── vocalists.css        # vocalist-branded welcome dot rules
    │   ├── singers.css          # vocalist grid (square/list), search, skeleton
    │   ├── divider.css          # animated divider strip
    │   ├── error.css            # error page
    │   ├── music.css            # music search, controls, cards, skeleton
    │   ├── responsive.css       # mobile/tablet breakpoints
    │   └── animations.css       # keyframe animations (staggered cards, modal, etc.)
    ├── js/
    │   ├── errorHandler.js      # error screen logic
    │   ├── musicHandler.js      # music fetch, sort, render, song count
    │   ├── musicSearchHandler.js  # search filtering + init listeners
    │   ├── pageRenderer.js      # hash-driven router, social meta, selection color
    │   ├── soundHandler.js      # audio clip playback
    │   ├── themeHandler.js      # dark/light theme toggle
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
2. Create `src/json/vocals/<slug>.json` (include a `"type"` field: `"vocaloid"`, `"utau"`, `"vsynth"`, or `"other"`)
3. Create `src/json/ytmusic/<slug>Music.json`
4. Add the vocalist's image to `src/assets/img/`
5. Add a CSS color variable in `src/css/variables.css` (both light and dark themes)

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
