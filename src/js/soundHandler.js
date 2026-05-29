const SOUND_MAP = {
    miku: ["./src/assets/sound/miku/Mikudayo.mp3"],
    teto: [
        "./src/assets/sound/teto/awesommeee-teto.mp3",
        "./src/assets/sound/teto/i-hate-miku-teto.mp3",
        "./src/assets/sound/teto/teetoo.mp3",
        "./src/assets/sound/teto/teto-ahhhh.mp3",
        "./src/assets/sound/teto/teto-cursing-for-some-reason.mp3",
        "./src/assets/sound/teto/teto-wav.mp3",
    ],
    neru: ["./src/assets/sound/neru/neru-phone.mp3"],
};

const audioCache = {};
const audioState = {};

function getSoundSrc(page) {
    const sounds = SOUND_MAP[page];
    if (!Array.isArray(sounds) || sounds.length === 0) return null;
    if (sounds.length === 1) return sounds[0];
    return sounds[Math.floor(Math.random() * sounds.length)];
}

function playButtonSound(page) {
    const soundSrc = getSoundSrc(page);
    if (!soundSrc) return;

    if (audioState[page]?.playing) {
        return;
    }

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
        console.warn("Unable to play audio:", err);
        audioState[page].playing = false;
    });
}
