import { getCRMQueueWorker, closeCRMQueueWorker } from '~~/server/services/queue/CRMQueueWorker'

export default defineNitroPlugin((nitroApp) => {
  if (process.env.VITEST || process.env.NODE_ENV === 'test') {
    return
  }
  console.log('Starting CRM Queue Worker...')
  getCRMQueueWorker()

  nitroApp.hooks.hook('close', async () => {
    console.log('Shutting down CRM Queue Worker...')
    await closeCRMQueueWorker()
  })
})
