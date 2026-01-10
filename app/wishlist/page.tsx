'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/lib/i18n/context'
import { useWishlist } from '@/lib/hooks/useWishlist'
import { useCart } from '@/components/providers/CartProvider'

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const { t, translateCategory } = useTranslation()
  const { items, isLoading, fetchWishlist, removeItem } = useWishlist()
  const { addItem } = useCart()
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchWishlist()
    }
  }, [session])

  const handleRemove = async (productId: string) => {
    setRemovingId(productId)
    await removeItem(productId)
    setRemovingId(null)
  }

  const handleAddToCart = async (product: any) => {
    setAddingToCartId(product.id)
    // 解析 images JSON 字符串
    let imageUrl = '/placeholder.svg'
    try {
      const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images
      imageUrl = images?.[0] || '/placeholder.svg'
    } catch (e) {
      console.error('Failed to parse images:', e)
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
    })
    setTimeout(() => setAddingToCartId(null), 500)
  }

  // 未登录状态
  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">{t.wishlist.title}</h1>
          <p className="text-gray-600 mb-8">{t.wishlist.loginRequired}</p>
          <Link
            href="/auth/signin?callbackUrl=/wishlist"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            {t.auth.signIn}
          </Link>
        </div>
      </div>
    )
  }

  // 加载状态
  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-8">{t.wishlist.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 空收藏夹
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">{t.wishlist.title}</h1>
          <p className="text-gray-600 mb-8">{t.wishlist.empty}</p>
          <Link
            href="/products"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            {t.wishlist.continueShopping}
          </Link>
        </div>
      </div>
    )
  }

  // 解析商品图片
  const getProductImage = (images: string | string[]): string => {
    try {
      const parsed = typeof images === 'string' ? JSON.parse(images) : images
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0]
      }
    } catch (e) {
      console.error('Failed to parse images:', e)
    }
    return 'https://picsum.photos/400/400'
  }

  // 收藏列表
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{t.wishlist.title}</h1>
        <span className="text-gray-600">{items.length} {t.wishlist.items}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
            <Link href={`/products/${item.product.slug}`}>
              <div className="aspect-square relative bg-gray-100">
                <Image
                  src={getProductImage(item.product.images)}
                  alt={item.product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {/* 移除按钮 */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleRemove(item.productId)
                  }}
                  disabled={removingId === item.productId}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50 transition"
                >
                  {removingId === item.productId ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            </Link>

            <div className="p-4">
              {item.product.category && (
                <p className="text-xs text-gray-500 mb-1">
                  {translateCategory(item.product.category.name)}
                </p>
              )}
              <Link href={`/products/${item.product.slug}`}>
                <h3 className="font-medium text-gray-900 hover:text-primary-600 transition line-clamp-2 mb-2">
                  {item.product.name}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-primary-600">
                  ${item.product.price.toFixed(2)}
                </p>
                <button
                  onClick={() => handleAddToCart(item.product)}
                  disabled={addingToCartId === item.product.id}
                  className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition disabled:bg-gray-400"
                >
                  {addingToCartId === item.product.id ? t.wishlist.adding : t.wishlist.addToCart}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
