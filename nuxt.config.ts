import fs from 'node:fs'
import path from 'node:path'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from './lib/locales'

const siteUrl = process.env.NUXT_SITE_URL || 'https://edu-turkish.com'

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
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@nuxt/fonts',
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
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    'nuxt-swiper',
  ],
  swiper: {
    bundled: true,
    enableComposables: true,
  },
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
  icon: {
    collections: ['mdi', 'ph'],
  },
  fonts: {
    provider: isProduction ? 'google' : 'local',
    defaults: {
      fallbacks: {
        'sans-serif': ['system-ui', 'Arial'],
      },
    },
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
          content: 'Обучение в Турции: поступление, программы, стипендии и поддержка.',
        },
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
    directusStaticToken: process.env.DIRECTUS_STATIC_TOKEN || '',
    // CRM Configuration
    crmProvider: process.env.NUXT_CRM_PROVIDER || process.env.CRM_PROVIDER || 'espocrm',
    // Bitrix
    bitrixWebhookUrl: process.env.NUXT_BITRIX_WEBHOOK_URL || process.env.BITRIX_WEBHOOK_URL || '',
    bitrixAccessToken: process.env.NUXT_BITRIX_ACCESS_TOKEN || process.env.BITRIX_ACCESS_TOKEN || '',
    // EspoCRM
    espocrmUrl: process.env.NUXT_ESPOCRM_URL || process.env.ESPOCRM_URL || 'http://espocrm',
    espocrmApiKey: process.env.NUXT_ESPOCRM_API_KEY || process.env.ESPOCRM_API_KEY || '',
    // Redis
    redisHost: process.env.NUXT_REDIS_HOST || process.env.REDIS_HOST || 'localhost',
    redisPort: process.env.NUXT_REDIS_PORT || process.env.REDIS_PORT || '6379',
    redisPassword: process.env.NUXT_REDIS_PASSWORD || process.env.REDIS_PASSWORD || '',
    public: {
      siteUrl,
      directusUrl: process.env.NUXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055',
      yandexMetrikaId: process.env.NUXT_PUBLIC_YANDEX_METRIKA_ID || '',
    },
  },
  robots: {
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
  sitemap: {
    // Uses runtimeConfig.public.siteUrl implicitly
    autoLastmod: true,
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
  i18n: {
    // Used for generating absolute alternate/canonical links
    baseUrl: siteUrl,
    // Don't change this path, it is correct
    langDir: 'locales',
    locales: SUPPORTED_LOCALES.map(code => ({
      code,
      language: code === 'kk' ? 'kk-KZ' : code === 'ru' ? 'ru-RU' : code === 'en' ? 'en-US' : 'tr-TR',
      files: getLocaleFiles(code),
    })),
    defaultLocale: DEFAULT_LOCALE,
    detectBrowserLanguage: { useCookie: true, cookieKey: 'i18n_locale', redirectOn: 'root' },
    // Missing-key config removed for compatibility
    // Always prefix routes with locale (including default) for consistent SEO-friendly URLs
    strategy: 'prefix',
  },
})