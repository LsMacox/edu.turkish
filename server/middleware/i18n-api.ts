import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale } from '~~/server/utils/locale'

export default defineEventHandler(async (event) => {
  if (!event.node.req.url?.startsWith('/api/')) {
    return
  }

  const locale = detectLanguage(event)

  event.context.locale = locale

  setHeader(event, 'Content-Language', locale)
  setHeader(event, 'Vary', 'Accept-Language')
})

function detectLanguage(event: any): SupportedLocale {
  const queryLang = getQuery(event).lang as string
  if (queryLang && SUPPORTED_LOCALES.includes(queryLang as SupportedLocale)) {
    return queryLang as SupportedLocale
  }

  const acceptLang = getHeader(event, 'Accept-Language')
  if (acceptLang) {
    const preferred = parseAcceptLanguageSimple(acceptLang)
    for (const lang of preferred) {
      const baseCode = lang.split('-')[0]
      if (SUPPORTED_LOCALES.includes(lang as SupportedLocale)) {
        return lang as SupportedLocale
      }
      if (SUPPORTED_LOCALES.includes(baseCode as SupportedLocale)) {
        return baseCode as SupportedLocale
      }
    }
  }

  return DEFAULT_LOCALE
}

function parseAcceptLanguageSimple(acceptLang: string): string[] {
  return acceptLang
    .split(',')
    .map((lang) => {
      const [code] = lang.trim().split(';')
      return code?.toLowerCase()
    })
    .filter((code): code is string => Boolean(code))
}
