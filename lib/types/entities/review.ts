import type { UserType } from '../api/common'

export type { UserType }

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
    videoId: string | null
    imageUrl: string | null
}

export interface ReviewStatistics {
    totalStudents: number
    averageRating: number
    successRate: number
    universitiesCount: number
    scholarshipsProvided: number
    citiesCovered: number
    languagesSupported: number
    specialtiesAvailable: number
}
