'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { translations, Locale, TranslationKeys, categoryNames } from './translations'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationKeys
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh') // 默认中文
  const [isLoaded, setIsLoaded] = useState(false)

  // 从 localStorage 加载语言设置
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh')) {
      setLocaleState(savedLocale)
    }
    setIsLoaded(true)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    // 更新 html lang 属性
    document.documentElement.lang = newLocale === 'zh' ? 'zh-CN' : 'en'
  }, [])

  const t = translations[locale]

  // 防止水合不匹配，在加载前使用默认语言
  if (!isLoaded) {
    return (
      <I18nContext.Provider value={{ locale: 'zh', setLocale, t: translations.zh }}>
        {children}
      </I18nContext.Provider>
    )
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

// 获取翻译的便捷 hook
export function useTranslation() {
  const { t, locale } = useI18n()
  
  // 翻译分类名称
  const translateCategory = (name: string): string => {
    return categoryNames[name]?.[locale] || name
  }
  
  return { t, locale, translateCategory }
}
