const prisma = require("./lib/prisma");

async function run() {

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

    console.log("✅ Categories Fixed");

    process.exit();

}

run();