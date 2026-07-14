const WISHLIST_KEY = "yalda-wishlist";

function getWishlist(){

    const wishlist = localStorage.getItem(WISHLIST_KEY);

    return wishlist ? JSON.parse(wishlist) : [];

}

function saveWishlist(wishlist){

    localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
    );

}

function addToWishlist(product){

    const wishlist = getWishlist();

    const exists = wishlist.find(item => item.slug === product.slug);

    if(exists) return;

    wishlist.push(product);

    saveWishlist(wishlist);

}

function removeFromWishlist(slug){

    let wishlist = getWishlist();

    wishlist = wishlist.filter(item => item.slug !== slug);

    saveWishlist(wishlist);

}

function isInWishlist(slug){

    return getWishlist().some(item => item.slug === slug);

}

function getWishlistCount(){

    return getWishlist().length;

}

function updateWishlistBadge(){

    const badge =
        document.getElementById("wishlist-count");

    if(!badge) return;

    const count = getWishlistCount();

    badge.textContent = count;

    if(count === 0){

        badge.style.display = "none";

    }else{

        badge.style.display = "flex";

    }

}