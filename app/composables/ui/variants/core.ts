import type { CoreButtonVariant } from '~/types/ui'

export const CORE_BUTTON_CLASSES: Record<CoreButtonVariant, string> = {
    primary: [
        'bg-primary text-white border border-primary font-semibold',
        'hover:bg-red-600 hover:border-red-600',
        'focus:ring-primary focus-visible:ring-primary',
    ].join(' '),
    secondary: [
        'bg-white text-secondary border border-default font-medium',
        'hover:bg-surface hover:border-muted',
        'focus:ring-gray-500 focus-visible:ring-gray-500',
    ].join(' '),
    outline: [
        'bg-transparent text-primary border-2 border-primary font-semibold',
        'hover:bg-primary hover:text-white',
        'focus:ring-primary focus-visible:ring-primary',
    ].join(' '),
    ghost: [
        'bg-transparent text-primary border border-transparent',
        'hover:bg-red-50 hover:text-red-600',
        'focus:ring-primary focus-visible:ring-primary',
    ].join(' '),
    gradient: [
        'bg-gradient-to-r from-red-500 to-red-600 text-white border-0 font-semibold',
        'hover:from-red-600 hover:to-red-700',
        'focus:ring-primary focus-visible:ring-primary',
    ].join(' '),
    inverted: [
        'bg-white text-primary border border-transparent font-semibold',
        'hover:bg-gray-100',
        'focus:ring-white focus-visible:ring-white',
        'shadow-card-hover',
    ].join(' '),
    link: [
        'bg-transparent text-meta !font-normal border border-transparent !p-0 !min-h-0 !min-w-0',
        'hover:text-primary',
        'focus:ring-transparent focus-visible:ring-transparent',
    ].join(' '),
}
