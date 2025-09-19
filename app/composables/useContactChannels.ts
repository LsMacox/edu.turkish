import { computed } from 'vue'
import { withQuery } from 'ufo'
import { contactChannels, personalTelegramChannelKey, type ContactChannelDefinition, type ContactChannelKey } from '~/lib/contact/channels'
import { useReferral } from './useReferral'

export interface ContactChannelInstance extends ContactChannelDefinition {
  href: string
  cta: string
  message?: string
}

const REFERRAL_PLACEHOLDER = /\{\{\s*referral\s*\}\}/gi

const sanitizeMessage = (template: string | undefined, referral: string): string | undefined => {
  if (!template) {
    return undefined
  }

  const replaced = template.replace(REFERRAL_PLACEHOLDER, referral || '').trim()
  return replaced.length > 0 ? replaced : undefined
}

const buildGoTelegramHref = (
  referral: string,
  sessionId: string | undefined,
  utm: Record<string, string>
): string => {
  const query: Record<string, string> = {}

  if (referral) {
    query.referral_code = referral
  }

  if (sessionId) {
    query.session = sessionId
  }

  for (const [key, value] of Object.entries(utm)) {
    if (value) {
      query[key] = value
    }
  }

  return Object.keys(query).length > 0 ? withQuery('/go/telegram', query) : '/go/telegram'
}

const extractUtmParams = (query: Record<string, any>): Record<string, string> => {
  return Object.entries(query).reduce<Record<string, string>>((acc, [key, value]) => {
    if (key.startsWith('utm_') && typeof value === 'string' && value.length > 0) {
      acc[key] = value
    }
    return acc
  }, {})
}

export const useContactChannels = () => {
  const { referralCode } = useReferral()
  const route = useRoute()

  const channels = computed<Record<ContactChannelKey, ContactChannelInstance>>(() => {
    const referral = referralCode.value || ''
    const analyticsReferral = referralCode.value || 'direct'
    const sessionId = typeof route.query.session === 'string' ? route.query.session : undefined
    const utmParams = extractUtmParams(route.query as Record<string, any>)

    return Object.entries(contactChannels).reduce<Record<ContactChannelKey, ContactChannelInstance>>(
      (acc, [key, definition]) => {
        const typedKey = key as ContactChannelKey
        const message = sanitizeMessage(definition.defaultMessage, referral)
        let href = definition.baseUrl

        if (typedKey === personalTelegramChannelKey) {
          href = buildGoTelegramHref(analyticsReferral, sessionId, utmParams)
        } else if (definition.queryParam && message) {
          href = withQuery(definition.baseUrl, { [definition.queryParam]: message })
        } else if (typedKey === 'telegramBot' && referral) {
          href = withQuery(definition.baseUrl, { start: referral })
        }

        acc[typedKey] = {
          ...definition,
          href,
          cta: definition.defaultCta,
          message
        }

        return acc
      },
      {} as Record<ContactChannelKey, ContactChannelInstance>
    )
  })

  const channelList = computed(() => Object.values(channels.value))

  const getChannel = (key: ContactChannelKey) => computed(() => channels.value[key])

  return {
    channels,
    channelList,
    getChannel
  }
}
