import Link from 'next/link'

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string }
}) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
        
        {searchParams.order && (
          <p className="text-gray-600 mb-2">
            Order number: <strong>{searchParams.order}</strong>
          </p>
        )}
        
        <p className="text-gray-600 mb-8">
          We&apos;ve sent a confirmation email with your order details.
          You can track your order status in your account.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account/orders"
            className="border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            View Orders
          </Link>
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg text-left">
          <h3 className="font-semibold mb-4">What&apos;s next?</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">1</span>
              <span>You&apos;ll receive an order confirmation email shortly.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">2</span>
              <span>We&apos;ll process and ship your order within 1-2 business days.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">3</span>
              <span>You&apos;ll receive a shipping confirmation with tracking info.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
