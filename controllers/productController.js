const prisma = require("../lib/prisma");

async function getProducts(req, res) {

    try {

        const { category, q } = req.query;

        const where = {};
        where.isActive = true;
        const categoryMap = {
            serving: "ظروف پذیرایی",
            cups: "لیوان و فنجان",
            cutlery: "قاشق و چنگال",
            cooking: "لوازم پخت و پز",
            storage: "ظروف نگهداری",
            kitchen: "لوازم آشپزخانه",
            others: "سایر محصولات"
        };

        const realCategory = categoryMap[category] || category;

        if (category && category !== "all") {
            where.category = realCategory;
        }

        if (q) {
            where.OR = [
                {
                    name: {
                        contains: q,
                        mode: "insensitive"
                    }
                },
                {
                    brand: {
                        contains: q,
                        mode: "insensitive"
                    }
                }
            ];
        }

      console.time("products");

const products = await prisma.product.findMany({
    where,
    include: {
        images: true
    },
    orderBy: {
        id: "desc"
    }
});

console.timeEnd("products");

        res.json({
            success: true,
            products
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "خطا در دریافت محصولات"
        });

    }

}
async function fixCategories(req, res) {

    const map = {
        serving: "ظروف پذیرایی",
        cups: "لیوان و فنجان",
        cutlery: "قاشق و چنگال",
        cooking: "لوازم پخت و پز",
        storage: "ظروف نگهداری",
        kitchen: "لوازم آشپزخانه",
        others: "سایر محصولات"
    };

    for (const oldCategory in map) {

        await prisma.product.updateMany({
            where: {
                category: oldCategory
            },
            data: {
                category: map[oldCategory]
            }
        });

    }

    res.json({
        success: true
    });

}

// ویرایش محصول
async function updateProduct(req, res) {

    try {
console.log("CREATE PRODUCT START");
        const id = Number(req.params.id);

        const {

            name,
            description,
            price,
            stock,
            category,
            brand,
            discount,
            feature1,
            feature2,
            oldPrice,
            isActive

        } = req.body;

const oldProduct = await prisma.product.findUnique({
            where: { id }
        });

        const product = await prisma.product.update({

            
            where: {

                id

            },

          data: {
    name,
    description,
    price: Number(price),
    stock: Number(stock),
    category,
    brand,
    discount: discount ? Number(discount) : null,
    feature1,
    feature2,
    oldPrice: oldPrice ? Number(oldPrice) : null,
    isActive: req.body.isActive === "on"
}

        });
const currentImages = await prisma.productImage.count({

    where: {
        productId: id
    }

});

if (req.files && currentImages + req.files.length > 5) {

    return res.status(400).json({

        success: false,
        message: `این محصول در حال حاضر ${currentImages} تصویر دارد. حداکثر ۵ تصویر مجاز است.`

    });

}

if (req.files?.length) {

    await prisma.product.update({

        where: {
            id
        },

        data: {

            image: "/uploads/" + req.files[0].filename

        }

    });

    await prisma.productImage.createMany({

        data: req.files.map((file, index) => ({

            image: "/uploads/" + file.filename,

            sort: index,

            productId: id

        }))

    });

}
const hadDiscountBefore = oldProduct?.discount && oldProduct.discount > 0;
        const hasDiscountNow = product.discount && product.discount > 0;

        if (!hadDiscountBefore && hasDiscountNow) {

            const io = req.app.get("io");

            io.emit("newDiscount", {
                productId: product.id,
                name: product.name,
                discount: product.discount,
                image: product.image,
                slug: product.slug
            });

        }
        
        res.json({

            success: true,
            product

        });

    }

   catch (error) {

    console.error("UPDATE ERROR:");
    console.error(error);

    res.status(500).json({
        success: false,
        message: error.message
    });

}

}
async function createProduct(req, res) {

    try {

        const {

            name,
            description,
            price,
            stock,
            category,
            brand,
            discount,
            feature1,
            feature2,
            oldPrice

        } = req.body;

console.log(req.body);
console.log(req.files);

if (req.files && req.files.length > 5) {

    return res.status(400).json({

        success: false,
        message: "حداکثر ۵ تصویر برای هر محصول مجاز است."

    });

}

       let slug = name
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

const existing = await prisma.product.findUnique({

    where: {

        slug

    }

});

if (existing) {

    slug = `${slug}-${Date.now()}`;

}
console.log("CATEGORY RECEIVED:", category);

        const product = await prisma.product.create({

            data: {

                name,

                description,

                price: Number(price),

                stock: Number(stock),

                category,

                brand,

                discount: discount ? Number(discount) : null,

                feature1,

                feature2,

                oldPrice: oldPrice ? Number(oldPrice) : null,

                slug,

               image: req.files?.length
    ? "/uploads/" + req.files[0].filename
    : null

            }

        });
if (req.files?.length) {

    await prisma.productImage.createMany({

        data: req.files.map((file, index) => ({

            image: "/uploads/" + file.filename,

            sort: index,

            productId: product.id

        }))

    });

}
if (product.discount && product.discount > 0) {

            const io = req.app.get("io");

            io.emit("newDiscount", {
                productId: product.id,
                name: product.name,
                discount: product.discount ,
                image: product.image,
                slug: product.slug
            });

        }
        res.json({

            success: true,

            product

        });

    }

    catch (error) {

    console.log("========== ERROR ==========");
    console.error(error);
    console.log("MESSAGE:", error.message);
    console.log("STACK:", error.stack);
    console.log("===========================");

    res.status(500).json({
        success: false,
        message: error.message
    });

}

}
const fs = require("fs");
const path = require("path");

async function deleteProduct(req, res) {

    try {

        const id = Number(req.params.id);

        // حذف تمام تصاویر محصول
        await prisma.productImage.deleteMany({
            where: {
                productId: id
            }
        });

        // حذف خود محصول
        await prisma.product.delete({
            where: {
                id
            }
        });

        res.json({
            success: true,
            message: "محصول با موفقیت حذف شد."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "خطا در حذف محصول"
        });

    }

}
module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProductImage,
    fixCategories
};