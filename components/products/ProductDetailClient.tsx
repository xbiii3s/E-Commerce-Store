'use client'

import { useTranslation } from '@/lib/i18n/context'
import Link from 'next/link'
import ProductImage from '@/components/ui/ProductImage'
import AddToCartButton from '@/components/products/AddToCartButton'
import ProductCard from '@/components/products/ProductCard'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: Date
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  comparePrice: number | null
  inventory: number
  images: string
  category: Category | null
  reviews: Review[]
}

interface RelatedProduct {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  images: string
  category?: Category | null
}

interface ProductDetailClientProps {
  product: Product
  relatedProducts: RelatedProduct[]
  mainImage: string
}

export default function ProductDetailClient({ product, relatedProducts, mainImage }: ProductDetailClientProps) {
  const { t, translateCategory } = useTranslation()

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600">{t.nav.home}</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-primary-600">{t.nav.products}</Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary-600">
              {translateCategory(product.category.name)}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div>
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden mb-4">
            <ProductImage
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <p className="text-primary-600 text-sm font-medium mb-2">{translateCategory(product.category.name)}</p>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          {/* Rating */}
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= avgRating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 text-sm">
                {avgRating.toFixed(1)} ({product.reviews.length} {t.products.reviews})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-primary-600">
              ${product.price.toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-gray-400 line-through">
                ${product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Stock */}
          <div className="mb-6">
            {product.inventory > 0 ? (
              <span className="text-green-600 font-medium">
                ✓ {t.products.inStock} ({product.inventory} {t.products.available})
              </span>
            ) : (
              <span className="text-red-600 font-medium">{t.products.outOfStock}</span>
            )}
          </div>

          {/* Add to Cart */}
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: mainImage,
            }}
            disabled={product.inventory === 0}
          />

          {/* Features */}
          <div className="border-t mt-8 pt-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="font-medium text-sm">{t.home.freeShipping}</p>
                  <p className="text-xs text-gray-500">{t.home.freeShippingDesc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">↩️</span>
                <div>
                  <p className="font-medium text-sm">{t.home.easyReturns}</p>
                  <p className="text-xs text-gray-500">{t.home.easyReturnsDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t.products.customerReviews}</h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-gray-600">{review.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">{t.products.relatedProducts}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
