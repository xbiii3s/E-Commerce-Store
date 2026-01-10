'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProductImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  priority?: boolean
}

// 内联 SVG 占位图
const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' fill='%239ca3af' font-family='Arial' font-size='16' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E`

export default function ProductImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  sizes,
  priority = false,
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src || placeholderSvg)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    setImgSrc(placeholderSvg)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  if (fill) {
    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          sizes={sizes}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
          unoptimized={imgSrc.startsWith('data:')}
        />
      </>
    )
  }

  return (
    <>
      {isLoading && (
        <div 
          className="bg-gray-100 animate-pulse" 
          style={{ width: width || 400, height: height || 400 }}
        />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={width || 400}
        height={height || 400}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        unoptimized={imgSrc.startsWith('data:')}
      />
    </>
  )
}
