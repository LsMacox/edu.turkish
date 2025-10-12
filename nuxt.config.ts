import { defineNuxtConfig } from 'nuxt/config'
import fs from 'node:fs'
import path from 'node:path'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './lib/locales'

const rawSiteUrl =
  process.env.NITRO_ORIGIN || process.env.NUXT_SITE_URL || 'https://edu-turkish.com'
const siteUrl = (/^https?:\/\//i.test(rawSiteUrl) ? rawSiteUrl : `https://${rawSiteUrl}`).replace(
  /\/$/,
  '',
)

const enablePrerender = process.env.NITRO_PRERENDER === 'true'
const isProduction = process.env.NODE_ENV === 'production'

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

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vite: {
    build: {
      cssCodeSplit: false,
    },
  },
  modules: [
    '@pinia/nuxt',
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
        provider: isProduction ? 'google' : 'local',
        defaults: {
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
    ['nuxt-swiper', { bundled: true, enableComposables: true }],
  ],
  css: ['./app/assets/css/tailwind.css'],
  // Enhanced component auto-import configuration
  components: [
    {
      path: '~/components/layout',
      global: true,
    },
    {
      path: '~/components/modals',
      global: true,
    },
    {
      path: '~/components/features',
      pathPrefix: false,
    },
    {
      path: '~/components/ui',
      prefix: 'Ui',
    },
    {
      path: '~/components/shared',
      global: true,
    },
  ],
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
  nitro: {
    compressPublicAssets: true,
  },
  routeRules: {
    '/': { prerender: enablePrerender },
    '/ru': { prerender: enablePrerender },
    '/en': { prerender: enablePrerender },
    '/kk': { prerender: enablePrerender },
    '/tr': { prerender: enablePrerender },
    '/ru/about': { prerender: enablePrerender },
    '/ru/faq': { prerender: enablePrerender },
    '/ru/blog': { prerender: enablePrerender },
    '/ru/contract': { prerender: enablePrerender },
    '/ru/universities': { prerender: enablePrerender },
    '/ru/reviews': { prerender: enablePrerender },
    '/ru/privacy-policy': { prerender: enablePrerender },
    '/ru/university/**': { prerender: enablePrerender },
    '/ru/articles/**': { prerender: enablePrerender },
    '/en/about': { prerender: enablePrerender },
    '/en/faq': { prerender: enablePrerender },
    '/en/blog': { prerender: enablePrerender },
    '/en/contract': { prerender: enablePrerender },
    '/en/universities': { prerender: enablePrerender },
    '/en/reviews': { prerender: enablePrerender },
    '/en/privacy-policy': { prerender: enablePrerender },
    '/en/university/**': { prerender: enablePrerender },
    '/en/articles/**': { prerender: enablePrerender },
    '/kk/about': { prerender: enablePrerender },
    '/kk/faq': { prerender: enablePrerender },
    '/kk/blog': { prerender: enablePrerender },
    '/kk/contract': { prerender: enablePrerender },
    '/kk/universities': { prerender: enablePrerender },
    '/kk/reviews': { prerender: enablePrerender },
    '/kk/privacy-policy': { prerender: enablePrerender },
    '/kk/university/**': { prerender: enablePrerender },
    '/kk/articles/**': { prerender: enablePrerender },
    '/tr/about': { prerender: enablePrerender },
    '/tr/faq': { prerender: enablePrerender },
    '/tr/blog': { prerender: enablePrerender },
    '/tr/contract': { prerender: enablePrerender },
    '/tr/universities': { prerender: enablePrerender },
    '/tr/reviews': { prerender: enablePrerender },
    '/tr/privacy-policy': { prerender: enablePrerender },
    '/tr/university/**': { prerender: enablePrerender },
    '/tr/articles/**': { prerender: enablePrerender },
    '/api/**': {
      prerender: false,
      headers: { 'cache-control': 'public, max-age=60, stale-while-revalidate=300' },
    },
    '/_ipx/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
    '/_nuxt/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
    '/sitemap.xml': { prerender: enablePrerender },
    '/__sitemap__/**': { prerender: enablePrerender },
    /** Ensure all pages are indexable unless overridden */
    '/**': {
      headers: {
        'x-robots-tag': 'index, follow',
      },
    },
  },
})
