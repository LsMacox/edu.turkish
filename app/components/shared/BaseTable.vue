<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead :class="headerBgClass">
        <tr>
          <th
            v-for="column in columns"
            :key="String(column.key)"
            :class="[
              getCellClasses(column.align),
              'font-semibold text-secondary',
              column.headerClass,
            ]"
            :style="column.width ? { width: column.width } : undefined"
          >
            <slot :name="`header-${String(column.key)}`" :column="column">
              {{ column.label }}
            </slot>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr
          v-for="(row, index) in data"
          :key="index"
          :class="[
            striped && index % 2 === 1 ? 'bg-surface' : '',
            hoverable ? 'hover:bg-surface transition-colors' : '',
          ]"
        >
          <td
            v-for="column in columns"
            :key="String(column.key)"
            :class="[
              getCellClasses(column.align),
              column.cellClass,
            ]"
          >
            <slot :name="`cell-${String(column.key)}`" :row="row" :value="getCellValue(row, column.key)" :index="index">
              {{ getCellValue(row, column.key) }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts" generic="T">
import type { TableColumn, TableCellSize, TableCellAlign } from '~/types/ui'

interface Props {
  columns: TableColumn<T>[]
  data: T[]
  cellSize?: TableCellSize
  striped?: boolean
  hoverable?: boolean
  headerBg?: 'default' | 'background' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  cellSize: 'md',
  striped: true,
  hoverable: false,
  headerBg: 'background',
})

const getCellClasses = (align: TableCellAlign = 'left') => useTableCellClasses({
  size: () => props.cellSize,
  align: () => align,
}).value

const headerBgClass = useTableHeaderClasses({
  bg: () => props.headerBg,
})

function getCellValue(row: T, key: keyof T | string): unknown {
  return (row as Record<string, unknown>)[key as string]
}
</script>
