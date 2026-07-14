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

function addToCart(product, quantity = 1){

    const cart = getCart();

    const existing = cart.find(item => item.slug === product.slug);

    if(existing){

        existing.quantity += quantity;

    }else{

        cart.push({

            slug: product.slug,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: quantity

        });

    }

    saveCart(cart);

}

function removeFromCart(slug){

    let cart = getCart();

    cart = cart.filter(item => item.slug !== slug);

    saveCart(cart);

}

function clearCart(){

    localStorage.removeItem(CART_KEY);

}
function updateQuantity(slug, quantity){

    const cart = getCart();

    const item = cart.find(p => p.slug === slug);

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
