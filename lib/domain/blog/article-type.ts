/**
 * BlogArticle type abstraction
 *
 * Provides a clean enum-like API over the legacy isProgram/isPowerPage flags.
 * Use this instead of checking flags directly.
 */

// ==========================================
// Types
// ==========================================

export type BlogArticleType = 'article' | 'program' | 'powerpage'

export interface ArticleTypeFlags {
  isProgram?: boolean
  isPowerPage?: boolean
}

// ==========================================
// Type detection
// ==========================================

export function getArticleType(article: ArticleTypeFlags): BlogArticleType {
  if (article.isPowerPage) return 'powerpage'
  if (article.isProgram) return 'program'
  return 'article'
}

// ==========================================
// URL helpers
// ==========================================

export const ARTICLE_TYPE_URL_PREFIX: Record<BlogArticleType, string> = {
  article: '/articles',
  program: '/program',
  powerpage: '/powerpage',
}

export function getArticleUrl(article: ArticleTypeFlags, slug: string): string {
  const type = getArticleType(article)
  return `${ARTICLE_TYPE_URL_PREFIX[type]}/${slug}`
}

