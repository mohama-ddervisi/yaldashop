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
     alert("خطا در ارتباط با سرور: " + err.message);
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
    document.getElementById("colors-list").innerHTML = "";
    colorRowCount = 0;

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

formData.append("colors", JSON.stringify(getColorsFromForm()));
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

    document.getElementById("colors-list").innerHTML = "";
    colorRowCount = 0;

    (product.colors || []).forEach(color => {
        addColorRow(color);
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
let colorRowCount = 0;

function addColorRow(data = {}) {

    colorRowCount++;
    const rowId = `color-row-${colorRowCount}`;

    const list = document.getElementById("colors-list");

    const div = document.createElement("div");
    div.className = "color-row";
    div.id = rowId;
    div.style.display = "flex";
    div.style.gap = "8px";
    div.style.marginBottom = "8px";
    div.style.alignItems = "center";

    div.innerHTML = `
        <input
            type="text"
            placeholder="نام رنگ (مثلاً قرمز)"
            class="color-name-input"
            value="${data.name || ""}">

        <input
            type="color"
            class="color-hex-input"
            value="${data.hexCode || "#000000"}">

        <input
            type="number"
            placeholder="قیمت اختصاصی (اختیاری)"
            class="color-price-input"
            value="${data.priceOverride || ""}">

        <button
            type="button"
            onclick="document.getElementById('${rowId}').remove()">
            حذف
        </button>
    `;

    list.appendChild(div);


    const nameInput = div.querySelector(".color-name-input");
    const hexInput = div.querySelector(".color-hex-input");

    const colorNameMap = {
        "قرمز":"#ff0000","آبی":"#0000ff","سبز":"#00aa00","زرد":"#ffd700",
        "مشکی":"#000000","سیاه":"#000000","سفید":"#ffffff","نارنجی":"#ff8c00",
        "بنفش":"#8a2be2","صورتی":"#ff69b4","قهوه‌ای":"#8b4513","قهوه ای":"#8b4513",
        "طلایی":"#ffd700","نقره‌ای":"#c0c0c0","نقره ای":"#c0c0c0","خاکستری":"#808080",
        "کرم":"#fffdd0","آبی روشن":"#87ceeb","آبی تیره":"#00008b","سبز روشن":"#90ee90",
        "سبز تیره":"#006400","بژ":"#f5f5dc","یاسی":"#c8a2c8","فیروزه‌ای":"#40e0d0",
        "فیروزه ای":"#40e0d0","گلبهی":"#ffdab9","نیلوفری":"#7c5295","یشمی":"#00a86b",
        "زرشکی":"#8b0000","سرمه‌ای":"#001f54","سرمه ای":"#001f54","عنابی":"#8b0000",
        "شرابی":"#722f37","خردلی":"#c8a951","پسته‌ای":"#9dc183","پسته ای":"#9dc183",
        "کالباسی":"#e32636","یاقوتی":"#e0115f","زمردی":"#50c878","کهربایی":"#ffbf00",
        "آجری":"#b7410e","دودی":"#848482","استخوانی":"#e3dac9","عسلی":"#ffb300",
        "هلویی":"#ffdab9","لیمویی":"#dfff4f","آبی آسمانی":"#87ceeb","آبی کاربنی":"#36454f",
        "آبی نفتی":"#1b1b3a","سبز زیتونی":"#808000","سبز یشمی":"#00a86b","سبز چمنی":"#7cfc00",
        "صورتی کمرنگ":"#ffd1dc","بنفش کمرنگ":"#dcd0ff","بادمجانی":"#470024","گیلاسی":"#990024",
        "خاکی":"#c3b091","فیلی":"#e4d4c8","یخی":"#afeeee","توسی":"#8a8a8a",
        "موشی":"#9a9a9a","شکلاتی":"#7b3f00","کرمی":"#fffdd8","انگوری":"#6f2da8",
        "ارغوانی":"#8b008b","لاجوردی":"#26619c","تیفانی":"#0abab5","مسی":"#b87333",
        "برنزی":"#cd7f32","فیروزه":"#30d5c8","آبی یخی":"#a1caf1","خاکستری روشن":"#d3d3d3",
        "خاکستری تیره":"#404040","قرمز تیره":"#8b0000","قرمز روشن":"#ff6666",
        "زرد روشن":"#fff176","زرد تیره":"#c9a227","نارنجی تیره":"#cc5500",
        "صورتی تیره":"#c2185b","بنفش تیره":"#4b0082","قهوه‌ای روشن":"#c19a6b",
        "قهوه ای روشن":"#c19a6b","قهوه‌ای تیره":"#4b2e1e","قهوه ای تیره":"#4b2e1e"
    };

    nameInput.addEventListener("blur", () => {

        const typed = nameInput.value.trim().replace(/ي/g,"ی").replace(/ك/g,"ک");

        if (colorNameMap[typed]) {

            hexInput.value = colorNameMap[typed];
            hexInput.style.outline = "";

        } else if (typed) {

            hexInput.style.outline = "2px solid red";

        }

    });
}

document.getElementById("add-color-btn")
    .addEventListener("click", () => addColorRow());

function getColorsFromForm() {

    const rows = document.querySelectorAll(".color-row");

    const colors = [];

    rows.forEach(row => {

        const name = row.querySelector(".color-name-input").value.trim();
        const hexCode = row.querySelector(".color-hex-input").value;
        const priceOverride = row.querySelector(".color-price-input").value;

        if (name) {
            colors.push({
                name,
                hexCode,
                priceOverride: priceOverride || null
            });
        }

    });

    return colors;
}
