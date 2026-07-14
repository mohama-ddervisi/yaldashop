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

</h3>

<p>

${Number(item.price).toLocaleString()} تومان

</p>

</div>

<div class="cart-quantity">

<button
class="minus"
data-slug="${item.slug}"
>

−

</button>

<span class="quantity">

${item.quantity}

</span>

<button
class="plus"
data-slug="${item.slug}"
>

+

</button>

</div>

<button
class="remove-btn"
data-slug="${item.slug}"
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

function bindEvents(){

    document.querySelectorAll(".plus").forEach(btn=>{

        btn.onclick = ()=>{

            const slug =
            btn.dataset.slug;

            const cart =
            getCart();

            const item =
            cart.find(p=>p.slug===slug);

            updateQuantity(
                slug,
                item.quantity+1
            );

            renderCart();

        };

    });

    document.querySelectorAll(".minus").forEach(btn=>{

        btn.onclick = ()=>{

            const slug =
            btn.dataset.slug;

            const cart =
            getCart();

            const item =
            cart.find(p=>p.slug===slug);

            if(item.quantity>1){

                updateQuantity(
                    slug,
                    item.quantity-1
                );

                renderCart();

            }

        };

    });

    document.querySelectorAll(".remove-btn").forEach(btn=>{

        btn.onclick = ()=>{

            removeFromCart(
                btn.dataset.slug
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