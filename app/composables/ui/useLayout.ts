import { computed, type MaybeRefOrGetter, toValue } from 'vue'

export const MAX_WIDTH_MAP: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
}

export const TEXT_ALIGN_MAP: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
}

export const FLEX_ALIGN_MAP: Record<string, string> = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
}

export const ITEMS_ALIGN_MAP: Record<string, string> = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
    stretch: 'items-stretch',
}

export function useMaxWidthClasses(
    maxWidth: MaybeRefOrGetter<string | undefined>,
    options: { defaultWidth?: string; centered?: boolean } = {}
) {
    const { defaultWidth = '6xl', centered = true } = options

    return computed(() => {
        const value = toValue(maxWidth)
        const widthClass = MAX_WIDTH_MAP[value ?? defaultWidth] ?? MAX_WIDTH_MAP[defaultWidth]
        return [widthClass, centered && widthClass !== 'max-w-full' ? 'mx-auto' : ''].filter(Boolean).join(' ')
    })
}

export function useAlignClasses(
    align: MaybeRefOrGetter<string | undefined>,
    options: { context?: 'text' | 'flex' | 'items'; defaultAlign?: string } = {}
) {
    const { context = 'text', defaultAlign = 'left' } = options

    return computed(() => {
        const value = toValue(align) ?? defaultAlign
        if (context === 'text') return TEXT_ALIGN_MAP[value] ?? TEXT_ALIGN_MAP[defaultAlign]
        if (context === 'flex') return FLEX_ALIGN_MAP[value] ?? FLEX_ALIGN_MAP[defaultAlign]
        if (context === 'items') return ITEMS_ALIGN_MAP[value] ?? ITEMS_ALIGN_MAP[defaultAlign]
        return ''
    })
}
