import type { ApplicationStatus } from './common'
import type { PaginationMeta, ApiResponse } from './common'
import type {
    University,
    UniversityFilters,
    BlogArticleListItem,
    BlogCategory,
    BlogPopularArticle,
    FaqApiItem,
    FaqCategory,
    Review,
    MediaReview,
    DirectionInfo,
    ProgramCategoryWithItems,
    ProgramDetail,
} from '../entities'

// ============================================================================
// UNIVERSITY
// ============================================================================

export interface UniversityListResponse {
    data: University[]
    meta: PaginationMeta
}

/** @deprecated Use UniversityListResponse instead */
export interface UniversityResponse {
    data: University[]
    meta: PaginationMeta
    filters: UniversityFilters
}

// ============================================================================
// BLOG
// ============================================================================

export interface BlogArticlesResponse extends ApiResponse<BlogArticleListItem[]> {
    featured: BlogArticleListItem | null
    categories: BlogCategory[]
    popular: BlogPopularArticle[]
    totalArticles: number
    totalFAQs: number
}

// ============================================================================
// FAQ
// ============================================================================

export interface FaqResponse {
    data: FaqApiItem[]
    categories: FaqCategory[]
    meta: {
        count: number
        query?: string | null
    }
}

// ============================================================================
// DIRECTION
// ============================================================================

export interface DirectionResponse {
    data: DirectionInfo[]
    meta: PaginationMeta
}

// ============================================================================
// REVIEW
// ============================================================================

export interface ReviewResponse {
    data: Review[]
    meta: PaginationMeta
}

export interface MediaReviewResponse {
    data: MediaReview[]
}

export interface CreateReviewResponse {
    success: boolean
    id?: number
    message: string
}

// ============================================================================
// APPLICATION
// ============================================================================

export interface ApplicationResponse {
    id: string
    status: ApplicationStatus
    submittedAt: string
    trackingCode: string
    crm?: {
        provider: string | null
        leadId: string | number | null
        error: string | null
    }
}

// ============================================================================
// PROGRAM
// ============================================================================

export interface ProgramsResponse {
    data: ProgramCategoryWithItems[]
}

export interface ProgramDetailResponse {
    data: ProgramDetail
}

// ============================================================================
// EXCHANGE RATES
// ============================================================================

import type { SupportedCurrency } from '~~/lib/config/currency'

export interface ExchangeRatesResponse {
    rates: Record<SupportedCurrency, number>
    baseCurrency: 'USD'
    fetchedAt: string // ISO 8601
    expiresAt: string // ISO 8601
    isFallback?: boolean
}

export interface ExchangeRateDetails {
    rates: Record<SupportedCurrency, number>
    fetchedAt: Date
    expiresAt: Date
    isExpired: boolean
}
