import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { ShadowValue } from '~/types/ui'
import { SEMANTIC_SHADOW_CLASSES, SEMANTIC_SHADOW_INTERACTIVE } from './tokens/colors'
import { SHADOW_SIZE_MAP, type ShadowSize } from './tokens/shadows'

export interface ShadowClassesOptions {
    interactive?: boolean
    isHovered?: MaybeRefOrGetter<boolean>
}

// Types re-exported for convenience when importing from this file directly
// Note: SHADOW_SIZE_MAP and ShadowSize are also available from './tokens'

export function useShadowClasses(
    value: MaybeRefOrGetter<ShadowValue | undefined>,
    options: ShadowClassesOptions = {}
) {
    const { interactive = false, isHovered } = options

    return computed(() => {
        const rawValue = toValue(value)
        const semanticClasses = rawValue && SEMANTIC_SHADOW_CLASSES[rawValue as keyof typeof SEMANTIC_SHADOW_CLASSES]

        if (semanticClasses) {
            if (interactive && rawValue !== 'none' && rawValue !== 'hover') {
                const interactiveClasses = SEMANTIC_SHADOW_INTERACTIVE[rawValue as keyof typeof SEMANTIC_SHADOW_INTERACTIVE]
                if (interactiveClasses) {
                    return interactiveClasses
                }
            }
            return semanticClasses
        }

        const sizeValue = (rawValue as ShadowSize) ?? 'md'
        let baseClasses = SHADOW_SIZE_MAP[sizeValue] ?? SHADOW_SIZE_MAP.md

        if (interactive && isHovered && toValue(isHovered) && sizeValue !== 'none') {
            baseClasses += ' shadow-card-hover'
        }

        return baseClasses
    })
}
