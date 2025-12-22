import type { SocialButtonVariant } from '~/types/ui'

export const SOCIAL_BUTTON_CLASSES: Record<SocialButtonVariant, string> = {
    'social-whatsapp': [
        'bg-green-500 text-white border border-transparent',
        'hover:bg-green-600',
        'focus:ring-green-500 focus-visible:ring-green-500',
        '!p-0 w-10 h-10',
    ].join(' '),
    'social-telegram': [
        'bg-blue-500 text-white border border-transparent',
        'hover:bg-blue-600',
        'focus:ring-blue-500 focus-visible:ring-blue-500',
    ].join(' '),
    'social-instagram': [
        'bg-pink-500 text-white border border-transparent',
        'hover:bg-pink-600',
        'active:bg-pink-700',
        'focus:ring-pink-500 focus-visible:ring-pink-500',
        '!p-0 w-10 h-10',
    ].join(' '),
    'whatsapp-cta': [
        'bg-green-500 text-white border-0 shadow-card',
        'hover:bg-green-600',
        'active:bg-green-700',
        '!font-semibold',
    ].join(' '),
}
