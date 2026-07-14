async function loadProducts() {

    try {

       const res = await fetch("/admin/products", {
    method: "POST",
    body: formData
});

console.log("STATUS:", res.status);

const text = await res.text();

console.log(text);

return;

        console.log(data);
console.log(data.products);

        if (!data.success) return;

        const tbody = document.getElementById("products-table");

        tbody.innerHTML = "";

        let totalStock = 0;
        let lowStock = 0;
        let inactive = 0;

        document.getElementById("total-products").textContent =
            data.products.length;

        data.products.forEach(product => {

            totalStock += product.stock;

            if (product.stock <= 5) lowStock++;

            if (!product.isActive) inactive++;

            tbody.innerHTML += `

            <tr>

                <td>

                    <img src="${product.image}" alt="${product.name}">

                </td>

                <td>${product.name}</td>

                <td>${product.category}</td>

                <td>${product.price.toLocaleString("fa-IR")} تومان</td>

                <td>${product.stock}</td>

                <td>${product.soldCount}</td>

                <td>

                    ${product.isActive
                        ? '<span style="color:green">فعال</span>'
                        : '<span style="color:red">غیرفعال</span>'}

                </td>

                <td>

                    <button class="action-btn edit">ویرایش</button>

                    <button class="action-btn delete">حذف</button>

                </td>

            </tr>

            `;

        });

        document.getElementById("total-stock").textContent = totalStock;

        document.getElementById("low-stock").textContent = lowStock;

        document.getElementById("inactive-products").textContent = inactive;

    }

    catch (err) {

        console.error(err);

    }

}

loadProducts();

/* ================= Modal ================= */

const modal =
document.getElementById("product-modal");

const openBtn =
document.getElementById("add-product");

const closeBtn =
document.getElementById("close-modal");

openBtn.addEventListener("click",()=>{

    document.getElementById("modal-title").textContent =
    "افزودن محصول";

    document.getElementById("product-form").reset();

    document.getElementById("isActive").checked = true;

    modal.classList.add("active");

});

closeBtn.addEventListener("click",()=>{

    modal.classList.remove("active");

});

modal.addEventListener("click",(e)=>{

    if(e.target===modal){

        modal.classList.remove("active");

    }

});

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        modal.classList.remove("active");

    }

});
const imageInput =
document.getElementById("images");

const preview =
document.getElementById("image-preview");

imageInput.addEventListener("change", () => {

    preview.innerHTML = "";

    [...imageInput.files].forEach(file => {

        const reader = new FileReader();

        reader.onload = e => {

            preview.innerHTML += `

                <img
                    src="${e.target.result}"
                    class="preview-image">

            `;

        };

        reader.readAsDataURL(file);

    });

});
const form =
document.getElementById("product-form");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(form);

    console.log("FORM SUBMITTED");

    console.log("BEFORE FETCH");

    try {

        const res = await fetch("/admin/products", {

            method: "POST",

            body: formData

        });

        const data = await res.json();

        if (data.success) {

            alert("محصول با موفقیت اضافه شد");

            modal.classList.remove("active");

            form.reset();

            loadProducts();

        } else {

            alert(data.message);

        }

    }

    catch (err) {

        console.error(err);

    }

});