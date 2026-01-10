import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

const categories = [
  {
    name: '电子产品',
    slug: 'electronics',
    description: '最新的电子产品和智能设备',
    image: 'https://picsum.photos/seed/electronics/400/300',
  },
  {
    name: '服装配饰',
    slug: 'clothing',
    description: '时尚服装和配饰',
    image: 'https://picsum.photos/seed/clothing/400/300',
  },
  {
    name: '家居园艺',
    slug: 'home-garden',
    description: '家居装饰和园艺用品',
    image: 'https://picsum.photos/seed/home/400/300',
  },
  {
    name: '运动健身',
    slug: 'sports',
    description: '运动器材和健身用品',
    image: 'https://picsum.photos/seed/sports/400/300',
  },
  {
    name: '美妆护肤',
    slug: 'beauty',
    description: '美妆护肤和个人护理',
    image: 'https://picsum.photos/seed/beauty/400/300',
  },
  {
    name: '图书文具',
    slug: 'books',
    description: '图书、文具和办公用品',
    image: 'https://picsum.photos/seed/books/400/300',
  },
]

const products = [
  // 电子产品
  {
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: '搭载 A17 Pro 芯片，钛金属设计，超视网膜 XDR 显示屏',
    price: 1199,
    comparePrice: 1299,
    images: JSON.stringify(['https://picsum.photos/seed/iphone15/600/600']),
    inventory: 50,
    sku: 'ELEC-IP15PM-001',
    featured: true,
    categorySlug: 'electronics',
  },
  {
    name: 'MacBook Pro 14英寸',
    slug: 'macbook-pro-14',
    description: 'M3 Pro 芯片，18GB 内存，512GB SSD，Liquid Retina XDR 显示屏',
    price: 1999,
    comparePrice: 2199,
    images: JSON.stringify(['https://picsum.photos/seed/macbook14/600/600']),
    inventory: 30,
    sku: 'ELEC-MBP14-001',
    featured: true,
    categorySlug: 'electronics',
  },
  {
    name: 'AirPods Pro 2',
    slug: 'airpods-pro-2',
    description: '主动降噪，自适应透明模式，个性化空间音频',
    price: 249,
    comparePrice: 279,
    images: JSON.stringify(['https://picsum.photos/seed/airpods/600/600']),
    inventory: 100,
    sku: 'ELEC-APP2-001',
    featured: true,
    categorySlug: 'electronics',
  },
  {
    name: 'Sony WH-1000XM5 降噪耳机',
    slug: 'sony-wh1000xm5',
    description: '业界领先的降噪技术，30小时续航，舒适佩戴',
    price: 349,
    comparePrice: 399,
    images: JSON.stringify(['https://picsum.photos/seed/sonywh/600/600']),
    inventory: 45,
    sku: 'ELEC-SXMH-001',
    featured: false,
    categorySlug: 'electronics',
  },
  {
    name: 'iPad Air 5',
    slug: 'ipad-air-5',
    description: 'M1 芯片，10.9英寸 Liquid Retina 显示屏，支持 Apple Pencil',
    price: 599,
    comparePrice: 699,
    images: JSON.stringify(['https://picsum.photos/seed/ipadair/600/600']),
    inventory: 60,
    sku: 'ELEC-IPA5-001',
    featured: false,
    categorySlug: 'electronics',
  },

  // 服装配饰
  {
    name: '男士修身牛仔裤',
    slug: 'mens-slim-jeans',
    description: '高弹力舒适面料，经典修身剪裁，四季百搭',
    price: 59.99,
    comparePrice: 79.99,
    images: JSON.stringify(['https://picsum.photos/seed/jeans/600/600']),
    inventory: 200,
    sku: 'CLTH-MJN-001',
    featured: true,
    categorySlug: 'clothing',
  },
  {
    name: '女士羊绒围巾',
    slug: 'womens-cashmere-scarf',
    description: '100%羊绒，柔软保暖，多色可选',
    price: 89.99,
    comparePrice: 129.99,
    images: JSON.stringify(['https://picsum.photos/seed/scarf/600/600']),
    inventory: 150,
    sku: 'CLTH-WSC-001',
    featured: true,
    categorySlug: 'clothing',
  },
  {
    name: '运动休闲夹克',
    slug: 'sports-casual-jacket',
    description: '防风防水，透气舒适，适合户外运动',
    price: 129.99,
    comparePrice: 169.99,
    images: JSON.stringify(['https://picsum.photos/seed/jacket/600/600']),
    inventory: 80,
    sku: 'CLTH-SCJ-001',
    featured: false,
    categorySlug: 'clothing',
  },
  {
    name: '真皮商务皮带',
    slug: 'leather-business-belt',
    description: '头层牛皮，精致五金扣，商务休闲两用',
    price: 45.99,
    comparePrice: 59.99,
    images: JSON.stringify(['https://picsum.photos/seed/belt/600/600']),
    inventory: 120,
    sku: 'CLTH-LBB-001',
    featured: false,
    categorySlug: 'clothing',
  },

  // 家居园艺
  {
    name: '北欧简约沙发',
    slug: 'nordic-simple-sofa',
    description: '进口实木框架，高密度海绵，科技布面料',
    price: 899,
    comparePrice: 1199,
    images: JSON.stringify(['https://picsum.photos/seed/sofa/600/600']),
    inventory: 20,
    sku: 'HOME-NSS-001',
    featured: true,
    categorySlug: 'home-garden',
  },
  {
    name: '智能台灯',
    slug: 'smart-desk-lamp',
    description: 'LED护眼光源，支持调光调色，手机APP控制',
    price: 49.99,
    comparePrice: 69.99,
    images: JSON.stringify(['https://picsum.photos/seed/lamp/600/600']),
    inventory: 150,
    sku: 'HOME-SDL-001',
    featured: false,
    categorySlug: 'home-garden',
  },
  {
    name: '多肉植物组合盆栽',
    slug: 'succulent-plant-set',
    description: '精选多肉组合，含陶瓷花盆，易养护',
    price: 29.99,
    comparePrice: 39.99,
    images: JSON.stringify(['https://picsum.photos/seed/plant/600/600']),
    inventory: 80,
    sku: 'HOME-SPS-001',
    featured: false,
    categorySlug: 'home-garden',
  },

  // 运动健身
  {
    name: '瑜伽垫加厚款',
    slug: 'yoga-mat-thick',
    description: 'NBR高密度材质，15mm加厚，防滑耐磨',
    price: 39.99,
    comparePrice: 49.99,
    images: JSON.stringify(['https://picsum.photos/seed/yogamat/600/600']),
    inventory: 200,
    sku: 'SPRT-YMT-001',
    featured: true,
    categorySlug: 'sports',
  },
  {
    name: '可调节哑铃套装',
    slug: 'adjustable-dumbbell-set',
    description: '2-24kg可调节，专业健身，节省空间',
    price: 299,
    comparePrice: 399,
    images: JSON.stringify(['https://picsum.photos/seed/dumbbell/600/600']),
    inventory: 40,
    sku: 'SPRT-ADS-001',
    featured: true,
    categorySlug: 'sports',
  },
  {
    name: '跑步机家用款',
    slug: 'home-treadmill',
    description: '静音马达，可折叠设计，APP智能连接',
    price: 599,
    comparePrice: 799,
    images: JSON.stringify(['https://picsum.photos/seed/treadmill/600/600']),
    inventory: 15,
    sku: 'SPRT-HTM-001',
    featured: false,
    categorySlug: 'sports',
  },

  // 美妆护肤
  {
    name: 'SK-II神仙水',
    slug: 'sk2-facial-treatment-essence',
    description: '经典护肤精华，改善肤质，焕发肌肤光采',
    price: 189,
    comparePrice: 229,
    images: JSON.stringify(['https://picsum.photos/seed/sk2/600/600']),
    inventory: 100,
    sku: 'BEAU-SK2-001',
    featured: true,
    categorySlug: 'beauty',
  },
  {
    name: '兰蔻小黑瓶精华',
    slug: 'lancome-advanced-genifique',
    description: '肌底修护精华，焕活肌肤，紧致提亮',
    price: 159,
    comparePrice: 199,
    images: JSON.stringify(['https://picsum.photos/seed/lancome/600/600']),
    inventory: 80,
    sku: 'BEAU-LNC-001',
    featured: true,
    categorySlug: 'beauty',
  },
  {
    name: 'MAC子弹头口红',
    slug: 'mac-lipstick',
    description: '经典显色，持久不脱色，多色可选',
    price: 29.99,
    comparePrice: 39.99,
    images: JSON.stringify(['https://picsum.photos/seed/mac/600/600']),
    inventory: 200,
    sku: 'BEAU-MAC-001',
    featured: false,
    categorySlug: 'beauty',
  },

  // 图书文具
  {
    name: '《原子习惯》',
    slug: 'atomic-habits-book',
    description: '詹姆斯·克利尔著，掌握习惯的力量，改变人生',
    price: 18.99,
    comparePrice: 24.99,
    images: JSON.stringify(['https://picsum.photos/seed/atomichabits/600/600']),
    inventory: 300,
    sku: 'BOOK-ATM-001',
    featured: true,
    categorySlug: 'books',
  },
  {
    name: 'LAMY钢笔',
    slug: 'lamy-fountain-pen',
    description: '德国制造，经典设计，书写流畅',
    price: 49.99,
    comparePrice: 69.99,
    images: JSON.stringify(['https://picsum.photos/seed/lamy/600/600']),
    inventory: 100,
    sku: 'BOOK-LMY-001',
    featured: false,
    categorySlug: 'books',
  },
  {
    name: 'Moleskine经典笔记本',
    slug: 'moleskine-classic-notebook',
    description: '意大利品牌，优质纸张，适合书写和绘画',
    price: 19.99,
    comparePrice: 24.99,
    images: JSON.stringify(['https://picsum.photos/seed/moleskine/600/600']),
    inventory: 150,
    sku: 'BOOK-MLK-001',
    featured: false,
    categorySlug: 'books',
  },
]

export async function POST(request: Request) {
  try {
    // 检查授权（简单的密钥验证）
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    
    if (key !== 'init-seed-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 创建分类
    const createdCategories: Record<string, string> = {}
    
    for (const category of categories) {
      const existing = await prisma.category.findUnique({
        where: { slug: category.slug },
      })
      
      if (existing) {
        createdCategories[category.slug] = existing.id
      } else {
        const created = await prisma.category.create({
          data: category,
        })
        createdCategories[category.slug] = created.id
      }
    }

    // 创建商品
    let productsCreated = 0
    let productsSkipped = 0

    for (const product of products) {
      const { categorySlug, ...productData } = product
      
      const existing = await prisma.product.findUnique({
        where: { slug: product.slug },
      })
      
      if (existing) {
        productsSkipped++
        continue
      }

      await prisma.product.create({
        data: {
          ...productData,
          categoryId: createdCategories[categorySlug],
        },
      })
      productsCreated++
    }

    // 创建管理员用户（如果不存在）
    const adminEmail = 'admin@example.com'
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    let adminCreated = false
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'Admin',
          password: hashedPassword,
          role: 'admin',
        },
      })
      adminCreated = true
    }

    return NextResponse.json({
      success: true,
      message: '数据初始化完成',
      data: {
        categories: {
          total: categories.length,
          created: Object.keys(createdCategories).length,
        },
        products: {
          total: products.length,
          created: productsCreated,
          skipped: productsSkipped,
        },
        admin: {
          email: adminEmail,
          password: adminCreated ? 'admin123' : '(已存在)',
          created: adminCreated,
        },
      },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: '请使用 POST 请求并附带正确的 key 参数来初始化数据',
    example: 'POST /api/seed?key=init-seed-2024',
  })
}
