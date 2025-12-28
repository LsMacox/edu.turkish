import type { NuxtConfig } from 'nuxt/schema'

/**
 * Create runtime configuration
 */
export function createRuntimeConfig(siteUrl: string): NuxtConfig['runtimeConfig'] {
  return {
    // Private (server-only)
    espocrmWebhookToken: process.env.NUXT_ESPOCRM_WEBHOOK_TOKEN || '',
    espocrmAssignedTeamId: process.env.NUXT_ESPOCRM_ASSIGNED_TEAM_ID || '',
    telegramBotToken: process.env.NUXT_TELEGRAM_BOT_TOKEN || '',
    telegramLeadsChannelId: process.env.NUXT_TELEGRAM_LEADS_CHANNEL_ID || '',
    telegramCallsChannelId: process.env.NUXT_TELEGRAM_CALLS_CHANNEL_ID || '',

    // Public (client + server)
    public: {
      siteUrl,
      cdnUrl: process.env.NUXT_PUBLIC_CDN_URL || '',
      directusUrl: process.env.NUXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055',
      yandexMetrikaId: process.env.NUXT_PUBLIC_YANDEX_METRIKA_ID || '',
      gtmId: process.env.NUXT_PUBLIC_GTM_ID,
    },
  }
}
