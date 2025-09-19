export interface FAQQueryParams {
  q?: string
  category?: string
  featured?: boolean
  limit?: number
  lang?: string
}

export interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
  featured: boolean
  order: number
  relevance_score?: number
}

export interface FAQCategory {
  key: string
  name: string
  count: number
}

export interface FAQResponse {
  data: FAQItem[]
  categories: FAQCategory[]
  meta: {
    total: number
    filtered: number
    query?: string | null
  }
}
