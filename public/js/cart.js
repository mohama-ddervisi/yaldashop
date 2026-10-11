function renderCart(){

    const cart = getCart();

    const container =
    document.getElementById("cart-container");

    const totalElement =
    document.getElementById("cart-total");

    let total = 0;

    container.innerHTML = "";

    cart.forEach(item=>{

        total += item.price * item.quantity;

        container.innerHTML += `

<div class="cart-item">

<img
src="${item.image}"
class="cart-image"
>

<div class="cart-info">

<h3>

${item.name}
${item.colorName ? `<span class="cart-color-tag"> - رنگ: ${item.colorName}</span>` : ""}

</h3>

<p>

${Number(item.price).toLocaleString()} تومان

</p>

</div>

<div class="cart-quantity">

<button
class="minus"
data-slug="${item.slug}"
data-color="${item.colorName || ""}"
>

−

</button>

<span class="quantity">

${item.quantity}

</span>

<button
class="plus"
data-slug="${item.slug}"
data-color="${item.colorName || ""}"
>

+

</button>

</div>

<button
class="remove-btn"
data-slug="${item.slug}"
data-color="${item.colorName || ""}"
>

حذف

</button>

</div>

`;

    });

    totalElement.textContent =
    total.toLocaleString();

    bindEvents();

}

function findCartItem(cart, slug, colorName){

    return cart.find(p =>
        p.slug === slug &&
        (p.colorName || "") === (colorName || "")
    );

}

function bindEvents(){

    document.querySelectorAll(".plus").forEach(btn=>{

        btn.onclick = ()=>{

            const slug =
            btn.dataset.slug;

            const colorName =
            btn.dataset.color;

            const cart =
            getCart();

            const item =
            findCartItem(cart, slug, colorName);

            updateQuantity(
                slug,
                item.quantity+1,
                colorName
            );

            renderCart();

        };

    });

    document.querySelectorAll(".minus").forEach(btn=>{

        btn.onclick = ()=>{

            const slug =
            btn.dataset.slug;

            const colorName =
            btn.dataset.color;

            const cart =
            getCart();

            const item =
            findCartItem(cart, slug, colorName);

            if(item.quantity>1){

                updateQuantity(
                    slug,
                    item.quantity-1,
                    colorName
                );

                renderCart();

            }

        };

    });

    document.querySelectorAll(".remove-btn").forEach(btn=>{

        btn.onclick = ()=>{

            removeFromCart(
                btn.dataset.slug,
                btn.dataset.color
            );

            renderCart();

        };

    });

}

renderCart();

const checkoutBtn =
document.getElementById("checkout-btn");

if(checkoutBtn){

    checkoutBtn.addEventListener("click",()=>{

        window.location.href =
        "/checkout.html";

    });

}
