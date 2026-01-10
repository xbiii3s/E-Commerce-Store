'use client'

import { useEffect, useState } from 'react'
import CategorySection from './CategorySection'
import FeaturedProductsSection from './FeaturedProductsSection'

interface Category {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  images: string
  category: { name: string; slug: string } | null
}

export default function HomeDataSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?limit=8'),  // 先获取最新商品
          fetch('/api/categories'),
        ])

        if (productsRes.ok) {
          const productsData = await productsRes.json()
          let productsList = productsData.products || productsData || []
          
          // 如果有商品，尝试获取精选商品
          if (productsList.length > 0) {
            const featuredRes = await fetch('/api/products?featured=true&limit=8')
            if (featuredRes.ok) {
              const featuredData = await featuredRes.json()
              const featuredProducts = featuredData.products || []
              // 如果有精选商品则使用精选商品，否则使用最新商品
              if (featuredProducts.length > 0) {
                productsList = featuredProducts
              }
            }
          }
          setProducts(productsList)
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData || [])
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <>
        {/* Categories skeleton */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-20 mx-auto mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products skeleton */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4">
                    <div className="h-3 bg-gray-200 rounded w-16 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-5 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <CategorySection categories={categories} />
      <FeaturedProductsSection products={products} />
    </>
  )
}
