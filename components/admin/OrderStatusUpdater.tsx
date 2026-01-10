'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const allStatuses = [
  { key: 'pending', label: '待处理', icon: '⏳' },
  { key: 'processing', label: '处理中', icon: '🔄' },
  { key: 'shipped', label: '已发货', icon: '📦' },
  { key: 'delivered', label: '已送达', icon: '✅' },
  { key: 'cancelled', label: '已取消', icon: '❌' },
]

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState(currentStatus)

  const currentIndex = allStatuses.findIndex((s) => s.key === currentStatus)
  const isCancelled = currentStatus === 'cancelled'
  const isDelivered = currentStatus === 'delivered'

  const handleUpdate = async () => {
    if (newStatus === currentStatus) return
    
    if (newStatus === 'cancelled' && !confirm('确定要取消这个订单吗？此操作不可撤销。')) {
      setNewStatus(currentStatus)
      return
    }

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
        setNewStatus(currentStatus)
      }
    } catch (error) {
      alert('更新失败，请重试')
      setNewStatus(currentStatus)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 状态进度条 */}
      <div className="relative">
        <div className="flex justify-between items-center">
          {allStatuses.filter(s => s.key !== 'cancelled').map((status, index) => {
            const isPast = !isCancelled && index <= currentIndex && currentStatus !== 'cancelled'
            const isCurrent = status.key === currentStatus
            
            return (
              <div key={status.key} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    isCurrent
                      ? 'bg-primary-600 text-white'
                      : isPast
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {status.icon}
                </div>
                <span
                  className={`mt-2 text-xs ${
                    isCurrent ? 'font-semibold text-primary-600' : 'text-gray-500'
                  }`}
                >
                  {status.label}
                </span>
              </div>
            )
          })}
        </div>
        {/* 连接线 */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0">
          <div
            className="h-full bg-green-500 transition-all"
            style={{
              width: isCancelled
                ? '0%'
                : `${(Math.min(currentIndex, 3) / 3) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* 取消状态显示 */}
      {isCancelled && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 font-medium">订单已取消</p>
        </div>
      )}

      {/* 状态更新 */}
      {!isCancelled && !isDelivered && (
        <div className="border-t pt-6">
          <h3 className="font-medium mb-3">更新状态</h3>
          <div className="flex gap-3">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isUpdating}
            >
              {allStatuses.map((status) => (
                <option key={status.key} value={status.key}>
                  {status.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleUpdate}
              disabled={isUpdating || newStatus === currentStatus}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? '更新中...' : '更新'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
