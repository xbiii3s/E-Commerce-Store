import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater'

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, slug: true, images: true } },
        },
      },
    },
  })
  return order
}

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await getOrder(params.id)

  if (!order) {
    notFound()
  }

  const shippingInfo = order.shippingAddress ? JSON.parse(order.shippingAddress) : null

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/orders"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              订单 #{order.id.slice(-8).toUpperCase()}
            </h1>
          </div>
          <p className="text-gray-600 mt-1">
            创建于 {new Date(order.createdAt).toLocaleString('zh-CN')}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 订单详情 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 商品列表 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">订单商品</h2>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.images && item.product.images[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-medium hover:text-primary-600"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                    <p className="text-sm text-gray-500">单价: ${item.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>小计</span>
                <span>${order.subtotal?.toFixed(2) || order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>运费</span>
                <span>${order.shipping?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>总计</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* 时间线 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">订单状态</h2>
            <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 客户信息 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">客户信息</h2>
            {order.user ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">姓名</p>
                  <p className="font-medium">{order.user.name || '未设置'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">邮箱</p>
                  <p className="font-medium">{order.user.email}</p>
                </div>
                <Link
                  href={`/admin/users/${order.user.id}`}
                  className="inline-block text-primary-600 hover:underline text-sm"
                >
                  查看客户详情 →
                </Link>
              </div>
            ) : (
              <p className="text-gray-500">访客订单</p>
            )}
          </div>

          {/* 收货地址 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">收货地址</h2>
            {shippingInfo ? (
              <div className="space-y-1 text-sm">
                <p className="font-medium">{shippingInfo.name}</p>
                <p>{shippingInfo.phone}</p>
                <p className="text-gray-600">
                  {shippingInfo.address}
                  <br />
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}
                  <br />
                  {shippingInfo.country}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">无收货地址</p>
            )}
          </div>

          {/* 支付信息 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">支付信息</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">支付方式</span>
                <span>在线支付</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">支付状态</span>
                <span className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                  {order.paymentStatus === 'paid' ? '已支付' : '待支付'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
