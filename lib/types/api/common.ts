import type {
    UniversityType,
    DegreeType,
    UserType,
    ImportantDateType,
    ScholarshipType,
    ApplicationStatus,
} from '@prisma/client'

// Re-export Prisma enums for convenience
export type { UniversityType, DegreeType, UserType, ImportantDateType, ScholarshipType, ApplicationStatus }

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

