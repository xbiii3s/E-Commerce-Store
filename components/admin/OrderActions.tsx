'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const statusFlow = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
}

const statusLabels: Record<string, string> = {
  processing: '开始处理',
  shipped: '标记发货',
  delivered: '标记送达',
  cancelled: '取消订单',
}

export default function OrderActions({ 
  orderId, 
  currentStatus 
}: { 
  orderId: string
  currentStatus: string 
}) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const availableActions = statusFlow[currentStatus as keyof typeof statusFlow] || []

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === 'cancelled' && !confirm('确定要取消这个订单吗？')) return
    
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (res.ok) {
        router.refresh()
      } else {
        alert('更新失败，请重试')
      }
    } catch (error) {
      alert('更新失败，请重试')
    } finally {
      setIsUpdating(false)
      setShowMenu(false)
    }
  }

  return (
    <div className="relative flex items-center justify-end gap-2">
      <Link
        href={`/admin/orders/${orderId}`}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
        title="查看详情"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </Link>

      {availableActions.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            disabled={isUpdating}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            title="更多操作"
          >
            {isUpdating ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            )}
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 bottom-full mb-2 w-40 bg-white rounded-lg shadow-xl border z-50">
                {availableActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleStatusUpdate(action)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      action === 'cancelled' ? 'text-red-600' : 'text-gray-700'
                    }`}
                  >
                    {statusLabels[action]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
