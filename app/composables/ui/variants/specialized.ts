import type { SpecializedButtonVariant } from '~/types/ui'

export const SPECIALIZED_BUTTON_CLASSES: Record<SpecializedButtonVariant, string> = {
    pagination: [
        'bg-white text-content border border-default',
        'hover:bg-surface',
        'focus:ring-primary focus-visible:ring-primary',
        'data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:border-primary',
        '!px-3 !py-2 !min-w-[40px] !min-h-0',
    ].join(' '),
    'lightbox-close': [
        'bg-white/10 text-white border-0',
        'hover:bg-white hover:text-primary',
        '!p-0 !min-h-0 !min-w-0',
    ].join(' '),
    'lightbox-nav': [
        'bg-white text-primary border-0 shadow-card',
        'hover:bg-primary hover:text-white hover:scale-110',
        '!p-0 !min-h-0 !min-w-0',
    ].join(' '),
    'pill-secondary': [
        'bg-secondary text-white border-0 shadow-card',
        'hover:bg-primary hover:shadow-primary/25',
        '!min-h-0 !min-w-0',
    ].join(' '),
    'toast-close': [
        'bg-transparent text-current border-0 opacity-60',
        'hover:opacity-100',
        '!p-0 !min-h-0 !min-w-0',
    ].join(' '),
    'input-clear': [
        'bg-transparent text-hint border-0',
        'hover:text-muted',
        '!outline-none !ring-0 active:bg-transparent',
        '!p-0 !min-h-0 !min-w-0 !font-normal !mr-3',
    ].join(' '),
}
