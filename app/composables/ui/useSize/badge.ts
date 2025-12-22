import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { Size5 } from '~/types/ui'
import { ICON_SIZES } from './icon'

export interface BadgeSizeClasses {
    container: string
    icon: string
    dot: string
    removeButton: string
    removeIcon: string
}

export const BADGE_SIZE_MAP: Record<Size5, BadgeSizeClasses> = {
    xs: {
        container: 'px-1.5 py-0 text-[10px]',
        icon: ICON_SIZES.xs,
        dot: 'w-1 h-1',
        removeButton: ICON_SIZES.xs,
        removeIcon: 'w-1.5 h-1.5',
    },
    sm: {
        container: 'px-2 py-0.5 text-xs',
        icon: ICON_SIZES.xs,
        dot: 'w-1.5 h-1.5',
        removeButton: ICON_SIZES.xs,
        removeIcon: 'w-2 h-2',
    },
    md: {
        container: 'px-2 py-1 text-xs',
        icon: ICON_SIZES.xs,
        dot: 'w-2 h-2',
        removeButton: ICON_SIZES.xs,
        removeIcon: 'w-2 h-2',
    },
    lg: {
        container: 'px-3 py-1 text-sm',
        icon: ICON_SIZES.sm,
        dot: 'w-2.5 h-2.5',
        removeButton: ICON_SIZES.sm,
        removeIcon: ICON_SIZES.xs,
    },
    xl: {
        container: 'px-4 py-1.5 text-base',
        icon: ICON_SIZES.md,
        dot: 'w-3 h-3',
        removeButton: ICON_SIZES.md,
        removeIcon: ICON_SIZES.sm,
    },
}

export function useBadgeSizeClasses(
    size: MaybeRefOrGetter<Size5 | undefined>,
    defaultSize: Size5 = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return BADGE_SIZE_MAP[value ?? defaultSize] ?? BADGE_SIZE_MAP[defaultSize]
    })
}

export interface IconBadgeSizeClasses {
    container: string
    icon: string
}

export const ICON_BADGE_SIZE_MAP: Record<Size5, IconBadgeSizeClasses> = {
    xs: { container: 'w-10 h-10', icon: 'text-icon-sm' },
    sm: { container: 'w-12 h-12', icon: 'text-icon' },
    md: { container: 'w-16 h-16', icon: 'text-icon-lg' },
    lg: { container: 'w-20 h-20', icon: 'text-icon-xl' },
    xl: { container: 'w-24 h-24', icon: 'text-icon-2xl' },
}

export function useIconBadgeSizeClasses(
    size: MaybeRefOrGetter<Size5 | undefined>,
    defaultSize: Size5 = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return ICON_BADGE_SIZE_MAP[value ?? defaultSize] ?? ICON_BADGE_SIZE_MAP[defaultSize]
    })
}
