import type { StatusColor, StatusBadgeClasses, CalloutColor, CalloutClasses, RingColor, SizeCompact } from '~/types/ui'

export const STATUS_CONTAINER_SIZES: Record<SizeCompact, string> = {
    xs: 'w-5 h-5',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
}

export const STATUS_ICON_SIZES: Record<SizeCompact, string> = {
    xs: 'text-icon-xs',
    sm: 'text-icon-sm',
    md: 'text-icon',
}

export const STATUS_BG_COLORS: Record<StatusColor, string> = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    neutral: 'bg-gray-500',
}

export const STATUS_SOFT_BG_COLORS: Record<StatusColor, string> = {
    primary: 'bg-primary/10',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100',
    info: 'bg-blue-100',
    neutral: 'bg-gray-100',
}

export const STATUS_TEXT_COLORS: Record<StatusColor, string> = {
    primary: 'text-primary',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    neutral: 'text-gray-600',
}

export function getStatusBadgeClasses(
    color: StatusColor,
    size: SizeCompact = 'sm',
    variant: 'solid' | 'soft' = 'solid'
): StatusBadgeClasses {
    const bgColor = variant === 'solid' ? STATUS_BG_COLORS[color] : STATUS_SOFT_BG_COLORS[color]
    const textColor = variant === 'solid' ? 'text-white' : STATUS_TEXT_COLORS[color]

    return {
        container: `${STATUS_CONTAINER_SIZES[size]} ${bgColor} rounded-full flex items-center justify-center flex-shrink-0`,
        icon: `${STATUS_ICON_SIZES[size]} ${textColor}`,
    }
}

export const CALLOUT_CLASSES: Record<CalloutColor, CalloutClasses> = {
    primary: {
        container: 'bg-primary-soft border-l-4 border-l-primary',
        text: 'text-red-800',
        icon: 'text-primary',
    },
    success: {
        container: 'bg-success-light border-l-4 border-l-success',
        text: 'text-green-800',
        icon: 'text-success',
    },
    warning: {
        container: 'bg-warning-light border-l-4 border-l-warning',
        text: 'text-yellow-800',
        icon: 'text-warning',
    },
    error: {
        container: 'bg-error-light border-l-4 border-l-error',
        text: 'text-red-800',
        icon: 'text-error',
    },
    info: {
        container: 'bg-info-light border-l-4 border-l-info',
        text: 'text-blue-800',
        icon: 'text-info',
    },
    neutral: {
        container: 'bg-gray-50 border-l-4 border-l-gray-400',
        text: 'text-gray-800',
        icon: 'text-gray-600',
    },
}

export const RING_CLASSES: Record<RingColor, string> = {
    default: 'ring-2 ring-gray-100',
    primary: 'ring-2 ring-primary/20',
    white: 'ring-2 ring-white',
    success: 'ring-2 ring-green-100',
    error: 'ring-2 ring-red-100',
}

export type AlertVariant = 'success' | 'warning' | 'error' | 'info'

export interface AlertColors {
    container: string
    icon: string
    title: string
    content: string
}

export const ALERT_COLORS: Record<AlertVariant, AlertColors> = {
    success: {
        container: 'bg-green-50 border-green-200',
        icon: 'text-green-600',
        title: 'text-green-800',
        content: 'text-green-700',
    },
    warning: {
        container: 'bg-yellow-50 border-yellow-200',
        icon: 'text-yellow-600',
        title: 'text-yellow-800',
        content: 'text-yellow-700',
    },
    error: {
        container: 'bg-red-50 border-red-200',
        icon: 'text-red-600',
        title: 'text-red-800',
        content: 'text-red-700',
    },
    info: {
        container: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-600',
        title: 'text-blue-800',
        content: 'text-blue-700',
    },
}
