# Contributing to VocaWeb

Thanks for wanting to contribute! VocaWeb is community-driven, so every addition helps.
This guide covers everything you need to know to contribute smoothly.

---

## Before You Start

**Open an issue first.** Before writing any code or preparing data, open a GitHub issue describing what you want to add or fix. This avoids duplicate work and lets maintainers give early feedback before you invest time in a PR.

> **No direct pushes to `main`.** All changes go through a pull request, even small ones.

---

## What You Can Contribute

### 1. Adding a New Vocalist

This is the most common contribution and doesn't require touching any JS or CSS.

#### Step-by-step

**1. Add the slug to `vocaloidNames.json`**

Open `src/json/vocaloidNames.json` and append the new slug:

```json
["miku", "teto", "neru", "gumi", "luka", "rin-len", "yixi", "your-vocalist"]
```

Use lowercase with hyphens for multi-word names (e.g. `rin-len`, `flower`).

---

**2. Create the vocalist bio JSON**

Create `src/json/vocals/<slug>.json` using this exact structure:

```json
{
    "title": "DISPLAY NAME",
    "codename": "CV##",
    "subtitle": "VOCALOID / UTAU / etc.",
    "date": "Month DD, YYYY",
    "description": "A short bio paragraph here.",
    "imageUrl": "./src/assets/img/<slug>.webp",
    "imageDividerUrl": "./src/assets/img/dividers/divider-<slug>.png"
}
```

All fields are required. If a field genuinely has no value (e.g. no codename), use an empty string `""`.

---

**3. Create the music playlist JSON**

Create `src/json/ytmusic/<slug>Music.json` using this structure:

```json
{
    "songs": [
        {
            "id": "0",
            "title": "Song Title",
            "artist": "Artist Name",
            "album": "Album Name",
            "ytlink": "https://www.youtube.com/watch?v=XXXXXXXXXXX"
        }
    ]
}
```

- `id` values should be unique strings within the file, starting from `"0"`
- `album` can be an empty string `""` if unknown
- Both `youtube.com/watch?v=` and `youtu.be/` short URLs are supported

---

**4. Add the vocalist image**

Place a `.webp` image at `src/assets/img/<slug>.webp`.
Recommended size: tall portrait, similar dimensions to the existing images.

---

**5. Add the divider strip image**

Place a `.png` strip image at `src/assets/img/dividers/divider-<slug>.png`.
This is the repeating horizontal banner shown between the hero and music sections.
Look at existing dividers for reference on dimensions and style.

---

**6. Add the sign image (for the error screen)**

Place a `.png` image at `src/assets/img/signs/sign-<slug>.png`.
This is shown on the error screen when a page fails to load.

---

**7. Add the CSS color variable and button styles**

Open `src/css/global.css` and add the vocalist's brand color to both theme blocks (§2):

```css
:root[data-theme="light"] {
    /* existing variables ... */
    --your-vocalist-color: #hexcode;
}

:root[data-theme="dark"] {
    /* existing variables ... */
    --your-vocalist-color: #hexcode;
}
```

Then add button color rules under **§6b Vocalist Color Accents**:

```css
.your-vocalist-button.active-button,
.your-vocalist-button:active {
    background-color: var(--your-vocalist-color);
    color: var(--background-color);
}
.your-vocalist-button:hover {
    border-bottom: 3px solid var(--your-vocalist-color);
}
```

And a hero title color rule under **§7 Hero Section**:

```css
.hero-title.your-vocalist-title {
    color: var(--your-vocalist-color);
}
```

And a welcome dot under **§5 Welcome Section**:

```css
.dot-your-vocalist {
    background: var(--your-vocalist-color);
    animation-delay: Xs;
}
```

Increment the `animation-delay` by `0.2s` from the last dot.

---

**8. Add a dot to the welcome section**

Open `src/components/welcomeSection.js` and add a dot span inside `.welcome-dots`:

```html
<span class="dot dot-your-vocalist"></span>
```

---

### 2. Bug Fixes & Code Improvements

- Keep changes focused — one fix per PR
- Follow the existing code style (see below)
- If the fix is non-obvious, add a comment explaining why

---

## Code Style

This project uses plain HTML/CSS/JS with no linter configured, so just match what's already there:

**JavaScript**

- `const` for values that don't change, `let` for those that do
- `SCREAMING_SNAKE_CASE` for constants defined inside functions
- `camelCase` for variables and function names
- `async/await` over raw `.then()` chains where possible
- Always handle fetch errors with a try/catch or `.catch()`

**CSS**

- CSS variables for all colors — never hardcode hex values inside rules
- Follow the section order in `global.css` (see the TOC at the top of that file)
- No nesting — keep selectors flat

**General**

- No frameworks, no build tools — keep it vanilla
- Don't introduce `npm` dependencies

---

## Pull Request Checklist

Before opening a PR, make sure:

- [ ] An issue was opened and linked in the PR description
- [ ] The change is limited to what the issue describes
- [ ] New vocalist JSON files follow the exact structure shown above
- [ ] Images are in the correct folders with the correct naming convention
- [ ] CSS additions follow the existing style and section order
- [ ] Code matches the existing style (indentation, naming, comments)
- [ ] You've tested it locally with a live server (not `file://`)

---

## Getting Help

If you're unsure about anything, just ask in the issue before opening a PR. We'd rather answer a question than review a PR that needs to be redone.
