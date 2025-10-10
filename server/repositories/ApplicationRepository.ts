import type { PrismaClient } from '@prisma/client'
import type {
  ApplicationRequest,
  ApplicationResponse,
  ApplicationStatus,
} from '~~/server/types/api'
import { generateTrackingCode } from '~~/server/utils/tracking'

export class ApplicationRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new application
   */
  async create(data: ApplicationRequest): Promise<ApplicationResponse> {
    const trackingCode = generateTrackingCode()

    const normalizedFirstName = data.personal_info.first_name?.trim() || ''
    const normalizedLastName = data.personal_info.last_name?.trim() || null
    const normalizedEmail = data.personal_info.email?.trim() || null
    const normalizedPhone = data.personal_info.phone?.trim() || ''
    const normalizedCountry = data.personal_info.country?.trim() || null
    const normalizedCity = data.personal_info.city?.trim() || null
    const normalizedSource = data.source?.trim() || 'website'
    const normalizedReferralCode = data.referral_code?.trim() || null

    const application = await this.prisma.application.create({
      data: {
        trackingCode,
        status: 'submitted',
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        email: normalizedEmail,
        phone: normalizedPhone,
        country: normalizedCountry,
        city: normalizedCity,
        source: normalizedSource,
        referralCode: normalizedReferralCode,
        personalInfo: data.personal_info,
        preferences: data.preferences,
        additionalInfo: data.additional_info || {},
      },
    })

    return {
      id: application.id.toString(),
      status: application.status as ApplicationStatus,
      submitted_at: application.submittedAt.toISOString(),
      tracking_code: application.trackingCode,
    }
  }

  /**
   * Find application by tracking code
   */
  async findByTrackingCode(trackingCode: string): Promise<ApplicationResponse | null> {
    const application = await this.prisma.application.findUnique({
      where: { trackingCode },
    })

    if (!application) return null

    return {
      id: application.id.toString(),
      status: application.status as ApplicationStatus,
      submitted_at: application.submittedAt.toISOString(),
      tracking_code: application.trackingCode,
    }
  }

  /**
   * Find application by ID
   */
  async findById(id: number): Promise<any | null> {
    const application = await this.prisma.application.findUnique({
      where: { id },
    })

    if (!application) return null

    return {
      id: application.id,
      trackingCode: application.trackingCode,
      status: application.status,
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      phone: application.phone,
      country: application.country,
      city: application.city,
      source: application.source,
      referralCode: application.referralCode,
      personalInfo: application.personalInfo,
      preferences: application.preferences,
      additionalInfo: application.additionalInfo,
      submittedAt: application.submittedAt,
      updatedAt: application.updatedAt,
    }
  }

  /**
   * Update application status
   */
  async updateStatus(id: number, status: ApplicationStatus): Promise<ApplicationResponse | null> {
    const application = await this.prisma.application.update({
      where: { id },
      data: { status },
    })

    return {
      id: application.id.toString(),
      status: application.status as ApplicationStatus,
      submitted_at: application.submittedAt.toISOString(),
      tracking_code: application.trackingCode,
    }
  }

  /**
   * Get all applications with filtering
   */
  async findAll(
    filters: {
      status?: ApplicationStatus
      page?: number
      limit?: number
    } = {},
  ): Promise<{
    data: any[]
    total: number
    page: number
    limit: number
  }> {
    const { status, page = 1, limit = 20 } = filters

    const where: any = {}
    if (status) {
      where.status = status
    }

    const [applications, total] = await this.prisma.$transaction([
      this.prisma.application.findMany({
        where,
        orderBy: { submittedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.application.count({ where }),
    ])

    return {
      data: applications.map((app) => ({
        id: app.id,
        trackingCode: app.trackingCode,
        status: app.status,
        firstName: app.firstName,
        lastName: app.lastName,
        email: app.email,
        phone: app.phone,
        country: app.country,
        city: app.city,
        source: app.source,
        referralCode: app.referralCode,
        personalInfo: app.personalInfo,
        preferences: app.preferences,
        additionalInfo: app.additionalInfo,
        submittedAt: app.submittedAt,
        updatedAt: app.updatedAt,
      })),
      total,
      page,
      limit,
    }
  }

  /**
   * Get application statistics
   */
  async getStatistics(): Promise<{
    total: number
    byStatus: Record<ApplicationStatus, number>
    thisMonth: number
    successRate: number
  }> {
    const [totalCount, statusCounts, thisMonthCount] = await this.prisma.$transaction([
      this.prisma.application.count(),
      this.prisma.application.groupBy({
        by: ['status'],
        _count: { id: true },
        orderBy: { status: 'asc' },
      }),
      this.prisma.application.count({
        where: {
          submittedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ])

    const byStatus: Record<ApplicationStatus, number> = {
      submitted: 0,
      processing: 0,
      approved: 0,
      rejected: 0,
    }

    statusCounts.forEach((stat) => {
      if (stat._count && typeof stat._count === 'object' && 'id' in stat._count) {
        byStatus[stat.status as ApplicationStatus] = stat._count.id as number
      }
    })

    const successRate = totalCount > 0 ? (byStatus.approved / totalCount) * 100 : 0

    return {
      total: totalCount,
      byStatus,
      thisMonth: thisMonthCount,
      successRate: Math.round(successRate),
    }
  }
}
