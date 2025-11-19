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
  title: string
  description: string
  city: string
  foundedYear: number
  type: UniversityType
  tuitionRange: { min: number; max: number; currency: string }
  totalStudents: number
  internationalStudents: number
  ranking: { text?: string }
  hasAccommodation: boolean
  languages: string[]
  slug: string
  image: string
  heroImage?: string
  badge?: { label?: string; labelKey?: string; color: string }
  alternates?: Record<string, string>
}

export interface UniversityCampusFacility {
  id: number
  name: string
  description: string
  image?: string
  type:
    | 'academic'
    | 'recreational'
    | 'accommodation'
    | 'dining'
    | 'sports'
    | 'medical'
    | 'transport'
    | 'technology'
    | 'support'
  isActive: boolean
  order?: number
  capacity?: number
  area?: number
  features?: Record<string, any>
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
  degree_type: DegreeType
  language: string
  duration_years: number
  tuition_per_year: number
  description?: string
  specializations?: string[]
}

export interface UniversityStudyDirection {
  id: number
  name: string
  slug: string
  languages: string[]
}

export interface StrongProgramCategory {
  category: string
  programs: string[]
}

export interface UniversityCampusGalleryItem {
  url: string
  alt: string
  title: string
}

export interface UniversityKeyInfo {
  city: string
  foundedYear: number
  tuitionRange: { min: number; max: number; currency: string }
  languages: string[]
  totalStudents: number
  internationalStudents: number
  hasAccommodation: boolean
  texts?: Record<string, string>
  ranking: { text?: string }
}

export interface UniversityDetail extends University {
  keyInfo: UniversityKeyInfo
  about: {
    history: string
    mission: string
    campus_features: string[]
    strong_programs: string[]
    advantages: Array<{ title: string; description: string }>
  }
  campus_life: {
    facilities: UniversityCampusFacility[]
    gallery: UniversityCampusGalleryItem[]
    activities: string[]
  }
  strong_programs: StrongProgramCategory[]
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
