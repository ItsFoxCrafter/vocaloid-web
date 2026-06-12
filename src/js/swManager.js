(function () {
    if (!("serviceWorker" in navigator)) return;

    let swReg = null;
    let versionInterval = null;
    let dismissedVersion = null;

    function showBanner(message, versionKey) {
        if (dismissedVersion === versionKey) return;

        const banner = document.createElement("c-update-banner");
        banner.setAttribute("message", message);
        banner.addEventListener("update-action", (e) => {
            if (e.detail === "update") {
                if (swReg && swReg.waiting) {
                    swReg.waiting.postMessage("skip-waiting");
                } else {
                    window.location.reload();
                }
            } else {
                dismissedVersion = versionKey;
            }
        });
        document.body.appendChild(banner);
    }

    function checkVersion() {
        fetch("./version.json", { cache: "no-store" })
            .then((r) => r.json())
            .then((remote) => {
                const local = localStorage.getItem("vocaweb-version");
                const ver = String(remote.version);
                if (local && local !== ver) {
                    showBanner("New content available — refresh to see it.", "v" + ver);
                }
                localStorage.setItem("vocaweb-version", ver);
            })
            .catch(() => {});
    }

    navigator.serviceWorker.register("./sw.js").then((reg) => {
        swReg = reg;

        reg.addEventListener("updatefound", () => {
            const newSW = reg.installing;
            if (!newSW) return;
            newSW.addEventListener("statechange", () => {
                if (newSW.state === "installed" && navigator.serviceWorker.controller) {
                    showBanner("A new version of VocaWeb is available.", "sw");
                }
            });
        });

        if (reg.waiting) {
            showBanner("A new version of VocaWeb is available.", "sw");
        }

        checkVersion();
        versionInterval = setInterval(checkVersion, 1800000);
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
    });

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            checkVersion();
        }
    });

    window.addEventListener("beforeunload", function () {
        if (versionInterval) clearInterval(versionInterval);
    });
})();
