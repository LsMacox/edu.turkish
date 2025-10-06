import { CrmProviderFactory } from '~~/server/services/CrmProviderFactory'
import { validateCrmConfig } from '~~/server/utils/crm-config'
import { sanitizeUtm } from '~~/server/utils/utm'

interface MessengerEventRequestBody {
  channel?: string
  referral_code?: string
  session?: string
  utm?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

export default defineEventHandler(async (event) => {
  const body = await readBody<MessengerEventRequestBody>(event)
  const channel = body.channel?.trim()
  const referralCode = body.referral_code?.trim()

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

  const validation = validateCrmConfig()
  if (!validation.isValid) {
    console.warn('[CRM] Configuration is missing. Unable to log messenger event.', validation.errors)
    throw createError({
      statusCode: 503,
      statusMessage: 'CRM integration is not configured',
    })
  }

  const crm = CrmProviderFactory.create()
  const session =
    typeof body.session === 'string' && body.session.length > 0 ? body.session : undefined
  const utm = sanitizeUtm(body.utm)
  const metadata = typeof body.metadata === 'object' && body.metadata ? body.metadata : undefined

  const result = await crm.logMessengerEvent({
    channel,
    referralCode,
    session,
    utm,
    metadata,
  } as any)

  if (!result.success) {
    throw createError({
      statusCode: 502,
      statusMessage: result.error || 'Failed to log messenger event',
    })
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
