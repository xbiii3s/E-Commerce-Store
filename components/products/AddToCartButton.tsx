'use client'

import { useState } from 'react'
import { useCart } from '@/components/providers/CartProvider'

interface Product {
  id: string
  name: string
  price: number
  image?: string
}

export default function AddToCartButton({
  product,
  disabled = false,
}: {
  product: Product
  disabled?: boolean
}) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 hover:bg-gray-100 transition"
            disabled={disabled}
          >
            -
          </button>
          <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-2 hover:bg-gray-100 transition"
            disabled={disabled}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          disabled={disabled}
          className={`flex-grow py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
            disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : added
              ? 'bg-green-500 text-white'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {added ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Added to Cart
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </>
          )}
        </button>

        {/* Wishlist Button */}
        <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
