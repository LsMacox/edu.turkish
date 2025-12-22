import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { Size5 } from '~/types/ui'

export const ICON_SIZES = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
    '2xl': 'w-8 h-8',
} as const

export type IconSizeKey = keyof typeof ICON_SIZES

export interface IconContainerSizeClasses {
    container: string
    text: string
}

export const ICON_CONTAINER_SIZE_MAP: Record<Size5, IconContainerSizeClasses> = {
    xs: { container: 'icon-container-xs', text: 'text-icon-xs' },
    sm: { container: 'icon-container-sm', text: 'text-icon-sm' },
    md: { container: 'icon-container-md', text: 'text-icon' },
    lg: { container: 'icon-container-lg', text: 'text-icon-lg' },
    xl: { container: 'icon-container-xl', text: 'text-icon-xl' },
}

export function useIconContainerSizeClasses(
    size: MaybeRefOrGetter<Size5 | undefined>,
    defaultSize: Size5 = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return ICON_CONTAINER_SIZE_MAP[value ?? defaultSize] ?? ICON_CONTAINER_SIZE_MAP[defaultSize]
    })
}

export interface IconTextSizeClasses {
    icon: string
    text: string
}

export const ICON_TEXT_SIZE_MAP: Record<Size5, IconTextSizeClasses> = {
    xs: { icon: ICON_SIZES.xs, text: 'text-xs' },
    sm: { icon: ICON_SIZES.sm, text: 'text-sm' },
    md: { icon: ICON_SIZES.md, text: 'text-base' },
    lg: { icon: ICON_SIZES.lg, text: 'text-lg' },
    xl: { icon: ICON_SIZES.xl, text: 'text-xl' },
}

export function useIconTextSizeClasses(
    size: MaybeRefOrGetter<Size5 | undefined>,
    defaultSize: Size5 = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return ICON_TEXT_SIZE_MAP[value ?? defaultSize] ?? ICON_TEXT_SIZE_MAP[defaultSize]
    })
}

export interface IconButtonSizeClasses {
    container: string
    icon: string
}

export const ICON_BUTTON_SIZE_MAP: Record<Size5, IconButtonSizeClasses> = {
    xs: { container: 'w-8 h-8 min-w-[32px] min-h-[32px] md:w-6 md:h-6 md:min-w-[24px] md:min-h-[24px]', icon: 'w-4 h-4 md:w-3 md:h-3' },
    sm: { container: 'w-10 h-10 min-w-[40px] min-h-[40px] md:w-8 md:h-8 md:min-w-[32px] md:min-h-[32px]', icon: 'w-5 h-5 md:w-4 md:h-4' },
    md: { container: 'w-11 h-11 min-w-[44px] min-h-[44px] md:w-10 md:h-10 md:min-w-[40px] md:min-h-[40px]', icon: 'w-6 h-6 md:w-5 md:h-5' },
    lg: { container: 'w-12 h-12 min-w-[48px] min-h-[48px]', icon: ICON_SIZES.lg },
    xl: { container: 'w-14 h-14 min-w-[56px] min-h-[56px]', icon: ICON_SIZES.xl },
}

export function useIconButtonSizeClasses(
    size: MaybeRefOrGetter<Size5 | undefined>,
    defaultSize: Size5 = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return ICON_BUTTON_SIZE_MAP[value ?? defaultSize] ?? ICON_BUTTON_SIZE_MAP[defaultSize]
    })
}
