const axios = require("axios");
const prisma = require("../lib/prisma");

async function requestPayment(req, res) {

    try {

        const { orderId } = req.body;

        const order = await prisma.order.findUnique({

            where: {
                id: Number(orderId)
            }

        });

        if (!order) {

            return res.status(404).json({

                success: false,
                message: "سفارش پیدا نشد."

            });

        }

        const response = await axios.post(

            "https://gateway.zibal.ir/v1/request",

            {

                merchant: process.env.ZIBAL_API_KEY,

                amount: order.total,

                callbackUrl: "https://yaldashoping.ir/payment/callback",

                description: `پرداخت سفارش ${order.id}`,

                orderId: String(order.id),

                mobile: order.phone

            }

        );

        if (response.data.result !== 100) {

            return res.status(400).json({

                success: false,
                message: response.data.message

            });

        }

        await prisma.order.update({

            where: {

                id: order.id

            },

            data: {

                authority: response.data.trackId

            }

        });

        return res.json({

            success: true,

            paymentUrl:
                `https://gateway.zibal.ir/start/${response.data.trackId}`

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

}

async function verifyPayment(req, res) {

    res.json({

        success: true,

        message: "verifyPayment آماده است."

    });

}

module.exports = {

    requestPayment,

    verifyPayment

};