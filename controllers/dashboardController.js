const prisma = require("../lib/prisma");

async function getDashboardStats(req, res) {
    try {

     const [
    totalSales,
    totalOrders,
    totalProducts,
    totalCustomers,
    lowStock,
    lowStockProducts,
    topProducts,
    latestOrders
] = await Promise.all([

    prisma.order.aggregate({
        _sum: {
            total: true
        }
    }),

    prisma.order.count(),

    prisma.product.count(),

    prisma.order.groupBy({
        by: ["phone"]
    }),

    prisma.product.count({
        where: {
            stock: {
                lte: 5
            }
        }
    }),

    prisma.product.findMany({
        where: {
            stock: {
                lte: 5
            }
        },
        orderBy: {
            stock: "asc"
        },
        select: {
            id: true,
            name: true,
            stock: true,
            image: true
        }
    }),

    prisma.product.findMany({
        take: 5,
        orderBy: {
            soldCount: "desc"
        },
        select: {
            id: true,
            name: true,
            soldCount: true,
            image: true
        }
    }),

    prisma.order.findMany({
        take: 5,
        orderBy: {
            createdAt: "desc"
        },
        select: {
            id: true,
            fullName: true,
            phone: true,
            total: true,
            createdAt: true
        }
    })

]);
       
const chart = {
    labels: [],
    sales: []
};

for (let i = 6; i >= 0; i--) {

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - i);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const result = await prisma.order.aggregate({

        _sum: {
            total: true
        },

        where: {

            createdAt: {

                gte: start,
                lt: end

            }

        }

    });

    chart.labels.push(
        start.toLocaleDateString("fa-IR", {
            weekday: "short"
        })
    );

    chart.sales.push(result._sum.total || 0);

}
        res.json({
            
            success: true,

            totalSales: totalSales._sum.total || 0,

            totalOrders,

            totalProducts,

            totalCustomers: totalCustomers.length,

            lowStock,

            latestOrders,
            
            chart,

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