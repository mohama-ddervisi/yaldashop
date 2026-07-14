const prisma = require("../lib/prisma");

async function getDashboardStats(req, res) {
    try {

        const totalSales = await prisma.order.aggregate({
            _sum: {
                total: true
            }
        });

        const totalOrders = await prisma.order.count();

        const totalProducts = await prisma.product.count();

        const totalCustomers = await prisma.order.groupBy({
            by: ["phone"]
        });

        const lowStock = await prisma.product.count({
            where: {
                stock: {
                    lte: 5
                }
            }
        });

        const lowStockProducts =
await prisma.product.findMany({

    where:{

        stock:{

            lte:5

        }

    },

    select:{

        id:true,

        name:true,

        stock:true,

        image:true

    },

    orderBy:{

        stock:"asc"

    }

});

const topProducts =
await prisma.product.findMany({

    orderBy:{

        soldCount:"desc"

    },

    take:5,

    select:{

        id:true,

        name:true,

        soldCount:true,

        image:true

    }

});

        const latestOrders = await prisma.order.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: 5
        });

        res.json({
            
            success: true,

            totalSales: totalSales._sum.total || 0,

            totalOrders,

            totalProducts,

            totalCustomers: totalCustomers.length,

            lowStock,

            latestOrders,
lowStockProducts,

topProducts
           
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "خطا در دریافت اطلاعات داشبورد"
        });

    }
}

module.exports = {
    getDashboardStats
};