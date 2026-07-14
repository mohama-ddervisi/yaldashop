document.addEventListener("DOMContentLoaded", () => {
if(typeof updateWishlistBadge === "function"){

    updateWishlistBadge();

}
    if (typeof updateCartBadge === "function") {

        updateCartBadge();

    }

});

function showToast(message, type = "success") {

    const toast = document.getElementById("toast");
    const text = document.getElementById("toast-message");

    if (!toast || !text) return;

    text.innerHTML = message;

    toast.className = "";

    toast.classList.add(type);
    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}
window.addEventListener("storage", () => {

    if (typeof updateWishlistBadge === "function") {
        updateWishlistBadge();
    }

    if (typeof updateCartBadge === "function") {
        updateCartBadge();
    }

});