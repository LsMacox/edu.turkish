import { defineEventHandler } from 'h3'
import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  const [articles, universities] = await Promise.all([
    prisma.blogArticleTranslation.findMany({
      where: {
        article: {
          status: 'published',
          publishedAt: {
            lte: new Date(),
          },
        },
      },
      select: {
        slug: true,
        locale: true,
      },
    }),
    prisma.universityTranslation.findMany({
      select: {
        slug: true,
        locale: true,
      },
    }),
  ])

  const articleRoutes = articles.map(
    (a: { slug: string; locale: string }) => `/${a.locale}/articles/${a.slug}`,
  )
  const universityRoutes = universities.map(
    (u: { slug: string; locale: string }) => `/${u.locale}/university/${u.slug}`,
  )

  return [...articleRoutes, ...universityRoutes]
})
