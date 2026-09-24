const axios = require("axios");
const prisma = require("../lib/prisma");

const ZIBAL_MERCHANT = process.env.ZIBAL_MERCHANT;
const ZIBAL_REQUEST_URL = "https://gateway.zibal.ir/v1/request";
const ZIBAL_VERIFY_URL = "https://gateway.zibal.ir/v1/verify";
const ZIBAL_START_URL = "https://gateway.zibal.ir/start/";
const CALLBACK_URL = "https://yaldashoping.ir/payment/callback";

async function requestPayment(req, res) {
    try {
        const { orderId } = req.body;

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.json({ success: false, message: "سفارش پیدا نشد." });
        }

        if (order.status === "paid") {
            return res.json({ success: false, message: "این سفارش قبلاً پرداخت شده." });
        }

        const { data } = await axios.post(ZIBAL_REQUEST_URL, {
            merchant: ZIBAL_MERCHANT,
            amount: order.total * 10, // تبدیل تومان به ریال
            callbackUrl: CALLBACK_URL,
            orderId: String(order.id)
        });

        if (data.result === 100) {
            await prisma.order.update({
                where: { id: order.id },
                data: { paymentTrackId: String(data.trackId) }
            });

            return res.json({
                success: true,
                url: ZIBAL_START_URL + data.trackId
            });
        } else {
            return res.json({
                success: false,
                message: "خطا در ایجاد تراکنش (کد " + data.result + ")"
            });
        }

    } catch (err) {
        console.error("requestPayment error:", err.message);
        return res.status(500).json({ success: false, message: "خطای سرور در ارتباط با درگاه." });
    }
}

async function verifyPayment(req, res) {
    try {
        const { trackId, success } = req.query;

        const order = await prisma.order.findFirst({
            where: { paymentTrackId: String(trackId) },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return res.redirect("/order-failed.html");
        }

        if (order.status === "paid") {
            return res.redirect(`/order-success.html?orderId=${order.id}`);
        }

        if (success !== "1") {
            await prisma.order.update({
                where: { id: order.id },
                data: { status: "failed" }
            });
            return res.redirect("/order-failed.html");
        }

        const { data } = await axios.post(ZIBAL_VERIFY_URL, {
            merchant: ZIBAL_MERCHANT,
            trackId: trackId
        });

        if (data.result === 100 || data.result === 201) {

            await prisma.$transaction(async (tx) => {

                await tx.order.update({
                    where: { id: order.id },
                    data: {
                        status: "paid",
                        paymentRef: String(data.refNumber || order.paymentRef || ""),
                        paidAt: order.paidAt || new Date()
                    }
                });

                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: { decrement: item.quantity },
                            soldCount: { increment: item.quantity }
                        }
                    });
                }

            });

            return res.redirect(`/order-success.html?orderId=${order.id}`);
        }
 else {
            await prisma.order.update({
                where: { id: order.id },
                data: { status: "failed" }
            });
            return res.redirect("/order-failed.html");
        }

    } catch (err) {
        console.error("verifyPayment error:", err.message);
        return res.redirect("/order-failed.html");
    }
}

module.exports = {
    requestPayment,
    verifyPayment
};
