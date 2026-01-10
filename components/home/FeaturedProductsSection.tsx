'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'
import ProductCard from '@/components/products/ProductCard'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  images: string
  category: { name: string; slug: string } | null
}

export default function FeaturedProductsSection({ products }: { products: Product[] }) {
  const { t } = useTranslation()

  // 如果没有商品，不显示这个区块
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">{t.home.featuredProducts}</h2>
          <Link
            href="/products"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            {t.home.viewAll} →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
