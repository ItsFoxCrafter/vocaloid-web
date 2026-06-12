(function () {
    const indicator = document.querySelector(".offline-indicator");
    if (!indicator) return;

    function setOffline(offline) {
        indicator.classList.toggle("visible", offline);
    }

    setOffline(!navigator.onLine);
    window.addEventListener("online", function () { setOffline(false); });
    window.addEventListener("offline", function () { setOffline(true); });
})();
