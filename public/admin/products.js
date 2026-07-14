async function loadProducts() {

    try {

        const res = await fetch("/admin/products");

       const data = await res.json();

if (!data.success) return;

allProducts = data.products; 
const categoryFilter =
document.getElementById("category-filter");



   const categories = [

    "ظروف پذیرایی",

    "لیوان و فنجان",

    "قاشق و چنگال",

    "لوازم پخت و پز",

    "ظروف نگهداری",

    "لوازم آشپزخانه",

    "سایر محصولات"

];

categoryFilter.innerHTML =

`<option value="">همه دسته بندی ها</option>`;

categories.forEach(category=>{

    categoryFilter.innerHTML +=

    `<option value="${category}">

        ${category}

    </option>`;

});

filteredProducts = [...allProducts];

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

        renderProducts(filteredProducts);

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

let editingId = null;
let allProducts = [];
let filteredProducts = [];

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

        const url = editingId
    ? `/admin/products/${editingId}`
    : "/admin/products";

const method = editingId
    ? "PUT"
    : "POST";

const res = await fetch(url, {

    method,

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

function editProduct(id){

     console.log("EDIT CLICKED", id);
console.log("allProducts =", allProducts);
console.log("id =", id);
    const product =
        allProducts.find(p => p.id === id);

    if(!product) return;

    editingId = id;

    document.getElementById("modal-title").textContent =
    "ویرایش محصول";

    document.getElementById("name").value =
    product.name || "";

    document.getElementById("brand").value =
    product.brand || "";

    document.getElementById("price").value =
    product.price || "";

    document.getElementById("oldPrice").value =
    product.oldPrice || "";

    document.getElementById("discount").value =
    product.discount || "";

    document.getElementById("stock").value =
    product.stock || "";

    document.getElementById("category").value =
    product.category || "";

    document.getElementById("feature1").value =
    product.feature1 || "";

    document.getElementById("feature2").value =
    product.feature2 || "";

    document.getElementById("description").value =
    product.description || "";

    document.getElementById("isActive").checked =
    product.isActive;

    const currentImages =
document.getElementById("current-images");

currentImages.innerHTML = "";

product.images.forEach(image=>{

    currentImages.innerHTML += `

    <div class="current-image">

        <img src="${image.image}">

      <button
    type="button"
    class="delete-image"
    onclick="deleteImage(${image.id})">

    ×

</button>

    </div>

    `;

});

    modal.classList.add("active");

}

async function deleteProduct(id){

    const ok = confirm("از حذف این محصول مطمئن هستید؟");

    if(!ok) return;

    try{

        const res = await fetch(`/admin/products/${id}`,{
            method:"DELETE"
        });

        const data = await res.json();

        console.log(data);

        if(data.success){

            alert("محصول حذف شد");

            loadProducts();

        }else{

            alert(data.message);

        }

    }catch(err){

        console.error(err);

    }

}

function renderProducts(products){

    const tbody =
    document.getElementById("products-table");

    tbody.innerHTML = "";

    products.forEach(product=>{

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

                ${
                    product.isActive
                    ?'<span style="color:green">فعال</span>'
                    :'<span style="color:red">غیرفعال</span>'
                }

            </td>

            <td>

                <button
                    class="action-btn edit"
                    onclick="editProduct(${product.id})">

                    ویرایش

                </button>

                <button
                    class="action-btn delete"
                    onclick="deleteProduct(${product.id})">

                    حذف

                </button>

            </td>

        </tr>

        `;

    });

}
const searchInput = document.getElementById("search");

searchInput.addEventListener("input", () => {

    const value = searchInput.value
        .trim()
        .toLowerCase();

    filteredProducts = allProducts.filter(product => {

        return (

            product.name.toLowerCase().includes(value) ||

            product.category.toLowerCase().includes(value) ||

            (product.brand || "")
                .toLowerCase()
                .includes(value)

        );

    });

    renderProducts(filteredProducts);

});
const categoryFilter =

document.getElementById("category-filter");

categoryFilter.addEventListener("change",()=>{
if (imageInput.files.length > 5) {

    alert("حداکثر ۵ تصویر انتخاب کنید.");

    imageInput.value = "";

    preview.innerHTML = "";

    return;

}
    const value = categoryFilter.value;

    if(value===""){

        filteredProducts = [...allProducts];

    }else{

        filteredProducts =

        allProducts.filter(product=>

            product.category===value

        );

    }

    renderProducts(filteredProducts);

});
async function deleteImage(id) {

    const ok = confirm("این عکس حذف شود؟");

    if (!ok) return;

    try {

        const res = await fetch(`/admin/products/image/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();

        if (data.success) {

            alert("عکس حذف شد");

            editProduct(editingId);

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.error(err);

    }

}
window.deleteImage = deleteImage;