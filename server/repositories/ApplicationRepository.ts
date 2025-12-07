import { randomUUID } from 'node:crypto'
import type { PrismaClient } from '@prisma/client'
import type { ApplicationResponse } from '~~/server/types/api'
import { ApplicationRequestSchema } from '~~/server/schemas/application'

const generateTrackingCode = (): string => {
  const prefix = 'EDU'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export class ApplicationRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new application with validated data
   * @throws {z.ZodError} if data validation fails
   */
  async create(rawData: unknown): Promise<ApplicationResponse> {
    // Validate and transform input data using Zod schema
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
        referralCode: data.ref ?? null,
        personalInfo: data.personal_info,
        preferences: data.preferences ?? {},
        additionalInfo: data.additional_info ?? {},
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
