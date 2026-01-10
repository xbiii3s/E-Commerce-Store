import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import ProductActions from '@/components/admin/ProductActions'

async function getProducts(searchParams: { page?: string; search?: string; category?: string }) {
  const page = parseInt(searchParams.page || '1')
  const limit = 10
  const skip = (page - 1) * limit

  const where: any = {}
  
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search } },
      { description: { contains: searchParams.search } },
    ]
  }

  if (searchParams.category) {
    where.categoryId = searchParams.category
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  return { products, total, categories, page, totalPages: Math.ceil(total / limit) }
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; category?: string }
}) {
  const { products, total, categories, page, totalPages } = await getProducts(searchParams)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">商品管理</h1>
          <p className="text-gray-600 mt-1">共 {total} 件商品</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          添加商品
        </Link>
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <form className="flex flex-wrap gap-4">
          <input
            type="text"
            name="search"
            defaultValue={searchParams.search}
            placeholder="搜索商品名称..."
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            name="category"
            defaultValue={searchParams.category}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">所有分类</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
          >
            筛选
          </button>
        </form>
      </div>

      {/* 商品列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">商品</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">分类</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">价格</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">库存</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">状态</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  暂无商品
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const images = JSON.parse(product.images || '[]')
                const imageUrl = images[0] || '/placeholder.svg'
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 relative bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-sm text-gray-500">SKU: {product.sku || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                        {product.category?.name || '未分类'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">${product.price.toFixed(2)}</p>
                        {product.comparePrice && (
                          <p className="text-sm text-gray-400 line-through">
                            ${product.comparePrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${
                        product.inventory === 0 ? 'text-red-600' : 
                        product.inventory < 10 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {product.inventory}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.featured ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {product.featured ? '推荐' : '普通'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ProductActions productId={product.id} productSlug={product.slug} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              显示 {(page - 1) * 10 + 1} - {Math.min(page * 10, total)} / 共 {total} 件
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/products?page=${page - 1}${searchParams.search ? `&search=${searchParams.search}` : ''}${searchParams.category ? `&category=${searchParams.category}` : ''}`}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  上一页
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/products?page=${page + 1}${searchParams.search ? `&search=${searchParams.search}` : ''}${searchParams.category ? `&category=${searchParams.category}` : ''}`}
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
