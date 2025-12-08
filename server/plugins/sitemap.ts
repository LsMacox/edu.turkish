import { getArticleUrl } from '../../lib/blog/article-type'

// Mapping from sitemap filename locale part to DB locale
const sitemapLocaleMap: Record<string, string> = {
  'ru-RU': 'ru',
  'en-US': 'en',
  'tr-TR': 'tr',
  'kk-KZ': 'kk',
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:resolved', async (ctx: any) => {
    // Identify current sitemap locale
    const sitemapName = ctx.sitemapName || ''
    const sitemapLocaleKey = Object.keys(sitemapLocaleMap).find((key) =>
      sitemapName.includes(key),
    )

    // If this is not a localized sitemap (or unknown), skip adding dynamic routes
    if (!sitemapLocaleKey) {
      return
    }

    const dbLocale = sitemapLocaleMap[sitemapLocaleKey]

    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    try {
      const [articles, universities] = await Promise.all([
        prisma.blogArticleTranslation.findMany({
          where: {
            locale: dbLocale,
            article: {
              status: 'published',
              publishedAt: { lte: new Date() },
            },
          },
          select: {
            slug: true,
            locale: true,
            updatedAt: true,
            article: { select: { updatedAt: true, isProgram: true, isPowerPage: true } },
          },
        }),
        prisma.universityTranslation.findMany({
          where: {
            locale: dbLocale,
          },
          select: { slug: true, locale: true, updatedAt: true },
        }),
      ])

      const articleRoutes = articles.map((a: any) => ({
        loc: `/${a.locale}${getArticleUrl(a.article ?? {}, a.slug)}`,
        lastmod: (a.updatedAt || a.article?.updatedAt)?.toISOString?.(),
      }))
      const universityRoutes = universities.map((u: any) => ({
        loc: `/${u.locale}/university/${u.slug}`,
        lastmod: u.updatedAt?.toISOString?.(),
      }))

      ctx.urls.push(...articleRoutes, ...universityRoutes)
    } catch (e) {
      console.error('[sitemap plugin] failed:', e)
    } finally {
      await prisma.$disconnect()
    }
  })
})
