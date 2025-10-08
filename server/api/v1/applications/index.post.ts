import { prisma } from '~~/lib/prisma'
import { ApplicationRepository } from '~~/server/repositories'
import { validateApplicationData } from '~~/server/utils/api/applications'
import { CRMFactory } from '~~/server/services/crm/CRMFactory'
import { RedisQueue } from '~~/server/services/queue/RedisQueue'
import type { ApplicationRequest, ApplicationResponse } from '~~/server/types/api'
import type { LeadData } from '~~/server/types/crm'

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

    // Send to CRM via abstraction layer
    let crmLeadId: string | number | null = null
    let crmError: string | null = null
    let crmProvider: string | null = null

    try {
      // Transform application data to LeadData format
      const leadData: LeadData = {
        firstName: body.personal_info.first_name,
        lastName: body.personal_info.last_name?.trim()
          ? body.personal_info.last_name.trim()
          : undefined,
        phone: body.personal_info.phone,
        email: body.personal_info.email?.trim()
          ? body.personal_info.email.trim()
          : undefined,
        referralCode: body.referral_code || 'DIRECT',
        source: body.source || 'website',
        sourceDescription: body.source,
        userType: body.user_preferences?.userType,
        language: body.user_preferences?.language,
        universities: body.preferences?.universities,
        programs: body.preferences?.programs,
        scholarship: body.user_preferences?.scholarship,
        universityChosen: body.user_preferences?.universityChosen,
        additionalInfo: body.additional_info,
      }

      // Get CRM provider and attempt to create lead
      const crmService = CRMFactory.createFromEnv()
      crmProvider = crmService.providerName

      const crmResult = await crmService.createLead(leadData)

      if (crmResult.success) {
        crmLeadId = crmResult.id || null
        if (crmResult.duplicate) {
          console.log(`✓ CRM lead exists (duplicate): ${crmLeadId} (${crmProvider})`)
        } else {
          console.log(`✓ CRM lead created: ${crmLeadId} (${crmProvider})`)
        }
      } else if (crmResult.validationErrors && crmResult.validationErrors.length) {
        // Validation failure from CRM input schema — return 400 to frontend
        throw createError({
          statusCode: 400,
          statusMessage: 'Validation failed',
          data: { errors: crmResult.validationErrors },
        })
      } else {
        // Non-validation CRM failure, queue for retry
        crmError = crmResult.error || 'Unknown CRM error'
        console.error(`✗ CRM lead creation failed (${crmProvider}):`, crmError)

        try {
          const queue = new RedisQueue()
          await queue.addJob('createLead', crmProvider as 'bitrix' | 'espocrm', leadData)
          console.log('→ CRM operation queued for retry')
        } catch (queueErr: any) {
          console.error('Failed to enqueue CRM retry job:', queueErr?.message || queueErr)
        }
      }
    } catch (error: any) {
      crmError = error.message
      console.error('Error in CRM integration:', error)

      // If it's a validation error from our createLead (with errors array), surface to client
      const errors = Array.isArray(error?.data?.errors) ? error.data.errors : null
      if (error?.statusCode === 400 && errors && errors.length) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Validation failed',
          data: { errors },
        })
      }

      // Otherwise, queue for retry on exception
      try {
        const leadData: LeadData = {
          firstName: body.personal_info.first_name,
          lastName: body.personal_info.last_name?.trim()
            ? body.personal_info.last_name.trim()
            : undefined,
          phone: body.personal_info.phone,
          email: body.personal_info.email?.trim()
            ? body.personal_info.email.trim()
            : undefined,
          referralCode: body.referral_code || 'DIRECT',
          source: body.source || 'website',
        }
        const queue = new RedisQueue()
        const provider = CRMFactory.getCurrentProvider()
        await queue.addJob('createLead', provider, leadData)
        console.log('→ CRM operation queued for retry after exception')
      } catch (queueError: any) {
        console.error('Failed to queue CRM operation:', queueError)
      }
    }

    // Set success status
    setResponseStatus(event, 201)

    // Return application with CRM info
    return {
      ...application,
      crm: {
        provider: crmProvider ?? null,
        leadId: crmLeadId ?? null,
        error: crmError ?? null,
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
