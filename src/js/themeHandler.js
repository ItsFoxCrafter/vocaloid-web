function changeTheme() {
    const ROOT = document.documentElement;
    const CURRENT_THEME = ROOT.getAttribute("data-theme");
    const NEW_THEME = CURRENT_THEME === "light" ? "dark" : "light";
    ROOT.setAttribute("data-theme", NEW_THEME);
    localStorage.setItem("theme", NEW_THEME);
}

function initializeTheme() {
    const SAVED_THEME = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", SAVED_THEME);
}

initializeTheme();
