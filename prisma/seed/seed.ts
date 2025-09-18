import { PrismaClient } from '@prisma/client'
import { seedFAQs } from './faqs'
import { seedFaqCategories } from './faq-categories'
import { seedLocations } from './locations'
import { seedReviews } from './reviews'
import { seedBlog } from './blog'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Clearing existing data...')
    
    // Delete in reverse dependency order
    await prisma.$transaction([
      prisma.blogArticleTranslation.deleteMany(),
      prisma.blogArticle.deleteMany(),
      prisma.blogCategoryTranslation.deleteMany(),
      prisma.blogCategory.deleteMany(),
      prisma.scholarshipTranslation.deleteMany(),
      prisma.scholarship.deleteMany(),
      prisma.requirementTranslation.deleteMany(),
      prisma.admissionRequirement.deleteMany(),
      prisma.dateTranslation.deleteMany(),
      prisma.importantDate.deleteMany(),
      prisma.documentTranslation.deleteMany(),
      prisma.requiredDocument.deleteMany(),
      prisma.facilityTranslation.deleteMany(),
      prisma.campusFacility.deleteMany(),
      prisma.programTranslation.deleteMany(),
      prisma.academicProgram.deleteMany(),
      prisma.reviewTranslation.deleteMany(),
      prisma.review.deleteMany(),
      prisma.faqTranslation.deleteMany(),
      prisma.faqItem.deleteMany(),
      (prisma as any).faqCategoryTranslation.deleteMany(),
      (prisma as any).faqCategory.deleteMany(),
      prisma.application.deleteMany(),
      // Новые таблицы направлений
      prisma.universityDirection.deleteMany(),
      prisma.directionTranslation.deleteMany(),
      prisma.studyDirection.deleteMany(),
      // Существующие таблицы университетов
      prisma.universityTranslation.deleteMany(),
      prisma.university.deleteMany(),
      // Локации (города/страны)
      (prisma as any).cityTranslation.deleteMany(),
      (prisma as any).city.deleteMany(),
      (prisma as any).countryTranslation.deleteMany(),
      (prisma as any).country.deleteMany(),
    ])
    
    console.log('✅ Existing data cleared')
  }

  
  console.log('⭐ Seeding reviews...')
  await seedReviews(prisma)
  
  console.log('🗺️ Seeding locations...')
  await seedLocations(prisma)

  console.log('📂 Seeding FAQ categories...')
  const faqCategoryMap = await seedFaqCategories(prisma)

  console.log('❓ Seeding FAQs...')
  await seedFAQs(prisma, faqCategoryMap)

  console.log('📰 Seeding blog content...')
  await seedBlog(prisma)

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