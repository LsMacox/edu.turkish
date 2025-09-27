export type ContactChannelType = 'bot' | 'personal' | 'social'

export interface ContactChannelDefinition {
  key: ContactChannelKey
  type: ContactChannelType
  baseUrl: string
  defaultCta: string
  defaultMessage?: string
  queryParam?: string
}

export type ContactChannelKey = 'telegramBot' | 'whatsapp' | 'instagram'

export const contactChannels: Record<ContactChannelKey, ContactChannelDefinition> = {
  telegramBot: {
    key: 'telegramBot',
    type: 'personal',
    baseUrl: 'https://t.me/Hakim7292',
    defaultCta: 'Написать в Telegram',
  },
  whatsapp: {
    key: 'whatsapp',
    type: 'personal',
    baseUrl: 'https://wa.me/905438679950',
    defaultCta: 'Написать в WhatsApp',
  },
  instagram: {
    key: 'instagram',
    type: 'social',
    baseUrl: 'https://www.instagram.com/edu.turkish/',
    defaultCta: 'Подписаться в Instagram',
  },
}

export const primaryTelegramKey: ContactChannelKey = 'telegramBot'
