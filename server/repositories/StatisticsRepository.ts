import type { PrismaClient } from '@prisma/client'
import type { ReviewStatistics } from '~~/server/types/api'

export class StatisticsRepository {
  constructor(private prisma: PrismaClient) {}

  async getStatistics(): Promise<ReviewStatistics> {
    const [
      reviewStats,
      universityCount,
      cityGroups,
      programCount,
      scholarshipsCount,
      applicationsTotal,
      applicationsApprovedCount,
    ] = await this.prisma.$transaction([
      this.prisma.universityReview.aggregate({
        _count: { id: true },
        _avg: { rating: true },
      }),
      this.prisma.university.count(),
      this.prisma.university.groupBy({
        by: ['cityId'],
        where: { cityId: { not: null } },
        orderBy: { cityId: 'asc' },
      }),
      this.prisma.universityProgram.count(),
      this.prisma.universityScholarship.count(),
      this.prisma.application.count(),
      this.prisma.application.count({
        where: { status: 'approved' },
      }),
    ])

    const citiesCount = cityGroups.length

    const successRate =
      applicationsTotal > 0 ? Math.round((applicationsApprovedCount / applicationsTotal) * 100) : 0

    const avgRating = reviewStats._avg.rating ? Number(reviewStats._avg.rating.toFixed(1)) : 0

    return {
      total_students: reviewStats._count.id,
      average_rating: avgRating,
      success_rate: successRate,
      universities_count: universityCount,
      scholarships_provided: scholarshipsCount,
      cities_covered: citiesCount,
      languages_supported: 4, // en, ru, kk, tr - статичное значение
      specialties_available: programCount,
    }
  }
}
