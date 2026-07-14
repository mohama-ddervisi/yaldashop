const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

  await prisma.product.deleteMany();

  await prisma.product.createMany({

    data: [

    {
  name: "سرویس غذاخوری فلورانس",
  slug: "florence-dinner-set",

  description: "سرویس ۲۶ پارچه چینی زرین مناسب پذیرایی روزمره و مهمانی",

  price: 5137500,

  oldPrice: 6850000,

  discount: 25,

  stock: 20,

  image: "/images/category1.jpg",

  category: "serving",

  brand: "چینی زرین",

  feature1: "۲۶ پارچه",

  feature2: "درجه یک"
},

   {
  name: "ست فنجان کلاسیک",

  slug: "classic-cup-set",

  description: "ست ۶ عددی سرامیکی",

  price: 2250000,

  oldPrice: 2850000,

  discount: 21,

  stock: 15,

  image: "/images/category2.jpg",

  category: "cups",

  brand: "انگلیش هوم",

  feature1: "۶ عدد",

  feature2: "سرامیکی"
},

    {
  name: "لیوان کریستال",

  slug: "crystal-glass",

  description: "لیوان شیشه‌ای کریستال",

  price: 890000,

  oldPrice: 1150000,

  discount: 22,

  stock: 30,

  image: "/images/category3.jpg",

  category: "cups",

  brand: "پاشاباغچه",

  feature1: "کریستال",

  feature2: "۶ عدد"
},

      {
        name: "سرویس قاشق و چنگال",
        slug: "cutlery-set",
        description: "سرویس ۲۴ نفره استیل",
        price: 6500000,
        stock: 8,
        image: "/images/category4.jpg",
        category: "cutlery",
        brand: "برلین"
      },

      {
        name: "قابلمه گرانیتی",
        slug: "granite-pot",
        description: "قابلمه سایز ۲۸",
        price: 3900000,
        stock: 12,
        image: "/images/category5.jpg",
        category: "cooking",
        brand: "کاندید"
      },

      {
        name: "بانکه شیشه‌ای",
        slug: "glass-jar",
        description: "بانکه درب چوبی",
        price: 450000,
        stock: 40,
        image: "/images/category6.jpg",
        category: "storage",
        brand: "هوم کت"
      },

      {
        name: "جا ادویه",
        slug: "spice-rack",
        description: "استند ۱۲ عددی",
        price: 990000,
        stock: 22,
        image: "/images/category7.jpg",
        category: "kitchen",
        brand: "یونیک"
      }

    ]

  });

  console.log("✅ Seed Completed");

}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });