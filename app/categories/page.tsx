import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/products/ProductCard'
import Link from 'next/link'

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>

      <div className="space-y-16">
        {categories.map((category) => (
          <section key={category.id}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <p className="text-gray-500">{category._count.products} products</p>
              </div>
              <Link
                href={`/products?category=${category.slug}`}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
