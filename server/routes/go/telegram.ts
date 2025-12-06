import { getCookie } from 'h3'
import { contactChannels } from '~~/lib/contact/channels'
import { formatMessengerTouchNotification } from '~~/server/utils/telegram-formatter'
import { getTelegramQueue } from '~~/server/utils/telegram-queue'
import { sanitizeUtm } from '~~/server/utils/utm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const referralCode = getCookie(event, 'referral_code') || ''
  const hasReferralCode = referralCode.length > 0

  const cookieFp = getCookie(event, 'fp')
  const sessionId = cookieFp && cookieFp.length > 0 ? cookieFp : undefined
  const utm = sanitizeUtm(query as Record<string, any>)

  if (hasReferralCode) {
    try {
      const config = useRuntimeConfig()
      const queue = getTelegramQueue()
      const message = formatMessengerTouchNotification({
        channel: 'telegramBot',
        referralCode,
        sessionId,
        utm,
        timestamp: new Date().toISOString(),
      })

      await queue.add('sendNotification', {
        channelId: config.telegramCallsChannelId,
        message,
        parseMode: 'HTML',
        disableWebPagePreview: true,
      })
    } catch (error) {
      console.error('[go/telegram] Failed to enqueue telegram notification', error)
    }
  }

  const botUrl = contactChannels.telegramBot.baseUrl

  const html = `<!DOCTYPE html>
  <html lang="ru">
    <head>
      <meta charset="utf-8" />
      <title>Переходим в Telegram...</title>
    </head>
    <body>
      <script>
        window.location.replace(${JSON.stringify(botUrl)})
      </script>
      <p>Перенаправляем вас в Telegram...</p>
    </body>
  </html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
})
