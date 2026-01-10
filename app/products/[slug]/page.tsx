import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductDetailClient from '@/components/products/ProductDetailClient'

export const dynamic = 'force-dynamic'

// 根据产品名生成 picsum 图片 URL
function getProductImage(images: string, productName: string): string {
  const parsed = JSON.parse(images || '[]')
  if (parsed.length > 0 && !parsed[0].includes('via.placeholder')) {
    return parsed[0]
  }
  const hash = productName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return `https://picsum.photos/seed/${hash}/600/600`
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  if (!product) notFound()
  return product
}

async function getRelatedProducts(categoryId: string | null, productId: string) {
  if (!categoryId) return []
  return prisma.product.findMany({
    where: {
      categoryId,
      id: { not: productId },
      active: true,
    },
    include: { category: true },
    take: 4,
  })
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
  const relatedProducts = await getRelatedProducts(product.categoryId, product.id)

  const mainImage = getProductImage(product.images, product.name)

  // Serialize dates for client component
  const serializedProduct = {
    ...product,
    reviews: product.reviews.map(r => ({
      ...r,
      createdAt: r.createdAt,
    })),
  }

  return (
    <ProductDetailClient 
      product={serializedProduct}
      relatedProducts={relatedProducts}
      mainImage={mainImage}
    />
  )
}
