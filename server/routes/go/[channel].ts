import { getCookie } from 'h3'
import { contactChannels, type ContactChannelKey } from '~~/lib/domain/contact/channels'
import { sanitizeUtm } from '~~/lib/domain/contact/utm'
import { formatMessengerTouchNotification } from '~~/server/services/telegram/formatter'
import { getTelegramQueue } from '~~/server/services/telegram/queue'

const validChannels = new Set<string>(Object.keys(contactChannels))

export default defineEventHandler(async (event) => {
  const channel = getRouterParam(event, 'channel')

  if (!channel || !validChannels.has(channel)) {
    throw createError({ statusCode: 404, message: 'Channel not found' })
  }

  const channelKey = channel as ContactChannelKey
  const channelDef = contactChannels[channelKey]

  const query = getQuery(event)
  const referralCode = getCookie(event, 'referral_code') || ''

  const cookieFp = getCookie(event, 'fp')
  const hasFp = cookieFp && cookieFp.length > 0;
  const sessionId = hasFp ? cookieFp : undefined
  const utm = sanitizeUtm(query as Record<string, any>)

  if (hasFp) {
    try {
      const config = useRuntimeConfig()
      const queue = getTelegramQueue()
      const message = formatMessengerTouchNotification({
        channel: channelKey,
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
      console.error(`[go/${channel}] Failed to enqueue telegram notification`, error)
    }
  }

  const html = `<!DOCTYPE html>
  <html lang="ru">
    <head>
      <meta charset="utf-8" />
      <title>${channelDef.redirectTitle}</title>
    </head>
    <body>
      <script>
        window.location.replace(${JSON.stringify(channelDef.baseUrl)})
      </script>
      <p>Перенаправляем вас в ${channelDef.label}...</p>
    </body>
  </html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
})
