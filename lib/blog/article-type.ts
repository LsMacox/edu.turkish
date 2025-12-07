/**
 * BlogArticle type abstraction
 *
 * Provides a clean enum-like API over the legacy isProgram/isPowerPage flags.
 * Use this instead of checking flags directly.
 */

// ==========================================
// Types
// ==========================================

/**
 * Logical article type derived from database flags
 */
export type BlogArticleType = 'article' | 'program' | 'powerpage'

/**
 * Minimal interface for article type detection
 */
export interface ArticleTypeFlags {
  isProgram?: boolean
  isPowerPage?: boolean
}

// ==========================================
// Type detection
// ==========================================

/**
 * Derive article type from database flags
 *
 * Priority: isPowerPage > isProgram > article
 *
 * @example
 * const type = getArticleType(article)
 * // 'program' | 'powerpage' | 'article'
 */
export function getArticleType(article: ArticleTypeFlags): BlogArticleType {
  if (article.isPowerPage) return 'powerpage'
  if (article.isProgram) return 'program'
  return 'article'
}

/**
 * Check if article is a specific type
 */
function isArticleType(article: ArticleTypeFlags, type: BlogArticleType): boolean {
  return getArticleType(article) === type
}

// ==========================================
// URL helpers
// ==========================================

/**
 * URL prefix for each article type
 */
export const ARTICLE_TYPE_URL_PREFIX: Record<BlogArticleType, string> = {
  article: '/articles',
  program: '/program',
  powerpage: '/powerpage',
}

/**
 * Get URL path for an article
 *
 * @example
 * getArticleUrl(article, 'my-slug')
 * // '/program/my-slug' or '/articles/my-slug'
 */
export function getArticleUrl(article: ArticleTypeFlags, slug: string): string {
  const type = getArticleType(article)
  return `${ARTICLE_TYPE_URL_PREFIX[type]}/${slug}`
}

/**
 * Get full localized URL for an article
 */
function getLocalizedArticleUrl(article: ArticleTypeFlags, slug: string, locale: string): string {
  return `/${locale}${getArticleUrl(article, slug)}`
}
