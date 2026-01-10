'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function UserRoleUpdater({
  userId,
  currentRole,
}: {
  userId: string
  currentRole: string
}) {
  const router = useRouter()
  const { data: session } = useSession()
  const [role, setRole] = useState(currentRole)
  const [isUpdating, setIsUpdating] = useState(false)

  // 防止管理员修改自己的角色
  const isCurrentUser = (session?.user as any)?.id === userId

  const handleUpdate = async () => {
    if (role === currentRole) return
    
    const confirmMsg = role === 'admin' 
      ? '确定要将此用户设为管理员吗？他将获得后台管理权限。'
      : '确定要将此用户降为普通用户吗？他将失去后台管理权限。'
    
    if (!confirm(confirmMsg)) {
      setRole(currentRole)
      return
    }

    setIsUpdating(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || '更新失败，请重试')
        setRole(currentRole)
      }
    } catch (error) {
      alert('更新失败，请重试')
      setRole(currentRole)
    } finally {
      setIsUpdating(false)
    }
  }

  if (isCurrentUser) {
    return (
      <p className="text-gray-500 text-sm">无法修改自己的角色</p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
          <input
            type="radio"
            name="role"
            value="customer"
            checked={role === 'customer'}
            onChange={(e) => setRole(e.target.value)}
            disabled={isUpdating}
            className="w-4 h-4 text-primary-600"
          />
          <div>
            <p className="font-medium">普通用户</p>
            <p className="text-sm text-gray-500">只能访问前台功能</p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
          <input
            type="radio"
            name="role"
            value="admin"
            checked={role === 'admin'}
            onChange={(e) => setRole(e.target.value)}
            disabled={isUpdating}
            className="w-4 h-4 text-primary-600"
          />
          <div>
            <p className="font-medium">管理员</p>
            <p className="text-sm text-gray-500">拥有后台管理权限</p>
          </div>
        </label>
      </div>
      <button
        onClick={handleUpdate}
        disabled={isUpdating || role === currentRole}
        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUpdating ? '更新中...' : '保存更改'}
      </button>
    </div>
  )
}
