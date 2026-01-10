import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'
import OrderActions from '@/components/admin/OrderActions'

async function getOrders(searchParams: { page?: string; status?: string; search?: string }) {
  const page = parseInt(searchParams.page || '1')
  const limit = 15
  const skip = (page - 1) * limit

  const where: any = {}
  
  if (searchParams.status && searchParams.status !== 'all') {
    where.status = searchParams.status
  }

  if (searchParams.search) {
    where.OR = [
      { id: { contains: searchParams.search } },
      { user: { email: { contains: searchParams.search } } },
      { user: { name: { contains: searchParams.search } } },
    ]
  }

  const [orders, total, statusCounts] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: { 
          include: { product: { select: { name: true } } },
          take: 3,
        },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
    prisma.order.groupBy({
      by: ['status'],
      _count: true,
    }),
  ])

  const counts = {
    all: await prisma.order.count(),
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  }
  statusCounts.forEach((s) => {
    counts[s.status as keyof typeof counts] = s._count
  })

  return { orders, total, page, totalPages: Math.ceil(total / limit), counts }
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string; search?: string }
}) {
  const { orders, total, page, totalPages, counts } = await getOrders(searchParams)
  const currentStatus = searchParams.status || 'all'

  const statusTabs = [
    { key: 'all', label: '全部', count: counts.all },
    { key: 'pending', label: '待处理', count: counts.pending },
    { key: 'processing', label: '处理中', count: counts.processing },
    { key: 'shipped', label: '已发货', count: counts.shipped },
    { key: 'delivered', label: '已送达', count: counts.delivered },
    { key: 'cancelled', label: '已取消', count: counts.cancelled },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">订单管理</h1>
        <p className="text-gray-600 mt-1">管理和处理客户订单</p>
      </div>

      {/* 状态筛选 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {statusTabs.map((tab) => (
            <Link
              key={tab.key}
              href={`/admin/orders${tab.key !== 'all' ? `?status=${tab.key}` : ''}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                currentStatus === tab.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
            </Link>
          ))}
        </div>
      </div>

      {/* 搜索 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <form className="flex gap-4">
          <input
            type="text"
            name="search"
            defaultValue={searchParams.search}
            placeholder="搜索订单号、客户邮箱..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {searchParams.status && (
            <input type="hidden" name="status" value={searchParams.status} />
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
          >
            搜索
          </button>
        </form>
      </div>

      {/* 订单列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-visible">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">订单号</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">客户</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">商品</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">金额</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">状态</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">日期</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  暂无订单
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="font-mono text-sm text-primary-600 hover:underline"
                    >
                      #{order.id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{order.user?.name || '访客'}</p>
                      <p className="text-sm text-gray-500">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {order.items.slice(0, 2).map((item, i) => (
                        <p key={i} className="line-clamp-1 text-gray-600">
                          {item.product.name} × {item.quantity}
                        </p>
                      ))}
                      {order._count.items > 2 && (
                        <p className="text-gray-400">+{order._count.items - 2} 件商品</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">${order.total.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('zh-CN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <OrderActions orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              显示 {(page - 1) * 15 + 1} - {Math.min(page * 15, total)} / 共 {total} 个订单
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/orders?page=${page - 1}${searchParams.status ? `&status=${searchParams.status}` : ''}`}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  上一页
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/orders?page=${page + 1}${searchParams.status ? `&status=${searchParams.status}` : ''}`}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  下一页
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
