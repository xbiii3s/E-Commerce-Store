import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // 检查环境变量是否存在（不暴露具体值）
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      DIRECT_URL: !!process.env.DIRECT_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not set',
      NODE_ENV: process.env.NODE_ENV,
    }

    // 尝试连接数据库
    let dbStatus = 'unknown'
    let dbError = null
    
    try {
      const { prisma } = await import('@/lib/prisma')
      // 简单的数据库连接测试
      await prisma.$queryRaw`SELECT 1`
      dbStatus = 'connected'
      
      // 检查表是否存在
      const userCount = await prisma.user.count()
      const productCount = await prisma.product.count()
      const categoryCount = await prisma.category.count()
      
      return NextResponse.json({
        status: 'ok',
        env: envCheck,
        database: {
          status: dbStatus,
          tables: {
            users: userCount,
            products: productCount,
            categories: categoryCount,
          }
        }
      })
    } catch (e: any) {
      dbStatus = 'error'
      dbError = e.message
      
      return NextResponse.json({
        status: 'error',
        env: envCheck,
        database: {
          status: dbStatus,
          error: dbError,
        }
      }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 'fatal_error',
      error: error.message,
    }, { status: 500 })
  }
}
