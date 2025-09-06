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
      // Инженерные направления
      getDirectionStats(['engineering'], locale as string),
      // Бизнес и экономика
      getDirectionStats(['business', 'economics-management'], locale as string),
      // Дизайн и архитектура
      getDirectionStats(['architecture'], locale as string),
      // Международные отношения
      getDirectionStats(['humanities'], locale as string),
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

async function getDirectionStats(directionSlugs: string[], locale: string) {
  // Получаем направления по слагам
  const directions = await (prisma as any).studyDirection.findMany({
    where: {
      translations: {
        some: {
          locale,
          slug: { in: directionSlugs }
        }
      }
    },
    include: {
      universityDirections: {
        include: {
          university: true
        }
      }
    }
  })
  
  // Собираем все университеты для этих направлений
  const allUniversities = directions.flatMap((direction: any) => 
    direction.universityDirections.map((ud: any) => ud.university)
  )
  
  // Убираем дубликаты университетов
  const uniqueUniversities = allUniversities.filter((uni: any, index: number, arr: any[]) => 
    arr.findIndex((u: any) => u.id === uni.id) === index
  )
  
  // Получаем минимальную стоимость
  const costs = uniqueUniversities
    .map((uni: any) => (uni.tuitionMin ?? uni.tuitionMax))
    .filter((cost: number | null | undefined) => cost !== null && cost !== undefined)
    .map((cost: number | null | undefined) => Number(cost))
  
  const minCost = costs.length > 0 ? Math.min(...costs) : 0
  
  // Возвращаем только реальные значения без "красивых" подстановок
  const displayCount = uniqueUniversities.length
  const adjustedMinCost = minCost
  
  return {
    universities_count: displayCount,
    price_from: adjustedMinCost,
    actual_universities: uniqueUniversities.length,
    direction_slugs: directionSlugs
  }
}
