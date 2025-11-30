import type { ApiResponse } from './common'

export interface BlogCategory {
  key: string
  label: string
}

export type BlogArticleContentBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[]; style?: 'standard' | 'checklist' | 'steps' }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'image'; url: string; alt: string; caption?: string; width?: 'standard' | 'wide' | 'full' }
  | { type: 'spacer'; size: 'sm' | 'md' | 'lg' | 'xl' }
  | { type: 'divider' }
  | { type: 'faq'; items: Array<{ question: string; answer: string }> }

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
  isPowerPage: boolean
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
  tags: string[]
  alternates?: Record<string, string>
}

export interface BlogPopularArticle {
  id: number
  slug: string
  title: string
  publishedAt: string
  publishedAtLabel: string
}

export interface BlogArticlesResponse extends ApiResponse<BlogArticleListItem[]> {
  featured: BlogArticleListItem | null
  categories: BlogCategory[]
  popular: BlogPopularArticle[]
  totalArticles: number
  totalFAQs: number
}

export interface BlogArticleQueryParams {
  q?: string
  category?: string
  page?: number
  limit?: number
  lang?: string
}
