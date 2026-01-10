'use client'

import { useTranslation } from '@/lib/i18n/context'

interface ProductsHeaderProps {
  categoryName?: string | null
  searchQuery?: string | null
  total: number
}

export default function ProductsHeader({ categoryName, searchQuery, total }: ProductsHeaderProps) {
  const { t, translateCategory } = useTranslation()

  let title = t.products.allProducts
  if (categoryName) {
    title = translateCategory(categoryName)
  } else if (searchQuery) {
    title = `${t.products.search}: "${searchQuery}"`
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-500">{total} {t.products.productsFound}</p>
    </div>
  )
}
