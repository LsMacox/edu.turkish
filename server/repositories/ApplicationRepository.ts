import { randomUUID } from 'node:crypto'
import type { PrismaClient } from '@prisma/client'
import type { ApplicationResponse } from '~~/lib/types'
import { ApplicationRequestSchema } from '~~/lib/schemas/application'

const generateTrackingCode = (): string => {
  const prefix = 'EDU'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export class ApplicationRepository {
  constructor(private prisma: PrismaClient) { }

  async create(rawData: unknown): Promise<ApplicationResponse> {
    const data = ApplicationRequestSchema.parse(rawData)
    const trackingCode = generateTrackingCode()

    const application = await this.prisma.application.create({
      data: {
        trackingCode,
        status: 'submitted',
        firstName: data.personal_info.first_name,
        lastName: data.personal_info.last_name ?? null,
        email: data.personal_info.email ?? null,
        phone: data.personal_info.phone,
        source: data.source,
        referralCode: data.referral_code ?? null,
        personalInfo: data.personal_info,
        preferences: data.preferences ?? {},
        additionalInfo: data.additional_info ?? {},
      },
    })

    return {
      id: application.id.toString(),
      status: application.status,
      submittedAt: application.submittedAt.toISOString(),
      trackingCode: application.trackingCode,
    }
  }
}
