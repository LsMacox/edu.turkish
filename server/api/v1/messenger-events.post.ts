import { CRMFactory } from '~~/server/services/crm/CRMFactory'
import { getCRMConfig, validateCRMConfig } from '~~/server/utils/crm-config'
import { sanitizeUtm } from '~~/server/utils/utm'

interface MessengerEventRequestBody {
  channel?: string
  ref?: string
  session?: string
  utm?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

export default defineEventHandler(async (event) => {
  const body = await readBody<MessengerEventRequestBody>(event)
  const channel = body.channel?.trim()
  const referralCode = body.ref?.trim()

  if (!channel) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Channel is required',
    })
  }

  if (!referralCode) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Referral code is required',
    })
  }

  // Strict CRM config validation (throws on invalid)
  try {
    validateCRMConfig(getCRMConfig())
  } catch (e: any) {
    console.warn('[CRM] Configuration is missing. Unable to log messenger event.', e?.message || e)
    throw createError({
      statusCode: 503,
      statusMessage: 'CRM integration is not configured',
    })
  }

  const crm = CRMFactory.createFromEnv()
  const session =
    typeof body.session === 'string' && body.session.length > 0 ? body.session : undefined
  const utm = sanitizeUtm(body.utm)
  const metadata = typeof body.metadata === 'object' && body.metadata ? body.metadata : undefined

  const result = await crm.logActivity({
    channel: channel as any,
    referralCode,
    session,
    utm,
    metadata,
  } as any)

  if (!result.success) {
    // Do not surface CRM errors to the client to avoid breaking redirects from /routes/go/*
    // Log for observability and return a successful response with a null activityId
    console.warn('[CRM] Failed to log messenger event', {
      channel,
      referralCode,
      error: result.error,
    })
    return {
      success: true,
      activityId: null,
    }
  }

  return {
    success: true,
    activityId: ((): number | null => {
      const anyResult: any = result as any
      const raw = anyResult?.id ?? anyResult?.activityId ?? null
      if (raw == null) return null
      const num = typeof raw === 'string' ? Number(raw) : raw
      return Number.isFinite(num) ? (num as number) : null
    })(),
  }
})
