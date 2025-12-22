import type { IconActionVariant } from '~/types/ui'

export const ICON_ACTION_CLASSES: Record<IconActionVariant, string> = {
    icon: [
        'bg-transparent text-meta border border-transparent',
        'hover:bg-surface-elevated hover:text-muted',
        'focus:ring-gray-400 focus-visible:ring-gray-400',
        '!p-2 !min-w-0',
    ].join(' '),
    'icon-circle': [
        'bg-transparent text-meta border border-transparent',
        'hover:bg-surface-elevated active:bg-surface-muted',
        'focus:ring-gray-400 focus-visible:ring-gray-400',
        '!p-2 !min-w-0',
    ].join(' '),
    'icon-close-lg': [
        'bg-transparent text-meta border-0',
        'hover:bg-surface-elevated',
        'active:bg-surface-muted',
        '!p-0 !min-h-0 !min-w-0 !font-normal',
    ].join(' '),
    'icon-close-md': [
        'bg-transparent text-hint border-0',
        'hover:bg-surface-elevated',
        '!p-0 !min-h-0 !min-w-0 !font-normal',
    ].join(' '),
    'icon-close-sm': [
        'bg-transparent text-hint border-0',
        'hover:text-muted',
        '!p-1 !min-h-0 !min-w-0 !font-normal min-w-touch-44 min-h-touch-44',
    ].join(' '),
}
