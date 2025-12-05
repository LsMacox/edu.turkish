import {
  getTelegramQueueWorker,
  closeTelegramQueueWorker,
} from '~~/server/services/queue/TelegramQueueWorker'

export default defineNitroPlugin((nitroApp) => {
  if (process.env.VITEST || process.env.NODE_ENV === 'test') {
    return
  }
  console.log('Starting Telegram Queue Worker...')
  getTelegramQueueWorker()

  nitroApp.hooks.hook('close', async () => {
    console.log('Shutting down Telegram Queue Worker...')
    await closeTelegramQueueWorker()
  })
})
