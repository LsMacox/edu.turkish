import { withQuery } from 'ufo'
import {
  contactChannels,
  type ContactChannelDefinition,
  type ContactChannelKey,
} from '~~/lib/contact/channels'
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

// Map of channel keys to their redirect route paths
const channelRoutePaths: Record<ContactChannelKey, string> = {
  telegramBot: '/go/telegram',
  whatsapp: '/go/whatsapp',
  instagram: '/go/instagram',
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
    const sessionId = typeof route.query.session === 'string' ? route.query.session : undefined
    const utmParams = extractUtmParams(route.query as Record<string, any>)

    const hasTrackingParams = referral || sessionId || Object.keys(utmParams).length > 0

    return Object.entries(contactChannels).reduce<
      Record<ContactChannelKey, ContactChannelInstance>
    >(
      (acc, [key, definition]) => {
        const typedKey = key as ContactChannelKey
        const message = sanitizeMessage(definition.defaultMessage, referral)
        let href = definition.baseUrl

        // Use redirect route if tracking params are present
        if (hasTrackingParams) {
          const routePath = channelRoutePaths[typedKey]
          const query: Record<string, string> = { referral_code: referral }

          // Add session, utm if needed
          if (sessionId) {
            query.session = sessionId
          }
          for (const [key, value] of Object.entries(utmParams)) {
            if (value) {
              query[key] = value
            }
          }
          href = Object.keys(query).length > 0 ? withQuery(routePath, query) : routePath
        } else if (definition.queryParam && message) {
          // Fallback to direct link with message if no tracking params
          href = withQuery(definition.baseUrl, { [definition.queryParam]: message })
        }

        acc[typedKey] = {
          ...definition,
          href,
          cta: definition.defaultCta,
          message,
        }

        return acc
      },
      {} as Record<ContactChannelKey, ContactChannelInstance>,
    )
  })

  const channelList = computed(() => Object.values(channels.value))

  const getChannel = (key: ContactChannelKey) => computed(() => channels.value[key])

  return {
    channels,
    channelList,
    getChannel,
  }
}
