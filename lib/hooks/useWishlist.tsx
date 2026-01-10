'use client'

import { useState, useCallback, useEffect, createContext, useContext, ReactNode } from 'react'

interface WishlistItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
    category?: {
      name: string
    }
  }
}

interface WishlistContextType {
  items: WishlistItem[]
  isLoading: boolean
  fetchWishlist: () => Promise<void>
  addItem: (productId: string) => Promise<boolean>
  removeItem: (productId: string) => Promise<boolean>
  isInWishlist: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | null>(null)

// 全局状态
let globalItems: WishlistItem[] = []
let globalListeners: Set<() => void> = new Set()

function notifyListeners() {
  globalListeners.forEach(listener => listener())
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(globalItems)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const listener = () => setItems([...globalItems])
    globalListeners.add(listener)
    return () => { globalListeners.delete(listener) }
  }, [])

  const fetchWishlist = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/wishlist')
      if (res.ok) {
        const data = await res.json()
        globalItems = data
        notifyListeners()
      } else if (res.status === 401) {
        globalItems = []
        notifyListeners()
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addItem = useCallback(async (productId: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      
      if (res.ok) {
        const newItem = await res.json()
        globalItems = [newItem, ...globalItems]
        notifyListeners()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to add to wishlist:', error)
      return false
    }
  }, [])

  const removeItem = useCallback(async (productId: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      
      if (res.ok) {
        globalItems = globalItems.filter(item => item.productId !== productId)
        notifyListeners()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
      return false
    }
  }, [])

  const isInWishlist = useCallback((productId: string): boolean => {
    return globalItems.some(item => item.productId === productId)
  }, [items])

  return (
    <WishlistContext.Provider value={{ items, isLoading, fetchWishlist, addItem, removeItem, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    // 返回默认值，以便在 Provider 外部也能使用
    return {
      items: [] as WishlistItem[],
      isLoading: false,
      fetchWishlist: async () => {},
      addItem: async () => false,
      removeItem: async () => false,
      isInWishlist: () => false,
    }
  }
  return context
}
