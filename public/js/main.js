let allProducts = [];

const searchInput =
document.querySelector(".search-input");

const resultsBox =
document.querySelector(".search-results");

async function initSearch(){

    console.log("1");

    if(!searchInput || !resultsBox){
        console.log("2");
        return;
    }

    console.log("3");

    const response = await fetch("/products");

    console.log("4", response.status);

    const data = await response.json();

    console.log("5", data);

    allProducts = data.products || [];

    console.log("6", allProducts);

}

initSearch();

searchInput?.addEventListener("input", () => {

    const value =
    searchInput.value
    .trim()
    .toLowerCase();

    resultsBox.innerHTML = "";

    if(value === ""){

      resultsBox.style.opacity = "0";
resultsBox.style.transform = "translateY(-1rem)";
resultsBox.style.pointerEvents = "none";

setTimeout(() => {

    resultsBox.style.display = "none";

},280);

        return;

    }

    const result =
    allProducts.filter(product=>{

        return(

            product.name
            .toLowerCase()
            .includes(value)

            ||

            product.brand
            .toLowerCase()
            .includes(value)

        );

    });

    if(result.length === 0){

        resultsBox.innerHTML =

        `
        <div class="search-empty">

            محصولی یافت نشد

        </div>
        `;

     

        return;

    }

    result.forEach(product=>{

     resultsBox.innerHTML += `

<div
class="search-item"
data-slug="${product.slug}">

<img
src="${product.image || "/images/nop.jpg"}"
alt="${product.name}">

<div class="search-info">

<div class="search-name">

${product.name}

</div>

<div class="search-brand">

${product.brand || "YALDA SHOP"}

</div>

<div class="search-price">

${Number(product.price).toLocaleString("en-US")} تومان

</div>

</div>

</div>


`;
    });

resultsBox.style.display = "block";

requestAnimationFrame(() => {

    resultsBox.style.opacity = "1";
    resultsBox.style.transform = "translateY(0)";
    resultsBox.style.pointerEvents = "auto";

});

});
resultsBox.addEventListener("click",(e)=>{

    const item =
    e.target.closest(".search-item");

    if(!item) return;

    window.location.href =
    `/product.html?slug=${item.dataset.slug}`;

});
document.addEventListener("click",(e)=>{

    if(

        !e.target.closest(".search-box")

    ){

        resultsBox.style.display = "none";

    }

});
searchInput?.addEventListener("keydown",(e)=>{

    if(e.key === "Escape"){

        resultsBox.style.display="none";

    }

});

searchInput?.addEventListener("keydown",(e)=>{

    if(e.key === "Enter"){

        const value =
        searchInput.value.trim();

        if(value !== ""){

            window.location.href =
            `/products.html?q=${encodeURIComponent(value)}`;

        }

    }

});
const categoryItems =
document.querySelectorAll(".category-item");

categoryItems.forEach(item => {

    item.addEventListener("click", () => {

        const category =
        item.dataset.category;

        window.location.href =
        `/products.html?category=${category}`;

    });

});
/*======================================
MOBILE MENU
======================================*/

const menuToggle =
document.getElementById("menu-toggle");

const mobileMenu =
document.querySelector(".mobile-menu");

const mobileOverlay =
document.querySelector(".mobile-overlay");

const closeBtn =
document.getElementById("mobile-close");

function openMenu(){

    mobileMenu.classList.add("active");

    mobileOverlay.classList.add("active");

    document.body.style.overflow = "hidden";

    menuToggle.checked = true;

}

function closeMenu(){

    mobileMenu.classList.remove("active");

    mobileOverlay.classList.remove("active");

    document.body.style.overflow = "";

    menuToggle.checked = false;

}

if(menuToggle){

    menuToggle.addEventListener("change",()=>{

        if(menuToggle.checked){

            openMenu();

        }else{

            closeMenu();

        }

    });

}

if(closeBtn){

    closeBtn.addEventListener("click",closeMenu);

}

if(mobileOverlay){

    mobileOverlay.addEventListener("click",closeMenu);

}

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        closeMenu();

    }
document
.querySelectorAll(".mobile-nav a")
.forEach(link=>{

link.addEventListener("click",()=>{

closeMenu();

});

});
});
const showcaseBtn = document.querySelector(".showcase-btn");
const categories = document.getElementById("categories");

let isAnimating = false;

showcaseBtn.addEventListener("click", () => {

    if (isAnimating) return;

    isAnimating = true;

    categories.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    setTimeout(() => {

        // رفتن تا انتهای اسکرول
        categories.scrollTo({
            left: categories.scrollWidth,
            behavior: "smooth"
        });

        setTimeout(() => {

            // برگشت به اول
            categories.scrollTo({
                left: 0,
                behavior: "smooth"
            });

            setTimeout(() => {

                isAnimating = false;

            }, 900);

        }, 1200);

    }, 700);

});

const searchBtn = document.getElementById("search-btn");
const searchOverlay = document.getElementById("search-overlay");
const searchBox = document.getElementById("search-box");

searchBtn?.addEventListener("click", (e) => {

    e.preventDefault();

    searchOverlay.classList.add("active");
    searchBox.classList.add("active");

    document.querySelector(".search-input")?.focus();

});

searchOverlay?.addEventListener("click", () => {

    searchOverlay.classList.remove("active");
    searchBox.classList.remove("active");

});