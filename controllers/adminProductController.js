const prisma = require("../lib/prisma");

async function getProducts(req, res) {

    try {

       const products = await prisma.product.findMany({

    include:{

        images:true

    },

    orderBy:{
        createdAt:"desc"
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

            message: "خطا در دریافت محصولات"

        });

    }

}

module.exports = {

    getProducts

};