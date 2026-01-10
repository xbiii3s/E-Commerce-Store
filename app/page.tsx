import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/home/HeroSection'
import CategorySection from '@/components/home/CategorySection'
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import NewsletterSection from '@/components/home/NewsletterSection'

// 强制动态渲染，跳过构建时预渲染
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

async function getFeaturedProducts() {
  if (!prisma) return []
  try {
    return await prisma.product.findMany({
      where: { featured: true, active: true },
      include: { category: true },
      take: 8,
    })
  } catch (error) {
    console.error('Failed to fetch featured products:', error)
    return []
  }
}

async function getCategories() {
  if (!prisma) return []
  try {
    return await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    })
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <div>
      <HeroSection />
      <CategorySection categories={categories} />
      <FeaturedProductsSection products={featuredProducts} />
      <FeaturesSection />
      <NewsletterSection />
    </div>
  )
}
