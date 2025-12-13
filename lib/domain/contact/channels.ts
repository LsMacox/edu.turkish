export type ContactChannelType = 'bot' | 'personal' | 'social'

export interface ContactChannelDefinition {
  key: ContactChannelKey
  type: ContactChannelType
  baseUrl: string
  defaultCta: string
  label: string
  redirectTitle: string
  defaultMessage?: string
  queryParam?: string
}

export type ContactChannelKey = 'telegram' | 'whatsapp' | 'instagram'

export const contactChannels: Record<ContactChannelKey, ContactChannelDefinition> = {
  telegram: {
    key: 'telegram',
    type: 'personal',
    baseUrl: 'https://t.me/Hakim7292',
    defaultCta: 'Написать в Telegram',
    label: 'Telegram',
    redirectTitle: 'Переходим в Telegram...',
  },
  whatsapp: {
    key: 'whatsapp',
    type: 'personal',
    baseUrl: 'https://wa.me/905438679950',
    defaultCta: 'Написать в WhatsApp',
    label: 'WhatsApp',
    redirectTitle: 'Переходим в WhatsApp...',
  },
  instagram: {
    key: 'instagram',
    type: 'social',
    baseUrl: 'https://www.instagram.com/edu.turkish/',
    defaultCta: 'Подписаться в Instagram',
    label: 'Instagram',
    redirectTitle: 'Переходим в Instagram...',
  },
}

