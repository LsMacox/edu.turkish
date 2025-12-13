import type { UniversityType, DegreeType, ImportantDateType, ScholarshipType } from '../api/common'

// Re-export enums from api/common for convenience
export type { UniversityType, DegreeType, ImportantDateType, ScholarshipType }

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
    icon?: string
}

export interface UniversityAdmissionRequirement {
    id: number
    category: string
    requirement: string
    isMandatory: boolean
    details?: string
}

export interface UniversityRequiredDocument {
    id: number
    name: string
    description: string
    isMandatory: boolean
    formatRequirements?: string[]
}

export interface UniversityImportantDate {
    id: number
    event: string
    date: string
    deadlineType: ImportantDateType
}

export interface UniversityScholarship {
    id: number
    name: string
    type: ScholarshipType
    coveragePercentage: number
    eligibilityCriteria: string[]
    applicationDeadline?: string
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
