import prismaPkg from '@prisma/client'
import { seedFAQs } from './faqs'
import { seedFaqCategories } from './faq-categories'
import { seedLocations } from './locations'
import { seedReviews } from './reviews'
import { seedBlog } from './blog'
import { seedStudyDirections } from './study-directions'
import { seedServices } from './services'
const { PrismaClient } = prismaPkg as any

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data before seeding
  console.log('🧹 Clearing existing data...')

  // Delete in reverse dependency order
  await prisma.$transaction([
    prisma.blogArticleTranslation.deleteMany(),
    prisma.blogArticle.deleteMany(),
    prisma.blogCategoryTranslation.deleteMany(),
    prisma.blogCategory.deleteMany(),
    prisma.universityReviewTranslation.deleteMany(),
    prisma.universityReview.deleteMany(),
    prisma.faqTranslation.deleteMany(),
    prisma.faq.deleteMany(),
    (prisma as any).faqCategoryTranslation.deleteMany(),
    (prisma as any).faqCategory.deleteMany(),
    prisma.studyDirectionTranslation.deleteMany(),
    prisma.studyDirection.deleteMany(),
    (prisma as any).cityTranslation.deleteMany(),
    (prisma as any).city.deleteMany(),
    (prisma as any).countryTranslation.deleteMany(),
    (prisma as any).country.deleteMany(),
  ])

  console.log('✅ Existing data cleared')

  console.log('⭐ Seeding reviews...')
  await seedReviews(prisma)

  console.log('📚 Seeding study directions...')
  await seedStudyDirections(prisma)

  console.log('🗺️ Seeding locations...')
  await seedLocations(prisma)

  console.log('📂 Seeding FAQ categories...')
  const faqCategoryMap = await seedFaqCategories(prisma)

  console.log('❓ Seeding FAQs...')
  await seedFAQs(prisma, faqCategoryMap)

  console.log('📰 Seeding blog content...')
  await seedBlog(prisma)

  console.log('🛠️ Seeding services...')
  await seedServices(prisma)

  console.log('✅ Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Database seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
