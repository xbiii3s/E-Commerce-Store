'use client'

import Link from 'next/link'
import { useCart } from '@/components/providers/CartProvider'
import { useToast } from '@/components/ui/Toaster'
import { useTranslation } from '@/lib/i18n/context'
import ProductImage from '@/components/ui/ProductImage'
import WishlistButton from './WishlistButton'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  images: string
  category?: { name: string; slug: string } | null
}

// 根据产品名生成 picsum 图片 URL
function getProductImage(images: string, productName: string): string {
  const parsed = JSON.parse(images || '[]')
  if (parsed.length > 0 && !parsed[0].includes('via.placeholder')) {
    return parsed[0]
  }
  // 使用产品名的哈希值生成一个稳定的随机图片
  const hash = productName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return `https://picsum.photos/seed/${hash}/400/400`
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const { t, translateCategory } = useTranslation()
  const mainImage = getProductImage(product.images, product.name)

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
    toast(t.products.addedToCart, 'success')
  }

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
        {/* Image */}
        <div className="aspect-square relative bg-gray-100 overflow-hidden">
          <ProductImage
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
          {/* Wishlist button */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
            <WishlistButton productId={product.id} size="sm" />
          </div>
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
            <p className="text-xs text-gray-500 mb-1">{translateCategory(product.category.name)}</p>
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
