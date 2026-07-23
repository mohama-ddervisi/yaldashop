function getCurrentUser() {

    const user = localStorage.getItem("user");

    return user ? JSON.parse(user) : null;

}

function isLoggedIn() {

    return !!localStorage.getItem("token");

}

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "/login.html";

}
function updateProfileUI(){

    const link =
    document.getElementById("profile-link");

    const name =
    document.getElementById("profile-name");

    if(!link || !name) return;

    const user =
    getCurrentUser();

    if(!user){

        link.href="/login.html";

        name.textContent="";

        return;

    }

    link.removeAttribute("href");

    name.textContent=user.fullName;

}
const profileLink =
document.getElementById("profile-link");

const sheet =
document.getElementById("profile-sheet");

const overlay =
document.getElementById("profile-overlay");

const logoutButton =
document.getElementById("sheet-logout");

function openProfileSheet(){

    const user =
    getCurrentUser();

    if(!user){

        window.location.href="/login.html";

        return;

    }

    document.getElementById("sheet-name").textContent =
    user.fullName;

    document.getElementById("sheet-email").textContent =
    user.email || user.phone;

    sheet.classList.add("active");

    overlay.classList.add("active");

}
function closeProfileSheet(){

    sheet.classList.remove("active");

    overlay.classList.remove("active");

}profileLink?.addEventListener("click",(e)=>{

    e.preventDefault();

    openProfileSheet();

});

overlay?.addEventListener("click",closeProfileSheet);

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        closeProfileSheet();

    }

});

logoutButton?.addEventListener("click",()=>{

    logout();

});
document.querySelectorAll("#profile-link, #header-profile-link").forEach(link => {

    link.addEventListener("click", (e) => {

        e.preventDefault();

        openProfileSheet();

    });

});
