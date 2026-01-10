'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/components/providers/CartProvider'
import { useTranslation } from '@/lib/i18n/context'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { itemCount } = useCart()
  const { t } = useTranslation()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary-700 text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p>{t.home.freeShippingDesc}</p>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <select className="bg-transparent text-white text-sm border-none focus:outline-none cursor-pointer">
              <option value="USD">USD $</option>
              <option value="CNY">CNY ¥</option>
              <option value="EUR">EUR €</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-700">
            E-Store
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition">
              {t.nav.home}
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-600 transition">
              {t.nav.products}
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition">
              {t.nav.categories}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Account */}
            <Link
              href="/account"
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 hover:bg-gray-100 rounded-full transition relative"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Search bar */}
        {isSearchOpen && (
          <div className="mt-4">
            <form action="/products" method="GET" className="flex gap-2">
              <input
                type="text"
                name="search"
                placeholder={t.nav.search}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                🔍
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition">
                {t.nav.home}
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-primary-600 transition">
                {t.nav.products}
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition">
                {t.nav.categories}
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-primary-600 transition">
                {t.nav.cart}
              </Link>
              <Link href="/account" className="text-gray-700 hover:text-primary-600 transition">
                {t.nav.account}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
