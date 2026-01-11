import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { translations } from '@/lib/i18n/translations'

async function getUserOrders(userId: string, email: string) {
  noStore()
  try {
    return await prisma.order.findMany({
      where: {
        OR: [
          { userId }, // 已登录用户的订单
          { email }, // 通过邮箱匹配未登录用户的订单
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
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
  const userEmail = session.user.email!
  const orders = await getUserOrders(userId, userEmail)
  
  // 默认使用中文，可根据需要改为基于locale的动态选择
  const t = translations.zh

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/account" className="text-primary-600 hover:underline mb-6 inline-block">
        {t.orders.backToAccount}
      </Link>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">{t.orders.title}</h1>
        </div>

        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr className="text-left text-sm">
                  <th className="px-6 py-3 font-semibold">{t.orders.orderNumber}</th>
                  <th className="px-6 py-3 font-semibold">{t.orders.date}</th>
                  <th className="px-6 py-3 font-semibold">{t.orders.status}</th>
                  <th className="px-6 py-3 font-semibold">{t.orders.paymentStatus}</th>
                  <th className="px-6 py-3 font-semibold">{t.orders.total}</th>
                  <th className="px-6 py-3 font-semibold">{t.orders.action}</th>
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
                        {t.orders[order.status as keyof typeof t.orders] || order.status}
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
                        {t.orders[order.paymentStatus as keyof typeof t.orders] || order.paymentStatus}
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
                        {t.orders.view}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p className="mb-4">{t.orders.noOrders}</p>
            <Link
              href="/products"
              className="text-primary-600 hover:underline font-medium"
            >
              {t.orders.startShopping}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
