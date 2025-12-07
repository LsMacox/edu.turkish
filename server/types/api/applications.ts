import type { ApplicationStatus } from '@prisma/client'

export interface ApplicationRequest {
  personal_info: {
    first_name: string
    last_name?: string
    email?: string
    phone: string
    country?: string
    city?: string
    birth_date?: string
  }
  preferences?: {
    universities?: string[]
    programs?: string[]
    budget?: string
    start_date?: string
    scholarship_needed?: boolean
    language_preference?: string
  }
  additional_info?: string
  source?: string
  source_description?: string
  user_preferences?: any
  referral_code?: string
}

export interface ApplicationResponse {
  id: string
  status: ApplicationStatus
  submitted_at: string
  tracking_code: string
  crm?: {
    provider: string | null
    leadId: string | number | null
    error: string | null
  }
}
