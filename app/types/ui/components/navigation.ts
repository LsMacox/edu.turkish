export interface BasePaginationProps {
  page: number
  pageCount: number
  disabled?: boolean
  siblingCount?: number
  boundaryCount?: number
  alwaysShow?: boolean
}

export interface BasePaginationEvents {
  'update:page': [value: number]
}

