import type { SORT_OPTIONS } from './constants'

export type SortOption = (typeof SORT_OPTIONS)[number]

// Base filter fields shared between internal state and URL
interface BaseFilters {
    q: string
    city: string
    langs: string[]
    type: string
    level: string
}

// Internal filter state (price as tuple)
export interface Filters extends BaseFilters {
    price: [number, number]
}

// URL serialization format (price split into min/max, includes sort)
export interface UniversityUrlFilters extends BaseFilters {
    price_min: number
    price_max: number
    sort: SortOption
}

export interface FetchOpts {
    limit?: number
    page?: number
    overrides?: Partial<Filters> & { sort?: SortOption }
}
