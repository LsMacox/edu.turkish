import type { DegreeType, UniversityType } from './common'

export interface UniversityQueryParams {
  q?: string
  city?: string
  langs?: string[]
  type?: string
  level?: string
  price_min?: number
  price_max?: number
  sort?: 'pop' | 'price_asc' | 'price_desc' | 'alpha' | 'lang_en'
  page?: number
  limit?: number
  lang?: string
}

export interface University {
  id: number
  slug: string
  title: string
  description: string
  image: string
  heroImage?: string
  city: string
  type: UniversityType
  foundedYear: number
  totalStudents: number
  internationalStudents: number
  hasAccommodation: boolean
  tuitionMin: number
  tuitionMax: number
  currency: string
  languages: string[]
  rankingText?: string
  badge?: { label?: string; labelKey?: string; color: string }
  alternates?: Record<string, string>
}

export interface UniversityCampusFacility {
  id: number
  name: string
  description: string
  image?: string
}

export interface UniversityAdmissionRequirement {
  id: number
  category: string
  requirement: string
  is_mandatory: boolean
  details?: string
}

export interface UniversityRequiredDocument {
  id: number
  name: string
  description: string
  is_mandatory: boolean
  format_requirements?: string[]
}

export interface UniversityImportantDate {
  id: number
  event: string
  date: string
  deadline_type: 'application' | 'document' | 'exam' | 'notification'
}

export interface UniversityScholarship {
  id: number
  name: string
  type: 'government' | 'university' | 'private'
  coverage_percentage: number
  eligibility_criteria: string[]
  application_deadline?: string
}

export interface UniversityProgram {
  id: number
  name: string
  degreeType: DegreeType
  language: string
  durationYears: number
  tuitionPerYear: number
}

export interface UniversityStudyDirection {
  id: number
  name: string
  slug: string
  languages: string[]
}

export interface UniversityCampusGalleryItem {
  url: string
  alt: string
  title: string
}

export interface UniversityDetail extends University {
  about: {
    history: string
    mission: string
    campusFeatures: string[]
    advantages: Array<{ title: string; description: string }>
  }
  campusLife: {
    facilities: UniversityCampusFacility[]
    gallery: UniversityCampusGalleryItem[]
    activities: string[]
  }
  directions: UniversityStudyDirection[]
  admission: {
    requirements: UniversityAdmissionRequirement[]
    documents: UniversityRequiredDocument[]
    deadlines: UniversityImportantDate[]
    scholarships: UniversityScholarship[]
  }
  programs: UniversityProgram[]
}

export interface UniversityFilters {
  cities: string[]
  types: string[]
  levels: string[]
  languages: string[]
  priceRange: [number, number]
}

export interface UniversityResponse {
  data: University[]

  meta: import('./common').PaginationMeta
  filters: UniversityFilters
}
