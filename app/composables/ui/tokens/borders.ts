import type { BorderColor } from '~/types/ui'

export const BORDER_COLOR_CLASSES: Record<BorderColor, string> = {
    default: 'border-default',
    muted: 'border-muted',
    primary: 'border-primary',
    success: 'border-green-500',
    warning: 'border-yellow-500',
    error: 'border-red-500',
    info: 'border-blue-500',
}

export const BORDER_ACCENT_CLASSES: Record<BorderColor, string> = {
    default: 'border-l-4 border-l-gray-300',
    muted: 'border-l-4 border-l-gray-200',
    primary: 'border-l-4 border-l-primary',
    success: 'border-l-4 border-l-green-500',
    warning: 'border-l-4 border-l-yellow-500',
    error: 'border-l-4 border-l-red-500',
    info: 'border-l-4 border-l-blue-500',
}

