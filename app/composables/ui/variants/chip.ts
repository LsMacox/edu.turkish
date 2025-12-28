import type { ChipButtonVariant } from '~/types/ui'

export const CHIP_BUTTON_CLASSES: Record<ChipButtonVariant, string> = {
    chip: [
        'bg-white text-secondary border border-gray-300',
        'hover:border-primary hover:text-primary',
        'focus:ring-primary focus-visible:ring-primary',
        'data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:border-primary',
    ].join(' '),
    'chip-pill': [
        'bg-surface-elevated text-muted border border-transparent',
        'hover:bg-surface-muted',
        'focus:ring-primary focus-visible:ring-primary',
        'data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:shadow-button',
        '!px-2.5 !py-1 sm:!px-3.5 sm:!py-1.5 !text-[11px] sm:!text-xs !min-h-[32px] sm:!min-h-[36px]',
    ].join(' '),
    suggestion: [
        'bg-surface-elevated text-content border border-transparent',
        'hover:bg-surface-muted',
        'focus:ring-gray-400 focus-visible:ring-gray-400',
    ].join(' '),
}
