import { withQuery } from 'ufo'
import { contactChannels, type ContactChannelKey } from '~~/lib/domain/contact/channels'
import { useReferral } from './useReferral'
import { sanitizeUtm } from '~~/lib/domain/contact/utm'

const routePaths: Record<ContactChannelKey, string> = {
  telegramBot: '/go/telegram',
  whatsapp: '/go/whatsapp',
  instagram: '/go/instagram',
}

export const useContactChannels = () => {
  const { referralCode } = useReferral()
  const route = useRoute()

  const channels = computed(() => {
    const ref = referralCode.value || ''
    const utm = sanitizeUtm(route.query as Record<string, string>)
    const hasTracking = ref || utm

    const result = {} as Record<ContactChannelKey, { href: string; cta: string }>

    for (const [key, def] of Object.entries(contactChannels)) {
      let href = def.baseUrl

      if (hasTracking) {
        const query: Record<string, string> = { ref }
        if (utm) Object.assign(query, utm)
        href = withQuery(routePaths[key as ContactChannelKey], query)
      }

      result[key as ContactChannelKey] = { ...def, href, cta: def.defaultCta }
    }

    return result
  })

  const getChannel = (key: ContactChannelKey) => computed(() => channels.value[key])

  return { channels, getChannel }
}
