import type { ApiResponse } from './common'

export interface BlogCategory {
  key: string
  label: string
}

export type BlogArticleContentBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'image'; url: string; alt: string; caption?: string }

export interface BlogArticleQuickFact {
  title: string
  value: string
  icon?: string
}

export interface BlogArticleListItem {
  id: number
  slug: string
  title: string
  excerpt: string
  image: string | null
  imageAlt?: string
  publishedAt: string
  publishedAtLabel: string
  readingTimeMinutes?: number | null
  readingTimeLabel?: string
  category: BlogCategory
}

export interface BlogArticleDetail extends BlogArticleListItem {
  heroImage: string | null
  heroImageAlt?: string
  heroKicker?: string
  heroSubtitle?: string
  heroLocation?: string
  seoDescription?: string
  content: BlogArticleContentBlock[]
  quickFacts: BlogArticleQuickFact[]
  highlights: string[]
  tags: string[]
}

export interface BlogPopularArticle {
  id: number
  slug: string
  title: string
  publishedAt: string
  publishedAtLabel: string
  viewCount: number
  viewCountLabel: string
}

export interface BlogArticlesResponse extends ApiResponse<BlogArticleListItem[]> {
  featured: BlogArticleListItem | null
  categories: BlogCategory[]
  popular: BlogPopularArticle[]
}

export interface BlogArticleQueryParams {
  q?: string
  category?: string
  page?: number
  limit?: number
  lang?: string
}
