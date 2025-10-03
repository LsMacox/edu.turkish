import { prisma } from '~~/lib/prisma'
import { ApplicationRepository } from '~~/server/repositories'
import { validateApplicationData } from '~~/server/utils/api-helpers'
import { BitrixService } from '~~/server/services/BitrixService'
import { getBitrixConfig, validateBitrixConfig } from '~~/server/utils/bitrix-config'
import type { ApplicationRequest, ApplicationResponse } from '~~/server/types/api'

export default defineEventHandler(async (event): Promise<ApplicationResponse> => {
  const _locale = event.context.locale || 'ru'

  // Ensure this is a POST request
  assertMethod(event, 'POST')

  try {
    // Read and validate request body
    const body = (await readBody(event)) as ApplicationRequest

    // Validate the application data
    const validation = validateApplicationData(body)
    if (!validation.isValid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: {
          errors: validation.errors,
        },
      })
    }

    // Initialize repository
    const applicationRepository = new ApplicationRepository(prisma)

    // Create application in database
    const application = await applicationRepository.create(body)

    // Send to Bitrix CRM if configured
    let bitrixLeadId: number | null = null
    let bitrixError: string | null = null

    if (validateBitrixConfig()) {
      try {
        const bitrixConfig = getBitrixConfig()
        const bitrixService = new BitrixService(bitrixConfig)

        const bitrixResult = await bitrixService.createLead(body)

        if (bitrixResult.success) {
          bitrixLeadId = bitrixResult.id
          // Bitrix lead created successfully

          // Optionally update the application record with Bitrix lead ID
        } else {
          bitrixError = bitrixResult.error || 'Unknown Bitrix error'
          console.error('Failed to create Bitrix lead:', bitrixError)
        }
      } catch (error: any) {
        bitrixError = error.message
        console.error('Error sending to Bitrix:', error)
      }
    } else {
      console.warn('Bitrix is not configured. Skipping CRM integration.')
    }

    // Set success status
    setResponseStatus(event, 201)

    // Return application with optional Bitrix info
    return {
      ...application,
      bitrix: {
        leadId: bitrixLeadId,
        error: bitrixError,
      },
    }
  } catch (error: any) {
    // Handle validation errors specifically
    if (error.statusCode === 400) {
      throw error
    }

    console.error('Error creating application:', error)

    // Handle other errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
      data: {
        error: 'Failed to process application',
      },
    })
  }
})
