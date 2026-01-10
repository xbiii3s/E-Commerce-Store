'use client'

import { useTranslation } from '@/lib/i18n/context'
import ProductCard from '@/components/products/ProductCard'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  images: string
}

interface Category {
  id: string
  name: string
  slug: string
  _count: { products: number }
  products: Product[]
}

interface CategoriesClientProps {
  categories: Category[]
}

export default function CategoriesClient({ categories }: CategoriesClientProps) {
  const { t, translateCategory } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t.categories.title}</h1>

      <div className="space-y-16">
        {categories.map((category) => (
          <section key={category.id}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">{translateCategory(category.name)}</h2>
                <p className="text-gray-500">{category._count.products} {t.categories.products}</p>
              </div>
              <Link
                href={`/products?category=${category.slug}`}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                {t.categories.viewAll} →
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
