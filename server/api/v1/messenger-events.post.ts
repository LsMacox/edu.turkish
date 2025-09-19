import { BitrixService } from '../../services/BitrixService'
import { getBitrixConfig } from '../../utils/bitrix-config'
import type { MessengerEventUtm } from '../../services/bitrix.dto'

interface MessengerEventRequestBody {
  channel?: string
  referral_code?: string
  session?: string
  utm?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

type UtmCandidate = {
  utm_source?: unknown
  utm_medium?: unknown
  utm_campaign?: unknown
  utm_content?: unknown
  utm_term?: unknown
}

const sanitizeUtmPayload = (utm: MessengerEventRequestBody['utm']): MessengerEventUtm | undefined => {
  if (!utm || typeof utm !== 'object') {
    return undefined
  }

  const candidate = utm as UtmCandidate
  const sanitized: MessengerEventUtm = {}

  if (typeof candidate.utm_source === 'string') {
    const value = candidate.utm_source.trim()
    if (value) {
      sanitized.utm_source = value
    }
  }

  if (typeof candidate.utm_medium === 'string') {
    const value = candidate.utm_medium.trim()
    if (value) {
      sanitized.utm_medium = value
    }
  }

  if (typeof candidate.utm_campaign === 'string') {
    const value = candidate.utm_campaign.trim()
    if (value) {
      sanitized.utm_campaign = value
    }
  }

  if (typeof candidate.utm_content === 'string') {
    const value = candidate.utm_content.trim()
    if (value) {
      sanitized.utm_content = value
    }
  }

  if (typeof candidate.utm_term === 'string') {
    const value = candidate.utm_term.trim()
    if (value) {
      sanitized.utm_term = value
    }
  }

  return sanitized.utm_source || sanitized.utm_medium || sanitized.utm_campaign || sanitized.utm_content || sanitized.utm_term
    ? sanitized
    : undefined
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
  const session = typeof body.session === 'string' && body.session.length > 0 ? body.session : undefined
  const utm = sanitizeUtmPayload(body.utm)
  const metadata = typeof body.metadata === 'object' && body.metadata ? body.metadata : undefined

  const result = await bitrixService.logMessengerEvent({
    channel,
    referralCode,
    session,
    utm,
    metadata
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
