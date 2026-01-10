'use client'

import { useTranslation } from '@/lib/i18n/context'
import Link from 'next/link'

export default function NoProductsFound() {
  const { t } = useTranslation()

  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">{t.products.noProducts}</p>
      <Link href="/products" className="text-primary-600 hover:underline mt-2 inline-block">
        {t.products.viewAllProducts}
      </Link>
    </div>
  )
}
