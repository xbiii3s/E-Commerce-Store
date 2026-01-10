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

// 更新商品
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

    // 检查 slug 是否被其他商品使用
    const existing = await prisma.product.findFirst({
      where: { slug, NOT: { id: params.id } },
    })
    if (existing) {
      return NextResponse.json({ error: 'URL 标识已被使用' }, { status: 400 })
    }

    const product = await prisma.product.update({
      where: { id: params.id },
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

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Update product error:', error)
    return NextResponse.json({ error: '更新商品失败' }, { status: 500 })
  }
}

// 删除商品
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await checkAdmin()
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  try {
    // 删除相关的收藏
    await prisma.wishlistItem.deleteMany({ where: { productId: params.id } })
    
    // 删除商品
    await prisma.product.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete product error:', error)
    return NextResponse.json({ error: '删除商品失败' }, { status: 500 })
  }
}
