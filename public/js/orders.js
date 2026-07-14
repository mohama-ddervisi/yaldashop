const statusMap = {

    pending: {
        text: "در انتظار بررسی",
        class: "pending"
    },

    confirmed: {
        text: "تایید شده",
        class: "confirmed"
    },

    shipping: {
        text: "آماده ارسال",
        class: "shipping"
    },

    sent: {
        text: "ارسال شده",
        class: "sent"
    },

    cancelled: {
        text: "لغو شده",
        class: "cancelled"
    }

};

async function loadOrders() {

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href = "/login.html";

        return;

    }

    const response = await fetch("/orders/my", {

        headers: {

            Authorization: "Bearer " + token

        }

    });

    const data = await response.json();

    if (!data.success) {

        alert(data.message);

        return;

    }

    const orders = data.orders;

    const container =
    document.getElementById("orders-container");

    container.innerHTML = "";

    if (orders.length === 0) {

        container.innerHTML = `

        <div class="order-card">

            <h3>

                هنوز سفارشی ثبت نکرده‌اید.

            </h3>

        </div>

        `;

        return;

    }

    orders.forEach(order => {

    container.innerHTML += `

<div class="order-card"
onclick="goOrder(${order.id})">

<div class="order-head">

<div class="order-info">

<h3>سفارش #${order.id}</h3>

<p class="order-date">

${new Date(order.createdAt).toLocaleDateString("fa-IR")}

</p>

</div>

<div class="order-status ${statusMap[order.status].class}">

${statusMap[order.status].text}

</div>

</div>

<div class="order-images">

${order.items.slice(0,4).map(item=>`

<img
src="${item.product.image}"
alt="${item.product.name}">

`).join("")}

${
order.items.length>4
?
`<div class="more-images">
+${order.items.length-4}
</div>`
:
""
}

</div>

<div class="order-footer">

<div>

${order.items.length} محصول

</div>

<div class="order-price">

${Number(order.total).toLocaleString()} تومان

</div>

</div>

</div>

`;

    });

}

loadOrders();

function goOrder(id){

    window.location.href =
    `/order.html?id=${id}`;

}