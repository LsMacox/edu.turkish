import type { LeadData } from '~~/server/types/crm'
import type { ApplicationRequest } from '~~/server/types/api'

export interface LeadDataContext {
  body: ApplicationRequest
  fingerprintCookie?: string
  fingerprintKey?: string
}

/**
 * Map application request to CRM LeadData format.
 */
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
