let allProducts = [];

const searchInput =
document.querySelector(".search-input");

const resultsBox =
document.querySelector(".search-results");

async function initSearch(){

    if(!searchInput || !resultsBox) return;

    const response =
    await fetch("/products");

    allProducts =
    await response.json();

}

initSearch();

searchInput.addEventListener("input",()=>{

    const value =
    searchInput.value
    .trim()
    .toLowerCase();

    resultsBox.innerHTML = "";

    if(value === ""){

        resultsBox.style.display = "none";

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

        resultsBox.style.display="block";

        return;

    }

    result.forEach(product=>{

        resultsBox.innerHTML +=

        `
        <div
        class="search-item"
        data-slug="${product.slug}">

            ${product.name}

        </div>
        `;

    });

    resultsBox.style.display="block";

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
searchInput.addEventListener("keydown",(e)=>{

    if(e.key === "Escape"){

        resultsBox.style.display="none";

    }

});
searchInput.addEventListener("keydown",(e)=>{

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