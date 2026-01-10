import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import NewsletterSection from '@/components/home/NewsletterSection'
import HomeDataSection from '@/components/home/HomeDataSection'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <HomeDataSection />
      <FeaturesSection />
      <NewsletterSection />
    </div>
  )
}
