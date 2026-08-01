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
const logoutBtn = document.getElementById("logout-profile-btn");

if(logoutBtn){
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login.html";
    });
}