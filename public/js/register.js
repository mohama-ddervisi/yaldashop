const form = document.getElementById("register-form");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const body = {

        fullName: document.getElementById("fullName").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        email: document.getElementById("email").value.trim(),

        password: document.getElementById("password").value

    };

    try {

        const response = await fetch("/auth/register", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(body)

        });

        const data = await response.json();

        if (data.success) {

            showToast("ثبت‌نام با موفقیت انجام شد.");

            setTimeout(() => {

                window.location.href = "/login.html";

            }, 1500);

        } else {

            showToast(data.message);

        }

    } catch (error) {

        console.error(error);

        showToast("خطا در ارتباط با سرور");

    }

});