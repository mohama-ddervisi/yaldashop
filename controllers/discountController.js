const prisma = require("../lib/prisma");

// دریافت همه کدهای تخفیف
async function getDiscounts(req, res) {

    try {

        const discounts = await prisma.discount.findMany({

            orderBy: {
                createdAt: "desc"
            }

        });

        res.json({

            success: true,
            discounts

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "خطا در دریافت کدهای تخفیف"

        });

    }

}

// افزودن کد تخفیف
async function createDiscount(req, res) {

    try {

        const {

            code,
            type,
            value,
            minPurchase,
            maxDiscount,
            usageLimit,
            expiresAt,
            isActive

        } = req.body;

        const discount = await prisma.discount.create({

            data: {

                code: code.trim().toUpperCase(),

                type,

                value: Number(value),

                minPurchase: minPurchase
                    ? Number(minPurchase)
                    : null,

                maxDiscount: maxDiscount
                    ? Number(maxDiscount)
                    : null,

                usageLimit: usageLimit
                    ? Number(usageLimit)
                    : null,

                expiresAt: expiresAt
                    ? new Date(expiresAt)
                    : null,

                isActive: isActive === "on"

            }

        });

        res.json({

            success: true,
            discount

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}

module.exports = {

    getDiscounts,
    createDiscount,
   applyDiscount
};

async function applyDiscount(req, res) {

    try {

        const {

            code,
            total

        } = req.body;

        const discount = await prisma.discount.findUnique({

            where: {

                code

            }

        });

        if (!discount) {

            return res.json({

                success: false,

                message: "کد تخفیف معتبر نیست."

            });

        }

        if (!discount.isActive) {

            return res.json({

                success: false,

                message: "این کد غیرفعال است."

            });

        }

        if (discount.usedCount >= discount.maxUses) {

            return res.json({

                success: false,

                message: "سقف استفاده از این کد پر شده است."

            });

        }

        if (Number(total) < discount.minPurchase) {

            return res.json({

                success: false,

                message: `حداقل خرید ${discount.minPurchase.toLocaleString()} تومان است.`

            });

        }

        let discountAmount = 0;

        if (discount.type === "percent") {

            discountAmount =

                Math.floor(

                    total * discount.value / 100

                );

        } else {

            discountAmount = discount.value;

        }

        res.json({

            success: true,

            discountAmount

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "خطا"

        });

    }

}