// Minimal Nuxt app composables mock for tests
export function useCookie<T = any>(name: string, _opts?: any) {
  const g = globalThis as any
  if (!g.__mockCookies__) g.__mockCookies__ = new Map<string, any>()
  const store: Map<string, any> = g.__mockCookies__
  return {
    get value(): T | null {
      return (store.has(name) ? store.get(name) : null) as T | null
    },
    set value(v: T | null) {
      if (v === null || v === undefined) store.delete(name)
      else store.set(name, v)
    },
  } as { value: T | null }
}

export function useRuntimeConfig() {
  return { public: {} }
}
