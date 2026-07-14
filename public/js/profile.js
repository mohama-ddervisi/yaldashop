const user = getCurrentUser();

if(!user){

    window.location.href="/login.html";

}

document.getElementById("profile-name").textContent =
user.fullName;

document.getElementById("profile-phone").textContent =
user.phone || "";

document.getElementById("profile-email").textContent =
user.email || "";