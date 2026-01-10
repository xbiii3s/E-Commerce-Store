import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/home/HeroSection'
import CategorySection from '@/components/home/CategorySection'
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import NewsletterSection from '@/components/home/NewsletterSection'

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true, active: true },
    include: { category: true },
    take: 8,
  })
}

async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  })
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
