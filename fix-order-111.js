const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.order.update({
    where: { id: 111 },
    data: {
      status: 'paid',
      paymentRef: '4796503905',
      paidAt: new Date('2026-09-19T13:39:41Z')
    }
  });
  console.log('✅ آپدیت شد:', updated);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
