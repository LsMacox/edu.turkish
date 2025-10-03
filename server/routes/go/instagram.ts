import { getRequestURL } from 'h3'
import { contactChannels } from '~~/lib/contact/channels'
import { BitrixService } from '~~/server/services/BitrixService'
import { getBitrixConfig } from '~~/server/utils/bitrix-config'

const extractUtmParams = (query: Record<string, any>): Record<string, string> => {
  return Object.entries(query).reduce<Record<string, string>>((acc, [key, value]) => {
    if (key.startsWith('utm_') && typeof value === 'string' && value.length > 0) {
      acc[key] = value
    }
    return acc
  }, {})
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const referralCode = typeof query.referral_code === 'string' ? query.referral_code : ''
  const hasReferralCode = referralCode.length > 0

  const sessionId =
    typeof query.session === 'string' && query.session.length > 0 ? query.session : undefined
  const utmParams = extractUtmParams(query as Record<string, any>)

  // Convert utmParams to proper MessengerEventUtm format
  const utm: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_content?: string
    utm_term?: string
  } = {}
  if (utmParams.utm_source) utm.utm_source = utmParams.utm_source
  if (utmParams.utm_medium) utm.utm_medium = utmParams.utm_medium
  if (utmParams.utm_campaign) utm.utm_campaign = utmParams.utm_campaign
  if (utmParams.utm_content) utm.utm_content = utmParams.utm_content
  if (utmParams.utm_term) utm.utm_term = utmParams.utm_term

  if (hasReferralCode) {
    const requestUrl = getRequestURL(event)
    try {
      // Log messenger event (activity)
      await $fetch('/api/v1/messenger-events', {
        method: 'POST',
        body: {
          channel: 'instagram',
          referral_code: referralCode,
          session: sessionId,
          utm: Object.keys(utm).length > 0 ? utm : undefined,
        },
        baseURL: requestUrl.origin,
      })

      // Create minimal lead
      const bitrix = new BitrixService(getBitrixConfig())
      await bitrix.createMinimalLeadFromEvent({
        channel: 'instagram',
        referralCode,
        session: sessionId,
        utm: Object.keys(utm).length > 0 ? (utm as any) : undefined,
      })
    } catch (error) {
      console.error('[go/instagram] Failed to process messenger event and create lead', error)
    }
  }

  const instagramUrl = contactChannels.instagram.baseUrl

  const html = `<!DOCTYPE html>
  <html lang="ru">
    <head>
      <meta charset="utf-8" />
      <title>Переходим в Instagram...</title>
    </head>
    <body>
      <script>
        window.location.replace(${JSON.stringify(instagramUrl)})
      </script>
      <p>Перенаправляем вас в Instagram...</p>
    </body>
  </html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
})
