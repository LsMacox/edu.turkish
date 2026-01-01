import type { PrismaClient, Prisma } from '@prisma/client'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

type ProgramArticleTranslation = {
    locale: string
    slug: string
    title: string
    excerpt: string
    readingTime: string
    heroKicker: string
    heroSubtitle: string
    heroLocation: string
    imageAlt: string
    heroImageAlt: string
    seoDescription: string
    quickFacts: Array<{
        title: string
        value: string
        icon: string
    }>
    tags: string[]
    content: Prisma.JsonValue
}

type ProgramArticle = {
    categoryCode: string
    isProgram: true
    publishedAt: string
    coverImage: string
    heroImage: string
    readingTimeMinutes: number
    translations: ProgramArticleTranslation[]
}

const PROGRAM_ARTICLES_DIR = join(process.cwd(), 'prisma', 'seed', 'json', 'program-articles')

function loadProgramArticles(): ProgramArticle[] {
    if (!existsSync(PROGRAM_ARTICLES_DIR)) {
        console.warn('⚠️ Program articles directory not found:', PROGRAM_ARTICLES_DIR)
        return []
    }

    const files = readdirSync(PROGRAM_ARTICLES_DIR).filter((f: string) => f.endsWith('.json'))
    const articles: ProgramArticle[] = []

    for (const file of files) {
        try {
            const content = readFileSync(join(PROGRAM_ARTICLES_DIR, file), 'utf-8')
            const article = JSON.parse(content) as ProgramArticle
            articles.push(article)
        } catch (error) {
            console.error(`❌ Failed to load program article ${file}:`, error)
        }
    }

    return articles
}

export async function seedProgramArticles(prisma: PrismaClient) {
    console.log('🎓 Seeding program articles...')

    // Удаляем существующие статьи с isProgram = true
    const deleted = await prisma.blogArticle.deleteMany({
        where: { isProgram: true },
    })
    console.log(`🗑️ Deleted ${deleted.count} existing program articles`)

    const articles = loadProgramArticles()

    if (articles.length === 0) {
        console.log('ℹ️ No program articles to seed')
        return
    }

    const categories = await prisma.blogCategory.findMany({
        where: { isProgram: true },
    })

    const categoryMap = new Map(categories.map((c) => [c.code, c.id]))

    let seededCount = 0

    for (const article of articles) {
        const categoryId = categoryMap.get(article.categoryCode)

        if (!categoryId) {
            console.warn(`⚠️ Program category '${article.categoryCode}' not found, skipping article`)
            continue
        }

        const existingArticle = await prisma.blogArticle.findFirst({
            where: {
                translations: {
                    some: {
                        slug: article.translations[0]?.slug,
                    },
                },
            },
        })

        if (existingArticle) {
            console.log(`ℹ️ Article '${article.translations[0]?.slug}' already exists, skipping`)
            continue
        }

        await prisma.blogArticle.create({
            data: {
                categoryId,
                status: 'published',
                isFeatured: false,
                isPowerPage: false,
                isProgram: true,
                publishedAt: new Date(article.publishedAt),
                coverImage: article.coverImage,
                heroImage: article.heroImage,
                readingTimeMinutes: article.readingTimeMinutes,
                translations: {
                    create: article.translations.map((t) => ({
                        locale: t.locale,
                        slug: t.slug,
                        title: t.title,
                        excerpt: t.excerpt,
                        content: t.content as Prisma.InputJsonValue,
                        readingTime: t.readingTime,
                        heroKicker: t.heroKicker,
                        heroSubtitle: t.heroSubtitle,
                        heroLocation: t.heroLocation,
                        imageAlt: t.imageAlt,
                        heroImageAlt: t.heroImageAlt,
                        seoDescription: t.seoDescription,
                        quickFacts: t.quickFacts as Prisma.InputJsonValue,
                        tags: t.tags as Prisma.InputJsonValue,
                    })),
                },
            },
        })

        seededCount++
    }

    console.log(`✅ Seeded ${seededCount} program articles`)
}
