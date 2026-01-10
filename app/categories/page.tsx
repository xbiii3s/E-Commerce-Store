import { prisma } from '@/lib/prisma'
import CategoriesClient from '@/components/categories/CategoriesClient'

async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
      products: { take: 4 },
    },
  })
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return <CategoriesClient categories={categories} />
}
