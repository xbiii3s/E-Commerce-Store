import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
}

async function getUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  })
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  const userId = (session.user as any).id
  const [user, orders] = await Promise.all([
    getUser(userId),
    getUserOrders(userId),
  ])

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <h2 className="font-semibold text-lg">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>

            <nav className="space-y-2">
              <Link
                href="/account"
                className="block px-4 py-2 rounded-lg bg-primary-50 text-primary-700 font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/account/orders"
                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                My Orders
              </Link>
              <Link
                href="/account/addresses"
                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Addresses
              </Link>
              <Link
                href="/account/settings"
                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Settings
              </Link>
              <a
                href="/api/auth/signout"
                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 text-red-600"
              >
                Sign Out
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
            <p className="text-gray-600">
              Manage your account, view orders, and update your preferences.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {orders.length}
              </div>
              <p className="text-gray-600">Total Orders</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
              </div>
              <p className="text-gray-600">Total Spent</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {orders.filter((o) => o.status === 'delivered').length}
              </div>
              <p className="text-gray-600">Delivered Orders</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Recent Orders</h2>
            </div>

            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="px-6 py-3 font-semibold">Order Number</th>
                      <th className="px-6 py-3 font-semibold">Date</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold">Total</th>
                      <th className="px-6 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
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
      </div>
    </div>
  )
}
