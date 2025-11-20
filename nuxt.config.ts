import { defineNuxtConfig } from 'nuxt/config'
import fs from 'node:fs'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './lib/locales'

const rawSiteUrl =
  process.env.NITRO_ORIGIN || process.env.NUXT_SITE_URL || 'https://edu-turkish.com'
const siteUrl = (/^https?:\/\//i.test(rawSiteUrl) ? rawSiteUrl : `https://${rawSiteUrl}`).replace(
  /\/$/,
  '',
)

const enablePrerender = process.env.NITRO_PRERENDER === 'true'

function getLocaleFiles(localeCode: string): string[] {
  const localeDir = path.join('i18n/locales', localeCode)
  const files: string[] = []

  function readDir(dir: string, prefix = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true })
    for (const item of items) {
      const fullPath = path.join(dir, item.name)
      const relPath = prefix ? path.join(prefix, item.name) : item.name
      if (item.isDirectory()) {
        readDir(fullPath, relPath)
      } else if (item.name.endsWith('.json')) {
        files.push(relPath)
      }
    }
  }

  readDir(localeDir, localeCode)
  return files
}

function toPascalCase(str: string): string {
  return str
    .replace(/(^|[-_\s]+)([a-zA-Z0-9])/g, (_, __, c) => String(c).toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

function getFeatureDirs(): string[] {
  const base = path.join('app', 'components', 'features')
  try {
    return fs
      .readdirSync(base, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
  } catch {
    return []
  }
}

function hasVueFiles(dir: string): boolean {
  try {
    return fs.readdirSync(dir).some((f) => f.endsWith('.vue'))
  } catch {
    return false
  }
}

const featureComponentGroups = getFeatureDirs().flatMap((feature) => {
  const prefix = toPascalCase(feature)
  const baseAbs = path.join('app', 'components', 'features', feature)

  const entries: Array<{ path: string; prefix: string; pathPrefix: boolean }> = []

  // Register immediate subdirectories individually (e.g., components, sections)
  try {
    const children = fs.readdirSync(baseAbs, { withFileTypes: true })
    for (const child of children) {
      if (child.isDirectory()) {
        entries.push({
          path: `~/components/features/${feature}/${child.name}`,
          prefix,
          pathPrefix: false,
        })
      }
    }
  } catch {}

  // If the feature root contains .vue files directly, register it too
  if (hasVueFiles(baseAbs)) {
    entries.push({
      path: `~/components/features/${feature}`,
      prefix,
      pathPrefix: false,
    })
  }

  // Fallback: if no entries created (e.g., empty folders), still add base to avoid missing imports
  if (entries.length === 0) {
    entries.push({
      path: `~/components/features/${feature}`,
      prefix,
      pathPrefix: false,
    })
  }

  return entries
})

const STATIC_LOCALE_PAGES = [
  'about',
  'faq',
  'blog',
  'contract',
  'universities',
  'reviews',
  'privacy-policy',
]

const localized = (paths: string[]) =>
  Object.fromEntries(
    SUPPORTED_LOCALES.flatMap((l) =>
      paths.map((p) => [`/${l}${p}`, { prerender: enablePrerender }]),
    ),
  )

const prerenderLocaleIndex = Object.fromEntries(
  SUPPORTED_LOCALES.map((l) => [`/${l}`, { prerender: enablePrerender }]),
)

const prerenderLocaleStatics = localized(STATIC_LOCALE_PAGES.map((s) => `/${s}`))
const prerenderLocaleWildcards = localized(['/university/**', '/articles/**'])

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  vite: {
    build: {
      cssCodeSplit: true,
    },
  },
  modules: [
    ['@pinia/nuxt', { storesDirs: ['stores'], autoImports: ['defineStore', 'storeToRefs'] }],
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    ['@nuxt/icon', { collections: ['mdi', 'ph'] }],
    [
      '@nuxtjs/i18n',
      {
        baseUrl: siteUrl,
        langDir: 'locales',
        locales: SUPPORTED_LOCALES.map((code) => ({
          code,
          language:
            code === 'kk' ? 'kk-KZ' : code === 'ru' ? 'ru-RU' : code === 'en' ? 'en-US' : 'tr-TR',
          files: getLocaleFiles(code),
        })),
        defaultLocale: DEFAULT_LOCALE,
        detectBrowserLanguage: { useCookie: true, cookieKey: 'i18n_locale', redirectOn: 'root' },
        strategy: 'prefix',
      },
    ],
    [
      '@nuxt/fonts',
      {
        provider: 'local',
        defaults: {
          display: 'swap',
          fallbacks: {
            'sans-serif': ['system-ui', 'Arial'],
          },
        },
      },
    ],
    '@nuxt/scripts',
    [
      '@nuxt/image',
      {
        quality: 78,
        format: ['avif', 'webp', 'auto'],
        screens: {
          xs: 360,
          sm: 640,
          md: 768,
          lg: 1024,
          xl: 1280,
          '2xl': 1536,
        },
        placeholder: true,
      },
    ],
    [
      '@nuxtjs/robots',
      {
        enabled: true,
        groups: [
          {
            userAgent: '*',
            allow: '/',
            disallow: '',
          },
        ],
        sitemap: [`${siteUrl}/sitemap.xml`],
      },
    ],
    [
      '@nuxtjs/sitemap',
      {
        autoLastmod: true,
      },
    ],
  ],
  css: ['./app/assets/css/tailwind.css'],
  // Enhanced component auto-import configuration
  components: [
    {
      path: '~/components/layout',
      global: true,
    },
    ...featureComponentGroups,
    {
      path: '~/components/ui',
      prefix: 'Ui',
    },
    {
      path: '~/components/shared',
      global: true,
      pathPrefix: false,
    },
  ],
  imports: {
    dirs: ['stores'],
  },
  app: {
    head: {
      // Let @nuxtjs/i18n manage the <html lang> attribute for correct SEO per-locale
      titleTemplate: '%s | Edu.turkish',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Edu.turkish помогает поступить в университеты Турции: подбор программ, подготовка документов, стипендии и сопровождение на каждом этапе.',
        },
        {
          property: 'og:description',
          content:
            'Edu.turkish помогает поступить в университеты Турции: подбор программ, подготовка документов, стипендии и сопровождение на каждом этапе.',
        },
        {
          name: 'twitter:description',
          content:
            'Edu.turkish помогает поступить в университеты Турции: подбор программ, подготовка документов, стипендии и сопровождение на каждом этапе.',
        },
        { name: 'yandex-verification', content: 'a98923cf37486ffa' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Edu.turkish' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'theme-color', content: '#EF3C24' },
        { name: 'msapplication-TileColor', content: '#EF3C24' },
        { name: 'msapplication-config', content: '/browserconfig.xml' },
        { property: 'og:image', content: '/og-white-1200x630.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },
  runtimeConfig: {
    // Private (server-only)
    espocrmWebhookToken: process.env.NUXT_ESPOCRM_WEBHOOK_TOKEN || '',
    espocrmAssignedTeamId: process.env.NUXT_ESPOCRM_ASSIGNED_TEAM_ID || '',
    telegramBotToken: process.env.NUXT_TELEGRAM_BOT_TOKEN || '',
    telegramLeadsChannelId: process.env.NUXT_TELEGRAM_LEADS_CHANNEL_ID || '',
    telegramCallsChannelId: process.env.NUXT_TELEGRAM_CALLS_CHANNEL_ID || '',
    public: {
      siteUrl,
      directusUrl: process.env.NUXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055',
      yandexMetrikaId: process.env.NUXT_PUBLIC_YANDEX_METRIKA_ID || '',
      cdnUrl: process.env.NUXT_PUBLIC_CDN_URL || '',
    },
  },
  hooks: {
    async 'nitro:config'(nitroConfig) {
      if (enablePrerender) {
        const { PrismaClient } = await import('@prisma/client')
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
              },
            }),
            prisma.universityTranslation.findMany({
              select: {
                slug: true,
                locale: true,
              },
            }),
          ])

          const articleRoutes = articles.map((a) => `/${a.locale}/articles/${a.slug}`)
          const universityRoutes = universities.map((u) => `/${u.locale}/university/${u.slug}`)
          const routes = [...articleRoutes, ...universityRoutes]

          if (!nitroConfig.prerender) {
            nitroConfig.prerender = {}
          }
          if (!nitroConfig.prerender.routes) {
            nitroConfig.prerender.routes = []
          }
          nitroConfig.prerender.routes.push(...routes)
        } catch (error) {
          console.error('Failed to fetch routes for prerender:', error)
        } finally {
          await prisma.$disconnect()
        }
      }
    },
  },
  nitro: {
    compressPublicAssets: true,
  },
  routeRules: {
    '/': { prerender: enablePrerender },
    ...prerenderLocaleIndex,
    ...prerenderLocaleStatics,
    ...prerenderLocaleWildcards,
    '/api/v1/reviews/media': {
      cache: {
        maxAge: 60 * 10,
        swr: true,
      },
      headers: {
        'cache-control': 'public, max-age=600, stale-while-revalidate=3600',
        'x-robots-tag': 'noindex',
      },
    },
    '/api/**': {
      prerender: false,
      headers: {
        'cache-control': 'public, max-age=60, stale-while-revalidate=300',
        'x-robots-tag': 'noindex',
      },
    },
    '/_ipx/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
    '/_nuxt/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
    '/sitemap.xml': {
      prerender: enablePrerender,
      headers: { 'x-robots-tag': 'noindex' },
    },
    '/__sitemap__/**': {
      prerender: enablePrerender,
      headers: { 'x-robots-tag': 'noindex' },
    },
    /** Ensure all pages are indexable unless overridden */
    '/**': {
      headers: {
        'x-robots-tag': 'index, follow',
      },
    },
  },
})
