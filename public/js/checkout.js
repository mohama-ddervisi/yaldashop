function getCart(){

    return JSON.parse(

        localStorage.getItem("yalda-cart")

    ) || [];

}

const cartItems =
document.getElementById("cart-items");

const subtotal =
document.getElementById("subtotal");

const discount =
document.getElementById("discount");

const total =
document.getElementById("total");

const discountInput =
document.getElementById("discount-code");

const applyBtn =
document.getElementById("apply-discount");

let subtotalPrice = 0;

let discountPrice = 0;

function renderCheckout(){

    const cart = getCart();

    cartItems.innerHTML = "";

    let sum = 0;

    cart.forEach(item=>{

        sum += item.price * item.quantity;

        cartItems.innerHTML += `

<div class="cart-item">

<img src="${item.image}">

<div class="cart-info">

<div class="cart-name">

${item.name}

</div>

<div class="cart-price">

${item.quantity} × ${Number(item.price).toLocaleString()} تومان

</div>

</div>

</div>

`;

    });

    subtotalPrice = sum;

    subtotal.textContent =
    subtotalPrice.toLocaleString() + " تومان";

    discount.textContent =
    discountPrice.toLocaleString() + " تومان";

    total.textContent =
    (subtotalPrice - discountPrice)
    .toLocaleString() + " تومان";

}
renderCheckout();

document
.getElementById("submit-order")
.addEventListener("click", submitOrder);

async function submitOrder(){

    const cart = getCart();

    if(cart.length===0){

        alert("سبد خرید خالی است.");

        return;

    }

    const body = {

        fullName:
        document.getElementById("fullName").value,

        phone:
        document.getElementById("phone").value,

        province:
        document.getElementById("province").value,

        city:
        document.getElementById("city").value,

        address:
        document.getElementById("address").value,

        postalCode:
        document.getElementById("postalCode").value,

        note:
        document.getElementById("note").value,

        items:

        cart.map(item=>({

            slug:item.slug,

            quantity:item.quantity

        })),
       discountCode:
discountInput.value.trim(),

discountAmount:
discountPrice

    };

    const res = await fetch("/orders", {

    method: "POST",

   headers: {

    "Content-Type": "application/json",

    "Authorization": `Bearer ${localStorage.getItem("token")}`

},

    body: JSON.stringify(body)

});

const data = await res.json();

console.log(data);

if (data.success) {

    alert("سفارش با موفقیت ثبت شد.");

    localStorage.removeItem("yalda-cart");

    window.location.href = "/";

} else {

    alert(data.message);

}

}
applyBtn.onclick = async () => {

    const code =

    discountInput.value.trim();

    if (!code) {

        alert("کد تخفیف را وارد کنید.");

        return;

    }

    const res = await fetch("/discounts/apply", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            code,

            total: subtotalPrice

        })

    });

    const data = await res.json();

    if (!data.success) {

        alert(data.message);

        return;

    }

    discountPrice =
    data.discountAmount;

    discount.textContent =
    discountPrice.toLocaleString() + " تومان";

    total.textContent =
    (subtotalPrice - discountPrice)
    .toLocaleString() + " تومان";

    alert("کد تخفیف اعمال شد.");

};