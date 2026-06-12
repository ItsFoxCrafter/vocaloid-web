const svgCache = {};

function loadSVG(url, target, attrs) {
    if (svgCache[url]) {
        target.innerHTML = svgCache[url];
        if (attrs) Object.assign(target.firstElementChild, attrs);
        return;
    }
    fetch(url)
        .then((r) => r.text())
        .then((svg) => {
            svgCache[url] = svg;
            target.innerHTML = svg;
            if (attrs) Object.assign(target.firstElementChild, attrs);
        })
        .catch(() => {});
}
