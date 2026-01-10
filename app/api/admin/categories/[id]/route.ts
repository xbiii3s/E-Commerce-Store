import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

// 更新分类
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await checkAdmin()
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  try {
    const body = await request.json()
    const { name, slug, image } = body

    if (!name || !slug) {
      return NextResponse.json({ error: '请填写分类名称和标识' }, { status: 400 })
    }

    // 检查 slug 是否被其他分类使用
    const existing = await prisma.category.findFirst({
      where: { slug, NOT: { id: params.id } },
    })
    if (existing) {
      return NextResponse.json({ error: 'URL 标识已被使用' }, { status: 400 })
    }

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        image: image || null,
      },
    })

    return NextResponse.json(category)
  } catch (error: any) {
    console.error('Update category error:', error)
    return NextResponse.json({ error: '更新分类失败' }, { status: 500 })
  }
}

// 删除分类
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await checkAdmin()
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  try {
    // 检查分类下是否有商品
    const productCount = await prisma.product.count({
      where: { categoryId: params.id },
    })

    if (productCount > 0) {
      return NextResponse.json(
        { error: `此分类下有 ${productCount} 个商品，请先移除或更改这些商品的分类` },
        { status: 400 }
      )
    }

    await prisma.category.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete category error:', error)
    return NextResponse.json({ error: '删除分类失败' }, { status: 500 })
  }
}
