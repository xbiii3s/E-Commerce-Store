'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useWishlist } from '@/lib/hooks/useWishlist'

interface WishlistButtonProps {
  productId: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function WishlistButton({ 
  productId, 
  size = 'md', 
  showText = false,
  className = '' 
}: WishlistButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { isInWishlist, addItem, removeItem, fetchWishlist } = useWishlist()
  const [isLoading, setIsLoading] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (session) {
      fetchWishlist()
    }
  }, [session])

  useEffect(() => {
    setIsWishlisted(isInWishlist(productId))
  }, [productId, isInWishlist])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.pathname))
      return
    }

    setIsLoading(true)
    try {
      if (isWishlisted) {
        const success = await removeItem(productId)
        if (success) {
          setIsWishlisted(false)
        }
      } else {
        const success = await addItem(productId)
        if (success) {
          setIsWishlisted(true)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        ${showText ? 'px-4 py-2' : sizeClasses[size]}
        flex items-center justify-center gap-2
        border border-gray-300 rounded-lg
        hover:bg-gray-50 transition
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isWishlisted ? 'text-red-500 border-red-300 bg-red-50' : 'text-gray-600'}
        ${className}
      `}
      title={isWishlisted ? '取消收藏' : '加入收藏'}
    >
      <svg 
        className={iconSizes[size]}
        fill={isWishlisted ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      {showText && (
        <span className="text-sm font-medium">
          {isLoading ? '...' : isWishlisted ? '已收藏' : '收藏'}
        </span>
      )}
    </button>
  )
}
