import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getStats() {
  noStore()
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'cancelled' } },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true } } } },
        },
      }),
      prisma.product.findMany({
        where: { inventory: { lt: 10 } },
        take: 5,
        orderBy: { inventory: 'asc' },
        select: { id: true, name: true, inventory: true, slug: true },
      }),
    ])

    return {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: totalRevenue._sum.total || 0,
      recentOrders,
      lowStockProducts,
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
      recentOrders: [],
      lowStockProducts: [],
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    { label: '总商品数', value: stats.totalProducts, icon: '📦', href: '/admin/products', color: 'bg-blue-500' },
    { label: '总订单数', value: stats.totalOrders, icon: '📋', href: '/admin/orders', color: 'bg-green-500' },
    { label: '总用户数', value: stats.totalUsers, icon: '👥', href: '/admin/users', color: 'bg-purple-500' },
    { label: '总收入', value: `$${stats.totalRevenue.toFixed(2)}`, icon: '💰', href: '/admin/orders', color: 'bg-yellow-500' },
  ]

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const statusLabels: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    shipped: '已发货',
    delivered: '已送达',
    cancelled: '已取消',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">管理仪表盘</h1>
        <p className="text-gray-600 mt-1">欢迎回来，这是您的商店概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 最近订单 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">最近订单</h2>
            <Link href="/admin/orders" className="text-primary-600 hover:underline text-sm">
              查看全部 →
            </Link>
          </div>
          
          {stats.recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">暂无订单</p>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{order.user?.name || order.user?.email || '访客'}</p>
                    <p className="text-sm text-gray-500">
                      {order.items.length} 件商品 · {new Date(order.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${order.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 库存预警 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">库存预警</h2>
            <Link href="/admin/products" className="text-primary-600 hover:underline text-sm">
              查看全部 →
            </Link>
          </div>
          
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">所有商品库存充足 ✓</p>
          ) : (
            <div className="space-y-4">
              {stats.lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium line-clamp-1">{product.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${product.inventory === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                      {product.inventory === 0 ? '缺货' : `仅剩 ${product.inventory} 件`}
                    </span>
                    <Link
                      href={`/admin/products/${product.slug}/edit`}
                      className="text-primary-600 hover:underline text-sm"
                    >
                      补货
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6">快捷操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <span className="text-3xl">➕</span>
            <span className="text-sm font-medium">添加商品</span>
          </Link>
          <Link
            href="/admin/orders?status=pending"
            className="flex flex-col items-center gap-2 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition"
          >
            <span className="text-3xl">📦</span>
            <span className="text-sm font-medium">处理订单</span>
          </Link>
          <Link
            href="/admin/categories/new"
            className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
          >
            <span className="text-3xl">🏷️</span>
            <span className="text-sm font-medium">添加分类</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
          >
            <span className="text-3xl">👁️</span>
            <span className="text-sm font-medium">预览商店</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
