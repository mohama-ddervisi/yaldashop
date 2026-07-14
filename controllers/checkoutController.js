const prisma = require("../lib/prisma");

async function getCheckout(req, res) {

    try {

        const slugs = req.query.products?.split(",") || [];

        const products = await prisma.product.findMany({

            where: {

                slug: {

                    in: slugs

                }

            }

        });

        res.json({

            success: true,

            products

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "خطا در دریافت اطلاعات"

        });

    }

}

module.exports = {

    getCheckout

};