'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

export default function SortSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || 'newest'
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', e.target.value)
    params.set('page', '1')
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-gray-600">
        Sort by:
      </label>
      <select
        name="sort"
        id="sort"
        value={currentSort}
        onChange={handleSort}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name">Name</option>
      </select>
    </div>
  )
}
