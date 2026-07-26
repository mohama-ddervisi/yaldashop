const socket = io();

const MAX_NOTIFICATIONS = 20;

const bellIcons = document.querySelectorAll(".mobile-bell, .bell-icon");

function getNotifications() {

    const raw = localStorage.getItem("discountNotifications");

    return raw ? JSON.parse(raw) : [];

}

function saveNotifications(list) {

    localStorage.setItem("discountNotifications", JSON.stringify(list));

}

function addNotification(data) {

    const list = getNotifications();

   list.unshift({
        productId: data.productId,
        name: data.name,
        discount: data.discount,
        image: data.image || null,
        slug: data.slug || null,
        seen: false
    });

    if (list.length > MAX_NOTIFICATIONS) {
        list.length = MAX_NOTIFICATIONS;
    }

    saveNotifications(list);

    renderDot();

}

function renderDot() {

    const hasUnseen = getNotifications().some((n) => !n.seen);

    bellIcons.forEach((bell) => {

        let dot = bell.querySelector(".bell-dot");

        if (hasUnseen && !dot) {

            dot = document.createElement("span");
            dot.className = "bell-dot";
            bell.appendChild(dot);

        }

        if (!hasUnseen && dot) {
            dot.remove();
        }

    });

}

function markAllSeen() {

    const list = getNotifications();

    list.forEach((n) => (n.seen = true));

    saveNotifications(list);

    renderDot();

}

function buildDropdown(bell) {

    const dropdown = document.createElement("div");
    dropdown.className = "bell-dropdown";

    const list = getNotifications();

    if (list.length === 0) {

        dropdown.innerHTML = `<div class="bell-empty">اعلانی وجود ندارد</div>`;

    } else {

      list.forEach((n) => {

            const item = document.createElement("a");
            item.className = "bell-item";
            item.href = n.slug ? `/product.html?slug=${n.slug}` : "#";

            item.innerHTML = `
                ${n.image ? `<img src="${n.image}" class="bell-item-img">` : ""}
                <div class="bell-item-text">
                    <span class="bell-item-name">${n.name}</span>
                    <span class="bell-item-discount">${n.discount}% تخفیف</span>
                </div>
            `;

            item.addEventListener("click", (e) => {
                e.stopPropagation();
            });

            dropdown.appendChild(item);

        });

    }

    bell.appendChild(dropdown);

    return dropdown;

}

function toggleDropdown(bell) {

    const existing = bell.querySelector(".bell-dropdown");

    if (existing) {
        existing.remove();
        return;
    }

    // بستن دراپ‌داون‌های باز روی زنگوله‌های دیگر (دسکتاپ/موبایل)
    document.querySelectorAll(".bell-dropdown").forEach((el) => el.remove());

    buildDropdown(bell);

    markAllSeen();

}

renderDot();

socket.on("newDiscount", (data) => {

    addNotification(data);

});

bellIcons.forEach((bell) => {

    bell.addEventListener("click", (e) => {

        e.preventDefault();
        e.stopPropagation();

        toggleDropdown(bell);

    });

});

// بستن دراپ‌داون با کلیک بیرون از آن
document.addEventListener("click", (e) => {

    if (!e.target.closest(".mobile-bell, .bell-icon")) {

        document.querySelectorAll(".bell-dropdown").forEach((el) => el.remove());

    }

});