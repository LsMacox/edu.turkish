import type { EspoCRMLead } from '~~/lib/types/server'
import { formatLeadNotification } from '~~/server/services/telegram/formatter'
import { getTelegramQueue } from '~~/server/services/telegram/queue'

const isLead = (v: unknown): v is EspoCRMLead =>
  typeof v === 'object' && v !== null && 'id' in v && typeof (v as any).id === 'string'

const parseLeads = (body: unknown): EspoCRMLead[] => {
  const items = Array.isArray(body) ? body : [body]
  if (!items.every(isLead)) throw new Error('Invalid payload')
  return items
}

const shouldNotify = (teamsIds: string[] | undefined, teamId: string): boolean =>
  !teamId || !teamsIds?.length || teamsIds.includes(teamId)

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getQuery(event).token as string | undefined

  if (token !== config.espocrmWebhookToken) {
    setResponseStatus(event, 401)
    return { success: false, error: 'Invalid webhook token' }
  }

  let leads: EspoCRMLead[]
  try {
    leads = parseLeads(await readBody(event))
  } catch {
    setResponseStatus(event, 400)
    return { success: false, error: 'Invalid webhook payload' }
  }

  const queue = getTelegramQueue()
  const jobs: Array<{ id: string; jobId: string | number | undefined }> = []

  for (const lead of leads) {
    if (!shouldNotify(lead.teamsIds, config.espocrmAssignedTeamId)) continue

    const job = await queue.add('sendNotification', {
      channelId: config.telegramLeadsChannelId,
      message: formatLeadNotification(lead),
      parseMode: 'HTML',
      disableWebPagePreview: true,
    })

    jobs.push({ id: lead.id, jobId: job.id })
  }

  return { success: true, queued: jobs.length, jobs }
})
