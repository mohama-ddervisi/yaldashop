const prisma = require("../lib/prisma");

async function createMessage(req, res) {

    try {

        const { fullName, phone, message } = req.body;

        if (!fullName || !phone || !message) {

            return res.status(400).json({

                success: false,
                message: "لطفاً همه فیلدها را پر کنید."

            });

        }

        if (!/^09\d{9}$/.test(phone)) {

            return res.status(400).json({

                success: false,
                message: "شماره موبایل معتبر نیست."

            });

        }

        await prisma.contactMessage.create({

            data: {
                fullName,
                phone,
                message
            }

        });

        res.json({

            success: true,
            message: "پیام شما با موفقیت ثبت شد."

        });

    }

    catch (error) {

        console.error("CONTACT MESSAGE ERROR:");
        console.error(error);

        res.status(500).json({

            success: false,
            message: "خطای سرور"

        });

    }

}

async function getMessages(req, res) {

    try {

        const messages = await prisma.contactMessage.findMany({

            orderBy: {
                createdAt: "desc"
            }

        });

        res.json({

            success: true,
            messages

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "خطای سرور"

        });

    }

}
async function createMessage(req, res) {

    console.log("=== createMessage START ===");
    console.log(req.body);

    try {

        const { fullName, phone, message } = req.body;

        console.log("Before prisma.create");

        await prisma.contactMessage.create({
            data: {
                fullName,
                phone,
                message
            }
        });

        console.log("After prisma.create");

        res.json({
            success: true,
            message: "پیام شما با موفقیت ثبت شد."
        });

    } catch (error) {
        console.error("CONTACT MESSAGE ERROR:");
        console.error(error);

        res.status(500).json({
            success: false,
            message: "خطای سرور"
        });
    }
}
module.exports = {

    createMessage,
    getMessages

};