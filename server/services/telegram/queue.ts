import { Queue } from 'bullmq'
import type { TelegramNotificationJob } from '~~/lib/types/server'
import { createRedisClient } from '../queue/redis'

let queue: Queue<TelegramNotificationJob> | null = null

export function getTelegramQueue(): Queue<TelegramNotificationJob> {
    if (!queue) {
        const connection = createRedisClient()

        queue = new Queue<TelegramNotificationJob>('telegram-notifications', {
            connection,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
                removeOnComplete: {
                    age: 24 * 3600,
                    count: 1000,
                },
                removeOnFail: {
                    age: 7 * 24 * 3600,
                },
            },
        })

        console.log('Telegram notification queue initialized')
    }

    return queue
}

export async function closeTelegramQueue(): Promise<void> {
    if (queue) {
        await queue.close()
        queue = null
        console.log('Telegram notification queue closed')
    }
}
