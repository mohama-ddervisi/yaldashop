const contactForm = document.getElementById("contact-form");
const contactAlert = document.getElementById("contact-alert");
const submitBtn = document.getElementById("contact-submit-btn");

function showAlert(message, type) {

    contactAlert.textContent = message;
    contactAlert.className = "contact-alert " + type;

}

contactForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const fullName = document.getElementById("contact-name").value.trim();
    const phone = document.getElementById("contact-phone").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    if (!/^09\d{9}$/.test(phone)) {

        showAlert("شماره موبایل معتبر نیست.", "error");
        return;

    }

    submitBtn.disabled = true;
    submitBtn.textContent = "در حال ارسال...";

    try {

        const response = await fetch("/contact", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                fullName,
                phone,
                message
            })

        });

        const data = await response.json();

        if (!data.success) {

            showAlert(data.message || "خطا در ارسال پیام.", "error");
            submitBtn.disabled = false;
            submitBtn.textContent = "ارسال پیام";
            return;

        }

        showAlert("پیام شما با موفقیت ارسال شد. به‌زودی با شما تماس می‌گیریم.", "success");
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = "ارسال پیام";

    }

    catch (error) {

        console.error(error);
        showAlert("خطا در ارتباط با سرور.", "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "ارسال پیام";

    }

});