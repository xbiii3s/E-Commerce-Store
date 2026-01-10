'use client'

import Link from 'next/link'

export default function WishlistPage() {
  // Demo: 收藏夹功能（实现可在后续迭代中完成）
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
        <p className="text-gray-600 mb-8">You haven&apos;t added anything to your wishlist yet.</p>
        <Link
          href="/products"
          className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
