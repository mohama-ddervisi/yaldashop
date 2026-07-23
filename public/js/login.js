const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const phone = document
        .getElementById("phone-number")
        .value
        .trim();

    if (!/^09\d{9}$/.test(phone)) {

        showToast("شماره موبایل معتبر نیست.");

        return;

    }

    try {

        const response = await fetch("/auth/send-code", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                phone

            })

        });

        const data = await response.json();

        if (!data.success) {

            showToast(data.message);

            return;

        }
console.log("Redirect URL:", `/verify.html?phone=${phone}`);
        window.location.href =
            `/verify.html?phone=${phone}`;

    }

    catch (error) {

        console.error(error);

        showToast("خطا در ارتباط با سرور");

    }

});