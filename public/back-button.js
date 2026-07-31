(() => {

    if (window.location.pathname === "/" ||
        window.location.pathname === "/index.html") {
        return;
    }

    const btn = document.createElement("button");

    btn.innerHTML = "✕";

    btn.style.position = "fixed";
    btn.style.top = "20px";
    btn.style.left = "20px";
    btn.style.width = "45px";
    btn.style.height = "45px";
    btn.style.border = "none";
    btn.style.borderRadius = "50%";
    btn.style.background = "#111";
    btn.style.color = "#fff";
    btn.style.fontSize = "22px";
    btn.style.cursor = "pointer";
    btn.style.zIndex = "999999";

    btn.onclick = () => {
        if (history.length > 1) {
            history.back();
        } else {
            location.href = "/";
        }
    };

    document.body.appendChild(btn);

})();