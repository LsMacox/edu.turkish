export type H3Event = Record<string, any>

type MaybeEvent = Partial<H3Event> & {
  query?: Record<string, any>
  req?: { url?: string }
  node?: { req?: { url?: string } }
}

const parseQueryString = (url?: string) => {
  if (!url) return {}
  try {
    const parsed = new URL(url, 'http://localhost')
    return Array.from(parsed.searchParams.entries()).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        acc[key] = value
        return acc
      },
      {},
    )
  } catch {
    return {}
  }
}

export const getQuery = (event?: MaybeEvent) => {
  if (!event) return {}
  if (event.query && typeof event.query === 'object') {
    return event.query
  }
  const url = event.req?.url || event.node?.req?.url
  if (url) {
    return parseQueryString(url)
  }
  return {}
}
