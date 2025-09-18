import { PrismaClient } from '@prisma/client'
import type { ApplicationRequest, ApplicationResponse, ApplicationStatus } from '../types/api'
import { generateTrackingCode } from '../utils/tracking'

export class ApplicationRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new application
   */
  async create(data: ApplicationRequest): Promise<ApplicationResponse> {
    // Generate tracking code
    const trackingCode = generateTrackingCode()

    const application = await this.prisma.application.create({
      data: {
        trackingCode,
        status: 'submitted',
        personalInfo: data.personal_info,
        education: data.education,
        preferences: data.preferences,
        additionalInfo: data.additional_info || {}
      }
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
      where: { trackingCode }
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
      where: { id }
    })

    if (!application) return null

    return {
      id: application.id,
      trackingCode: application.trackingCode,
      status: application.status,
      personalInfo: application.personalInfo,
      education: application.education,
      preferences: application.preferences,
      additionalInfo: application.additionalInfo,
      submittedAt: application.submittedAt,
      updatedAt: application.updatedAt
    }
  }

  /**
   * Update application status
   */
  async updateStatus(id: number, status: ApplicationStatus): Promise<ApplicationResponse | null> {
    const application = await this.prisma.application.update({
      where: { id },
      data: { status }
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
  async findAll(filters: {
    status?: ApplicationStatus
    page?: number
    limit?: number
  } = {}): Promise<{
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
        take: limit
      }),
      this.prisma.application.count({ where })
    ])

    return {
      data: applications.map(app => ({
        id: app.id,
        trackingCode: app.trackingCode,
        status: app.status,
        personalInfo: app.personalInfo,
        education: app.education,
        preferences: app.preferences,
        additionalInfo: app.additionalInfo,
        submittedAt: app.submittedAt,
        updatedAt: app.updatedAt
      })),
      total,
      page,
      limit
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
        _count: { id: true }
      }),
      this.prisma.application.count({
        where: {
          submittedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ])

    const byStatus: Record<ApplicationStatus, number> = {
      submitted: 0,
      processing: 0,
      approved: 0,
      rejected: 0
    }

    statusCounts.forEach(stat => {
      byStatus[stat.status as ApplicationStatus] = stat._count.id
    })

    const successRate = totalCount > 0 ? (byStatus.approved / totalCount) * 100 : 0

    return {
      total: totalCount,
      byStatus,
      thisMonth: thisMonthCount,
      successRate: Math.round(successRate)
    }
  }

}
