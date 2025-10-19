import {
  getTelegramQueueWorker,
  closeTelegramQueueWorker,
} from '~~/server/services/queue/TelegramQueueWorker'

/**
 * Telegram Queue Worker Plugin
 *
 * Starts the Telegram notification queue worker on server startup
 * and handles graceful shutdown
 */
export default defineNitroPlugin((nitroApp) => {
  if (process.env.VITEST || process.env.NODE_ENV === 'test') {
    return
  }
  // Start worker on server startup
  console.log('Starting Telegram Queue Worker...')
  getTelegramQueueWorker()

  // Handle graceful shutdown
  nitroApp.hooks.hook('close', async () => {
    console.log('Shutting down Telegram Queue Worker...')
    await closeTelegramQueueWorker()
  })
})
