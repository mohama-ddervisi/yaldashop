const form =
document.getElementById("login-form");

form.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const username =
document.getElementById("login-username")
.value.trim();

const body = {

    phone: username,

    password:
    document.getElementById("login-password").value

};

    try{

        const response =
        await fetch("/auth/login",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(body)

        });

        const data =
        await response.json();

        if(!data.success){

            showToast(data.message);

            return;

        }

        localStorage.setItem(

            "token",

            data.token

        );

        localStorage.setItem(

            "user",

            JSON.stringify(data.user)

        );

        showToast("ورود با موفقیت انجام شد.");

        setTimeout(()=>{

            window.location.href="/";

        },1000);

    }

    catch(error){

        console.error(error);

        showToast("خطا در ارتباط با سرور");

    }

});