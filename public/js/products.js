 let allProducts = [];
let filtersRendered = false;

const params = new URLSearchParams(window.location.search);

const category = params.get("category");
const searchQuery = params.get("q");

async function loadProducts() {

    try{

      let url = "/products";

const query = [];

if (category) {

    query.push(`category=${encodeURIComponent(category)}`);

}

if (searchQuery) {

    query.push(`q=${encodeURIComponent(searchQuery)}`);

}

if (query.length) {

    url += "?" + query.join("&");

}

const response = await fetch(url);

const data = await response.json();

allProducts = data.products;

let products = [...allProducts];

        // Search

        if(searchQuery){

            products = products.filter(product =>

                product.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())

                ||

                (product.brand || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())

            );

        }

       

      

        // Sort

        const sortSelect =
        document.getElementById("sort-select");

        if(sortSelect){

            switch(sortSelect.value){

                case "cheap":

                    products.sort((a,b)=>a.price-b.price);

                break;

                case "expensive":

                    products.sort((a,b)=>b.price-a.price);

                break;

                case "name":

                    products.sort((a,b)=>

                        a.name.localeCompare(b.name,"fa")

                    );

                break;

                case "discount":

                    products.sort((a,b)=>

                        (b.discount||0)-(a.discount||0)

                    );

                break;

            }

        }

        const container =
        document.getElementById("products-container");

        container.innerHTML = "";

        const productsCount =
document.getElementById("products-count");

if(productsCount){

    productsCount.textContent =
    `${products.length} محصول`;

}

  products.forEach(product => {

container.innerHTML += `

<div class="product-card">

    ${product.discount ? `
    <div class="discount-badge">
        ${product.discount}%
    </div>
    ` : ""}

   <button
    class="wishlist-btn"
    data-slug="${product.slug}">

   <img
class="wishlist-icon"
src="${
isInWishlist(product.slug)
? "/images/heart-suit-svgrepo-com.svg"
: "/images/heart-regular-full.svg"
}"
alt="wishlist">

</button>

    <a href="/product.html?slug=${product.slug}"
       class="product-image-box">

        <img
        src="${product.image || "/images/nop.jpg"}"
        alt="${product.name}"
        class="product-image">

    </a>

    <div class="product-content">

        <span class="product-brand">

            ${product.brand || "YALDA SHOP"}

        </span>

        <h3 class="product-title">

            ${product.name}

        </h3>
       
     
        <div class="product-prices">

            ${
                product.oldPrice
                ?

                `<span class="old-price">

                ${Number(product.oldPrice).toLocaleString("en-US")} تومان

                </span>`

                : ""
            }

            <span class="new-price">

                ${Number(product.price).toLocaleString("en-US")} تومان

            </span>

        </div>

        <button
        class="product-btn"
        
        onclick="goProduct('${product.slug}')">

            مشاهده محصول

        </button>

    </div>

</div>

`;

});
const wishlistButtons =
document.querySelectorAll(".wishlist-btn");

wishlistButtons.forEach(btn=>{

    btn.addEventListener("click",()=>{

        const slug =
        btn.dataset.slug;

        const product =
        allProducts.find(p=>p.slug===slug);

        if(!product) return;

        if(isInWishlist(slug)){

            removeFromWishlist(slug);

            showToast("💔 محصول از علاقه‌مندی حذف شد");

        }else{

            addToWishlist(product);

            showToast("❤️ محصول به علاقه‌مندی اضافه شد");

        }

       updateWishlistBadge();

const icon = btn.querySelector(".wishlist-icon");

if(icon){

    icon.src = isInWishlist(slug)

    ? "/images/heart-suit-svgrepo-com.svg"

    : "/images/heart-regular-full.svg";
    
icon.classList.remove("pop");

void icon.offsetWidth;

icon.classList.add("pop");
}

    });

});
    }

    catch(error){

        console.error(error);

    }

}
loadProducts();

// تبدیل نام دسته

const categoryNames = {

    all: "همه محصولات",

    serving: "ظروف پذیرایی",

    cups: "لیوان و فنجان",

    cutlery: "قاشق و چنگال",

    cooking: "لوازم پخت و پز",

    storage: "ظروف نگهداری",

    kitchen: "لوازم آشپزخانه",

    others: "سایر محصولات"

};

const pageTitle =
document.getElementById("page-title");

const categoryTitle =
document.getElementById("category-title");

if(categoryNames[category]){

    pageTitle.textContent =
    categoryNames[category];

    categoryTitle.textContent =
    categoryNames[category];

}

function goProduct(slug){

    window.location.href =
    `/product.html?slug=${slug}`;

}



// مرتب سازی

const sortSelect =
document.getElementById("sort-select");

if(sortSelect){

    sortSelect.addEventListener("change",loadProducts);

}

