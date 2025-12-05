import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale } from '~~/lib/locales'

const isLocale = (v: string): v is SupportedLocale => SUPPORTED_LOCALES.includes(v as SupportedLocale)

export default defineEventHandler((event) => {
  if (!event.node.req.url?.startsWith('/api/')) return

  const locale = detectLanguage(event)
  event.context.locale = locale
  setHeader(event, 'Content-Language', locale)
  setHeader(event, 'Vary', 'Accept-Language')
})

function detectLanguage(event: Parameters<typeof defineEventHandler>[0] extends (e: infer E) => any ? E : never): SupportedLocale {
  const queryLang = getQuery(event).lang
  if (typeof queryLang === 'string' && isLocale(queryLang)) return queryLang

  const acceptLang = getHeader(event, 'Accept-Language')
  if (acceptLang) {
    for (const part of acceptLang.split(',')) {
      const code = part.split(';')[0]?.trim().toLowerCase()
      const base = code?.split('-')[0]
      if (code && isLocale(code)) return code
      if (base && isLocale(base)) return base
    }
  }

  return DEFAULT_LOCALE
}
