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

// 获取所有分类
export async function GET() {
  const authResult = await checkAdmin()
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(categories)
  } catch (error: any) {
    console.error('Get categories error:', error)
    return NextResponse.json({ error: '获取分类失败' }, { status: 500 })
  }
}

// 创建分类
export async function POST(request: NextRequest) {
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

    // 检查 slug 是否已存在
    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'URL 标识已被使用' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        image: image || null,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    console.error('Create category error:', error)
    return NextResponse.json({ error: '创建分类失败' }, { status: 500 })
  }
}
