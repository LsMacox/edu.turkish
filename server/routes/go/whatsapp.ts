import { getRequestURL, getCookie } from 'h3'
import { contactChannels } from '~~/lib/contact/channels'
import { CRMFactory } from '~~/server/services/crm/CRMFactory'
import { extractUtmFromQuery } from '~~/server/utils/utm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const referralCode = typeof query.referral_code === 'string' ? query.referral_code : ''
  const hasReferralCode = referralCode.length > 0

  const querySession =
    typeof query.session === 'string' && query.session.length > 0 ? query.session : undefined
  const querySessionId =
    typeof (query as any).session_id === 'string' && (query as any).session_id.length > 0
      ? ((query as any).session_id as string)
      : undefined
  const cookieFp = getCookie(event, 'fp')
  const sessionId = querySession || querySessionId || (cookieFp && cookieFp.length > 0
    ? cookieFp
    : undefined)
  const utm = extractUtmFromQuery(query as Record<string, any>)

  if (hasReferralCode) {
    const requestUrl = getRequestURL(event)
    try {
      // Log messenger event (activity)
      await $fetch('/api/v1/messenger-events', {
        method: 'POST',
        body: {
          channel: 'whatsapp',
          referral_code: referralCode,
          session: sessionId,
          utm,
        },
        baseURL: requestUrl.origin,
      })

      // Create minimal lead via unified CRM provider
      const crm = CRMFactory.createFromEnv()
      await crm.createMinimalLeadFromActivity({
        channel: 'whatsapp',
        referralCode,
        session: sessionId,
        utm: utm as any,
      } as any)
    } catch (error) {
      console.error('[go/whatsapp] Failed to process messenger event and create lead', error)
    }
  }

  const whatsappUrl = contactChannels.whatsapp.baseUrl

  const html = `<!DOCTYPE html>
  <html lang="ru">
    <head>
      <meta charset="utf-8" />
      <title>Переходим в WhatsApp...</title>
    </head>
    <body>
      <script>
        window.location.replace(${JSON.stringify(whatsappUrl)})
      </script>
      <p>Перенаправляем вас в WhatsApp...</p>
    </body>
  </html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
})
