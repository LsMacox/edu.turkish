import { defineNuxtConfig } from 'nuxt/config'
import {
  componentsConfig,
  createModulesConfig,
  createRouteRulesConfig,
  createRuntimeConfig,
  headConfig,
  loadPrerenderRoutes,
} from './config'

// Environment configuration
const rawSiteUrl =
  process.env.NITRO_ORIGIN || process.env.NUXT_SITE_URL || 'https://edu-turkish.com'
const siteUrl = (/^https?:\/\//i.test(rawSiteUrl) ? rawSiteUrl : `https://${rawSiteUrl}`).replace(
  /\/$/,
  '',
)
const enablePrerender = process.env.NITRO_PRERENDER === 'true'
const enableRemoteImages = process.env.NUXT_ENABLE_REMOTE_IMAGES === 'true'
const cdnUrl = process.env.NUXT_PUBLIC_CDN_URL || ''

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  vite: {
    build: {
      cssCodeSplit: true,
    },
  },

  modules: createModulesConfig({ siteUrl, enableRemoteImages, cdnUrl }),

  css: ['./app/assets/css/tailwind.css'],

  components: componentsConfig,

  imports: {
    dirs: ['stores'],
  },

  app: headConfig,

  runtimeConfig: createRuntimeConfig(siteUrl),

  routeRules: createRouteRulesConfig(enablePrerender),

  nitro: {
    compressPublicAssets: true,
  },

  hooks: {
    'nitro:config'(nitroConfig) {
      if (enablePrerender) {
        loadPrerenderRoutes(nitroConfig)
      }
    },
  },
})
