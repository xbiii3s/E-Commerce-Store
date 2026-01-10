'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'

interface Category {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

const categoryIcons: Record<string, string> = {
  'electronics': '📱',
  'clothing': '👕',
  'home-garden': '🏠',
  'sports': '⚽',
  'beauty': '💄',
  'books': '📚',
}

// 分类名称翻译
const categoryNames: Record<string, { en: string; zh: string }> = {
  'electronics': { en: 'Electronics', zh: '电子产品' },
  'clothing': { en: 'Clothing', zh: '服装配饰' },
  'home-garden': { en: 'Home & Garden', zh: '家居园艺' },
  'sports': { en: 'Sports', zh: '运动健身' },
  'beauty': { en: 'Beauty', zh: '美妆护肤' },
  'books': { en: 'Books', zh: '图书文具' },
}

export default function CategorySection({ categories }: { categories: Category[] }) {
  const { t, locale } = useTranslation()

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{t.home.shopByCategory}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const icon = categoryIcons[category.slug] || '📦'
            const name = categoryNames[category.slug]?.[locale] || category.name
            
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{icon}</span>
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition">
                  {name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {category._count.products} {t.home.products}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
