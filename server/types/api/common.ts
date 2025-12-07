import type {
  UniversityType,
  DegreeType,
  UserType,
  ImportantDateType,
  ScholarshipType,
} from '@prisma/client'

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

// Re-export Prisma enums used across API types to simplify imports elsewhere
export type { UniversityType, DegreeType, UserType, ImportantDateType, ScholarshipType }
