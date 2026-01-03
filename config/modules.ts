import type { NuxtConfig } from 'nuxt/schema'
import { createI18nConfig } from './i18n'

/**
 * Create Nuxt modules configuration
 */
export function createModulesConfig(options: {
  siteUrl: string
  enableRemoteImages: boolean
  cdnUrl: string
}): NuxtConfig['modules'] {
  const { siteUrl, enableRemoteImages, cdnUrl } = options

  return [
    // State management
    ['@pinia/nuxt', { storesDirs: ['stores'], autoImports: ['defineStore', 'storeToRefs'] }],

    // Code quality
    '@nuxt/eslint',

    // Styling
    '@nuxtjs/tailwindcss',

    // Icons
    ['@nuxt/icon', { collections: ['mdi', 'ph'] }],

    // Internationalization
    ['@nuxtjs/i18n', createI18nConfig(siteUrl)],

    // Fonts
    [
      '@nuxt/fonts',
      {
        defaults: {
          display: 'swap',
          fallbacks: {
            'sans-serif': ['system-ui', 'Arial'],
          },
        },
      },
    ],

    // Scripts
    '@nuxt/scripts',

    // Image optimization
    [
      '@nuxt/image',
      {
        quality: 78,
        format: ['avif', 'webp', 'auto'],
        domains: enableRemoteImages ? ['cdn.edu-turkish.com', 'edu-turkish.com'] : [],
        screens: {
          xs: 360,
          sm: 640,
          md: 768,
          lg: 1024,
          xl: 1280,
          '2xl': 1536,
        },
        placeholder: true,
        provider: 'bunny',
        bunny: {
          baseURL: cdnUrl,
        },
      },
    ],

    // SEO: Robots
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

    // SEO: Sitemap
    [
      '@nuxtjs/sitemap',
      {
        autoLastmod: true,
        exclude: ['/*/services/**'],
      },
    ],
  ]
}
