import { formatLeadNotification } from '~~/server/utils/telegram-formatter'
import { getTelegramQueue } from '~~/server/utils/telegram-queue'

/**
 * Debug endpoint for testing Telegram notifications
 * 
 * Usage: POST /api/debug/telegram-test
 * Body: { "message": "test message" } or empty for default test
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const body = await readBody(event).catch(() => ({}))
    
    // Test data
    const testLead = {
      id: 'debug-test-' + Date.now(),
      firstName: 'Тест',
      lastName: 'Отладка',
      phoneNumber: '+7123456789',
      emailAddress: 'debug@test.com',
      source: 'Debug Test',
      status: 'Новый',
      description: 'Тестовое сообщение для отладки Telegram уведомлений',
      assignedUserName: 'Debug Manager',
      createdAt: new Date().toISOString(),
      teamsIds: [config.espocrmAssignedTeamId]
    }
    
    // Format message
    const message = body.message || formatLeadNotification(testLead as any)
    
    console.log('=== TELEGRAM DEBUG TEST ===')
    console.log('Bot Token:', config.telegramBotToken ? 'SET' : 'NOT SET')
    console.log('Channel ID:', config.telegramLeadsChannelId || 'NOT SET')
    console.log('Team ID:', config.espocrmAssignedTeamId || 'NOT SET')
    console.log('Message:', message)
    console.log('========================')
    
    // Queue notification
    const queue = getTelegramQueue()
    const job = await queue.add(
      'sendNotification',
      {
        channelId: config.telegramLeadsChannelId,
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
    
    console.log(`Debug test job queued: ${job.id}`)
    
    return {
      success: true,
      message: 'Debug test queued',
      jobId: job.id,
      config: {
        botTokenSet: !!config.telegramBotToken,
        channelIdSet: !!config.telegramLeadsChannelId,
        teamIdSet: !!config.espocrmAssignedTeamId,
      },
      testData: testLead
    }
  } catch (error: any) {
    console.error('Debug test error:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
})
