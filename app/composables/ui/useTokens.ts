import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { SemanticColor, BorderColor, RingColor } from '~/types/ui'
import {
    SEMANTIC_TEXT_COLORS,
    SEMANTIC_BG_COLORS,
    SEMANTIC_BG_SOFT_COLORS,
    BORDER_COLOR_CLASSES,
    RING_CLASSES,
} from './tokens'

export function useSemanticTextColor(color: MaybeRefOrGetter<SemanticColor>) {
    return computed(() => {
        const c = toValue(color)
        return SEMANTIC_TEXT_COLORS[c] || ''
    })
}

export function useBgColor(color: MaybeRefOrGetter<SemanticColor>, variant: 'solid' | 'soft' = 'solid') {
    return computed(() => {
        const c = toValue(color)
        return variant === 'solid' ? SEMANTIC_BG_COLORS[c] : SEMANTIC_BG_SOFT_COLORS[c]
    })
}

export function useBorderColor(color: MaybeRefOrGetter<BorderColor>) {
    return computed(() => {
        const c = toValue(color)
        return BORDER_COLOR_CLASSES[c]
    })
}

export function useRingClasses(color: MaybeRefOrGetter<RingColor>) {
    return computed(() => {
        const c = toValue(color)
        return RING_CLASSES[c]
    })
}
