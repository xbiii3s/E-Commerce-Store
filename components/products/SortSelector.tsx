'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n/context'

export default function SortSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const currentSort = searchParams.get('sort') || 'newest'

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', e.target.value)
    params.set('page', '1')
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-gray-600">
        {t.products.sortBy}:
      </label>
      <select
        name="sort"
        id="sort"
        value={currentSort}
        onChange={handleSort}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="newest">{t.products.sortNewest}</option>
        <option value="price-asc">{t.products.sortPriceAsc}</option>
        <option value="price-desc">{t.products.sortPriceDesc}</option>
        <option value="name">{t.products.sortName}</option>
      </select>
    </div>
  )
}
