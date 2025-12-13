import { getTelegramQueue } from '~~/server/services/telegram/queue'

/**
 * Telegram Queue Health Check
 *
 * Returns queue statistics and health status
 *
 * Usage:
 *   curl https://your-domain.com/api/health/telegram-queue
 *
 * Integration with monitoring:
 *   - Prometheus: Scrape this endpoint
 *   - Grafana: Create dashboard
 *   - Uptime monitoring: Check healthy=true
 */
export default defineEventHandler(async (event) => {
  try {
    const queue = getTelegramQueue()

    const counts = await queue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed')

    const waitingCount = counts.waiting || 0
    const failedCount = counts.failed || 0
    const activeCount = counts.active || 0

    const isHealthy =
      waitingCount < 100 &&
      failedCount < 10 && 
      activeCount < 20 

    let recentFailures: any[] = []
    if (failedCount > 0) {
      const failedJobs = await queue.getFailed(0, 5)
      recentFailures = failedJobs.map((job) => ({
        id: job.id,
        attempts: job.attemptsMade,
        error: job.failedReason,
        timestamp: job.finishedOn ? new Date(job.finishedOn).toISOString() : null,
      }))
    }

    return {
      healthy: isHealthy,
      status: isHealthy ? 'ok' : 'degraded',
      queue: 'telegram-notifications',
      counts: {
        waiting: waitingCount,
        active: activeCount,
        completed: counts.completed || 0,
        failed: failedCount,
        delayed: counts.delayed || 0,
      },
      recentFailures,
      timestamp: new Date().toISOString(),
    }
  } catch (error: any) {
    console.error('Telegram queue health check failed:', error)

    setResponseStatus(event, 503)
    return {
      healthy: false,
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    }
  }
})
