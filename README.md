# VocaWeb

A community-driven, open-source fan site for exploring your favorite Vocaloid virtual singers — their bios, music, and more.

Built with plain HTML, CSS, and JavaScript. No frameworks, no build tools, just open it and go.

---

## Features

- Browse vocalist pages for Miku, Teto, Neru, Gumi, Luka, Rin/Len, Yi Xi and more
- Embedded YouTube music player per vocalist
- Light / dark theme toggle with localStorage persistence
- Vocalist sound clips on navbar button click
- Animated welcome screen and section transitions
- Fully community-expandable — new vocalists only need a JSON entry

---

## Project Structure

```
vocaloid-web/
├── index.html
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── src/
    ├── assets/
    │   ├── img/
    │   │   ├── <vocalist>.webp          # vocalist portrait images
    │   │   ├── dividers/
    │   │   │   └── divider-<vocalist>.png  # animated divider strip per vocalist
    │   │   ├── icons/
    │   │   │   ├── search.svg
    │   │   │   └── sun-moon.svg
    │   │   └── signs/
    │   │       └── sign-<vocalist>.png     # vocalist sign images used in error screen
    │   └── sound/
    │       └── <vocalist>/                 # vocalist audio clips
    ├── components/                        # custom HTML elements
    │   ├── aboutSection.js
    │   ├── errorSection.js
    │   ├── heroSection.js
    │   ├── musicSection.js
    │   ├── navbar.js
    │   ├── virtualSingerButton.js
    │   ├── welcomeDots.js
    │   └── welcomeSection.js
    ├── css/
    │   ├── global.css           # manifest — imports all partial CSS files below
    │   ├── reset.css            # universal reset & box-sizing
    │   ├── variables.css        # light/dark theme CSS custom properties
    │   ├── layout.css           # body background & shared section layout
    │   ├── welcome.css          # welcome section
    │   ├── navbar.css           # navbar, other/theme buttons
    │   ├── hero.css             # hero section layout
    │   ├── vocalists.css        # vocalist-branded class rules (navbar, hero, welcome)
    │   ├── divider.css          # animated divider strip
    │   ├── error.css            # error page
    │   ├── music.css            # music search & cards
    │   ├── responsive.css       # mobile/tablet breakpoints
    │   └── animations.css       # keyframe animations
    ├── js/
    │   ├── errorHandler.js      # error screen logic
    │   ├── musicHandler.js      # music fetch and render
    │   ├── musicSearchHandler.js  # search filtering logic
    │   ├── navbarButtonRenderer.js  # dynamic navbar population
    │   ├── pageRenderer.js      # main content router
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
2. Create `src/json/vocals/<slug>.json`
3. Create `src/json/ytmusic/<slug>Music.json`
4. Add the vocalist's image to `src/assets/img/`
5. Add a CSS variable in `src/css/variables.css` and color class rules in `src/css/vocalists.css`

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
