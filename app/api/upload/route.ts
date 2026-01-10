import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { put } from '@vercel/blob'

// 验证管理员权限
async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { error: '请先登录', status: 401 }
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { role: true },
  })
  
  if (user?.role !== 'admin') {
    return { error: '无权限访问', status: 403 }
  }
  
  return { user, session }
}

export async function POST(request: NextRequest) {
  const authResult = await checkAdmin()
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: '请选择要上传的文件' }, { status: 400 })
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      // 验证文件类型（支持图片和视频）
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg']
      const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes]
      if (!allowedTypes.includes(file.type)) {
        continue // 跳过不支持的文件类型
      }

      // 验证文件大小 (图片最大 5MB，视频最大 100MB)
      const maxSize = allowedVideoTypes.includes(file.type) ? 100 * 1024 * 1024 : 5 * 1024 * 1024
      if (file.size > maxSize) {
        continue // 跳过过大的文件
      }

      // 生成唯一文件名
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 8)
      const ext = file.name.split('.').pop() || 'jpg'
      const fileName = `products/${timestamp}-${randomStr}.${ext}`

      // 上传到 Vercel Blob
      const blob = await put(fileName, file, {
        access: 'public',
      })

      uploadedUrls.push(blob.url)
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json({ error: '没有有效的文件（支持图片和视频）' }, { status: 400 })
    }

    return NextResponse.json({ urls: uploadedUrls })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: '上传失败: ' + error.message }, { status: 500 })
  }
}
