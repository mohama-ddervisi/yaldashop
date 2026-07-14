// گرفتن slug از URL
console.log("PRODUCT JS LOADED");

console.log(typeof getCart);
console.log(typeof addToCart);
const params =
new URLSearchParams(
    window.location.search
);

const slug =
params.get("slug");
let currentProduct = null;
async function loadProduct() {

    try {

        // دریافت محصولات

       const response =
    await fetch("/products");

const data =
    await response.json();

const products =
    data.products;

    

        // پیدا کردن محصول

        const product =
            products.find(
                function(p){

                    return p.slug === slug;

                }
            );
currentProduct = product;
        const container =
            document.getElementById(
                "product-container"
            );

        // اگر محصول پیدا نشد

        if(!product){

            container.innerHTML =
                `
                    <h2>
                        Product not found
                    </h2>
                `;

            return;
        }

        // نمایش محصول

      
const images =
product.images.length
? product.images
: [{ image: product.image }];

document.getElementById("main-image").src =
images[0].image;

images.forEach((img,index)=>{

const thumb =
document.getElementById(`thumb-${index+1}`);

if(thumb){

thumb.src = img.image;

thumb.style.display="block";

}
const images =
product.images && product.images.length
? product.images
: [{ image: product.image }];

document.getElementById("main-image").src =
images[0].image;

// ابتدا همه بندانگشتی‌ها مخفی شوند
for(let i = 1; i <= 5; i++){

    const thumb =
    document.getElementById(`thumb-${i}`);

    if(thumb){

        thumb.style.display = "none";

    }

}

// فقط عکس‌های موجود نمایش داده شوند
images.forEach((img,index)=>{

    const thumb =
    document.getElementById(`thumb-${index+1}`);

    if(thumb){

        thumb.src = img.image;

        thumb.style.display = "block";

    }

});
});
document.getElementById("product-name").textContent =
product.name;

document.getElementById("product-brand").textContent =
product.brand;

document.getElementById("product-description").textContent =
product.description;
console.log("name", document.getElementById("product-name"));
console.log("brand", document.getElementById("product-brand"));
console.log("description", document.getElementById("product-description"));
console.log("price", document.getElementById("product-price"));
console.log("stock", document.getElementById("product-stock"));


document.getElementById("product-price").textContent =
`${product.price} تومان`;


document.getElementById("product-stock").textContent =
`موجودی : ${product.stock}`;
    }

    catch(error){

        console.error(
            error
        );

    }

}
const thumbs = document.querySelectorAll(".gallery-thumbs img");

thumbs.forEach(thumb => {

    thumb.addEventListener("click", () => {

        document.getElementById("main-image").src = thumb.src;

        thumbs.forEach(item => {

            item.classList.remove("active");

        });

        thumb.classList.add("active");

    });

});
// اجرا

loadProduct();

let quantity = 1;

const quantityElement = document.getElementById("quantity");

document.getElementById("plus-btn").addEventListener("click",()=>{

    quantity++;

    quantityElement.textContent = quantity;
setTimeout(updateHeart,0);
});

document.getElementById("minus-btn").addEventListener("click",()=>{

    if(quantity > 1){

        quantity--;

        quantityElement.textContent = quantity;

    }

});
const addCartBtn = document.querySelector(".add-cart-btn");
console.log("CLICK");
console.log(currentProduct);
console.log(quantity);

addCartBtn.addEventListener("click", () => {

    addToCart(currentProduct, quantity);

    updateCartBadge();

    console.log(getCart());

    showToast("محصول به سبد خرید اضافه شد");

});
const wishlistBtn =
document.getElementById("wishlist-btn");

const wishlistIcon =
document.getElementById("wishlist-icon");

if(wishlistBtn){

    updateHeart();

    wishlistBtn.addEventListener("click",(e)=>{

        e.preventDefault();

        if(isInWishlist(currentProduct.slug)){

            removeFromWishlist(currentProduct.slug);

            showToast(" محصول از علاقه‌مندی حذف شد");

        }else{

            addToWishlist(currentProduct);

            showToast(" محصول به علاقه‌مندی اضافه شد");

        }

        updateWishlistBadge();

        updateHeart();

    });

}

function updateHeart(){

    if(!currentProduct) return;

    if(isInWishlist(currentProduct.slug)){

     wishlistIcon.src =
"/images/heart-suit-svgrepo-com.svg";

    }else{

        wishlistIcon.src =
        "/images/heart-regular-full.svg";

    }

}

