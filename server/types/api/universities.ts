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
}

export interface CampusFacility {
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

export interface AdmissionRequirement {
  id: number
  category: string
  requirement: string
  is_mandatory: boolean
  details?: string
}

export interface RequiredDocument {
  id: number
  name: string
  description: string
  is_mandatory: boolean
  format_requirements?: string[]
}

export interface ImportantDate {
  id: number
  event: string
  date: string
  deadline_type: 'application' | 'document' | 'exam' | 'notification'
}

export interface ScholarshipInfo {
  id: number
  name: string
  type: 'government' | 'university' | 'private'
  coverage_percentage: number
  eligibility_criteria: string[]
  application_deadline?: string
}

export interface AcademicProgram {
  id: number
  name: string
  degree_type: DegreeType
  language: string
  duration_years: number
  tuition_per_year: number
  description: string
  specializations?: string[]
}

export interface StudyDirection {
  id: number
  name: string
  description: string
  slug: string
  languages: string[]
  duration_years?: number
  cost_per_year?: number
}

export interface StrongProgramCategory {
  category: string
  programs: string[]
}

export interface CampusGalleryItem {
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
  campus_life: { facilities: CampusFacility[]; gallery: CampusGalleryItem[]; activities: string[] }
  strong_programs: StrongProgramCategory[]
  directions: StudyDirection[]
  admission: {
    requirements: AdmissionRequirement[]
    documents: RequiredDocument[]
    deadlines: ImportantDate[]
    scholarships: ScholarshipInfo[]
  }
  programs: AcademicProgram[]
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
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  meta: import('./common').PaginationMeta
  filters: UniversityFilters
}
