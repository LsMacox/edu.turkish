import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { Size3 } from '~/types/ui'
import { SECTION_PADDING_CLASSES } from './tokens'

export type SectionBackground = 'default' | 'white' | 'gray' | 'gradient' | 'gradient-down' | 'primary' | 'primary-gradient'

export const SECTION_BG_CLASSES: Record<SectionBackground, string> = {
    default: 'bg-background',
    white: 'bg-white',
    gray: 'bg-gray-50',
    gradient: 'bg-gradient-to-b from-white to-gray-50',
    'gradient-down': 'bg-gradient-to-b from-gray-50 to-white',
    primary: 'bg-primary',
    'primary-gradient': 'bg-gradient-to-r from-primary to-red-600',
}

export function useSectionClasses(options: {
    padding: MaybeRefOrGetter<Size3 | 'xl' | undefined>
    bg: MaybeRefOrGetter<SectionBackground | undefined>
}) {
    return computed(() => {
        const padding = toValue(options.padding) ?? 'md'
        const bg = toValue(options.bg) ?? 'default'

        return [
            SECTION_PADDING_CLASSES[padding] ?? SECTION_PADDING_CLASSES.md,
            SECTION_BG_CLASSES[bg] ?? SECTION_BG_CLASSES.default,
        ].join(' ')
    })
}
