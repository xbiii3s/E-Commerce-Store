'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t.home.heroTitle}
          </h1>
          <p className="text-xl mb-8 text-primary-100">
            {t.home.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              {t.home.shopNow}
            </Link>
            <Link
              href="/categories"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              {t.home.browseCategories}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
