import type { NuxtConfig } from 'nuxt/schema'

/**
 * App head configuration
 */
export const headConfig: NuxtConfig['app'] = {
  head: {
    titleTemplate: '%s | Edu.turkish',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
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
}
