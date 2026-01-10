const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: '待处理', className: 'bg-yellow-100 text-yellow-800' },
  processing: { label: '处理中', className: 'bg-blue-100 text-blue-800' },
  shipped: { label: '已发货', className: 'bg-purple-100 text-purple-800' },
  delivered: { label: '已送达', className: 'bg-green-100 text-green-800' },
  cancelled: { label: '已取消', className: 'bg-red-100 text-red-800' },
}

export default function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
