// Common types
export type {
    PaginationMeta,
    ApiResponse,
    UniversityType,
    DegreeType,
    UserType,
    ImportantDateType,
    ScholarshipType,
    ApplicationStatus,
} from './common'

// Request types
export type {
    UniversityQueryParams,
    BlogArticleQueryParams,
    DirectionQueryParams,
    ReviewQueryParams,
    ApplicationRequest,
} from './requests'

// Response types
export type {
    UniversityListResponse,
    UniversityResponse,
    BlogArticlesResponse,
    FaqResponse,
    DirectionResponse,
    ReviewResponse,
    MediaReviewResponse,
    CreateReviewResponse,
    ApplicationResponse,
    ProgramsResponse,
    ProgramDetailResponse,
    ExchangeRatesResponse,
    ExchangeRateDetails,
} from './responses'

// Error types
export type {
    FieldErrorIssue,
    ValidationErrorResponse,
} from './errors'

