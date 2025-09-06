import { prisma } from '../../../../lib/prisma'
import { UniversityRepository } from '../../../repositories'
import type { UniversityDetail } from '../../../types/api'

export default defineEventHandler(async (event): Promise<UniversityDetail | null> => {
  try {
    const locale = event.context.locale || 'ru'
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'University ID is required'
      })
    }
    
    // Initialize repository
    const universityRepository = new UniversityRepository(prisma)
    
    // Try to find by ID first (if it's a number)
    if (!isNaN(Number(id))) {
      const university = await universityRepository.findById(Number(id), locale)
      if (university) {
        return university
      }
    }
    
    // If not found by ID or ID is not a number, try to find by slug
    const university = await universityRepository.findBySlug(id, locale)
    
    if (!university) {
      throw createError({
        statusCode: 404,
        statusMessage: 'University not found'
      })
    }
    
    return university
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Error fetching university:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch university details'
    })
  }
})