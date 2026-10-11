const CART_KEY = "yalda-cart";

function getCart(){

    const cart = localStorage.getItem(CART_KEY);

    return cart ? JSON.parse(cart) : [];

}

function saveCart(cart){

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}

function addToCart(product, quantity = 1, colorName = null){

    const cart = getCart();

    const existing = cart.find(item => item.slug === product.slug && (item.colorName || "") === (colorName || ""));

    if(existing){

        existing.quantity += quantity;

    }else{

        cart.push({

            slug: product.slug,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: quantity,

            colorName: colorName

        });

    }

    saveCart(cart);

}

function removeFromCart(slug, colorName = null){

    let cart = getCart();

    cart = cart.filter(item => !(item.slug === slug && (item.colorName || "") === (colorName || "")));

    saveCart(cart);

}

function clearCart(){

    localStorage.removeItem(CART_KEY);

}
function updateQuantity(slug, quantity, colorName = null){

    const cart = getCart();

    const item = cart.find(p => p.slug === slug && (p.colorName || "") === (colorName || ""));

    if(item){

        item.quantity = quantity;

    }

    saveCart(cart);

}

function getCartTotal(){

    const cart = getCart();

    return cart.reduce((sum,item)=>{

        return sum + item.price * item.quantity;

    },0);

}
function getCartCount(){

    const cart = getCart();

    return cart.reduce((total,item)=>{

        return total + item.quantity;

    },0);

}
function updateCartBadge(){

    const badge =
    document.getElementById("cart-count");

    if(!badge) return;

    badge.textContent =
    getCartCount();

}
