'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl?: string
}

export default function Pagination({ currentPage, totalPages, baseUrl = '/products' }: PaginationProps) {
  const searchParams = useSearchParams()
  
  // 构建带有当前筛选参数的 URL
  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    return `${baseUrl}?${params.toString()}`
  }

  // 计算显示的页码范围
  const getPageNumbers = () => {
    const delta = 2 // 当前页前后显示的页数
    const range: (number | string)[] = []
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i)
      } else if (range[range.length - 1] !== '...') {
        range.push('...')
      }
    }
    
    return range
  }

  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers()

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      {/* 上一页 */}
      <Link
        href={buildUrl(currentPage - 1)}
        className={`px-3 py-2 rounded-lg border transition flex items-center gap-1 ${
          currentPage === 1
            ? 'pointer-events-none text-gray-300 border-gray-200'
            : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
        }`}
        aria-disabled={currentPage === 1}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">上一页</span>
      </Link>

      {/* 页码 */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                ...
              </span>
            )
          }

          const pageNum = page as number
          const isActive = pageNum === currentPage

          return (
            <Link
              key={pageNum}
              href={buildUrl(pageNum)}
              className={`min-w-[40px] px-3 py-2 rounded-lg text-center transition ${
                isActive
                  ? 'bg-primary-600 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </Link>
          )
        })}
      </div>

      {/* 下一页 */}
      <Link
        href={buildUrl(currentPage + 1)}
        className={`px-3 py-2 rounded-lg border transition flex items-center gap-1 ${
          currentPage === totalPages
            ? 'pointer-events-none text-gray-300 border-gray-200'
            : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
        }`}
        aria-disabled={currentPage === totalPages}
      >
        <span className="hidden sm:inline">下一页</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </nav>
  )
}
