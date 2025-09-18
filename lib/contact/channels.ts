export type ContactChannelType = 'bot' | 'personal' | 'social'

export interface ContactChannelDefinition {
  key: ContactChannelKey
  type: ContactChannelType
  baseUrl: string
  defaultCta: string
  defaultMessage?: string
  queryParam?: string
  copyOnNavigate?: boolean
}

export type ContactChannelKey =
  | 'telegramPersonal'
  | 'telegramBot'
  | 'whatsapp'
  | 'instagram'

export const contactChannels: Record<ContactChannelKey, ContactChannelDefinition> = {
  telegramPersonal: {
    key: 'telegramPersonal',
    type: 'personal',
    baseUrl: 'https://t.me/eduturkish',
    defaultCta: 'Связаться с консультантом',
    defaultMessage: 'Здравствуйте! Меня направил партнёр с кодом {{referral}}. Хочу получить консультацию по обучению в Турции.',
    copyOnNavigate: true
  },
  telegramBot: {
    key: 'telegramBot',
    type: 'bot',
    baseUrl: 'https://t.me/eduturkish_bot',
    defaultCta: 'Запустить Telegram-бота',
    defaultMessage: '{{referral}}',
    queryParam: 'start'
  },
  whatsapp: {
    key: 'whatsapp',
    type: 'personal',
    baseUrl: 'https://wa.me/905438679950',
    defaultCta: 'Написать в WhatsApp',
    defaultMessage: 'Здравствуйте! Меня направил партнёр с кодом {{referral}}. Подскажите, пожалуйста, по обучению в Турции.',
    queryParam: 'text'
  },
  instagram: {
    key: 'instagram',
    type: 'social',
    baseUrl: 'https://www.instagram.com/edu.turkish/',
    defaultCta: 'Подписаться в Instagram'
  }
}

export const personalTelegramChannelKey: ContactChannelKey = 'telegramPersonal'
