import type { PaginationMeta, UserType } from './common'

export interface ReviewQueryParams {
  type?: UserType | 'all'
  featured?: boolean
  page?: number
  limit?: number
  lang?: string
}

export interface Review {
  id: number
  type: UserType
  name: string
  university?: string
  year?: number
  quote: string
  rating: number
  avatar: string
  featured: boolean
  achievements?: {
    yos_score?: number
    scholarship_percentage?: number
    turkish_level?: string
    sat_score?: number
    english_level?: string
    helpful_aspects?: string[]
    recommendation?: string
    faculty?: string
    contact?: string
  }
}

export interface ReviewResponse {
  data: Review[]
  meta: PaginationMeta
}

export interface ReviewStatistics {
  total_students: number
  average_rating: number
  success_rate: number
  universities_count: number
  scholarships_provided: number
  cities_covered: number
  languages_supported: number
  specialties_available: number
}

export interface CreateReviewRequest {
  name: string
  university: string
  faculty?: string
  year?: string
  rating: number
  contact?: string
  review: string
  helpful?: string[]
  recommend?: string
  type?: UserType
}

export interface CreateReviewResponse {
  success: boolean
  id?: number
  message: string
}
