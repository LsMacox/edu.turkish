import type { UniversityFilters as ApiFilters } from '~~/lib/types'
import type { Filters } from './types'
import { CITY_ALL, TYPE_ALL, LEVEL_ALL, VALID_LEVELS } from './constants'
import { filterParsers } from '~~/app/composables/useUrlFilters'

export function normalizeLevel(v?: string | null): string {
    const l = v?.trim().toLowerCase()
    return l && (VALID_LEVELS as readonly string[]).includes(l) ? l : LEVEL_ALL
}

export function createDefaultFilters(priceRange: [number, number]): Filters {
    return {
        q: '',
        city: CITY_ALL,
        langs: [],
        type: TYPE_ALL,
        level: LEVEL_ALL,
        price: [...priceRange] as [number, number],
    }
}

export function parseFiltersFromQuery(
    query: Record<string, unknown>,
    available: ApiFilters,
): Filters {
    if (!Object.keys(query).length) {
        return createDefaultFilters(available.priceRange as [number, number])
    }

    const parseStr = filterParsers.string('').parse
    const parseArr = filterParsers.stringArray().parse
    const [minDef, maxDef] = available.priceRange

    return {
        q: parseStr(query.q as string | string[] | undefined),
        city: parseStr(query.city as string | string[] | undefined) || CITY_ALL,
        langs: parseArr(query.langs as string | string[] | undefined),
        type: parseStr(query.type as string | string[] | undefined) || TYPE_ALL,
        level: normalizeLevel(parseStr(query.level as string | string[] | undefined)),
        price:
            query.price_min || query.price_max
                ? [Number(query.price_min) || minDef, Number(query.price_max) || maxDef]
                : [minDef, maxDef],
    }
}
