import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getOrder(orderId: string, userId: string, email: string) {
  noStore()
  try {
    return await prisma.order.findFirst({
      where: {
        id: orderId,
        OR: [
          { userId }, // 已登录用户的订单
          { email }, // 通过邮箱匹配未登录用户的订单
        ],
      },
      include: { items: { include: { product: true } } },
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  const userId = (session.user as any).id
  const userEmail = session.user.email!
  const order = await getOrder(params.id, userId, userEmail)

  if (!order) {
    redirect('/account/orders')
  }

  const shippingAddress = JSON.parse(order.shippingAddress || '{}')

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/account/orders" className="text-primary-600 hover:underline mb-6 inline-block">
        ← Back to Orders
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
                <p className="text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full font-medium ${
                  order.status === 'delivered'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'processing'
                    ? 'bg-blue-100 text-blue-700'
                    : order.status === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Order Items */}
            <div className="border-t pt-6">
              <h2 className="font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                    {item.image && (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-gray-500 text-sm">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold mb-4">Shipping Address</h2>
            <div className="text-gray-600">
              <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
              <p>{shippingAddress.address}</p>
              {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
              <p>
                {shippingAddress.city}, {shippingAddress.state}{' '}
                {shippingAddress.zipCode}
              </p>
              <p>{shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm border-b pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600">Payment Status</p>
                <p className="font-medium capitalize">{order.paymentStatus}</p>
              </div>
              <div>
                <p className="text-gray-600">Currency</p>
                <p className="font-medium">{order.currency}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
