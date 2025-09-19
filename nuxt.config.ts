// https://nuxt.com/docs/api/configuration/nuxt-config
const siteUrl = process.env.NUXT_SITE_URL || 'https://edu-turkish.com'

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  vite: {
    build: {
      cssCodeSplit: false
    }
  },
  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@nuxt/fonts',
    '@nuxt/scripts',
    ['@nuxt/image', {
      quality: 78,
      format: ['avif', 'webp', 'auto'],
      screens: {
        xs: 360,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536
      },
      domains: ['storage.googleapis.com'],
      placeholder: true
    }],
    '@nuxtjs/robots',
    '@nuxtjs/sitemap'
  ],
  // Enhanced component auto-import configuration
  components: [
    {
      path: '~/components/layout',
      global: true
    },
    {
      path: '~/components/modals',
      global: true
    },
    {
      path: '~/components/features',
      pathPrefix: false
    },
    {
      path: '~/components/ui',
      prefix: 'Ui'
    },
    {
      path: '~/components/shared',
      global: true
    }
  ],
  icon: {
    collections: ['mdi', 'ph'],
  },
  fonts: {
    provider: 'google'
  },
  
  app: {
    head: {
      // Let @nuxtjs/i18n manage the <html lang> attribute for correct SEO per-locale
      titleTemplate: '%s | Edu.turkish',
      meta: [
        { name: 'charset', content: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Обучение в Турции: поступление, программы, стипендии и поддержка.' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Edu.turkish' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'theme-color', content: '#EF3C24' },
        { name: 'msapplication-TileColor', content: '#EF3C24' },
        { name: 'msapplication-config', content: '/browserconfig.xml' },
        { property: 'og:image', content: '/og-white-1200x630.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },
  runtimeConfig: {
    directusStaticToken: process.env.DIRECTUS_STATIC_TOKEN || '',
    public: {
      siteUrl,
      directusUrl: process.env.NUXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_PUBLIC_URL || 'http://localhost:8055',
      yandexMetrikaId: process.env.NUXT_PUBLIC_YANDEX_METRIKA_ID || ''
    }
  },
  robots: {
    enabled: true,
    groups: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ''
      }
    ],
    sitemap: [`${siteUrl}/sitemap.xml`]
  },
  sitemap: {
    // Uses runtimeConfig.public.siteUrl implicitly
    autoLastmod: true
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      routes: [
        '/', 
        '/ru/about', 
        '/ru/faq', 
        '/ru/contract', 
        '/ru/privacy-policy',
        '/ru/universities',
        '/ru/reviews',
        '/kz/about', 
        '/kz/faq', 
        '/kz/contract',
        '/kz/privacy-policy',
        '/kz/universities',
        '/kz/reviews',
        '/en/about', 
        '/en/faq', 
        '/en/contract', 
        '/en/privacy-policy',
        '/en/universities',
        '/en/reviews',
        '/tr/about', 
        '/tr/faq', 
        '/tr/contract',
        '/tr/privacy-policy',
        '/tr/universities',
        '/tr/reviews',
        '/sitemap.xml',
        '/__sitemap__/ru-RU.xml',
        '/__sitemap__/kk-KZ.xml',
        '/__sitemap__/en-US.xml',
        '/__sitemap__/tr-TR.xml'
      ]
    },
    routeRules: {
      // Cache optimized images aggressively on edge/CDN
      '/_ipx/**': {
        headers: { 'cache-control': 'public, max-age=31536000, immutable' }
      }
    }
  },
  routeRules: {
    '/': { prerender: true },
    '/ru/about': { prerender: true },
    '/ru/faq': { prerender: true },
    '/ru/contract': { prerender: true },
    '/ru/universities': { prerender: true },
    '/ru/reviews': { prerender: true },
    '/ru/privacy-policy': { prerender: true },
    '/ru/university/**': { prerender: true },
    '/ru/blog/**': { prerender: true },
    '/en/about': { prerender: true },
    '/en/faq': { prerender: true },
    '/en/contract': { prerender: true },
    '/en/universities': { prerender: true },
    '/en/reviews': { prerender: true },
    '/en/privacy-policy': { prerender: true },
    '/en/university/**': { prerender: true },
    '/en/blog/**': { prerender: true },
    '/kz/about': { prerender: true },
    '/kz/faq': { prerender: true },
    '/kz/contract': { prerender: true },
    '/kz/universities': { prerender: true },
    '/kz/reviews': { prerender: true },
    '/kz/privacy-policy': { prerender: true },
    '/kz/university/**': { prerender: true },
    '/kz/blog/**': { prerender: true },
    '/tr/about': { prerender: true },
    '/tr/faq': { prerender: true },
    '/tr/contract': { prerender: true },
    '/tr/universities': { prerender: true },
    '/tr/reviews': { prerender: true },
    '/tr/privacy-policy': { prerender: true },
    '/tr/university/**': { prerender: true },
    '/tr/blog/**': { prerender: true },
    '/api/**': {
      headers: { 'cache-control': 'public, max-age=60, stale-while-revalidate=300' }
    },
    '/_nuxt/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' }
    },
    '/sitemap.xml': { prerender: true },
    '/__sitemap__/**': { prerender: true },
    /** Ensure all pages are indexable unless overridden */
    '/**': {
      headers: {
        'x-robots-tag': 'index, follow'
      }
    }
  },
  scripts: {
    // Оптимизированная загрузка внешних скриптов
    // Yandex Metrika загружается через плагин для лучшего контроля
  },
  i18n: {
    // Used for generating absolute alternate/canonical links
    baseUrl: siteUrl,
    langDir: 'locales',
    locales: [
      {
        code: 'ru',
        language: 'ru-RU',
        files: [
          'ru/nav.json',
          'ru/common.json',
          'ru/pages/home.json',
          'ru/pages/about.json',
          'ru/pages/faq.json',
          'ru/pages/blog.json',
          'ru/pages/article.json',
          'ru/pages/reviews.json',
          'ru/pages/universities.json',
          'ru/pages/university.json',
          'ru/privacy-policy.json',
          'ru/contract.json',
          'ru/components/forms.json',
          'ru/components/modals.json',
          'ru/components/ui.json',
          'ru/errors.json'
        ]
      },
      {
        // Use 'kz' as URL prefix while keeping correct language tag
        code: 'kz',
        language: 'kk-KZ',
        files: [
          'kk/nav.json',
          'kk/common.json',
          'kk/pages/home.json',
          'kk/pages/about.json',
          'kk/pages/faq.json',
          'kk/pages/blog.json',
          'kk/pages/article.json',
          'kk/pages/reviews.json',
          'kk/pages/universities.json',
          'kk/pages/university.json',
          'kk/privacy-policy.json',
          'kk/contract.json',
          'kk/components/forms.json',
          'kk/components/modals.json',
          'kk/components/ui.json',
          'kk/errors.json'
        ]
      },
      {
        code: 'en',
        language: 'en-US',
        files: [
          'en/nav.json',
          'en/common.json',
          'en/pages/home.json',
          'en/pages/about.json',
          'en/pages/faq.json',
          'en/pages/blog.json',
          'en/pages/article.json',
          'en/pages/reviews.json',
          'en/pages/universities.json',
          'en/pages/university.json',
          'en/privacy-policy.json',
          'en/contract.json',
          'en/components/forms.json',
          'en/components/modals.json',
          'en/components/ui.json',
          'en/errors.json'
        ]
      },
      {
        code: 'tr',
        language: 'tr-TR',
        files: [
          'tr/nav.json',
          'tr/common.json',
          'tr/pages/home.json',
          'tr/pages/about.json',
          'tr/pages/faq.json',
          'tr/pages/blog.json',
          'tr/pages/article.json',
          'tr/pages/reviews.json',
          'tr/pages/universities.json',
          'tr/pages/university.json',
          'tr/privacy-policy.json',
          'tr/contract.json',
          'tr/components/forms.json',
          'tr/components/modals.json',
          'tr/components/ui.json',
          'tr/errors.json'
        ]
      }
    ],
    defaultLocale: 'ru',
    detectBrowserLanguage: { useCookie: true, cookieKey: 'i18n_locale', redirectOn: 'root' },
    // Missing-key config removed for compatibility
    // Always prefix routes with locale (including default) for consistent SEO-friendly URLs
    strategy: 'prefix'
  }
})
