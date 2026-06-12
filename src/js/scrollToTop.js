(function () {
    const btn = document.createElement("button");
    btn.className = "scroll-top-btn";
    btn.setAttribute("aria-label", "Scroll to top");
    const wrap = document.createElement("span");
    wrap.className = "icon-wrap";
    btn.appendChild(wrap);
    document.body.appendChild(btn);

    let ticking = false;

    function update() {
        const scrollY = window.scrollY || window.pageYOffset;
        btn.classList.toggle("visible", scrollY > 300);
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }

    if (typeof loadSVG === "function") loadSVG("./src/assets/img/icons/chevron-up.svg", wrap);

    window.addEventListener("scroll", requestTick, { passive: true });
    btn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
})();
