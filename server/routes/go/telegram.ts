import { getRequestURL } from 'h3'
import { contactChannels, personalTelegramChannelKey } from '~~/lib/contact/channels'

const REFERRAL_PLACEHOLDER = /\{\{\s*referral\s*\}\}/gi

const extractUtmParams = (query: Record<string, any>): Record<string, string> => {
  return Object.entries(query).reduce<Record<string, string>>((acc, [key, value]) => {
    if (key.startsWith('utm_') && typeof value === 'string' && value.length > 0) {
      acc[key] = value
    }
    return acc
  }, {})
}

const buildGreeting = (template: string | undefined, referral: string): string | undefined => {
  if (!template) {
    return undefined
  }

  const text = template.replace(REFERRAL_PLACEHOLDER, referral || '').trim()
  return text.length > 0 ? text : undefined
}

export default defineEventHandler(async event => {
  const query = getQuery(event)
  const referralCode = typeof query.referral_code === 'string' ? query.referral_code : ''

  if (!referralCode) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Referral code is required'
    })
  }

  const sessionId = typeof query.session === 'string' && query.session.length > 0 ? query.session : undefined
  const utmParams = extractUtmParams(query as Record<string, any>)

  const requestUrl = getRequestURL(event)
  try {
    await $fetch('/api/v1/messenger-events', {
      method: 'POST',
      body: {
        channel: personalTelegramChannelKey,
        referral_code: referralCode,
        session: sessionId,
        utm: utmParams
      },
      baseURL: requestUrl.origin
    })
  } catch (error) {
    console.error('[go/telegram] Failed to log messenger event', error)
  }

  const channelConfig = contactChannels[personalTelegramChannelKey]
  const greetingText = buildGreeting(channelConfig.defaultMessage, referralCode)
  const shouldCopy = Boolean(channelConfig.copyOnNavigate && greetingText)

  const html = `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <title>Переходим в Telegram...</title>
  </head>
  <body>
    <script>
      const targetUrl = ${JSON.stringify(channelConfig.baseUrl)}
      const greeting = ${JSON.stringify(greetingText || '')}
      const shouldCopy = ${JSON.stringify(shouldCopy)}

      ;(async () => {
        const redirect = () => {
          window.location.replace(targetUrl)
        }

        if (!shouldCopy) {
          redirect()
          return
        }

        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(greeting)
          } else {
            const textarea = document.createElement('textarea')
            textarea.value = greeting
            textarea.setAttribute('readonly', '')
            textarea.style.position = 'absolute'
            textarea.style.left = '-9999px'
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
          }
        } catch (error) {
          console.warn('Failed to copy greeting text', error)
        } finally {
          redirect()
        }
      })()
    </script>
    <p>Перенаправляем вас в Telegram...</p>
  </body>
</html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  })
})
