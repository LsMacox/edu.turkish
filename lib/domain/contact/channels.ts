export type ContactChannelType = 'bot' | 'personal' | 'social'

export interface ContactChannelDefinition {
  key: ContactChannelKey
  type: ContactChannelType
  baseUrl: string
  label: string
  cta: string
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
    label: 'Telegram',
    cta: 'Написать',
    redirectTitle: 'Переходим в Telegram...',
  },
  whatsapp: {
    key: 'whatsapp',
    type: 'personal',
    baseUrl: 'https://wa.me/905438679950',
    label: 'WhatsApp',
    cta: 'Написать',
    redirectTitle: 'Переходим в WhatsApp...',
  },
  instagram: {
    key: 'instagram',
    type: 'social',
    baseUrl: 'https://www.instagram.com/edu.turkish/',
    label: 'Instagram',
    cta: 'Подписаться',
    redirectTitle: 'Переходим в Instagram...',
  },
}

