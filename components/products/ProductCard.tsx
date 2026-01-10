'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/providers/CartProvider'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  images: string
  category?: { name: string; slug: string } | null
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const images = JSON.parse(product.images || '[]')
  const mainImage = images[0] || 'https://via.placeholder.com/400x400?text=No+Image'

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: mainImage,
    })
  }

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
        {/* Image */}
        <div className="aspect-square relative bg-gray-100">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
          {/* Quick add button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 bg-primary-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-primary-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          {product.category && (
            <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
          )}
          <h3 className="font-medium text-gray-800 group-hover:text-primary-600 transition line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-primary-600">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
