import { z } from 'zod'
import { parseCallWebhookPayload, validateWebhookToken, shouldNotifyByTeam } from '~~/server/utils/espocrm-webhook-validator'
import { formatCallNotification } from '~~/server/utils/telegram-formatter'
import { getTelegramQueue } from '~~/server/utils/telegram-queue'

/**
 * EspoCRM Call Activity Webhook Endpoint
 *
 * Receives webhook notifications for new call activities from EspoCRM
 * and queues Telegram notifications
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    // 1. Validate webhook token
    const query = getQuery(event)
    const token = query.token as string | undefined

    if (!validateWebhookToken(token, config.espocrmWebhookToken)) {
      setResponseStatus(event, 401)
      return {
        success: false,
        error: 'Invalid webhook token',
      }
    }

    // 2. Parse and validate request body
    const body = await readBody(event)

    let payload: { event: string; entity: any }
    try {
      payload = parseCallWebhookPayload(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setResponseStatus(event, 400)
        return {
          success: false,
          error: 'Invalid webhook payload',
          details: error.issues[0],
        }
      }
      throw error
    }

    // 3. We accept only plain entity payloads from EspoCRM and treat them as 'create'

    // 4. Apply team filter
    if (!shouldNotifyByTeam(payload.entity.teamsIds, config.espocrmAssignedTeamId)) {
      // Return 200 OK but don't queue notification
      console.log(
        `Call ${payload.entity.id} filtered out by team (teams: ${payload.entity.teamsIds?.join(', ') || 'none'})`,
      )
      return {
        success: true,
        message: 'Webhook received (filtered by team)',
      }
    }

    // 5. Format message
    const message = formatCallNotification(payload.entity as any)

    // 6. Queue Telegram notification
    const queue = getTelegramQueue()
    const job = await queue.add(
      'sendNotification',
      {
        channelId: config.telegramCallsChannelId,
        message,
        parseMode: 'HTML',
        disableWebPagePreview: true,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    )

    console.log(`Call webhook processed: ${payload.entity.id}, job queued: ${job.id}`)

    // 7. Return success immediately
    return {
      success: true,
      message: 'Webhook received and queued for processing',
      jobId: job.id,
    }
  } catch (error: any) {
    console.error('Call webhook error:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      error: 'Internal server error',
      message: error.message,
    }
  }
})
