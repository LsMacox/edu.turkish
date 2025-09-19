import type { PaginationMeta } from './common'
import type { University } from './universities'

export interface DirectionQueryParams {
  q?: string
  page?: number
  limit?: number
  lang?: string
}

export interface DirectionInfo {
  id: number
  name: string
  description: string
  slug: string
  universities_count: number
}

export interface DirectionResponse {
  data: DirectionInfo[]
  meta: PaginationMeta
}

export interface DirectionDetailResponse {
  direction: DirectionInfo
  universities: University[]
}
