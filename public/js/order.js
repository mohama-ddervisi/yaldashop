const params =
new URLSearchParams(window.location.search);

const orderId =
params.get("id");

loadOrder();

async function loadOrder(){

    const token =
    localStorage.getItem("token");

    if(!token){

        window.location.href="/login.html";

        return;

    }

    const response =
    await fetch(`/orders/${orderId}`,{

        headers:{

            Authorization:
            "Bearer "+token

        }

    });

const order = await response.json();

const statusMap = {

    pending:{
        text:"در انتظار بررسی",
        class:"pending"
    },

    confirmed:{
        text:"تایید شده",
        class:"confirmed"
    },

    shipping:{
        text:"آماده ارسال",
        class:"shipping"
    },

    sent:{
        text:"ارسال شده",
        class:"sent"
    },

    cancelled:{
        text:"لغو شده",
        class:"cancelled"
    }

};
const stepMap = {

    pending:1,

    confirmed:2,

    shipping:3,

    sent:4,

    cancelled:0

};

const currentStep =
stepMap[order.status];
const container =
document.getElementById("order-container");

container.innerHTML = `

<div class="order-card">
<div class="order-timeline">

<div class="timeline-item ${currentStep>=1?"active":""}">

<div class="circle"></div>

<span>

ثبت سفارش

</span>

</div>

<div class="line ${currentStep>=2?"active":""}"></div>

<div class="timeline-item ${currentStep>=2?"active":""}">

<div class="circle"></div>

<span>

تایید

</span>

</div>

<div class="line ${currentStep>=3?"active":""}"></div>

<div class="timeline-item ${currentStep>=3?"active":""}">

<div class="circle"></div>

<span>

ارسال

</span>

</div>

<div class="line ${currentStep>=4?"active":""}"></div>

<div class="timeline-item ${currentStep>=4?"active":""}">

<div class="circle"></div>

<span>

تحویل

</span>

</div>

</div>
<div class="order-info">

<h2>

سفارش #${order.id}

</h2>

<div class="order-status ${statusMap[order.status].class}">

${statusMap[order.status].text}

</div>

</div>

<div class="order-summary">

<p>

<b>تاریخ:</b>

${new Date(order.createdAt).toLocaleDateString("fa-IR")}

</p>

<p>

<b>مبلغ:</b>

${Number(order.total).toLocaleString()} تومان

</p>

</div>

</div>

<h3 class="section-title">
محصولات سفارش
</h3>

<div class="products-list">

${order.items.map(item=>`

<div class="product-row">

<img
class="product-image"
src="${item.product.image}"
alt="${item.product.name}">

<div class="product-info">

<h4>${item.product.name}</h4>

<p>

تعداد:
${item.quantity}

</p>

<p>

${Number(item.price).toLocaleString()} تومان

</p>

</div>

</div>

`).join("")}

</div>
<h3 class="section-title">

اطلاعات گیرنده

</h3>

<div class="receiver-box">

<p>

<b>نام:</b>

${order.fullName}

</p>

<p>

<b>موبایل:</b>

${order.phone}

</p>

<p>

<b>استان:</b>

${order.province || "-"}

</p>

<p>

<b>شهر:</b>

${order.city || "-"}

</p>

<p>

<b>آدرس:</b>

${order.address}

</p>

<p>

<b>کدپستی:</b>

${order.postalCode || "-"}

</p>

${order.note ? `

<p>

<b>توضیحات:</b>

${order.note}

</p>

` : ""}

</div>
<div class="order-total">

جمع کل

<span>

${Number(order.total).toLocaleString()} تومان

</span>

</div>
`;

}