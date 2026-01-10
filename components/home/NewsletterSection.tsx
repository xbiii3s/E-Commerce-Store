'use client'

import { useTranslation } from '@/lib/i18n/context'

export default function NewsletterSection() {
  const { t } = useTranslation()

  return (
    <section className="py-16 bg-primary-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">{t.home.newsletter}</h2>
        <p className="mb-8 text-primary-100">{t.home.newsletterDesc}</p>
        <form className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            placeholder={t.home.emailPlaceholder}
            className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <button
            type="submit"
            className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
          >
            {t.home.subscribe}
          </button>
        </form>
      </div>
    </section>
  )
}
