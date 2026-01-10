import { prisma } from '@/lib/prisma'
import CategoriesClient from '@/components/categories/CategoriesClient'

export const dynamic = 'force-dynamic'

async function getCategories() {
  try {
    return await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
        products: { take: 4 },
      },
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return <CategoriesClient categories={categories} />
}
