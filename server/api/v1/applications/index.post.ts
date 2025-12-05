import { getCookie } from 'h3'
import { z, ZodError } from 'zod'
import { prisma } from '~~/lib/prisma'
import { ApplicationRepository } from '~~/server/repositories'
import { formatZodError } from '~~/server/utils/zod'
import { CRMFactory } from '~~/server/services/crm/CRMFactory'
import { RedisQueue } from '~~/server/services/queue/RedisQueue'
import type { ApplicationRequest, ApplicationResponse } from '~~/server/types/api'
import type { LeadData } from '~~/server/types/crm'

const ApplicationSchema = z.object({
  personal_info: z.object({
    first_name: z.string().min(2, 'min_length').max(50, 'max_length'),
    last_name: z.string().max(50, 'max_length').optional(),
    email: z.string().email('invalid_email').max(255, 'max_length').optional().or(z.literal('')),
    phone: z
      .string()
      .min(1, 'required')
      .refine(
        (val) => val.replace(/\D/g, '').length >= 10,
        { message: 'invalid_phone' },
      ),
  }),
  preferences: z
    .object({
      universities: z.array(z.string()).optional(),
      programs: z.array(z.string()).optional(),
      budget: z.string().optional(),
      start_date: z.string().optional(),
    })
    .optional(),
  additional_info: z.string().max(500, 'max_length').optional(),
  source: z.string().optional(),
  source_description: z.string().optional(),
  ref: z.string().optional(),
  user_preferences: z.any().optional(),
})

export default defineEventHandler(async (event): Promise<ApplicationResponse> => {
  const _locale = event.context.locale || 'ru'

  // Ensure this is a POST request
  assertMethod(event, 'POST')

  try {
    const rawBody = await readBody(event)

    let body: ApplicationRequest
    try {
      body = ApplicationSchema.parse(rawBody) as ApplicationRequest
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = formatZodError(error)
        throw createError({
          statusCode: 422,
          statusMessage: 'Validation failed',
          data: validationError,
        })
      }
      throw error
    }

    const applicationRepository = new ApplicationRepository(prisma)

    const application = await applicationRepository.create(body)

    const fingerprintCookie = getCookie(event, 'fp')?.trim()
    const normalizedEmail = body.personal_info.email?.trim().toLowerCase() || undefined
    const normalizedPhone = body.personal_info.phone?.replace(/\D/g, '') || undefined
    const fingerprintKey =
      normalizedEmail && normalizedPhone
        ? `email:${normalizedEmail}|phone:${normalizedPhone}`
        : undefined

    // Send to CRM via abstraction layer
    let crmLeadId: string | number | null = null
    let crmError: string | null = null
    let crmProvider: string | null = null

    try {
      const leadData: LeadData = {
        firstName: body.personal_info.first_name,
        lastName: body.personal_info.last_name?.trim()
          ? body.personal_info.last_name.trim()
          : undefined,
        phone: body.personal_info.phone,
        email: body.personal_info.email?.trim() ? body.personal_info.email.trim() : undefined,
        referralCode: body.ref || 'DIRECT',
        source: body.source || 'website',
        sourceDescription: body.source_description || body.source,
        userType: body.user_preferences?.userType,
        language: body.user_preferences?.language,
        universities: body.preferences?.universities,
        programs: body.preferences?.programs,
        scholarship: body.user_preferences?.scholarship,
        universityChosen: body.user_preferences?.universityChosen,
        additionalInfo: body.additional_info,
        session: fingerprintCookie,
        fingerprintKey,
      }

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
        throw createError({
          statusCode: 422,
          statusMessage: 'Validation failed',
          data: {
            error: 'ValidationError',
            nonFieldErrors: crmResult.validationErrors.map((msg) => ({
              code: 'crm_validation_error',
              meta: { message: msg },
            })),
            traceId: Math.random().toString(36).substring(2, 12),
          },
        })
      } else {
        crmError = crmResult.error || 'Unknown CRM error'
        console.error(`✗ CRM lead creation failed (${crmProvider}):`, crmError)

        try {
          const queue = new RedisQueue()
          await queue.addJob('createLead', 'espocrm', leadData)
          console.log('→ CRM operation queued for retry')
        } catch (queueErr: any) {
          console.error('Failed to enqueue CRM retry job:', queueErr?.message || queueErr)
        }
      }
    } catch (error: any) {
      crmError = error.message
      console.error('Error in CRM integration:', error)

      if (error?.statusCode === 422) {
        throw error
      }

      // Otherwise, queue for retry on exception
      try {
        const leadData: LeadData = {
          firstName: body.personal_info.first_name,
          lastName: body.personal_info.last_name?.trim()
            ? body.personal_info.last_name.trim()
            : undefined,
          phone: body.personal_info.phone,
          email: body.personal_info.email?.trim() ? body.personal_info.email.trim() : undefined,
          referralCode: body.ref || 'DIRECT',
          source: body.source || 'website',
          sourceDescription: body.source_description || body.source,
          session: fingerprintCookie,
          fingerprintKey,
        }
        const queue = new RedisQueue()
        await queue.addJob('createLead', 'espocrm', leadData)
        console.log('→ CRM operation queued for retry after exception')
      } catch (queueError: any) {
        console.error('Failed to queue CRM operation:', queueError)
      }
    }

    setResponseStatus(event, 201)

    return {
      ...application,
      crm: {
        provider: crmProvider ?? null,
        leadId: crmLeadId ?? null,
        error: crmError ?? null,
      },
    }
  } catch (error: any) {
    if (error.statusCode === 422) {
      throw error
    }

    console.error('Error creating application:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
      data: {
        error: 'server_error',
        message: 'Failed to process application',
      },
    })
  }
})
