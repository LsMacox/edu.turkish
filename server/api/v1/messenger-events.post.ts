import { BitrixService } from '../../services/BitrixService'
import { getBitrixConfig } from '../../utils/bitrix-config'

interface MessengerEventRequestBody {
  channel?: string
  referral_code?: string
  session?: string
  utm?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

const sanitizeUtmPayload = (utm: MessengerEventRequestBody['utm']): Record<string, string> => {
  if (!utm || typeof utm !== 'object') {
    return {}
  }

  return Object.entries(utm).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === 'string' && value.length > 0) {
      acc[key] = value
    }
    return acc
  }, {})
}

export default defineEventHandler(async event => {
  const body = await readBody<MessengerEventRequestBody>(event)
  const channel = body.channel?.trim()
  const referralCode = body.referral_code?.trim()

  if (!channel) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Channel is required'
    })
  }

  if (!referralCode) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Referral code is required'
    })
  }

  const bitrixService = new BitrixService(getBitrixConfig())
  const result = await bitrixService.logMessengerEvent({
    channel,
    referralCode,
    session: typeof body.session === 'string' && body.session.length > 0 ? body.session : undefined,
    utm: sanitizeUtmPayload(body.utm),
    metadata: typeof body.metadata === 'object' && body.metadata ? body.metadata : undefined
  })

  if (!result.success) {
    throw createError({
      statusCode: 502,
      statusMessage: result.error || 'Failed to log messenger event'
    })
  }

  return {
    success: true,
    activityId: result.activityId ?? null
  }
})
