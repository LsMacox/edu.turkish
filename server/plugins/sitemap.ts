export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:resolved', async (ctx: any) => {
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    try {
      const [articles, universities] = await Promise.all([
        prisma.blogArticleTranslation.findMany({
          where: {
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
          select: { slug: true, locale: true, updatedAt: true },
        }),
      ])

      const articleRoutes = articles.map((a: any) => ({
        loc: `/${a.locale}/${a.article?.isProgram ? 'program' : a.article?.isPowerPage ? 'powerpage' : 'articles'}/${a.slug}`,
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
