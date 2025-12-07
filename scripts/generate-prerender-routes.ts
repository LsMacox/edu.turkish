#!/usr/bin/env tsx
/**
 * Generates prerender routes by querying the database.
 * Run this script before build to create .nuxt/prerender-routes.json
 *
 * Usage: npx tsx scripts/generate-prerender-routes.ts
 */

import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'
import path from 'node:path'
import { getArticleUrl } from '../lib/blog/article-type'

async function main() {
  const prisma = new PrismaClient()

  try {
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
          article: { select: { isProgram: true, isPowerPage: true } },
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
      (a) => `/${a.locale}${getArticleUrl(a.article ?? {}, a.slug)}`,
    )
    const universityRoutes = universities.map((u) => `/${u.locale}/university/${u.slug}`)
    const routes = [...articleRoutes, ...universityRoutes]

    // Ensure .nuxt directory exists
    const outputDir = path.join(process.cwd(), '.nuxt')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const outputPath = path.join(outputDir, 'prerender-routes.json')
    fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2))

    console.log(`Generated ${routes.length} prerender routes to ${outputPath}`)
  } catch (error) {
    console.error('Failed to generate prerender routes:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
