import type { UniversityType, DegreeType, UserType } from '../../../app/types/domain'

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
}

// Re-export domain types used across API types to simplify imports elsewhere
export type { UniversityType, DegreeType, UserType }
