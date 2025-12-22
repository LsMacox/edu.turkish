import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { ButtonVariant } from '~/types/ui'
import { CORE_BUTTON_CLASSES } from './core'
import { CHIP_BUTTON_CLASSES } from './chip'
import { ICON_ACTION_CLASSES } from './icon'
import { SOCIAL_BUTTON_CLASSES } from './social'
import { TAB_BUTTON_CLASSES } from './tab'
import { SPECIALIZED_BUTTON_CLASSES } from './specialized'

export * from './core'
export * from './chip'
export * from './icon'
export * from './social'
export * from './tab'
export * from './specialized'

const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
    ...CORE_BUTTON_CLASSES,
    ...CHIP_BUTTON_CLASSES,
    ...ICON_ACTION_CLASSES,
    ...SOCIAL_BUTTON_CLASSES,
    ...TAB_BUTTON_CLASSES,
    ...SPECIALIZED_BUTTON_CLASSES,
}

export function useButtonVariantClasses(variant: MaybeRefOrGetter<ButtonVariant | undefined>) {
    return computed(() => {
        const v = toValue(variant) ?? 'primary'
        return BUTTON_VARIANT_CLASSES[v] ?? BUTTON_VARIANT_CLASSES.primary
    })
}
