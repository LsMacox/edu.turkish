import { computed, type MaybeRefOrGetter, toValue } from 'vue'

export type RoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'button'
export type CardRoundedSize = RoundedSize
export type FormRoundedSize = RoundedSize
export type RoundedContext = 'default' | 'badge' | 'card' | 'form' | 'checkbox' | 'radio' | 'icon'

type RoundedClassMap = Record<RoundedSize, string>

export const ROUNDED_MAPS: Record<RoundedContext, RoundedClassMap> = {
    default: {
        none: '', sm: 'rounded-sm', md: 'rounded-lg', lg: 'rounded-xl',
        xl: 'rounded-2xl', '2xl': 'rounded-3xl', full: 'rounded-full', button: 'rounded-button',
    },
    badge: {
        none: '', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
        xl: 'rounded-xl', '2xl': 'rounded-2xl', full: 'rounded-full', button: 'rounded-md',
    },
    card: {
        none: '', sm: 'rounded-md', md: 'rounded-button', lg: 'rounded-card',
        xl: 'rounded-card-lg', '2xl': 'rounded-3xl', full: 'rounded-full', button: 'rounded-button',
    },
    icon: {
        none: '', sm: 'rounded-sm', md: 'rounded-icon', lg: 'rounded-button',
        xl: 'rounded-card', '2xl': 'rounded-card-lg', full: 'rounded-full', button: 'rounded-button',
    },
    form: {
        none: '', sm: 'rounded-md', md: 'rounded-lg', lg: 'rounded-xl',
        xl: 'rounded-2xl', '2xl': 'rounded-3xl', full: 'rounded-full', button: 'rounded-button',
    },
    checkbox: {
        none: '', sm: 'rounded', md: 'rounded-md', lg: 'rounded-lg',
        xl: 'rounded-xl', '2xl': 'rounded-2xl', full: 'rounded-full', button: 'rounded-md',
    },
    radio: {
        none: 'rounded-full', sm: 'rounded-full', md: 'rounded-full', lg: 'rounded-full',
        xl: 'rounded-full', '2xl': 'rounded-full', full: 'rounded-full', button: 'rounded-full',
    },
} as const

export const ROUNDED_DEFAULTS: Record<RoundedContext, RoundedSize> = {
    default: 'xl',
    badge: 'xl',
    card: 'lg',
    form: 'lg',
    checkbox: 'sm',
    radio: 'full',
    icon: 'full',
}

export function useRoundedClasses<T extends RoundedSize = RoundedSize>(
    rounded: MaybeRefOrGetter<T | undefined>,
    options: { context?: RoundedContext; defaultSize?: T } = {}
) {
    const { context = 'default', defaultSize } = options
    const effectiveDefault = defaultSize ?? (ROUNDED_DEFAULTS[context] as T)

    return computed(() => {
        const value = toValue(rounded)
        const map = ROUNDED_MAPS[context]
        return map[value ?? effectiveDefault] ?? map[effectiveDefault] ?? ''
    })
}
