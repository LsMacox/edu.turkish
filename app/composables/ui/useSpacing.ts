import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { Size3, Size5, WithNone } from '~/types/ui'
import {
    CARD_PADDING_CLASSES,
    SECTION_PADDING_CLASSES,
    COMPONENT_SPACE_CLASSES,
    COMPONENT_GAP_CLASSES,
    COMPONENT_MB_CLASSES,
    COMPONENT_MT_CLASSES,
    COMPONENT_PT_CLASSES,
    MARGIN_BOTTOM_CLASSES,
} from './tokens/spacing'

export function useCardPadding(
    size: MaybeRefOrGetter<WithNone<Size5> | undefined>,
    defaultSize: WithNone<Size5> = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return CARD_PADDING_CLASSES[value ?? defaultSize] ?? CARD_PADDING_CLASSES[defaultSize]
    })
}

export function useSectionPadding(
    size: MaybeRefOrGetter<Size3 | 'xl' | undefined>,
    defaultSize: Size3 | 'xl' = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return SECTION_PADDING_CLASSES[value ?? defaultSize] ?? SECTION_PADDING_CLASSES[defaultSize]
    })
}

export function useComponentSpace(
    size: MaybeRefOrGetter<Size5 | undefined>,
    defaultSize: Size5 = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return COMPONENT_SPACE_CLASSES[value ?? defaultSize] ?? COMPONENT_SPACE_CLASSES[defaultSize]
    })
}

export function useComponentGap(
    size: MaybeRefOrGetter<Size5 | undefined>,
    defaultSize: Size5 = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return COMPONENT_GAP_CLASSES[value ?? defaultSize] ?? COMPONENT_GAP_CLASSES[defaultSize]
    })
}

export function useComponentMb(
    size: MaybeRefOrGetter<Size5 | undefined>,
    defaultSize: Size5 = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return COMPONENT_MB_CLASSES[value ?? defaultSize] ?? COMPONENT_MB_CLASSES[defaultSize]
    })
}

export function useComponentMt(
    size: MaybeRefOrGetter<Size5 | undefined>,
    defaultSize: Size5 = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return COMPONENT_MT_CLASSES[value ?? defaultSize] ?? COMPONENT_MT_CLASSES[defaultSize]
    })
}

export function useComponentPt(
    size: MaybeRefOrGetter<Size5 | undefined>,
    defaultSize: Size5 = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return COMPONENT_PT_CLASSES[value ?? defaultSize] ?? COMPONENT_PT_CLASSES[defaultSize]
    })
}

export function useMarginBottom(
    size: MaybeRefOrGetter<WithNone<Size3 | 'xl'> | undefined>,
    defaultSize: WithNone<Size3 | 'xl'> = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return MARGIN_BOTTOM_CLASSES[value ?? defaultSize] ?? MARGIN_BOTTOM_CLASSES[defaultSize]
    })
}

export interface SpacingClasses {
    cardPadding: string
    sectionPy: string
    space: string
    gap: string
    mb: string
    mt: string
    pt: string
}

export function useSpacing(
    size: MaybeRefOrGetter<Size3 | undefined>,
    defaultSize: Size3 = 'md'
): SpacingClasses {
    const sizeValue = computed(() => toValue(size) ?? defaultSize)

    return {
        cardPadding: CARD_PADDING_CLASSES[sizeValue.value] ?? CARD_PADDING_CLASSES[defaultSize],
        sectionPy: SECTION_PADDING_CLASSES[sizeValue.value] ?? SECTION_PADDING_CLASSES[defaultSize],
        space: COMPONENT_SPACE_CLASSES[sizeValue.value] ?? COMPONENT_SPACE_CLASSES[defaultSize],
        gap: COMPONENT_GAP_CLASSES[sizeValue.value] ?? COMPONENT_GAP_CLASSES[defaultSize],
        mb: COMPONENT_MB_CLASSES[sizeValue.value] ?? COMPONENT_MB_CLASSES[defaultSize],
        mt: COMPONENT_MT_CLASSES[sizeValue.value] ?? COMPONENT_MT_CLASSES[defaultSize],
        pt: COMPONENT_PT_CLASSES[sizeValue.value] ?? COMPONENT_PT_CLASSES[defaultSize],
    }
}
