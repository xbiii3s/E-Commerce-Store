import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getUsers(searchParams: { page?: string; role?: string; search?: string }) {
  noStore()
  try {
    const page = parseInt(searchParams.page || '1')
    const limit = 20
    const skip = (page - 1) * limit

    const where: any = {}

    if (searchParams.role && searchParams.role !== 'all') {
      where.role = searchParams.role
    }

    if (searchParams.search) {
      where.OR = [
        { email: { contains: searchParams.search } },
        { name: { contains: searchParams.search } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          _count: {
            select: { orders: true },
          },
          orders: {
            select: { total: true },
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    const usersWithStats = users.map((user) => ({
      ...user,
      orderCount: user._count.orders,
      totalSpent: user.orders.reduce((sum, order) => sum + order.total, 0),
    }))

    return { users: usersWithStats, total, page, totalPages: Math.ceil(total / limit) }
  } catch (error) {
    console.error('Error fetching users:', error)
    return { users: [], total: 0, page: 1, totalPages: 0 }
  }
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { page?: string; role?: string; search?: string }
}) {
  const { users, total, page, totalPages } = await getUsers(searchParams)
  const currentRole = searchParams.role || 'all'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
          <p className="text-gray-600 mt-1">共 {total} 个注册用户</p>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <form className="flex flex-wrap gap-4">
          <input
            type="text"
            name="search"
            defaultValue={searchParams.search}
            placeholder="搜索邮箱或姓名..."
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            name="role"
            defaultValue={currentRole}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">全部角色</option>
            <option value="customer">普通用户</option>
            <option value="admin">管理员</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
          >
            筛选
          </button>
        </form>
      </div>

      {/* 用户列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">用户</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">角色</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">订单数</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">消费总额</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">注册时间</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  暂无用户
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {(user.name || user.email)[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name || '未设置姓名'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.role === 'admin' ? '管理员' : '普通用户'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{user.orderCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">${user.totalSpent.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                        title="查看详情"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              显示 {(page - 1) * 20 + 1} - {Math.min(page * 20, total)} / 共 {total} 个用户
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/users?page=${page - 1}${searchParams.role ? `&role=${searchParams.role}` : ''}${searchParams.search ? `&search=${searchParams.search}` : ''}`}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  上一页
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/users?page=${page + 1}${searchParams.role ? `&role=${searchParams.role}` : ''}${searchParams.search ? `&search=${searchParams.search}` : ''}`}
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
