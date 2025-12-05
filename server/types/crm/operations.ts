import { z } from 'zod'

export interface LeadData {
  firstName: string
  lastName?: string
  phone: string
  email?: string
  universities?: string[]
  programs?: string[]
  userType?: 'student' | 'parent'
  language?: 'turkish' | 'english' | 'both'
  scholarship?: 'yes' | 'no'
  universityChosen?: string
  referralCode: string
  source: string
  sourceDescription?: string
  additionalInfo?: string
  session?: string
  fingerprintKey?: string
}

export interface CRMResult {
  success: boolean
  id?: string | number
  error?: string
  provider: 'espocrm'
  operation: 'createLead'
  timestamp: Date
  duplicate?: boolean
  validationErrors?: string[]
}

export const leadDataSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().min(10).max(20),
  email: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().email().optional(),
  ),
  universities: z.array(z.string()).optional(),
  programs: z.array(z.string()).optional(),
  userType: z.enum(['student', 'parent']).optional(),
  language: z.enum(['turkish', 'english', 'both']).optional(),
  scholarship: z.enum(['yes', 'no']).optional(),
  universityChosen: z.string().optional(),
  referralCode: z.string().min(1),
  source: z.string().min(1),
  sourceDescription: z.string().optional(),
  additionalInfo: z.string().optional(),
  session: z.string().optional(),
  fingerprintKey: z.string().min(3).optional(),
})
