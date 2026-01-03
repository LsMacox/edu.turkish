import type { NuxtConfig } from 'nuxt/schema'
import { SUPPORTED_LOCALES } from '../lib/config/locales'

/**
 * Static pages that should be prerendered per locale
 */
const STATIC_LOCALE_PAGES = [
  'about',
  'faq',
  'blog',
  'contract',
  'universities',
  'reviews',
  'privacy-policy',
] as const

/**
 * Create localized route rules for given paths
 */
function createLocalizedRules(
  paths: string[],
  enablePrerender: boolean,
): Record<string, { prerender: boolean }> {
  return Object.fromEntries(
    SUPPORTED_LOCALES.flatMap((locale) =>
      paths.map((path) => [`/${locale}${path}`, { prerender: enablePrerender }]),
    ),
  )
}

/**
 * Create route rules configuration
 */
export function createRouteRulesConfig(enablePrerender: boolean): NuxtConfig['routeRules'] {
  // Locale index pages (e.g., /ru, /en, /kk, /tr)
  const localeIndexRules = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [`/${locale}`, { prerender: enablePrerender }]),
  )

  // Static pages per locale
  const staticPageRules = createLocalizedRules(
    STATIC_LOCALE_PAGES.map((page) => `/${page}`),
    enablePrerender,
  )

  // Dynamic pages with wildcards
  const wildcardRules = createLocalizedRules(['/university/**', '/articles/**'], enablePrerender)

  return {
    // Root page
    '/': { prerender: enablePrerender },

    // Locale-specific rules
    ...localeIndexRules,
    ...staticPageRules,
    ...wildcardRules,

    // API caching rules
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

    // Static assets caching
    '/_ipx/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
    '/_nuxt/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },

    // UI pages: exclude from indexing (internal/dev pages)
    '/*/ui/**': {
      headers: { 'x-robots-tag': 'noindex, nofollow' },
    },

    // Sitemap
    '/sitemap.xml': {
      prerender: enablePrerender,
      headers: { 'x-robots-tag': 'noindex' },
    },
    '/__sitemap__/**': {
      prerender: enablePrerender,
      headers: { 'x-robots-tag': 'noindex' },
    },

    // Default: all pages indexable
    '/**': {
      headers: {
        'x-robots-tag': 'index, follow',
      },
    },
  }
}
