let allOrders = [];
async function loadOrders() {

    const res = await fetch("/orders");

    const orders = await res.json();
    allOrders = orders;  
    const tbody =
    document.getElementById("orders-body");

    tbody.innerHTML = "";

    let totalSales = 0;

   renderOrders(orders);

    document.getElementById("orders-count")
    .textContent = orders.length;

    document.getElementById("orders-total")
    .textContent =
    totalSales.toLocaleString() + " تومان";

}

loadOrders();
function renderOrders(orders){

    const tbody =
    document.getElementById("orders-body");

    tbody.innerHTML="";

    let totalSales=0;

    orders.forEach(order=>{

        totalSales+=order.total;

        const tr=document.createElement("tr");

        tr.innerHTML=`

<td>#${order.id}</td>

<td>${order.fullName}</td>

<td>${order.phone}</td>

<td>${order.total.toLocaleString()} تومان</td>

<td>

<select
class="status-select"
data-id="${order.id}">

<option value="pending" ${order.status==="pending"?"selected":""}>در انتظار</option>

<option value="confirmed" ${order.status==="confirmed"?"selected":""}>تایید شده</option>

<option value="shipping" ${order.status==="shipping"?"selected":""}>آماده ارسال</option>

<option value="sent" ${order.status==="sent"?"selected":""}>ارسال شده</option>

<option value="cancelled" ${order.status==="cancelled"?"selected":""}>لغو شده</option>

</select>

</td>

<td>${new Date(order.createdAt).toLocaleDateString("fa-IR")}</td>

<td>

<button class="view-btn" data-id="${order.id}">
مشاهده
</button>

<button class="invoice-btn" data-id="${order.id}">
🖨 چاپ
</button>

</td>
`;

        tbody.appendChild(tr);

    });

    document.getElementById("orders-count").textContent=orders.length;

    document.getElementById("orders-total").textContent=
    totalSales.toLocaleString()+" تومان";

}

document.addEventListener("change",async(e)=>{

    if(!e.target.classList.contains("status-select")) return;

    const id =
    e.target.dataset.id;

    const status =
    e.target.value;

    await fetch(`/orders/${id}/status`,{

        method:"PATCH",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            status
        })

    });

});

document.addEventListener("click", async (e) => {

    if (e.target.classList.contains("invoice-btn")) {

        const id = e.target.dataset.id;

        window.open(`/orders/${id}/invoice`, "_blank");

        return;
    }

    if (!e.target.classList.contains("view-btn")) return;

    const id = e.target.dataset.id;

    const res = await fetch(`/orders/${id}`);

    const order = await res.json();

    modalBody.innerHTML = `
<h2>سفارش #${order.id}</h2>

<p><b>مشتری:</b> ${order.fullName}</p>

<p><b>موبایل:</b> ${order.phone}</p>

<p><b>آدرس:</b> ${order.address}</p>

<hr>

<h3>محصولات</h3>

<table>

<tr>
<th>محصول</th>
<th>تعداد</th>
<th>قیمت</th>
</tr>

${order.items.map(item=>`

<tr>

<td>${item.product.name}</td>

<td>${item.quantity}</td>

<td>${item.price.toLocaleString()} تومان</td>

</tr>

`).join("")}

</table>

<h3 style="margin-top:20px">

جمع کل:
${order.total.toLocaleString()} تومان

</h3>
`;

    modal.classList.add("active");

});

const modal =
document.getElementById("order-modal");

const modalBody =
document.getElementById("modal-body");

const closeModal =
document.getElementById("close-modal");

closeModal.onclick = ()=>{

    modal.classList.remove("active");

};

window.onclick=(e)=>{

    if(e.target===modal){

        modal.classList.remove("active");

    }

};
document.getElementById("search-order").addEventListener("input",(e)=>{

    const value=e.target.value.trim().toLowerCase();

    const filtered=allOrders.filter(order=>{

        return(

            order.fullName.toLowerCase().includes(value) ||

            order.phone.includes(value) ||

            String(order.id).includes(value)

        );

    });

    renderOrders(filtered);

});