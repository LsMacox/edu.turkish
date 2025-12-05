import { randomUUID } from 'node:crypto'
import type { PrismaClient } from '@prisma/client'
import type { ApplicationRequest, ApplicationResponse } from '~~/server/types/api'

const generateTrackingCode = (): string => {
  const prefix = 'EDU'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export class ApplicationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: ApplicationRequest): Promise<ApplicationResponse> {
    const trackingCode = generateTrackingCode()

    const normalizedFirstName = data.personal_info.first_name?.trim() || ''
    const normalizedLastName = data.personal_info.last_name?.trim() || null
    const normalizedEmail = data.personal_info.email?.trim() || null
    const normalizedPhone = data.personal_info.phone?.trim() || ''
    const normalizedSource = data.source?.trim() || 'website'
    const normalizedReferralCode = data.ref?.trim() || null

    const application = await this.prisma.application.create({
      data: {
        trackingCode,
        status: 'submitted',
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        email: normalizedEmail,
        phone: normalizedPhone,
        source: normalizedSource,
        referralCode: normalizedReferralCode,
        personalInfo: data.personal_info,
        preferences: data.preferences || {},
        additionalInfo: data.additional_info || {},
      },
    })

    return {
      id: application.id.toString(),
      status: application.status,
      submitted_at: application.submittedAt.toISOString(),
      tracking_code: application.trackingCode,
    }
  }
}
