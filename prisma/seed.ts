import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Gadgets and devices' },
  { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel' },
  { name: 'Home & Garden', slug: 'home-garden', description: 'Home decor and garden supplies' },
  { name: 'Sports', slug: 'sports', description: 'Sports equipment and gear' },
  { name: 'Beauty', slug: 'beauty', description: 'Beauty and personal care' },
  { name: 'Books', slug: 'books', description: 'Books and publications' },
]

const products = [
  // Electronics (8 products)
  { name: 'Wireless Bluetooth Headphones', slug: 'wireless-bluetooth-headphones', price: 79.99, comparePrice: 99.99, category: 'electronics', inventory: 50, featured: true },
  { name: 'Smart Watch Pro', slug: 'smart-watch-pro', price: 199.99, comparePrice: 249.99, category: 'electronics', inventory: 30, featured: true },
  { name: 'Portable Power Bank 20000mAh', slug: 'portable-power-bank', price: 39.99, category: 'electronics', inventory: 100 },
  { name: 'USB-C Hub 7-in-1', slug: 'usb-c-hub', price: 49.99, category: 'electronics', inventory: 75 },
  { name: 'Wireless Charging Pad', slug: 'wireless-charging-pad', price: 29.99, category: 'electronics', inventory: 80 },
  { name: 'Noise Cancelling Earbuds', slug: 'noise-cancelling-earbuds', price: 149.99, comparePrice: 179.99, category: 'electronics', inventory: 45, featured: true },
  { name: 'Mechanical Gaming Keyboard', slug: 'mechanical-gaming-keyboard', price: 89.99, category: 'electronics', inventory: 35 },
  { name: 'Webcam HD 1080p', slug: 'webcam-hd-1080p', price: 59.99, category: 'electronics', inventory: 60 },

  // Clothing (8 products)
  { name: 'Classic Cotton T-Shirt', slug: 'classic-cotton-tshirt', price: 24.99, category: 'clothing', inventory: 200 },
  { name: 'Slim Fit Jeans', slug: 'slim-fit-jeans', price: 59.99, comparePrice: 79.99, category: 'clothing', inventory: 150 },
  { name: 'Hooded Sweatshirt', slug: 'hooded-sweatshirt', price: 49.99, category: 'clothing', inventory: 120, featured: true },
  { name: 'Leather Belt', slug: 'leather-belt', price: 34.99, category: 'clothing', inventory: 90 },
  { name: 'Winter Jacket', slug: 'winter-jacket', price: 129.99, comparePrice: 159.99, category: 'clothing', inventory: 40, featured: true },
  { name: 'Running Sneakers', slug: 'running-sneakers', price: 89.99, category: 'clothing', inventory: 70 },
  { name: 'Casual Polo Shirt', slug: 'casual-polo-shirt', price: 39.99, category: 'clothing', inventory: 100 },
  { name: 'Wool Beanie Hat', slug: 'wool-beanie-hat', price: 19.99, category: 'clothing', inventory: 150 },

  // Home & Garden (8 products)
  { name: 'Ceramic Plant Pot Set', slug: 'ceramic-plant-pot-set', price: 34.99, category: 'home-garden', inventory: 60 },
  { name: 'LED Desk Lamp', slug: 'led-desk-lamp', price: 44.99, category: 'home-garden', inventory: 80, featured: true },
  { name: 'Throw Blanket', slug: 'throw-blanket', price: 29.99, category: 'home-garden', inventory: 100 },
  { name: 'Scented Candle Set', slug: 'scented-candle-set', price: 24.99, category: 'home-garden', inventory: 120 },
  { name: 'Wall Clock Modern', slug: 'wall-clock-modern', price: 39.99, category: 'home-garden', inventory: 50 },
  { name: 'Kitchen Knife Set', slug: 'kitchen-knife-set', price: 79.99, comparePrice: 99.99, category: 'home-garden', inventory: 45 },
  { name: 'Bamboo Cutting Board', slug: 'bamboo-cutting-board', price: 19.99, category: 'home-garden', inventory: 90 },
  { name: 'French Press Coffee Maker', slug: 'french-press-coffee-maker', price: 34.99, category: 'home-garden', inventory: 70 },

  // Sports (8 products)
  { name: 'Yoga Mat Premium', slug: 'yoga-mat-premium', price: 39.99, category: 'sports', inventory: 80, featured: true },
  { name: 'Resistance Bands Set', slug: 'resistance-bands-set', price: 24.99, category: 'sports', inventory: 100 },
  { name: 'Dumbbell Set 20kg', slug: 'dumbbell-set-20kg', price: 89.99, comparePrice: 109.99, category: 'sports', inventory: 30 },
  { name: 'Jump Rope Speed', slug: 'jump-rope-speed', price: 14.99, category: 'sports', inventory: 150 },
  { name: 'Sports Water Bottle', slug: 'sports-water-bottle', price: 19.99, category: 'sports', inventory: 200 },
  { name: 'Foam Roller', slug: 'foam-roller', price: 29.99, category: 'sports', inventory: 70 },
  { name: 'Tennis Racket Pro', slug: 'tennis-racket-pro', price: 149.99, category: 'sports', inventory: 25 },
  { name: 'Gym Bag Duffle', slug: 'gym-bag-duffle', price: 44.99, category: 'sports', inventory: 60 },

  // Beauty (8 products)
  { name: 'Facial Cleanser Gentle', slug: 'facial-cleanser-gentle', price: 18.99, category: 'beauty', inventory: 100 },
  { name: 'Moisturizing Cream', slug: 'moisturizing-cream', price: 29.99, category: 'beauty', inventory: 80, featured: true },
  { name: 'Vitamin C Serum', slug: 'vitamin-c-serum', price: 34.99, comparePrice: 44.99, category: 'beauty', inventory: 60 },
  { name: 'Hair Dryer Professional', slug: 'hair-dryer-professional', price: 79.99, category: 'beauty', inventory: 40 },
  { name: 'Makeup Brush Set', slug: 'makeup-brush-set', price: 24.99, category: 'beauty', inventory: 90 },
  { name: 'Perfume Eau de Toilette', slug: 'perfume-eau-de-toilette', price: 59.99, category: 'beauty', inventory: 50 },
  { name: 'Nail Polish Collection', slug: 'nail-polish-collection', price: 19.99, category: 'beauty', inventory: 120 },
  { name: 'Electric Toothbrush', slug: 'electric-toothbrush', price: 49.99, category: 'beauty', inventory: 70 },

  // Books (2 products to make 42 total)
  { name: 'Bestseller Fiction Novel', slug: 'bestseller-fiction-novel', price: 14.99, category: 'books', inventory: 200 },
  { name: 'Self-Help Guide Book', slug: 'self-help-guide-book', price: 19.99, category: 'books', inventory: 150 },
]

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Create categories
  console.log('📁 Creating categories...')
  for (const category of categories) {
    await prisma.category.create({ data: category })
  }

  // Get category IDs
  const categoryMap = new Map<string, string>()
  const allCategories = await prisma.category.findMany()
  for (const cat of allCategories) {
    categoryMap.set(cat.slug, cat.id)
  }

  // Create products
  console.log('📦 Creating products...')
  for (const product of products) {
    const { category, ...productData } = product
    await prisma.product.create({
      data: {
        ...productData,
        description: `High quality ${productData.name.toLowerCase()}. Perfect for everyday use.`,
        images: JSON.stringify([`https://via.placeholder.com/400x400?text=${encodeURIComponent(productData.name)}`]),
        categoryId: categoryMap.get(category),
      },
    })
  }

  console.log('✅ Seed completed successfully!')
  console.log(`   - ${categories.length} categories created`)
  console.log(`   - ${products.length} products created`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
