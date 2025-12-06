import type { BlogArticleContentBlock, BlogArticleQuickFact } from './blog'

/**
 * Категория программы/направления с изображением
 */
export interface ProgramCategory {
  key: string
  label: string
}

/**
 * Программа/направление в списке
 */
export interface ProgramListItem {
  id: number
  slug: string
  title: string
  excerpt: string
  image: string | null
  imageAlt?: string
  publishedAt: string
  publishedAtLabel: string
  category: ProgramCategory
}

/**
 * Детальная информация о программе/направлении
 */
export interface ProgramDetail extends ProgramListItem {
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

/**
 * Категория со списком программ для отображения на странице /programs
 */
export interface ProgramCategoryWithItems {
  key: string
  label: string
  programs: ProgramListItem[]
}

/**
 * Ответ API для списка программ сгруппированных по категориям
 */
export interface ProgramsResponse {
  data: ProgramCategoryWithItems[]
}

/**
 * Ответ API для детальной информации о программе
 */
export interface ProgramDetailResponse {
  data: ProgramDetail
}
