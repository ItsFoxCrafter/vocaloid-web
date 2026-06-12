(function () {
    const btn = document.createElement("button");
    btn.className = "scroll-top-btn";
    btn.setAttribute("aria-label", "Scroll to top");
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
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

    window.addEventListener("scroll", requestTick, { passive: true });
    btn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
})();
