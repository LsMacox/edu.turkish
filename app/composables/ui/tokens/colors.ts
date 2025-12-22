import type { SemanticColor, BadgeVariant, ToastType, ShadowSemantic } from '~/types/ui'

export const SEMANTIC_TEXT_COLORS: Record<SemanticColor, string> = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info',
    neutral: 'text-gray-600',
}

export const SEMANTIC_BG_COLORS: Record<SemanticColor, string> = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-info',
    neutral: 'bg-gray-500',
}

export const SEMANTIC_BG_SOFT_COLORS: Record<SemanticColor, string> = {
    primary: 'bg-primary-light',
    secondary: 'bg-gray-100',
    success: 'bg-success-light',
    warning: 'bg-warning-light',
    error: 'bg-error-light',
    info: 'bg-info-light',
    neutral: 'bg-gray-100',
}

export const SEMANTIC_BADGE_COLORS: Record<SemanticColor, Record<BadgeVariant, string>> = {
    primary: {
        solid: 'bg-primary text-white',
        soft: 'bg-primary-light text-red-800',
        outline: 'border border-primary text-primary bg-transparent',
        gradient: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    },
    secondary: {
        solid: 'bg-secondary text-white',
        soft: 'bg-gray-100 text-gray-800',
        outline: 'border border-secondary text-secondary bg-transparent',
        gradient: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
    },
    success: {
        solid: 'bg-green-600 text-white',
        soft: 'bg-green-100 text-green-800',
        outline: 'border border-green-600 text-green-600 bg-transparent',
        gradient: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
    },
    warning: {
        solid: 'bg-yellow-600 text-white',
        soft: 'bg-yellow-100 text-yellow-800',
        outline: 'border border-yellow-600 text-yellow-600 bg-transparent',
        gradient: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
    },
    error: {
        solid: 'bg-red-600 text-white',
        soft: 'bg-red-100 text-red-800',
        outline: 'border border-red-600 text-red-600 bg-transparent',
        gradient: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    },
    info: {
        solid: 'bg-blue-600 text-white',
        soft: 'bg-blue-100 text-blue-800',
        outline: 'border border-blue-600 text-blue-600 bg-transparent',
        gradient: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    },
    neutral: {
        solid: 'bg-gray-600 text-white',
        soft: 'bg-gray-100 text-gray-700',
        outline: 'border border-gray-300 text-gray-700 bg-transparent',
        gradient: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
    },
}

export const SEMANTIC_TOAST_COLORS: Record<ToastType, { container: string; icon: string }> = {
    success: {
        container: 'bg-green-50 border-green-200 text-green-900',
        icon: 'text-green-600',
    },
    error: {
        container: 'bg-red-50 border-red-200 text-red-900',
        icon: 'text-red-600',
    },
    warning: {
        container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        icon: 'text-yellow-600',
    },
    info: {
        container: 'bg-blue-50 border-blue-200 text-blue-900',
        icon: 'text-blue-600',
    },
}

export const SEMANTIC_SHADOW_CLASSES: Record<ShadowSemantic, string> = {
    none: '',
    button: 'shadow-button',
    card: 'shadow-card',
    elevated: 'shadow-custom',
    hover: 'shadow-card-hover',
}

export const SEMANTIC_SHADOW_INTERACTIVE: Record<Exclude<ShadowSemantic, 'none' | 'hover'>, string> = {
    button: 'shadow-button hover:shadow-button-hover',
    card: 'shadow-card hover:shadow-card-hover',
    elevated: 'shadow-custom hover:shadow-card-hover',
}

export interface ColorTokens {
    bg: string
    bgSoft: string
    border: string
    text: string
    solid: string
    ring: string
}

export const SEMANTIC_COLOR_TOKENS: Record<SemanticColor, ColorTokens> = {
    primary: {
        bg: 'bg-primary/10',
        bgSoft: 'bg-primary-light',
        border: 'border-primary/20',
        text: 'text-primary',
        solid: 'bg-primary',
        ring: 'ring-4 ring-primary/20',
    },
    secondary: {
        bg: 'bg-gray-100',
        bgSoft: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-secondary',
        solid: 'bg-secondary',
        ring: 'ring-4 ring-gray-200',
    },
    success: {
        bg: 'bg-green-50',
        bgSoft: 'bg-success-light',
        border: 'border-green-100',
        text: 'text-success',
        solid: 'bg-success',
        ring: 'ring-4 ring-green-100',
    },
    warning: {
        bg: 'bg-yellow-50',
        bgSoft: 'bg-warning-light',
        border: 'border-yellow-100',
        text: 'text-warning',
        solid: 'bg-warning',
        ring: 'ring-4 ring-yellow-100',
    },
    error: {
        bg: 'bg-red-50',
        bgSoft: 'bg-error-light',
        border: 'border-red-100',
        text: 'text-error',
        solid: 'bg-error',
        ring: 'ring-4 ring-red-100',
    },
    info: {
        bg: 'bg-blue-50',
        bgSoft: 'bg-info-light',
        border: 'border-blue-100',
        text: 'text-info',
        solid: 'bg-info',
        ring: 'ring-4 ring-blue-100',
    },
    neutral: {
        bg: 'bg-gray-100',
        bgSoft: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-600',
        solid: 'bg-gray-500',
        ring: 'ring-4 ring-gray-200',
    },
}
