import type { LocationQuery, Router, RouteLocationNormalizedLoaded } from 'vue-router'

/**
 * Configuration for a single filter field
 */
export interface FilterFieldConfig<T> {
  /** URL query parameter name */
  queryKey: string
  /** Default value when not present in URL */
  defaultValue: T
  /** Parse value from URL query string */
  parse: (value: string | string[] | undefined) => T
  /** Serialize value to URL query string (return undefined to omit from URL) */
  serialize: (value: T, defaultValue: T) => string | string[] | undefined
}

/**
 * Options for useUrlFilters composable
 */
export interface UseUrlFiltersOptions<T extends object> {
  /** Filter field configurations */
  fields: { [K in keyof T]: FilterFieldConfig<T[K]> }
  /** Callback when filters change from URL navigation */
  onRouteChange?: (filters: T) => void | Promise<void>
  /** Whether to use router.push (scrolls to top) or router.replace (preserves scroll) */
  useRouterPush?: boolean
  /** Preserve scroll position when using replace (default: true) */
  preserveScroll?: boolean
}

/**
 * Helper functions for common filter types
 */
export const filterParsers = {
  /** Parse string value */
  string: (defaultValue = '') => ({
    parse: (v: string | string[] | undefined): string =>
      typeof v === 'string' ? v : Array.isArray(v) ? v[0] || defaultValue : defaultValue,
    serialize: (v: string, def: string): string | undefined => (v && v !== def ? v : undefined),
  }),

  /** Parse number value */
  number: (defaultValue = 0) => ({
    parse: (v: string | string[] | undefined): number => {
      const str = typeof v === 'string' ? v : Array.isArray(v) ? v[0] : undefined
      const num = str ? Number(str) : NaN
      return Number.isFinite(num) ? num : defaultValue
    },
    serialize: (v: number, def: number): string | undefined => (v !== def ? String(v) : undefined),
  }),

  /** Parse positive integer (e.g., page number) */
  positiveInt: (defaultValue = 1) => ({
    parse: (v: string | string[] | undefined): number => {
      const str = typeof v === 'string' ? v : Array.isArray(v) ? v[0] : undefined
      const num = str ? Number(str) : NaN
      return Number.isFinite(num) && num > 0 ? Math.floor(num) : defaultValue
    },
    serialize: (v: number, def: number): string | undefined => (v > def ? String(v) : undefined),
  }),

  /** Parse string array */
  stringArray: () => ({
    parse: (v: string | string[] | undefined): string[] => (v ? (Array.isArray(v) ? v : [v]) : []),
    serialize: (v: string[], _def: string[]): string[] | undefined =>
      v.length > 0 ? v : undefined,
  }),

  /** Parse number range [min, max] */
  numberRange: (defaultMin: number, defaultMax: number) => ({
    parse: (_v: string | string[] | undefined): [number, number] => {
      // This parser is special - it expects two separate query params
      // Use with custom serialize/parse in the field config
      return [defaultMin, defaultMax]
    },
    serialize: (_v: [number, number], _def: [number, number]): string | undefined => {
      // Range serialization is handled separately for min/max
      return undefined
    },
  }),

  /** Parse enum value with validation */
  enum: <T extends string>(validValues: readonly T[], defaultValue: T) => ({
    parse: (v: string | string[] | undefined): T => {
      const str = typeof v === 'string' ? v : Array.isArray(v) ? v[0] : undefined
      return str && (validValues as readonly string[]).includes(str) ? (str as T) : defaultValue
    },
    serialize: (v: T, def: T): string | undefined => (v !== def ? v : undefined),
  }),
}

/**
 * Create a filter field configuration
 */
export function defineFilterField<T>(
  queryKey: string,
  defaultValue: T,
  parser: {
    parse: (v: string | string[] | undefined) => T
    serialize: (v: T, def: T) => string | string[] | undefined
  },
): FilterFieldConfig<T> {
  return {
    queryKey,
    defaultValue,
    parse: parser.parse,
    serialize: parser.serialize,
  }
}

/**
 * Universal composable for URL filter synchronization
 */
export function useUrlFilters<T extends object>(options: UseUrlFiltersOptions<T>) {
  const route = useRoute() as RouteLocationNormalizedLoaded
  const router = useRouter() as Router

  const { fields, onRouteChange, preserveScroll = true } = options

  const isUpdatingRoute = ref(false)
  const useRouterPush = ref(options.useRouterPush ?? false)

  /**
   * Get default filter values
   */
  const getDefaults = (): T => {
    const defaults = {} as T
    for (const key in fields) {
      defaults[key] = fields[key].defaultValue as T[typeof key]
    }
    return defaults
  }

  /**
   * Parse filters from current route query
   */
  const parseFromRoute = (query: LocationQuery = route.query): T => {
    const result = {} as T
    for (const key in fields) {
      const config = fields[key]
      result[key] = config.parse(
        query[config.queryKey] as string | string[] | undefined,
      ) as T[typeof key]
    }
    return result
  }

  /**
   * Serialize filters to route query object
   */
  const serializeToQuery = (
    filters: T,
    defaults: T = getDefaults(),
  ): Record<string, string | string[]> => {
    const query: Record<string, string | string[]> = {}

    for (const key in fields) {
      const config = fields[key]
      const serialized = config.serialize(filters[key], defaults[key])
      if (serialized !== undefined) {
        query[config.queryKey] = serialized
      }
    }

    return query
  }

  /**
   * Sync current filter state to URL
   */
  const syncToUrl = (currentState: T, overrides: Partial<T> = {}, opts?: { push?: boolean }) => {
    if (isUpdatingRoute.value) return

    const merged = { ...currentState, ...overrides }
    const query = serializeToQuery(merged)

    isUpdatingRoute.value = true

    const shouldPush = opts?.push ?? useRouterPush.value

    if (shouldPush) {
      router.push({ query }).finally(() => {
        nextTick(() => {
          isUpdatingRoute.value = false
          useRouterPush.value = false
        })
      })
    } else {
      const scrollY = preserveScroll && typeof window !== 'undefined' ? window.scrollY : 0

      router.replace({ query }).finally(() => {
        if (preserveScroll && typeof window !== 'undefined') {
          requestAnimationFrame(() => window.scrollTo(0, scrollY))
        }
        nextTick(() => {
          isUpdatingRoute.value = false
        })
      })
    }
  }

  /**
   * Check if filters have changed
   */
  const hasChanged = (a: T, b: T): boolean => {
    for (const key in fields) {
      const valA = a[key]
      const valB = b[key]

      if (Array.isArray(valA) && Array.isArray(valB)) {
        if (valA.length !== valB.length || valA.some((v, i) => v !== valB[i])) {
          return true
        }
      } else if (valA !== valB) {
        return true
      }
    }
    return false
  }

  /**
   * Watch for route query changes and invoke callback
   */
  const watchRouteChanges = (callback?: (filters: T) => void | Promise<void>) => {
    watch(
      () => route.query,
      async (newQuery) => {
        if (isUpdatingRoute.value) return

        const filters = parseFromRoute(newQuery)
        const handler = callback ?? onRouteChange
        if (handler) {
          await handler(filters)
        }
      },
    )
  }

  /**
   * Set whether next sync should use push (scroll to top)
   */
  const setUseRouterPush = (value: boolean) => {
    useRouterPush.value = value
  }

  /**
   * Skip next URL sync (useful when initializing from URL)
   */
  const skipNextSync = ref(false)

  const syncToUrlWithSkip = (
    currentState: T,
    overrides: Partial<T> = {},
    opts?: { push?: boolean },
  ) => {
    if (skipNextSync.value) {
      skipNextSync.value = false
      return
    }
    syncToUrl(currentState, overrides, opts)
  }

  return {
    /** Whether route update is in progress */
    isUpdatingRoute: readonly(isUpdatingRoute),
    /** Get default filter values */
    getDefaults,
    /** Parse filters from route query */
    parseFromRoute,
    /** Serialize filters to query object */
    serializeToQuery,
    /** Sync filters to URL */
    syncToUrl,
    /** Sync filters to URL with skip support */
    syncToUrlWithSkip,
    /** Check if two filter states differ */
    hasChanged,
    /** Watch route changes */
    watchRouteChanges,
    /** Set whether to use push for next sync */
    setUseRouterPush,
    /** Skip next sync flag */
    skipNextSync,
  }
}

/**
 * Create a debounced search function
 */
export function createDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delayMs = 400,
): { debounced: T; clear: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null

  const debounced = ((...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => callback(...args), delayMs)
  }) as T

  const clear = () => {
    if (timer) clearTimeout(timer)
  }

  return { debounced, clear }
}
