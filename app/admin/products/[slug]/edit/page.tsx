import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })
  return product
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export default async function EditProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const [product, categories] = await Promise.all([
    getProduct(params.slug),
    getCategories(),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">编辑商品</h1>
        <p className="text-gray-600 mt-1">修改商品信息</p>
      </div>

      <ProductForm categories={categories} product={product} />
    </div>
  )
}
