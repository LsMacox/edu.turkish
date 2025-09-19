import { prisma } from '../../../../lib/prisma'

const DEFAULT_LOCALE = 'ru'

const CANONICAL_LOCALE_MAP: Record<string, string> = {
  kk: 'kz'
}

const LOCALE_VARIANTS: Record<string, string[]> = {
  kz: ['kz', 'kk']
}

export interface NormalizedLanguage {
  locale: string
  variants: string[]
}

export function resolveLanguage(input?: string | null): NormalizedLanguage {
  const raw = typeof input === 'string' ? input.trim().toLowerCase() : ''

  if (!raw) {
    return { locale: DEFAULT_LOCALE, variants: [DEFAULT_LOCALE] }
  }

  const base = raw.split(/[-_]/)[0]
  const locale = CANONICAL_LOCALE_MAP[base] ?? base
  const variants = LOCALE_VARIANTS[locale] ?? [locale]

  return { locale, variants }
}

export function normalizeLanguageCode(input?: string | null): string {
  return resolveLanguage(input).locale
}

function extractLanguage(query: Record<string, unknown>): string {
  const candidate = query.lang ?? query.locale

  if (Array.isArray(candidate)) {
    return candidate[0] as string
  }

  if (typeof candidate === 'string') {
    return candidate
  }

  return 'ru'
}

export default defineEventHandler(async (event) => {
  const rawLanguage = extractLanguage(getQuery(event))
  const { locale } = resolveLanguage(rawLanguage)

  try {
    // Получаем статистику по каждому направлению
    const popularPrograms = await Promise.all([
      // ИТ направления
      getDirectionStats(['it', 'computer-science', 'software-engineering'], locale),
      // Медицинские направления
      getDirectionStats(['medicine'], locale),
      // Инженерные направления (конкретные слаги)
      getDirectionStats([
        'mechanical-engineering',
        'civil-engineering',
        'electrical-electronics-engineering',
        'industrial-engineering',
        'mechatronics',
        'aerospace-engineering',
        'environmental-engineering',
        'marine-engineering'
      ], locale),
      // Бизнес и экономика
      getDirectionStats([
        'business',
        'economics',
        'management',
        'finance',
        'accounting',
        'marketing',
        'entrepreneurship',
        'tourism-hospitality'
      ], locale),
      // Дизайн и архитектура
      getDirectionStats(['design', 'architecture', 'fine-arts'], locale),
      // Международные отношения и гуманитарные науки
      getDirectionStats(['international-relations', 'political-science'], locale),
    ])

    return {
      success: true,
      data: {
        it: popularPrograms[0],
        medicine: popularPrograms[1],
        engineering: popularPrograms[2],
        business: popularPrograms[3],
        design: popularPrograms[4],
        international: popularPrograms[5],
      },
    }
  } catch (error) {
    console.error('Error fetching popular programs stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при получении статистики популярных направлений',
    })
  }
})

export interface DirectionStatsDto {
  universities_count: number
  price_from: number
  direction_slugs: string[]
}

export async function getDirectionStats(
  directionSlugs: string[],
  locale: string,
): Promise<DirectionStatsDto> {
  if (directionSlugs.length === 0) {
    return {
      universities_count: 0,
      price_from: 0,
      direction_slugs: directionSlugs,
    }
  }

  const { locale: normalizedLocale, variants } = resolveLanguage(locale)

  const directions = await prisma.studyDirection.findMany({
    where: {
      translations: {
        some: {
          locale: { in: variants },
          slug: { in: directionSlugs }
        }
      }
    },
    select: {
      id: true,
    },
  })

  const directionIds = directions.map((direction) => direction.id)

  if (directionIds.length === 0) {
    return {
      universities_count: 0,
      price_from: 0,
      direction_slugs: directionSlugs,
    }
  }

  const baseWhere = {
    universityDirections: {
      some: {
        directionId: { in: directionIds },
      },
    },
  }

  const universitiesCount = await prisma.university.count({
    where: baseWhere,
  })

  if (universitiesCount === 0) {
    return {
      universities_count: 0,
      price_from: 0,
      direction_slugs: directionSlugs,
    }
  }

  const priceAggregate = await prisma.university.aggregate({
    where: baseWhere,
    _min: {
      tuitionMin: true,
      tuitionMax: true,
    },
  })

  const minTuition = priceAggregate._min.tuitionMin
  const minTuitionMax = priceAggregate._min.tuitionMax

  const priceFrom =
    minTuition !== null && minTuition !== undefined
      ? Number(minTuition)
      : minTuitionMax !== null && minTuitionMax !== undefined
        ? Number(minTuitionMax)
        : 0

  return {
    universities_count: universitiesCount,
    price_from: priceFrom,
    direction_slugs: directionSlugs,
  }
}
