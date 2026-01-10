import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">添加新商品</h1>
        <p className="text-gray-600 mt-1">填写商品信息创建新商品</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
