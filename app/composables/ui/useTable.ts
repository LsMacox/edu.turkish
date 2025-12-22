import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { TableCellSize, TableCellAlign } from '~/types/ui'
import { TABLE_CELL_PADDING_CLASSES } from './tokens/spacing'

export const TABLE_ALIGN_MAP: Record<TableCellAlign, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
}

export const TABLE_HEADER_BG_MAP: Record<string, string> = {
    default: 'bg-white',
    background: 'bg-background',
    none: '',
}

export function useTableCellClasses(options: {
    size: MaybeRefOrGetter<TableCellSize | undefined>
    align?: MaybeRefOrGetter<TableCellAlign | undefined>
}) {
    return computed(() => {
        const size = toValue(options.size) ?? 'md'
        const align = toValue(options.align) ?? 'left'

        // Map lg to md if it's not in the padding map
        const effectiveSize = (size === 'lg' ? 'md' : size) as keyof typeof TABLE_CELL_PADDING_CLASSES

        return [
            TABLE_CELL_PADDING_CLASSES[effectiveSize] ?? TABLE_CELL_PADDING_CLASSES.md,
            TABLE_ALIGN_MAP[align] ?? TABLE_ALIGN_MAP.left,
        ].join(' ')
    })
}

export function useTableHeaderClasses(options: {
    bg: MaybeRefOrGetter<string | undefined>
}) {
    return computed(() => {
        const bg = toValue(options.bg) ?? 'background'
        return TABLE_HEADER_BG_MAP[bg] ?? TABLE_HEADER_BG_MAP.background
    })
}
