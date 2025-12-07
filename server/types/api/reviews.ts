import type { PaginationMeta, UserType } from './common'

export interface ReviewQueryParams {
  type?: UserType | 'all'
  featured?: boolean
  mediaType?: 'text' | 'video' | 'image'
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

/**
 * Media review (video/image) for carousel display
 */
export interface MediaReview {
  id: number
  type: string
  mediaType: 'video' | 'image' | 'text'
  name: string
  quote: string
  university: string
  rating: number | null
  year: number | null
  avatar: string | null
  videoUrl: string | null
  videoThumb: string | null
  videoDuration: string | null
  imageUrl: string | null
}

export interface MediaReviewResponse {
  data: MediaReview[]
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
  helpfulAspects?: string[]
  recommendation?: string
  type?: UserType
}

export interface CreateReviewResponse {
  success: boolean
  id?: number
  message: string
}
