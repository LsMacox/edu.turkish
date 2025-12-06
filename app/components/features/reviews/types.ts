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

export interface ReviewListResponse<T> {
  data?: T[]
}

export interface StudentReview {
  id: number | string
  name: string
  university: string
  rating: number
  quote: string
}

export interface ParentReview {
  id: number | string
  name: string
  rating: number
  quote: string
  year: number
}
