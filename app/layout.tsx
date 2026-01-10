import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/components/providers/CartProvider'
import { ToastProvider } from '@/components/ui/Toaster'
import { I18nProvider } from '@/lib/i18n/context'
import Providers from '@/components/providers/Providers'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
  title: 'E-Store | 优质在线商店',
  description: '发现优质商品，享受超值价格。订单满 $50 免运费。',
  keywords: ['电商', '在线商店', '电子产品', '服装', '家居用品', 'ecommerce', 'online shop'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <CartProvider>
            <I18nProvider>
              <ToastProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </div>
              </ToastProvider>
            </I18nProvider>
          </CartProvider>
        </Providers>
      </body>
    </html>
  )
}
