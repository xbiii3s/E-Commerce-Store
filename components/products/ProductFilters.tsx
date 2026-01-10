'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from '@/lib/i18n/context'

interface Category {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

export default function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, translateCategory } = useTranslation()
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')

  const currentCategory = searchParams.get('category')

  const handleCategoryClick = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  const handlePriceFilter = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (minPrice) params.set('minPrice', minPrice)
    else params.delete('minPrice')
    if (maxPrice) params.set('maxPrice', maxPrice)
    else params.delete('maxPrice')
    params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/products')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">{t.products.filters}</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 hover:underline"
        >
          {t.products.clearAll}
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">{t.products.category}</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleCategoryClick(null)}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${
                !currentCategory
                  ? 'bg-primary-50 text-primary-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              {t.products.allProducts}
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => handleCategoryClick(category.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg transition flex justify-between items-center ${
                  currentCategory === category.slug
                    ? 'bg-primary-50 text-primary-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span>{translateCategory(category.name)}</span>
                <span className="text-sm text-gray-400">
                  {category._count.products}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">{t.products.priceRange}</h3>
        <form onSubmit={handlePriceFilter} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={t.products.min}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-gray-400 self-center">-</span>
            <input
              type="number"
              placeholder={t.products.max}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition text-sm"
          >
            {t.products.apply}
          </button>
        </form>
      </div>

      {/* Featured */}
      <div>
        <h3 className="font-medium mb-3">{t.products.other}</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={searchParams.get('featured') === 'true'}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString())
              if (e.target.checked) {
                params.set('featured', 'true')
              } else {
                params.delete('featured')
              }
              router.push(`/products?${params.toString()}`)
            }}
            className="rounded text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm">{t.products.featuredOnly}</span>
        </label>
      </div>
    </div>
  )
}
