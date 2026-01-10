import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import UserRoleUpdater from '@/components/admin/UserRoleUpdater'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'

async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        include: {
          _count: { select: { items: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      wishlist: {
        include: {
          product: { select: { id: true, name: true, slug: true, price: true } },
        },
        take: 10,
      },
      _count: {
        select: { orders: true, wishlist: true },
      },
    },
  })
  return user
}

export default async function UserDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await getUser(params.id)

  if (!user) {
    notFound()
  }

  const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0)

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl text-primary-600 font-bold">
                {(user.name || user.email)[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.name || '未设置姓名'}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
        <span
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            user.role === 'admin'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {user.role === 'admin' ? '管理员' : '普通用户'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 统计信息 */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">订单总数</p>
            <p className="text-3xl font-bold mt-1">{user._count.orders}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">消费总额</p>
            <p className="text-3xl font-bold mt-1">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">收藏商品</p>
            <p className="text-3xl font-bold mt-1">{user._count.wishlist}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">注册时间</p>
            <p className="text-xl font-bold mt-1">
              {new Date(user.createdAt).toLocaleDateString('zh-CN')}
            </p>
          </div>
        </div>

        {/* 订单历史 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">最近订单</h2>
              {user._count.orders > 10 && (
                <Link
                  href={`/admin/orders?search=${user.email}`}
                  className="text-sm text-primary-600 hover:underline"
                >
                  查看全部
                </Link>
              )}
            </div>
            {user.orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">暂无订单</p>
            ) : (
              <div className="divide-y">
                {user.orders.map((order) => (
                  <div key={order.id} className="py-4 flex items-center justify-between">
                    <div>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono text-sm text-primary-600 hover:underline"
                      >
                        #{order.id.slice(-8).toUpperCase()}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {order._count.items} 件商品 · {new Date(order.createdAt).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">${order.total.toFixed(2)}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 用户角色 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">用户角色</h2>
            <UserRoleUpdater userId={user.id} currentRole={user.role} />
          </div>

          {/* 收藏商品 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">收藏商品</h2>
            {user.wishlist.length === 0 ? (
              <p className="text-gray-500 text-center py-4">暂无收藏</p>
            ) : (
              <div className="space-y-3">
                {user.wishlist.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.product.slug}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <p className="font-medium line-clamp-1">{item.product.name}</p>
                    <p className="text-sm text-primary-600">${item.product.price.toFixed(2)}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
