import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (key !== 'update-featured-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 获取每个分类的前 1-2 个商品设为精选
    const categories = await prisma.category.findMany()
    
    let updatedCount = 0
    
    for (const category of categories) {
      const products = await prisma.product.findMany({
        where: { categoryId: category.id },
        take: 2,
        orderBy: { price: 'desc' }, // 选择价格较高的商品作为精选
      })
      
      for (const product of products) {
        await prisma.product.update({
          where: { id: product.id },
          data: { featured: true },
        })
        updatedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `已将 ${updatedCount} 个商品设为精选`,
      updatedCount,
    })
  } catch (error) {
    console.error('Update featured error:', error)
    return NextResponse.json(
      { error: 'Failed to update featured products', details: String(error) },
      { status: 500 }
    )
  }
}
