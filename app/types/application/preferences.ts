import type { UserType } from '@prisma/client'
import type { ServiceApplicationContext } from '~/types/services'

export type StudyLanguage = 'turkish' | 'english' | 'both'

/**
 * Application preferences — all fields optional except source
 */
export interface ApplicationPreferences {
  source: string
  description: string

  // University context
  universityName?: string
  universityCity?: string
  universityTuition?: number

  // Questionnaire fields
  userType?: UserType
  universityChosen?: boolean
  language?: StudyLanguage
  scholarship?: boolean

  // Service context
  serviceContext?: ServiceApplicationContext
}
