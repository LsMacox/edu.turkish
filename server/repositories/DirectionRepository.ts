import type { Prisma, PrismaClient } from '@prisma/client'
import type { NormalizedLocale } from '~~/server/utils/locale'

export interface DirectionListResult {
  data: Array<{ id: number; name: string; slug: string; universitiesCount: number }>
  total: number
}

export class DirectionRepository {
  constructor(private prisma: PrismaClient) { }

  async findAll(
    locale: NormalizedLocale,
    opts: { search?: string; page?: number; limit?: number } = {},
  ): Promise<DirectionListResult> {
    const loc = locale.normalized
    const search = opts.search?.trim()
    const page = Math.max(1, opts.page ?? 1)
    const limit = Math.max(1, Math.min(1000, opts.limit ?? 100))

    const where: Prisma.StudyDirectionWhereInput = search
      ? { translations: { some: { locale: loc, name: { contains: search } } } }
      : {}

    const [rows, total] = await Promise.all([
      this.prisma.studyDirection.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          translations: { where: { locale: loc }, select: { name: true, slug: true } },
          _count: { select: { universityDirections: true } },
        },
      }),
      this.prisma.studyDirection.count({ where }),
    ])

    return {
      data: rows.map((d) => ({
        id: d.id,
        name: d.translations[0]?.name ?? '',
        slug: d.translations[0]?.slug ?? '',
        universitiesCount: d._count.universityDirections,
      })),
      total,
    }
  }
}
