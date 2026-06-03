/**
 * @file soundHandler.js
 * @description Plays a vocalist-specific sound clip when their navbar button
 *              is clicked. Supports multiple clips per vocalist (picked randomly)
 *              and prevents overlapping playback.
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. SOUND_MAP       — maps vocalist slugs to their audio file paths
 *  2. Audio State     — cache, playing-state, and mute trackers
 *  3. getSoundSrc     — picks a sound file for a given page
 *  4. playButtonSound — plays the sound, guarding against overlap and mute
 *  5. toggleSound     — toggles mute state and updates the navbar button UI
 *
 * Adding sounds for a new vocalist
 * ----------------------------------
 *  Add an entry to SOUND_MAP using the vocalist's slug as the key:
 *  e.g.  gumi: ["./src/assets/sound/gumi/gumi-hello.mp3"]
 *  Slugs must match the data-page values used in navbar.js.
 */

/* §1 SOUND_MAP ──────────────────────────────────────────────── */

const SOUND_MAP = {
    miku: ["./src/assets/sound/miku/Mikudayo.mp3"],
    teto: [
        "./src/assets/sound/teto/awesommeee-teto.mp3",
        "./src/assets/sound/teto/i-hate-miku-teto.mp3",
        "./src/assets/sound/teto/teetoo.mp3",
        "./src/assets/sound/teto/teto-ahhhh.mp3",
        "./src/assets/sound/teto/teto-wav.mp3",
    ],
    neru: ["./src/assets/sound/neru/neru-phone.mp3"],
};

/* §2 Audio State ────────────────────────────────────────────── */

const audioCache = {}; // stores Audio instances so we don't recreate them
const audioState = {}; // tracks whether a clip is currently playing

// persists mute preference across page reloads
let isSoundMuted = localStorage.getItem("soundMuted") === "true";

/* §3 getSoundSrc ────────────────────────────────────────────── */

/**
 * Returns a sound file path for the given page.
 * If the vocalist has multiple clips, one is chosen at random.
 *
 * @param {string} page - Vocalist slug
 * @returns {string|null} Path to an audio file, or null if none defined
 */
function getSoundSrc(page) {
    const sounds = SOUND_MAP[page];
    if (!Array.isArray(sounds) || sounds.length === 0) return null;
    if (sounds.length === 1) return sounds[0];
    return sounds[Math.floor(Math.random() * sounds.length)];
}

/* §4 playButtonSound ────────────────────────────────────────── */

/**
 * Plays a sound for the given vocalist.
 * Skips silently if sound is muted, no sound is mapped,
 * or if a clip is already playing.
 *
 * @param {string} page - Vocalist slug matching a key in SOUND_MAP
 */
function playButtonSound(page) {
    // respect the mute toggle
    if (isSoundMuted) return;

    const soundSrc = getSoundSrc(page);
    if (!soundSrc) return;

    // don't interrupt a clip that's already playing
    if (audioState[page]?.playing) return;

    // reuse a cached Audio instance, or create a fresh one
    let audio = audioCache[page];
    if (!audio || audio.ended) {
        audio = new Audio(soundSrc);
        audioCache[page] = audio;
    }

    audioState[page] = { playing: false };

    audio.onplay = () => {
        audioState[page].playing = true;
    };
    audio.onended = () => {
        audioState[page].playing = false;
    };

    audio.currentTime = 0;
    audio.play().catch((err) => {
        // browsers may block autoplay until the user has interacted with the page
        console.warn("Unable to play audio:", err);
        audioState[page].playing = false;
    });
}

/* §5 toggleSound ────────────────────────────────────────────── */

/**
 * Toggles the global mute state and updates the sound button appearance.
 * Saves the preference to localStorage so it persists on reload.
 * Called by navbar.js when the sound toggle button is clicked.
 */
function toggleSound() {
    const SOUND_BTN = document.querySelector(".sound-button");

    isSoundMuted = !isSoundMuted;
    localStorage.setItem("soundMuted", isSoundMuted);

    // Ensure the button exists before trying to modify its classes
    if (SOUND_BTN) {
        // This will remove the class if it exists, and add it if it doesn't
        SOUND_BTN.classList.toggle("active-button");

        // Keeps your mute/unmute visual states working
        SOUND_BTN.classList.toggle("muted", isSoundMuted);
        SOUND_BTN.title = isSoundMuted ? "Sound off" : "Sound on";
    }
}

/**
 * Applies the saved mute state to the sound button on initial load.
 * Called once by navbar.js after the button is rendered.
 */
function initSoundButton() {
    const SOUND_BTN = document.querySelector(".sound-button");
    if (!SOUND_BTN) return;
    SOUND_BTN.classList.toggle("muted", isSoundMuted);
    SOUND_BTN.title = isSoundMuted ? "Sound off" : "Sound on";
}
