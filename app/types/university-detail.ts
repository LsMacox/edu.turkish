import type { UniversityStudyDirection } from '~~/server/types/api/universities'
import type { DegreeType } from '~/types/domain'

export interface UniversityProgram {
  name: string
  language: 'EN' | 'TR' | 'EN/TR'
  duration: string
  price: number
  level: DegreeType
}

export interface UniversityKeyInfo {
  city: string
  foundedYear: number
  priceFrom: number
  languages: string[]
  studentsCount: number
  accommodation: string
  ranking: string
  internationalStudents: string
}

export interface UniversityDetailFrontend {
  id: string
  name: string
  description: string
  heroImage: string
  type: string
  keyInfo: UniversityKeyInfo
  about: {
    history: string
    campus: string
    advantages: Array<{
      title: string
      description: string
    }>
  }
  strongPrograms: Array<{
    category: string
    programs: string[]
  }>
  academicPrograms: UniversityProgram[]
  slugs: {
    ru: string
    en: string
    kk: string
    tr: string
  }
  directions?: UniversityStudyDirection[]
  campus_life?: {
    gallery: Array<{
      url: string
      alt?: string
      title?: string
    }>
    facilities: Array<{
      id: number
      name: string
      description: string
      type: string
      capacity?: number
      area?: number
    }>
  }
  admission?: {
    requirements: Array<{
      id: number
      category: string
      requirement: string
      is_mandatory: boolean
      details?: string
    }>
    documents: Array<{
      id: number
      name: string
      description: string
      is_mandatory: boolean
      format_requirements?: string[]
    }>
    deadlines: Array<{
      id: number
      event: string
      date: string
      deadline_type: 'application' | 'document' | 'exam' | 'notification'
    }>
    scholarships: Array<{
      id: number
      name: string
      type: 'government' | 'university' | 'private'
      coverage_percentage: number
      eligibility_criteria: string[]
      application_deadline?: string
    }>
  }
}
