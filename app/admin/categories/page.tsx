import { prisma } from '@/lib/prisma'
import CategoryManager from '@/components/admin/CategoryManager'

export const dynamic = 'force-dynamic'

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    })
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">分类管理</h1>
        <p className="text-gray-600 mt-1">管理商品分类</p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  )
}
