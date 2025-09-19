export interface UserPreferencesDTO {
  source?: string
  userType?: 'student' | 'parent'
  universityChosen?: 'yes' | 'no'
  language?: 'turkish' | 'english' | 'both'
  scholarship?: 'yes' | 'no'
}

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
    field: string
    institution?: string
    school_name?: string
    graduation_year?: number
    gpa?: number
  }
  preferences: {
    universities?: string[]
    programs?: string[]
    budget?: string
    start_date?: string
    scholarship_needed?: boolean
    language_preference?: string
  }
  additional_info?: string
  source: string
  user_preferences?: UserPreferencesDTO
  referral_code?: string
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
