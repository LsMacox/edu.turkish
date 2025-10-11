import { z } from 'zod'

/**
 * CRM Operation Types and Validation Schemas
 */

export interface LeadData {
  // Personal Information (required)
  firstName: string
  lastName?: string
  phone: string
  email?: string

  // Education Preferences (optional)
  universities?: string[]
  programs?: string[]

  // User Preferences (optional)
  userType?: 'student' | 'parent'
  language?: 'turkish' | 'english' | 'both'
  scholarship?: 'yes' | 'no'
  universityChosen?: string

  // Attribution (required)
  referralCode: string
  source: string
  sourceDescription?: string

  // UTM Parameters (optional)
  utm?: {
    source?: string
    medium?: string
    campaign?: string
    content?: string
    term?: string
  }

  // Additional
  additionalInfo?: string
  session?: string
  fingerprintKey?: string
}

export interface ActivityData {
  channel: 'telegramBot' | 'whatsapp' | 'instagram'
  referralCode: string
  session?: string
  utm?: {
    source?: string
    medium?: string
    campaign?: string
    content?: string
    term?: string
  }
  metadata?: {
    page?: string
    section?: string
    component?: string
    campaign?: string
    referrer?: string
    notes?: string
  }
}

export interface CRMResult {
  success: boolean
  id?: string | number
  error?: string
  provider: 'bitrix' | 'espocrm'
  operation: 'createLead' | 'logActivity' | 'createMinimalLeadFromActivity'
  timestamp: Date
  duplicate?: boolean
  validationErrors?: string[]
}

export interface CRMQueueJob {
  id: string
  operation: 'createLead' | 'logActivity'
  provider: 'bitrix' | 'espocrm'
  data: LeadData | ActivityData
  attempts: number
  maxAttempts: number
  createdAt: Date
  lastAttemptAt?: Date
  nextRetryAt?: Date
  error?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

// Zod Validation Schemas
export const leadDataSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().min(10).max(20),
  email: z.preprocess((v) => {
    if (typeof v === 'string') {
      const t = v.trim()
      return t === '' ? undefined : t
    }
    return v
  }, z.string().email().optional()),
  universities: z.array(z.string()).optional(),
  programs: z.array(z.string()).optional(),
  userType: z.enum(['student', 'parent']).optional(),
  language: z.enum(['turkish', 'english', 'both']).optional(),
  scholarship: z.enum(['yes', 'no']).optional(),
  universityChosen: z.string().optional(),
  referralCode: z.string().min(1),
  source: z.string().min(1),
  sourceDescription: z.string().optional(),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      content: z.string().optional(),
      term: z.string().optional(),
    })
    .optional(),
  additionalInfo: z.string().optional(),
  session: z.string().optional(),
  fingerprintKey: z.string().min(3).optional(),
})

export const activityDataSchema = z.object({
  channel: z.enum(['telegramBot', 'whatsapp', 'instagram']),
  referralCode: z.string().min(1),
  session: z.string().optional(),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      content: z.string().optional(),
      term: z.string().optional(),
    })
    .optional(),
  metadata: z
    .object({
      page: z.string().optional(),
      section: z.string().optional(),
      component: z.string().optional(),
      campaign: z.string().optional(),
      referrer: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
})
