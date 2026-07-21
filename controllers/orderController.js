const prisma = require("../lib/prisma");

async function createOrder(req, res) {

    try {

     const {

    fullName,
    phone,
    province,
    city,
    address,
    postalCode,
    note,
    items,
    discountCode

} = req.body;

        if (
            !fullName ||
            !phone ||
            !address ||
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message: "اطلاعات سفارش ناقص است."
            });

        }

        const slugs = items.map(item => item.slug);

        const products = await prisma.product.findMany({

            where: {

                slug: {

                    in: slugs

                }

            }

        });

        if (products.length !== items.length) {

            return res.status(404).json({

                success: false,

                message: "بعضی از محصولات پیدا نشدند."

            });

        }

        let total = 0;

        for (const item of items) {

            const product = products.find(

                p => p.slug === item.slug

            );

            if (!product) {

                return res.status(404).json({

                    success: false,

                    message: "محصول پیدا نشد"

                });

            }

            total += product.price * item.quantity;

        }
let finalTotal = total;

if (discountCode) {

    const discount = await prisma.discount.findUnique({

        where: {

            code: discountCode

        }

    });

    if (!discount) {

        return res.status(400).json({

            success: false,

            message: "کد تخفیف معتبر نیست."

        });

    }

    if (!discount.isActive) {

        return res.status(400).json({

            success: false,

            message: "کد تخفیف غیرفعال است."

        });

    }

    if (discount.usedCount >= discount.maxUses) {

        return res.status(400).json({

            success: false,

            message: "ظرفیت استفاده از کد تکمیل شده است."

        });

    }

    if (total < discount.minPurchase) {

        return res.status(400).json({

            success: false,

            message: "حداقل مبلغ خرید رعایت نشده است."

        });

    }

    let discountValue = 0;

    if (discount.type === "percent") {

        discountValue = Math.floor(
            total * discount.value / 100
        );

    } else {

        discountValue = discount.value;

    }

    finalTotal = total - discountValue;


}
let order;

await prisma.$transaction(async (tx) => {
console.log("REQ USER =", req.user);
  order = await tx.order.create({

   data: {

    fullName,
    phone,
    province,
    city,
    address,
    postalCode,
    note,
    total: finalTotal,

    userId: req.user?.id ?? null

}

});

    await tx.orderItem.createMany({

        data: items.map(item => {

            const product = products.find(

                p => p.slug === item.slug

            );

            return {

                orderId: order.id,

                productId: product.id,

                quantity: item.quantity,

                price: product.price

            };

        })

    });

    for (const item of items) {

        const product = products.find(

            p => p.slug === item.slug

        );

        await tx.product.update({

            where: {

                id: product.id

            },

            data: {

                stock: {

                    decrement: item.quantity

                },

                soldCount: {

                    increment: item.quantity

                }

            }

        });

    }

    if (discountCode) {

        const discount = await tx.discount.findUnique({

            where: {

                code: discountCode

            }

        });

        if (discount) {

            await tx.discount.update({

                where: {

                    id: discount.id

                },

                data: {

                    usedCount: {

                        increment: 1

                    }

                }

            });

        }

    }

});

return res.json({

    success: true,

    message: "سفارش ثبت شد",

    order

});

    }

 catch (error) {

    console.error(error);

    console.error(error.message);

    console.error(error.stack);

    return res.status(500).json({

        success: false,

        message: error.message

    });

}

}
async function updateOrderStatus(req, res) {

    try {

        const { id } = req.params;

        const {

            status,

            trackingCode,

            shippingCompany

        } = req.body;

        const order = await prisma.order.update({

            where: {

                id: Number(id)

            },

            data: {

                status,

                trackingCode,

                shippingCompany

            }

        });

        res.json({

            success: true,

            order

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "خطا در تغییر وضعیت سفارش"

        });

    }

}
module.exports = {

    createOrder,

    getOrders,

    getOrder,

    updateOrderStatus,

    getMyOrders

};

async function getOrders(req, res) {

    try {

        const orders = await prisma.order.findMany({

            include: {

                items: {

                    include: {

                        product: true

                    }

                }

            },

            orderBy: {

                createdAt: "desc"

            }

        });

        res.json(orders);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "خطا"

        });

    }

}

async function getOrder(req, res) {

    const id = Number(req.params.id);

    const order = await prisma.order.findUnique({

        where: {
            id
        },

        include: {

            items: {

                include: {
                    product: true
                }

            }

        }

    });

    if (!order) {

        return res.status(404).json({

            success: false,

            message: "سفارش پیدا نشد"

        });

    }

    res.json(order);

}
async function getMyOrders(req, res) {

    try {

        const orders = await prisma.order.findMany({

            where: {
                userId: req.user.id
            },

            include: {

                items: {

                    include: {

                        product: true

                    }

                }

            },

            orderBy: {

                createdAt: "desc"

            }

        });

        return res.json({

            success: true,

            orders

        });

    }

    catch (error) {

        console.error(error);
        console.error(error.message);
        console.error(error.stack);

        return res.status(500).json({

            success: false,

            message: "خطا در دریافت سفارش‌ها"

        });

    }

}