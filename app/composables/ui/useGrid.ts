import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { GridCols, GridGap } from '~/types/ui'

export const GRID_COLS_MAP: Record<GridCols, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
}

export const GRID_MD_COLS_MAP: Record<GridCols, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    6: 'md:grid-cols-6',
    12: 'md:grid-cols-12',
}

export const GRID_LG_COLS_MAP: Record<GridCols, string> = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    6: 'lg:grid-cols-6',
    12: 'lg:grid-cols-12',
}

export const GRID_XL_COLS_MAP: Record<GridCols, string> = {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
    6: 'xl:grid-cols-6',
    12: 'xl:grid-cols-12',
}

export const GRID_GAP_MAP: Record<GridGap, string> = {
    xs: 'gap-component-xs',
    sm: 'gap-component-sm',
    md: 'gap-component-md',
    lg: 'gap-component-lg',
    xl: 'gap-component-xl',
}

export const GRID_ALIGN_MAP: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
}

export interface UseGridOptions {
    cols: MaybeRefOrGetter<GridCols | undefined>
    md?: MaybeRefOrGetter<GridCols | undefined>
    lg?: MaybeRefOrGetter<GridCols | undefined>
    xl?: MaybeRefOrGetter<GridCols | undefined>
    gap?: MaybeRefOrGetter<GridGap | undefined>
    align?: MaybeRefOrGetter<string | undefined>
}

export function useGridClasses(options: UseGridOptions) {
    return computed(() => {
        const cols = toValue(options.cols) ?? 1
        const md = toValue(options.md)
        const lg = toValue(options.lg)
        const xl = toValue(options.xl)
        const gap = toValue(options.gap) ?? 'md'
        const align = toValue(options.align) ?? 'stretch'

        const classes = [
            'grid',
            GRID_COLS_MAP[cols],
            GRID_GAP_MAP[gap],
            GRID_ALIGN_MAP[align] || GRID_ALIGN_MAP.stretch,
        ]

        if (md) classes.push(GRID_MD_COLS_MAP[md])
        if (lg) classes.push(GRID_LG_COLS_MAP[lg])
        if (xl) classes.push(GRID_XL_COLS_MAP[xl])

        return classes
    })
}
