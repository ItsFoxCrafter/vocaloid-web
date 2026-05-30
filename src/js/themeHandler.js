/**
 * @file themeHandler.js
 * @description Manages the light/dark theme toggle for VocaWeb.
 *              Persists the user's preference in localStorage and applies it
 *              on every page load before content renders (avoiding flash).
 *
 * TABLE OF CONTENTS
 * -----------------
 *  1. changeTheme      — toggles between light and dark, saves to localStorage
 *  2. initializeTheme  — reads saved preference and applies it on load
 *
 * How theming works
 * -----------------
 *  The active theme is stored as a data-theme attribute on <html>
 *  (e.g. <html data-theme="dark">). CSS variables in global.css are scoped
 *  to :root[data-theme="light"] and :root[data-theme="dark"] selectors,
 *  so swapping the attribute instantly re-skins the entire page.
 */

/* §1 changeTheme ────────────────────────────────────────────── */

/**
 * Flips the current theme and saves the new value to localStorage.
 * Called by checkClickedButton() in pageRenderer.js when the theme
 * toggle button is clicked.
 */
function changeTheme() {
    const ROOT = document.documentElement;
    const CURRENT_THEME = ROOT.getAttribute("data-theme");
    const NEW_THEME = CURRENT_THEME === "light" ? "dark" : "light";
    ROOT.setAttribute("data-theme", NEW_THEME);
    localStorage.setItem("theme", NEW_THEME);
}

/* §2 initializeTheme ────────────────────────────────────────── */

/**
 * Applies the saved theme preference immediately on script load.
 * Defaults to "light" if no preference has been saved yet.
 * Called once at the bottom of this file so it runs on every page load.
 */
function initializeTheme() {
    const SAVED_THEME = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", SAVED_THEME);
}

initializeTheme();
