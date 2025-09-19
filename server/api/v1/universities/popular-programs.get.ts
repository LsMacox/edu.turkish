import { prisma } from '../../../../lib/prisma'
// import { UniversityRepository } from '../../../repositories/UniversityRepository'

export default defineEventHandler(async (event) => {
  const { locale = 'ru' } = getQuery(event)
  
  try {
    // Получаем статистику по каждому направлению
    const popularPrograms = await Promise.all([
      // ИТ направления
      getDirectionStats(['it', 'computer-science', 'software-engineering'], locale as string),
      // Медицинские направления
      getDirectionStats(['medicine'], locale as string),
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
      ], locale as string),
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
      ], locale as string),
      // Дизайн и архитектура
      getDirectionStats(['design', 'architecture', 'fine-arts'], locale as string),
      // Международные отношения и гуманитарные науки
      getDirectionStats(['international-relations', 'political-science'], locale as string),
    ])
    
    return {
      success: true,
      data: {
        it: popularPrograms[0],
        medicine: popularPrograms[1],
        engineering: popularPrograms[2],
        business: popularPrograms[3],
        design: popularPrograms[4],
        international: popularPrograms[5]
      }
    }
  } catch (error) {
    console.error('Error fetching popular programs stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при получении статистики популярных направлений'
    })
  }
})

export interface DirectionStatsDto {
  universities_count: number
  price_from: number
  direction_slugs: string[]
}

export async function getDirectionStats(directionSlugs: string[], locale: string): Promise<DirectionStatsDto> {
  if (directionSlugs.length === 0) {
    return {
      universities_count: 0,
      price_from: 0,
      direction_slugs: directionSlugs
    }
  }

  const directions = await prisma.studyDirection.findMany({
    where: {
      translations: {
        some: {
          locale,
          slug: { in: directionSlugs }
        }
      }
    },
    select: {
      id: true
    }
  })

  const directionIds = directions.map(direction => direction.id)

  if (directionIds.length === 0) {
    return {
      universities_count: 0,
      price_from: 0,
      direction_slugs: directionSlugs
    }
  }

  const baseWhere = {
    universityDirections: {
      some: {
        directionId: { in: directionIds }
      }
    }
  }

  const universitiesCount = await prisma.university.count({
    where: baseWhere
  })

  if (universitiesCount === 0) {
    return {
      universities_count: 0,
      price_from: 0,
      direction_slugs: directionSlugs
    }
  }

  const priceAggregate = await prisma.university.aggregate({
    where: baseWhere,
    _min: {
      tuitionMin: true,
      tuitionMax: true
    }
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
    direction_slugs: directionSlugs
  }
}
