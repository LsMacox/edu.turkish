const SUPPORTED_LOCALES = ['en', 'ru', 'kk', 'kz', 'tr']
const DEFAULT_LOCALE = 'ru'

export default defineEventHandler(async (event) => {
  if (!event.node.req.url?.startsWith('/api/')) {
    return
  }

  const locale = detectLanguage(event)

  event.context.locale = locale

  setHeader(event, 'Content-Language', locale)
  setHeader(event, 'Vary', 'Accept-Language')
})

function detectLanguage(event: any): string {
  const queryLang = getQuery(event).lang as string
  if (queryLang && SUPPORTED_LOCALES.includes(queryLang)) {
    return queryLang === 'kz' ? 'kk' : queryLang
  }

  const acceptLang = getHeader(event, 'Accept-Language')
  if (acceptLang) {
    const preferred = parseAcceptLanguageSimple(acceptLang)
    for (const lang of preferred) {
      const baseCode = lang.split('-')[0]
      if (SUPPORTED_LOCALES.includes(lang)) {
        return lang === 'kz' ? 'kk' : lang
      }
      if (SUPPORTED_LOCALES.includes(baseCode)) {
        return baseCode === 'kz' ? 'kk' : baseCode
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
      return code.toLowerCase()
    })
    .filter(Boolean)
}
