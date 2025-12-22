import type { TabButtonVariant } from '~/types/ui'

export const TAB_BUTTON_CLASSES: Record<TabButtonVariant, string> = {
    'tab-active': [
        'bg-primary text-white border-0',
        '!px-6 !py-3 !min-h-0 !min-w-0',
    ].join(' '),
    'tab-inactive': [
        'bg-transparent text-muted border-0',
        'hover:text-secondary',
        '!px-6 !py-3 !min-h-0 !min-w-0',
    ].join(' '),
    'tab-pros': [
        'bg-transparent text-meta border-0',
        'hover:bg-surface',
        '!px-6 !py-3 !min-h-0 !rounded-none',
        'data-[active=true]:bg-green-50 data-[active=true]:text-green-700 data-[active=true]:border-b-2 data-[active=true]:border-green-500',
    ].join(' '),
    'tab-cons': [
        'bg-transparent text-meta border-0',
        'hover:bg-surface',
        '!px-6 !py-3 !min-h-0 !rounded-none',
        'data-[active=true]:bg-amber-50 data-[active=true]:text-amber-700 data-[active=true]:border-b-2 data-[active=true]:border-amber-500',
    ].join(' '),
}
