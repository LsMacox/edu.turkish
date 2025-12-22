import type { Size } from '../common'

export type TableCellSize = Exclude<Size, 'xl'> | 'xs'
export type TableCellAlign = 'left' | 'center' | 'right'

export interface TableColumn<T = unknown> {
  key: keyof T | string
  label: string
  align?: TableCellAlign
  headerClass?: string
  cellClass?: string
  width?: string
}

export interface BaseTableProps<T = unknown> {
  columns: TableColumn<T>[]
  data: T[]
  cellSize?: TableCellSize
  striped?: boolean
  hoverable?: boolean
  headerBg?: 'default' | 'background' | 'none'
}
