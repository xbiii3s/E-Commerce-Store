import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/products/ProductCard'
import ProductFilters from '@/components/products/ProductFilters'
import SortSelector from '@/components/products/SortSelector'
import Pagination from '@/components/ui/Pagination'
import ProductsHeader from '@/components/products/ProductsHeader'
import NoProductsFound from '@/components/products/NoProductsFound'

interface SearchParams {
  category?: string
  search?: string
  sort?: string
  minPrice?: string
  maxPrice?: string
  featured?: string
  page?: string
}

async function getProducts(searchParams: SearchParams) {
  const where: any = { active: true }

  if (searchParams.category) {
    where.category = { slug: searchParams.category }
  }

  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search } },
      { description: { contains: searchParams.search } },
    ]
  }

  if (searchParams.featured === 'true') {
    where.featured = true
  }

  if (searchParams.minPrice) {
    where.price = { ...where.price, gte: parseFloat(searchParams.minPrice) }
  }

  if (searchParams.maxPrice) {
    where.price = { ...where.price, lte: parseFloat(searchParams.maxPrice) }
  }

  let orderBy: any = { createdAt: 'desc' }
  if (searchParams.sort === 'price-asc') orderBy = { price: 'asc' }
  if (searchParams.sort === 'price-desc') orderBy = { price: 'desc' }
  if (searchParams.sort === 'name') orderBy = { name: 'asc' }

  const page = parseInt(searchParams.page || '1')
  const pageSize = 12

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ])

  return { products, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  })
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const [{ products, total, page, totalPages }, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <ProductFilters categories={categories} />
        </aside>

        {/* Products Grid */}
        <div className="flex-grow">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <ProductsHeader 
              categoryName={searchParams.category 
                ? categories.find((c) => c.slug === searchParams.category)?.name 
                : null}
              searchQuery={searchParams.search}
              total={total}
            />

            {/* Sort */}
            <SortSelector />
          </div>

          {/* Products */}
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination currentPage={page} totalPages={totalPages} />
            </>
          ) : (
            <NoProductsFound />
          )}
        </div>
      </div>
    </div>
  )
}
