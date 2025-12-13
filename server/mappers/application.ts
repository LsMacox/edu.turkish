import type { LeadData } from '~~/lib/types/server'
import type { ApplicationRequest } from '~~/lib/types'

interface LeadDataContext {
  body: ApplicationRequest
  fingerprintCookie?: string
  fingerprintKey?: string
}

export function mapApplicationToLeadData(ctx: LeadDataContext): LeadData {
  const { body, fingerprintCookie, fingerprintKey } = ctx

  return {
    firstName: body.personal_info.first_name,
    lastName: body.personal_info.last_name?.trim() || undefined,
    phone: body.personal_info.phone,
    email: body.personal_info.email?.trim() || undefined,
    referralCode: body.referral_code || 'DIRECT',
    source: body.source || 'website',
    sourceDescription: body.source_description || body.source,
    userType: body.user_preferences?.userType,
    language: body.user_preferences?.language,
    universities: body.preferences?.universities,
    programs: body.preferences?.programs,
    scholarship: body.user_preferences?.scholarship,
    universityChosen: body.user_preferences?.universityChosen,
    additionalInfo: body.additional_info,
    session: fingerprintCookie,
    fingerprintKey,
  }
}
