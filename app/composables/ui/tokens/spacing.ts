import type { Size5, Size3, SizeCompact, WithNone } from '~/types/ui'

export const COMPONENT_SPACE_CLASSES: Record<Size5, string> = {
    xs: 'space-component-xs',
    sm: 'space-component-sm',
    md: 'space-component-md',
    lg: 'space-component-lg',
    xl: 'space-component-xl',
}

export const COMPONENT_GAP_CLASSES: Record<Size5, string> = {
    xs: 'gap-component-xs',
    sm: 'gap-component-sm',
    md: 'gap-component-md',
    lg: 'gap-component-lg',
    xl: 'gap-component-xl',
}

export const COMPONENT_MB_CLASSES: Record<Size5, string> = {
    xs: 'mb-component-xs',
    sm: 'mb-component-sm',
    md: 'mb-component-md',
    lg: 'mb-component-lg',
    xl: 'mb-component-xl',
}

export const COMPONENT_MT_CLASSES: Record<Size5, string> = {
    xs: 'mt-component-xs',
    sm: 'mt-component-sm',
    md: 'mt-component-md',
    lg: 'mt-component-lg',
    xl: 'mt-component-xl',
}

export const COMPONENT_PT_CLASSES: Record<Size5, string> = {
    xs: 'pt-component-xs',
    sm: 'pt-component-sm',
    md: 'pt-component-md',
    lg: 'pt-component-lg',
    xl: 'pt-component-xl',
}

export const CARD_PADDING_CLASSES: Record<WithNone<Size5>, string> = {
    none: '',
    xs: 'card-padding-xs',
    sm: 'card-padding-sm',
    md: 'card-padding',
    lg: 'card-padding-lg',
    xl: 'card-padding-xl',
}

export const SECTION_PADDING_CLASSES: Record<Size3 | 'xl', string> = {
    sm: 'section-py-sm',
    md: 'section-py',
    lg: 'section-py-lg',
    xl: 'section-py-xl',
}

export const MARGIN_BOTTOM_CLASSES: Record<WithNone<Size3 | 'xl'>, string> = {
    none: '',
    sm: 'mb-4 md:mb-6',
    md: 'mb-6 md:mb-8',
    lg: 'mb-8 md:mb-12',
    xl: 'mb-10 md:mb-16',
}

export const TABLE_CELL_PADDING_CLASSES: Record<SizeCompact, string> = {
    xs: 'px-2 py-1',
    sm: 'px-2 py-1.5 md:px-3 md:py-2',
    md: 'px-2 py-2 md:px-4 md:py-3',
}

