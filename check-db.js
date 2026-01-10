const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  const products = await prisma.product.findMany({ take: 5, select: { id: true, name: true, images: true } })
  products.forEach(p => console.log(JSON.stringify(p, null, 2)))
}
main().finally(() => prisma.$disconnect())
