const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  orders.forEach(o => {
    console.log(`ID: ${o.id} | وضعیت: ${o.status} | مبلغ: ${o.total} | نام: ${o.fullName} | تلفن: ${o.phone} | تاریخ: ${o.createdAt} | trackId: ${o.paymentTrackId}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
