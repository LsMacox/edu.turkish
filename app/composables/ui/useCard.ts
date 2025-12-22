import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { BaseCardProps, CardVariant, Size5, WithNone, ShadowSemantic } from '~/types/ui'
import { CARD_PADDING_CLASSES } from './tokens/spacing'
import { useRoundedClasses } from './useSize'

export interface CardVariantDefaults {
    padding: WithNone<Size5>
    shadow: WithNone<Size5> | ShadowSemantic
    bordered: boolean
}

export const VARIANT_DEFAULTS: Record<CardVariant, CardVariantDefaults> = {
    default: { padding: 'md', shadow: 'md', bordered: false },
    surface: { padding: 'lg', shadow: 'md', bordered: false },
    bordered: { padding: 'md', shadow: 'sm', bordered: true },
}

export function useCardPaddingClasses(
    padding: MaybeRefOrGetter<WithNone<Size5> | undefined>,
    options: { defaultSize?: WithNone<Size5> } = {}
) {
    const { defaultSize = 'md' } = options

    return computed(() => {
        const value = toValue(padding)
        return CARD_PADDING_CLASSES[value ?? defaultSize] ?? CARD_PADDING_CLASSES[defaultSize]
    })
}

export function useCardBase(props: MaybeRefOrGetter<BaseCardProps>) {
    const propsValue = computed(() => toValue(props))

    const variantDefaults = computed(() => {
        const variant = propsValue.value.variant ?? 'default'
        return VARIANT_DEFAULTS[variant]
    })

    const effectivePadding = computed(
        () => propsValue.value.padding ?? variantDefaults.value!.padding
    )
    const effectiveShadow = computed(
        () => propsValue.value.shadow ?? variantDefaults.value!.shadow
    )
    const effectiveBordered = computed(
        () => propsValue.value.bordered ?? variantDefaults.value!.bordered
    )

    const paddingClasses = useCardPaddingClasses(() => effectivePadding.value)

    const borderRadiusClasses = useRoundedClasses(
        () => propsValue.value.rounded ?? 'lg',
        { context: 'card', defaultSize: 'lg' }
    )

    const headerClasses = computed(() => {
        return effectivePadding.value === 'none'
            ? 'px-4 py-3 border-b border-default'
            : 'border-b border-default pb-4 mb-4'
    })

    const contentClasses = computed(() => {
        return effectivePadding.value === 'none' ? 'px-4 py-3' : ''
    })

    const footerClasses = computed(() => {
        return effectivePadding.value === 'none'
            ? 'px-4 py-3 border-t border-default'
            : 'border-t border-default pt-4 mt-4'
    })

    return {
        variantDefaults,
        effectivePadding,
        effectiveShadow,
        effectiveBordered,
        paddingClasses,
        borderRadiusClasses,
        headerClasses,
        contentClasses,
        footerClasses,
    }
}
