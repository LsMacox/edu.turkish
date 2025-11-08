import { z } from 'zod'
import { parseCallWebhookBatchPayload, validateWebhookToken, shouldNotifyByTeam } from '~~/server/utils/espocrm-webhook-validator'
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

    // 2. Parse and validate request body (EspoCRM sends an array payload)
    const body = await readBody(event)

    let batch: { event: 'create'; entities: any[] }
    try {
      batch = parseCallWebhookBatchPayload(body)
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

    // 3. Iterate entities, apply team filter, format and enqueue notifications
    const queue = getTelegramQueue()
    const processed: Array<{ id: string; jobId: string | number | undefined }> = []
    const skipped: string[] = []

    for (const entity of batch.entities) {
      if (!shouldNotifyByTeam(entity.teamsIds, config.espocrmAssignedTeamId)) {
        skipped.push(entity.id)
        continue
      }

      const message = formatCallNotification(entity as any)
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

      processed.push({ id: entity.id, jobId: job.id })
    }

    // 4. Return success with summary
    return {
      success: true,
      message: 'Webhook received and processed',
      total: batch.entities.length,
      queued: processed.length,
      skipped: skipped.length,
      jobs: processed,
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
