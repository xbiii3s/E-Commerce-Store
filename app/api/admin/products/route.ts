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

// 创建商品
export async function POST(request: NextRequest) {
  const authResult = await checkAdmin()
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  try {
    const body = await request.json()
    
    const {
      name,
      slug,
      description,
      content,
      price,
      comparePrice,
      images,
      inventory,
      sku,
      categoryId,
      featured,
    } = body

    // 验证必填字段
    if (!name || !slug || !price) {
      return NextResponse.json({ error: '请填写必填字段' }, { status: 400 })
    }

    // 检查 slug 是否已存在
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'URL 标识已被使用' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || '',
        content: content || null,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        images: images || '[]',
        inventory: parseInt(inventory) || 0,
        sku: sku || null,
        categoryId: categoryId || null,
        featured: featured === 'true' || featured === true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('Create product error:', error)
    return NextResponse.json({ error: '创建商品失败' }, { status: 500 })
  }
}
