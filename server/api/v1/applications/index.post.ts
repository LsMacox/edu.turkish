import { ZodError } from 'zod'
import { formatZodError } from '~~/server/utils/validation'
import { ApplicationRequestSchema } from '~~/lib/schemas/application'
import { getApplicationService } from '~~/server/services/application/ApplicationService'
import type { ApplicationRequest } from '~~/lib/types'
import type { SubmitApplicationResult } from '~~/server/services/application/ApplicationService'

export default defineEventHandler(async (event): Promise<SubmitApplicationResult> => {
  assertMethod(event, 'POST')

  try {
    const rawBody = await readBody(event)

    let body: ApplicationRequest
    try {
      body = ApplicationRequestSchema.parse(rawBody) as ApplicationRequest
    } catch (error) {
      if (error instanceof ZodError) {
        throw createError({
          statusCode: 422,
          statusMessage: 'Validation failed',
          data: formatZodError(error),
        })
      }
      throw error
    }

    const service = getApplicationService()
    const ctx = service.extractContext(event)
    const result = await service.submit(body, ctx)

    setResponseStatus(event, 201)
    return result
  } catch (error: any) {
    if (error.isValidationError) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Validation failed',
        data: {
          error: 'ValidationError',
          nonFieldErrors: error.errors.map((msg: string) => ({
            code: 'crm_validation_error',
            meta: { message: msg },
          })),
          traceId: Math.random().toString(36).substring(2, 12),
        },
      })
    }

    if (error.statusCode === 422) {
      throw error
    }

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

