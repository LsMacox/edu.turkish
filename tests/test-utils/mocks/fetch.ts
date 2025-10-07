import { vi } from 'vitest'

export type MockFetch = (url: string, options?: RequestInit) => Promise<any>

export function mockFetch(routes: Record<string, any> = {}): MockFetch {
  const fetchFn = vi.fn(async (url: string, options?: RequestInit) => {
    const method = options?.method?.toUpperCase() || 'GET'
    
    for (const [pattern, response] of Object.entries(routes)) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'))
      if (regex.test(url)) {
        if (typeof response === 'function') {
          return response(url, options)
        }
        return response
      }
    }
    
    throw new Error(`No mock response defined for ${method} ${url}`)
  })

  return fetchFn as unknown as MockFetch
}
