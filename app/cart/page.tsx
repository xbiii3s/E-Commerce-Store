'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/components/providers/CartProvider'

export default function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart()

  const shipping = subtotal >= 50 ? 0 : 9.99
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link
            href="/products"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({itemCount} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`p-6 flex gap-4 ${index !== items.length - 1 ? 'border-b' : ''}`}
              >
                {/* Image */}
                <div className="w-24 h-24 relative bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={item.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-primary-600 font-bold mt-1">${item.price.toFixed(2)}</p>

                  {/* Quantity */}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition text-sm"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x border-gray-300 text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100 transition text-sm"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-4">
            <Link
              href="/products"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {subtotal < 50 && (
                <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block w-full bg-primary-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Proceed to Checkout
            </Link>

            {/* Payment Methods */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 mb-2">Secure payment with</p>
              <div className="flex justify-center gap-2">
                <div className="bg-gray-100 rounded px-2 py-1 text-xs font-bold">VISA</div>
                <div className="bg-gray-100 rounded px-2 py-1 text-xs font-bold">MC</div>
                <div className="bg-gray-100 rounded px-2 py-1 text-xs font-bold">AMEX</div>
                <div className="bg-gray-100 rounded px-2 py-1 text-xs font-bold">PayPal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
