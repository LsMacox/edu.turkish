import type { IconButtonVariant } from '~/types/ui/components/button'

export const ICON_BUTTON_VARIANT_CLASSES: Record<IconButtonVariant, string> = {
    primary: [
        'bg-primary text-white border border-primary',
        'hover:bg-red-600 hover:border-red-600',
        'focus:ring-primary focus-visible:ring-primary',
    ].join(' '),
    secondary: [
        'bg-white text-secondary border border-gray-300',
        'hover:bg-gray-50 hover:border-gray-400',
        'focus:ring-gray-500 focus-visible:ring-gray-500',
    ].join(' '),
    outline: [
        'bg-transparent text-primary border-2 border-primary',
        'hover:bg-primary hover:text-white',
        'focus:ring-primary focus-visible:ring-primary',
    ].join(' '),
    ghost: [
        'bg-transparent text-primary border border-transparent',
        'hover:bg-red-50 hover:text-red-600',
        'focus:ring-primary focus-visible:ring-primary',
    ].join(' '),
    subtle: [
        'bg-transparent text-gray-500 border border-transparent',
        'hover:bg-gray-100 hover:text-gray-700',
        'focus:ring-gray-400 focus-visible:ring-gray-400',
    ].join(' '),
}

