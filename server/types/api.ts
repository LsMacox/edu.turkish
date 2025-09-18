import type { UniversityType, DegreeType, UserType } from '../../app/types/domain'
// ==========================================
// Common API Interfaces
// ==========================================

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

// ==========================================
// Blog API Interfaces
// ==========================================

export interface BlogCategory {
  key: string
  label: string
}

export type BlogArticleContentBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'image'; url: string; alt: string; caption?: string }

export interface BlogArticleListItem {
  id: number
  slug: string
  title: string
  excerpt: string
  image: string | null
  imageAlt?: string
  publishedAt: string
  publishedAtLabel: string
  readingTimeMinutes?: number | null
  readingTimeLabel?: string
  category: BlogCategory
}

export interface BlogArticleDetail extends BlogArticleListItem {
  heroImage: string | null
  heroImageAlt?: string
  heroKicker?: string
  heroSubtitle?: string
  heroLocation?: string
  seoDescription?: string
  content: BlogArticleContentBlock[]
}

export interface BlogPopularArticle {
  id: number
  slug: string
  title: string
  publishedAt: string
  publishedAtLabel: string
  viewCount: number
  viewCountLabel: string
}

export interface BlogArticlesResponse extends ApiResponse<BlogArticleListItem[]> {
  featured: BlogArticleListItem | null
  categories: BlogCategory[]
  popular: BlogPopularArticle[]
}

export interface BlogArticleQueryParams {
  q?: string
  category?: string
  page?: number
  limit?: number
  lang?: string
}

// ==========================================
// University API Interfaces
// ==========================================

export interface UniversityQueryParams {
  q?: string           // Search query
  city?: string        // City filter
  langs?: string[]     // Language of instruction filter
  type?: string        // Institution type filter
  level?: string       // Academic level filter
  price_min?: number   // Minimum tuition
  price_max?: number   // Maximum tuition
  sort?: 'pop' | 'price_asc' | 'price_desc' | 'alpha' | 'lang_en'
  page?: number        // Page number
  limit?: number       // Items per page
  lang?: string        // API language
}

export interface University {
  id: number
  title: string
  description: string
  city: string
  foundedYear: number
  type: UniversityType
  
  // Стоимость (нормализованная)
  tuitionRange: {
    min: number
    max: number
    currency: string
  }
  
  // Студенты (нормализованная)
  totalStudents: number
  internationalStudents: number
  
  // Рейтинг (нормализованный)
  ranking: {
    text?: string
  }
  
  // Проживание (нормализованное)
  hasAccommodation: boolean
  
  // Мета
  languages: string[]
  slug: string
  image: string
  heroImage?: string
  badge?: {
    label?: string
    labelKey?: string
    color: string
  }
}

export interface CampusFacility {
  id: number
  name: string
  description: string
  image?: string
  type: 'academic' | 'recreational' | 'accommodation' | 'dining' | 'sports' | 'medical' | 'transport' | 'technology' | 'support'
  
  // Новые поля
  isActive: boolean
  order?: number
  capacity?: number
  area?: number
  features?: Record<string, any>
}

export interface DormitoryInfo {
  id: number
  name: string
  type: 'male' | 'female' | 'mixed'
  capacity: number
  price_per_month: number
  amenities: string[]
  distance_to_campus: string
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

// Новые интерфейсы для расширенных данных
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
  tuitionRange: {
    min: number
    max: number
    currency: string
  }
  languages: string[]
  totalStudents: number
  internationalStudents: number
  hasAccommodation: boolean
  // Локализованные тексты для отображения в UI (необязательно)
  texts?: Record<string, string>
  ranking: {
    text?: string
  }
}

export interface UniversityDetail extends University {
  // Дополнительные поля для детального представления
  keyInfo: UniversityKeyInfo
  
  about: {
    history: string
    mission: string
    campus_features: string[]
    strong_programs: string[]
    advantages: Array<{
      title: string
      description: string
    }>
  }
  
  campus_life: {
    facilities: CampusFacility[]
    dormitories: DormitoryInfo[]
    gallery: CampusGalleryItem[]
    activities: string[]
  }
  
  // Сильные программы (агрегируются из FeaturedProgram)
  strong_programs: StrongProgramCategory[]
  
  // Связанные направления обучения
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
  meta: PaginationMeta
  filters: UniversityFilters
}

// ==========================================
// Study Directions API Interfaces
// ==========================================

export interface DirectionQueryParams {
  q?: string           // Search query
  page?: number        // Page number
  limit?: number       // Items per page
  lang?: string        // API language
}

export interface DirectionInfo {
  id: number
  name: string
  description: string
  slug: string
  universities_count: number
}

export interface DirectionResponse {
  data: DirectionInfo[]
  meta: PaginationMeta
}

export interface DirectionDetailResponse {
  direction: DirectionInfo
  universities: University[]
}

// ==========================================
// Reviews API Interfaces
// ==========================================

export interface ReviewQueryParams {
  type?: UserType | 'all'
  featured?: boolean
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
  }
}

export interface ReviewResponse {
  data: Review[]
  meta: PaginationMeta
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
  helpful?: string[]
  recommend?: string
  type?: UserType
}

export interface CreateReviewResponse {
  success: boolean
  id?: number
  message: string
}

// ==========================================
// FAQ API Interfaces
// ==========================================

export interface FAQQueryParams {
  q?: string           // Search query for questions and answers
  category?: string    // Filter by category
  featured?: boolean   // Show only featured FAQs
  limit?: number       // Number of results
  lang?: string        // API language
}

// Simplified FAQ data structure - using plain HTML strings for answers
export interface FAQItem {
  id: number
  question: string
  answer: string  // Always HTML string format
  category: string
  featured: boolean
  order: number
  relevance_score?: number  // When search is used
}

export interface FAQCategory {
  key: string
  name: string
  count: number
}

export interface FAQResponse {
  data: FAQItem[]
  categories: FAQCategory[]
  meta: {
    total: number
    filtered: number
    query?: string | null
  }
}

// ==========================================
// Application API Interfaces
// ==========================================

export interface ApplicationRequest {
  personal_info: {
    first_name: string
    last_name: string
    email: string
    phone: string
    country?: string
    city?: string
    birth_date?: string
  }
  education: {
    level: string
    field: string // направление обучения
    institution?: string // учебное заведение
    school_name?: string
    graduation_year?: number
    gpa?: number
  }
  preferences: {
    universities?: string[] // названия университетов
    programs?: string[]
    budget?: string // планируемый бюджет
    start_date?: string // желаемая дата начала
    scholarship_needed?: boolean
    language_preference?: string
  }
  additional_info?: string // общее поле для дополнительной информации
  source: string // источник заявки
  user_preferences?: any // предпочтения пользователя из анкеты
  referral_code?: string // New field for explicit referral tracking
}

export interface ApplicationResponse {
  id: string
  status: 'submitted' | 'processing' | 'approved' | 'rejected'
  submitted_at: string
  tracking_code: string
  bitrix?: {
    leadId: number | null
    error: string | null
  }
}

// ==========================================
// Content API Interfaces
// ==========================================

export interface AboutContent {
  mission: string
  story: string
  values: Array<{
    title: string
    description: string
  }>
  guarantees: Array<{
    title: string
    description: string
  }>
  contact_info: {
    email: string
    phone: string
    whatsapp: string
    address: string
  }
  working_hours: {
    weekdays: string
    weekends: string
    timezone: string
  }
}

// ==========================================
// Error Response Interfaces
// ==========================================

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ErrorResponse {
  error: ApiError
  validation_errors?: ValidationError[]
  timestamp: string
  path: string
}