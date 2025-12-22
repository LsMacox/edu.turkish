import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { Size5 } from '~/types/ui'

export const LABEL_LINE_HEIGHT = 'leading-relaxed' as const

export interface SectionHeaderSizeClasses {
    preTitle: string
    title: string
}

export const SECTION_HEADER_SIZE_MAP: Record<Size5, SectionHeaderSizeClasses> = {
    xs: { preTitle: 'text-[10px]', title: 'text-lg font-bold' },
    sm: { preTitle: 'text-xs', title: 'text-xl md:text-2xl font-bold' },
    md: { preTitle: 'text-sm', title: 'text-2xl md:text-3xl font-bold' },
    lg: { preTitle: 'text-sm', title: 'text-section-title' },
    xl: { preTitle: 'text-base', title: 'text-3xl md:text-5xl font-bold' },
}

export function useSectionHeaderSizeClasses(
    size: MaybeRefOrGetter<Size5 | undefined>,
    defaultSize: Size5 = 'lg'
) {
    return computed(() => {
        const value = toValue(size)
        return SECTION_HEADER_SIZE_MAP[value ?? defaultSize] ?? SECTION_HEADER_SIZE_MAP[defaultSize]
    })
}
