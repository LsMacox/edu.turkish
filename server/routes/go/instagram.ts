import { getRequestURL } from 'h3'
import { contactChannels } from '~~/lib/contact/channels'
import { CrmProviderFactory } from '~~/server/services/CrmProviderFactory'
import { extractUtmFromQuery } from '~~/server/utils/utm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const referralCode = typeof query.referral_code === 'string' ? query.referral_code : ''
  const hasReferralCode = referralCode.length > 0

  const sessionId =
    typeof query.session === 'string' && query.session.length > 0 ? query.session : undefined
  const utm = extractUtmFromQuery(query as Record<string, any>)

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
          utm,
        },
        baseURL: requestUrl.origin,
      })

      // Create minimal lead (if provider supports it)
      const crm = CrmProviderFactory.create()
      const minimalLeadPayload = {
        channel: 'instagram',
        referralCode,
        session: sessionId,
        utm: utm as any,
      }
      if (typeof (crm as any).createMinimalLeadFromEvent === 'function') {
        await (crm as any).createMinimalLeadFromEvent(minimalLeadPayload)
      }
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
