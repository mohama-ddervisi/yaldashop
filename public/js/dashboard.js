async function loadDashboard() {

    try {

        const res = await fetch("/dashboard");

        const data = await res.json();

        if (!data.success) return;

        document.getElementById("total-sales").textContent =
            data.totalSales.toLocaleString("fa-IR") + " تومان";

        document.getElementById("total-orders").textContent =
            data.totalOrders;

        document.getElementById("total-products").textContent =
            data.totalProducts;

        document.getElementById("total-customers").textContent =
            data.totalCustomers;

        document.getElementById("low-stock").textContent =
            data.lowStock;

        const tbody = document.getElementById("latest-orders");

        tbody.innerHTML = "";

        data.latestOrders.forEach(order => {

            tbody.innerHTML += `
                <tr>
                    <td>#${order.id}</td>
                    <td>${order.fullName}</td>
                    <td>${order.phone}</td>
                    <td>${order.total.toLocaleString("fa-IR")} تومان</td>
                    <td>${order.status}</td>
                </tr>
            `;

        });

        // محصولات کم موجود

const lowStockBox = document.getElementById("low-stock-products");

lowStockBox.innerHTML = "";

data.lowStockProducts.forEach(product => {

    lowStockBox.innerHTML += `
        <div class="product-item">

            <div class="product-info">

                <img src="${product.image}" alt="${product.name}">

                <div class="product-name">
                    ${product.name}
                </div>

            </div>

            <div class="product-value low">
                ${product.stock}
            </div>

        </div>
    `;

});


// پرفروش‌ترین محصولات

const topProductsBox = document.getElementById("top-products");

topProductsBox.innerHTML = "";

data.topProducts.forEach(product => {

    topProductsBox.innerHTML += `
        <div class="product-item">

            <div class="product-info">

                <img src="${product.image}" alt="${product.name}">

                <div class="product-name">
                    ${product.name}
                </div>

            </div>

            <div class="product-value top">
                ${product.soldCount}
            </div>

        </div>
    `;

});
renderSalesChart(
    data.chart.labels,
    data.chart.sales
);
    }

    catch (err) {

        console.error(err);

    }

}
function renderSalesChart(labels, sales){

    const ctx = document
        .getElementById("salesChart")
        .getContext("2d");

    new Chart(ctx,{

        type:"line",

        data:{

            labels,

            datasets:[{

                label:"فروش",

                data:sales,

                borderWidth:3,

                tension:.35,

                fill:true

            }]

        },

      options:{

    responsive:true,

    maintainAspectRatio:false,

    aspectRatio:2,

    plugins:{
        legend:{
            display:false
        }
    },

    scales:{
        y:{
            beginAtZero:true
        }
    }

}

    });

}

loadDashboard();