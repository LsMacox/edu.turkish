import type { LocationQuery, Router, RouteLocationNormalizedLoaded } from 'vue-router'

export interface FilterFieldConfig<T> {
  queryKey: string
  defaultValue: T
  parse: (value: string | string[] | undefined) => T
  serialize: (value: T, defaultValue: T) => string | string[] | undefined
}

export interface UseUrlFiltersOptions<T extends object> {
  fields: { [K in keyof T]: FilterFieldConfig<T[K]> }
  onRouteChange?: (filters: T) => void | Promise<void>
  useRouterPush?: boolean
  preserveScroll?: boolean
}

export const filterParsers = {
  string: (defaultValue = '') => ({
    parse: (v: string | string[] | undefined): string =>
      typeof v === 'string' ? v : Array.isArray(v) ? v[0] || defaultValue : defaultValue,
    serialize: (v: string, def: string): string | undefined => (v && v !== def ? v : undefined),
  }),

  number: (defaultValue = 0) => ({
    parse: (v: string | string[] | undefined): number => {
      const str = typeof v === 'string' ? v : Array.isArray(v) ? v[0] : undefined
      const num = str ? Number(str) : NaN
      return Number.isFinite(num) ? num : defaultValue
    },
    serialize: (v: number, def: number): string | undefined => (v !== def ? String(v) : undefined),
  }),

  positiveInt: (defaultValue = 1) => ({
    parse: (v: string | string[] | undefined): number => {
      const str = typeof v === 'string' ? v : Array.isArray(v) ? v[0] : undefined
      const num = str ? Number(str) : NaN
      return Number.isFinite(num) && num > 0 ? Math.floor(num) : defaultValue
    },
    serialize: (v: number, def: number): string | undefined => (v > def ? String(v) : undefined),
  }),

  stringArray: () => ({
    parse: (v: string | string[] | undefined): string[] => (v ? (Array.isArray(v) ? v : [v]) : []),
    serialize: (v: string[], _def: string[]): string[] | undefined =>
      v.length > 0 ? v : undefined,
  }),

  numberRange: (defaultMin: number, defaultMax: number) => ({
    parse: (_v: string | string[] | undefined): [number, number] => {
      return [defaultMin, defaultMax]
    },
    serialize: (_v: [number, number], _def: [number, number]): string | undefined => {
      return undefined
    },
  }),

  enum: <T extends string>(validValues: readonly T[], defaultValue: T) => ({
    parse: (v: string | string[] | undefined): T => {
      const str = typeof v === 'string' ? v : Array.isArray(v) ? v[0] : undefined
      return str && (validValues as readonly string[]).includes(str) ? (str as T) : defaultValue
    },
    serialize: (v: T, def: T): string | undefined => (v !== def ? v : undefined),
  }),
}

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

export function useUrlFilters<T extends object>(options: UseUrlFiltersOptions<T>) {
  const route = useRoute() as RouteLocationNormalizedLoaded
  const router = useRouter() as Router

  const { fields, onRouteChange, preserveScroll = true } = options

  const isUpdatingRoute = ref(false)
  const useRouterPush = ref(options.useRouterPush ?? false)

  const getDefaults = (): T => {
    const defaults = {} as T
    for (const key in fields) {
      defaults[key] = fields[key].defaultValue as T[typeof key]
    }
    return defaults
  }

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

  const setUseRouterPush = (value: boolean) => {
    useRouterPush.value = value
  }

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
    isUpdatingRoute: readonly(isUpdatingRoute),
    getDefaults,
    parseFromRoute,
    serializeToQuery,
    syncToUrl,
    syncToUrlWithSkip,
    hasChanged,
    watchRouteChanges,
    setUseRouterPush,
    skipNextSync,
  }
}

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
