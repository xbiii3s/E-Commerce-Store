import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getUserOrders(userId: string) {
  noStore()
  try {
    return await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return []
  }
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  const userId = (session.user as any).id
  const orders = await getUserOrders(userId)

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/account" className="text-primary-600 hover:underline mb-6 inline-block">
        ← Back to Account
      </Link>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>

        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr className="text-left text-sm">
                  <th className="px-6 py-3 font-semibold">Order Number</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Payment</th>
                  <th className="px-6 py-3 font-semibold">Total</th>
                  <th className="px-6 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50 text-sm">
                    <td className="px-6 py-3 font-medium">{order.orderNumber}</td>
                    <td className="px-6 py-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-medium">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="text-primary-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p className="mb-4">You haven't placed any orders yet.</p>
            <Link
              href="/products"
              className="text-primary-600 hover:underline font-medium"
            >
              Start shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
