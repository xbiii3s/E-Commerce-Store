'use client'

import { useTranslation } from '@/lib/i18n/context'

export default function FeaturesSection() {
  const { t } = useTranslation()

  const features = [
    {
      icon: '🚚',
      title: t.home.freeShipping,
      description: t.home.freeShippingDesc,
    },
    {
      icon: '↩️',
      title: t.home.easyReturns,
      description: t.home.easyReturnsDesc,
    },
    {
      icon: '🔒',
      title: t.home.securePayment,
      description: t.home.securePaymentDesc,
    },
    {
      icon: '💬',
      title: t.home.support,
      description: t.home.supportDesc,
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
