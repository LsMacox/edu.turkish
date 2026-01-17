import type { PrismaClient, Prisma } from '@prisma/client'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

type TranslationContent = {
  locale: string
  slug: string
  title: string
  excerpt: string
  readingTime: string
  heroKicker?: string
  heroSubtitle?: string
  heroLocation?: string
  imageAlt?: string
  heroImageAlt?: string
  seoDescription?: string
  quickFacts?: Array<{
    title: string
    value: string
    icon?: string
  }>
  tags?: string[]
  content: Prisma.JsonValue
}

type SeedArticle = {
  categoryCode: string
  isFeatured?: boolean
  isPowerPage?: boolean
  isProgram?: boolean
  publishedAt: string
  coverImage: string
  heroImage?: string
  readingTimeMinutes?: number
  translations: TranslationContent[]
}

type CategorySeed = {
  code: string
  order: number
  isProgram?: boolean
  translations: Array<{ locale: string; title: string }>
}

const BLOG_JSON_DIR = join(process.cwd(), 'prisma', 'seed', 'json', 'blog')
const BLOG_CATEGORIES_FILE = join(BLOG_JSON_DIR, 'categories.json')
const BLOG_ARTICLES_DIR = join(BLOG_JSON_DIR, 'articles')

function loadBlogCategories(): CategorySeed[] {
  if (!existsSync(BLOG_CATEGORIES_FILE)) {
    console.warn('⚠️ Blog categories file not found:', BLOG_CATEGORIES_FILE)
    return []
  }

  try {
    const content = readFileSync(BLOG_CATEGORIES_FILE, 'utf-8')
    return JSON.parse(content) as CategorySeed[]
  } catch (error) {
    console.error('❌ Failed to load blog categories:', error)
    return []
  }
}

function loadBlogArticles(): SeedArticle[] {
  if (!existsSync(BLOG_ARTICLES_DIR)) {
    console.warn('⚠️ Blog articles directory not found:', BLOG_ARTICLES_DIR)
    return []
  }

  const files = readdirSync(BLOG_ARTICLES_DIR).filter((file) => file.endsWith('.json'))
  const loaded: SeedArticle[] = []

  for (const file of files) {
    const fullPath = join(BLOG_ARTICLES_DIR, file)
    try {
      const content = readFileSync(fullPath, 'utf-8')
      loaded.push(JSON.parse(content) as SeedArticle)
    } catch (error) {
      console.error(`❌ Failed to load blog article ${file}:`, error)
    }
  }

  return loaded
}

export async function seedBlog(prisma: PrismaClient) {
  console.log('📝 Seeding blog categories and articles...')

  const categories = loadBlogCategories()
  const articles = loadBlogArticles()

  if (categories.length === 0) {
    console.warn('⚠️ No blog categories to seed')
    return
  }

  const categoryMap = new Map<string, number>()

  for (const category of categories) {
    const cat = await prisma.blogCategory.upsert({
      where: { code: category.code },
      update: { order: category.order, isProgram: category.isProgram ?? false },
      create: {
        code: category.code,
        order: category.order,
        isProgram: category.isProgram ?? false,
      },
    })

    for (const trans of category.translations) {
      await prisma.blogCategoryTranslation.upsert({
        where: {
          categoryId_locale: {
            categoryId: cat.id,
            locale: trans.locale,
          },
        },
        update: { title: trans.title },
        create: {
          categoryId: cat.id,
          locale: trans.locale,
          title: trans.title,
        },
      })
    }

    categoryMap.set(category.code, cat.id)
  }
  for (const article of articles) {
    const categoryId = categoryMap.get(article.categoryCode)
    if (!categoryId) {
      console.warn(`⚠️ Category ${article.categoryCode} not found for blog article seed.`)
      continue
    }

    await prisma.blogArticle.create({
      data: {
        categoryId,
        status: 'published',
        isFeatured: article.isFeatured ?? false,
        isPowerPage: article.isPowerPage ?? false,
        isProgram: article.isProgram ?? false,
        publishedAt: new Date(article.publishedAt),
        coverImage: article.coverImage,
        heroImage: article.heroImage ?? article.coverImage,
        readingTimeMinutes: article.readingTimeMinutes ?? null,
        translations: {
          create: article.translations.map((translation) => ({
            locale: translation.locale,
            slug: translation.slug,
            title: translation.title,
            excerpt: translation.excerpt,
            content: translation.content as Prisma.InputJsonValue,
            readingTime: translation.readingTime,
            heroKicker: translation.heroKicker,
            heroSubtitle: translation.heroSubtitle,
            heroLocation: translation.heroLocation,
            imageAlt: translation.imageAlt,
            heroImageAlt: translation.heroImageAlt ?? translation.imageAlt,
            seoDescription: translation.seoDescription,
            quickFacts: translation.quickFacts
              ? (translation.quickFacts as Prisma.InputJsonValue)
              : undefined,
            tags: translation.tags ? (translation.tags as Prisma.InputJsonValue) : undefined,
          })),
        },
      },
    })
  }

  console.log('✅ Blog content seeded')
}
