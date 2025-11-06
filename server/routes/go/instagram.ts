import { getCookie } from 'h3'
import { contactChannels } from '~~/lib/contact/channels'
import { CRMFactory } from '~~/server/services/crm/CRMFactory'
import { extractUtmFromQuery } from '~~/server/utils/utm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const referralFromQuery = typeof query.ref === 'string' ? query.ref : ''
  const referralFromCookie = getCookie(event, 'referral_code') || ''
  const referralCode = referralFromQuery || referralFromCookie
  const hasReferralCode = referralCode.length > 0

  const cookieFp = getCookie(event, 'fp')
  const sessionId = cookieFp && cookieFp.length > 0 ? cookieFp : undefined
  const utm = extractUtmFromQuery(query as Record<string, any>)

  if (hasReferralCode) {
    try {
      // Log messenger event (activity)
      await $fetch('/api/v1/messenger-events', {
        method: 'POST',
        body: {
          channel: 'instagram',
          ref: referralCode,
          session: sessionId,
          utm,
        },
      })

      // Create minimal lead via unified CRM provider
      const crm = CRMFactory.createFromEnv()
      await crm.createMinimalLeadFromActivity({
        channel: 'instagram',
        referralCode,
        session: sessionId,
        utm: utm as any,
      } as any)
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
