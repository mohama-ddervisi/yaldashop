loadWishlist();

function loadWishlist() {

    updateWishlistBadge();

    updateCartBadge();

    const container =
    document.getElementById("wishlist-container");

    const wishlist =
    getWishlist();

    if (!wishlist.length) {

        container.innerHTML = `

        <div class="wishlist-empty">

            <h2>

                هنوز محصولی به علاقه‌مندی اضافه نکرده‌اید.

            </h2>

        </div>

        `;

        return;

    }

    container.innerHTML = "";

    wishlist.forEach(product => {

        container.innerHTML += `

        <div class="product-card">

            ${product.discount ? `

            <div class="discount-badge">

                -${product.discount}%

            </div>

            ` : ""}

            <button

                class="wishlist-btn active"

                onclick="removeWishlist('${product.slug}')">

               ×

            </button>

            <a

                href="/product.html?slug=${product.slug}"

                class="product-image-box">

                <img

                    src="${product.image}"

                    class="product-image"

                    alt="${product.name}">

            </a>

            <div class="product-content">

                <span class="product-brand">

                    ${product.brand || "YALDA SHOP"}

                </span>

                <h3>

                    ${product.name}

                </h3>

                <div class="product-prices">

                    ${product.oldPrice ?

                    `<span class="old-price">

                    ${Number(product.oldPrice).toLocaleString("en-US")} تومان

                    </span>`

                    : ""}

                    <span class="new-price">

                    ${Number(product.price).toLocaleString("en-US")} تومان

                    </span>

                </div>

                <button

                    class="product-btn"

                    onclick="window.location='/product.html?slug=${product.slug}'">

                    مشاهده محصول

                </button>

            </div>

        </div>

        `;

    });

}
function removeWishlist(slug){

    removeFromWishlist(slug);

    updateWishlistBadge();

    updateCartBadge();

    showToast(" محصول از علاقه‌مندی حذف شد");

    loadWishlist();

}

document.addEventListener("DOMContentLoaded",()=>{

    updateWishlistBadge();

    updateCartBadge();

});