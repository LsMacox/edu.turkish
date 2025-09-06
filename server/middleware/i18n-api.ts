interface LanguagePreference {
  code: string
  quality: number
}

const SUPPORTED_LOCALES = ['en', 'ru', 'kk', 'kz', 'tr']
const DEFAULT_LOCALE = 'ru'

export default defineEventHandler(async (event) => {
  // Skip non-API routes
  if (!event.node.req.url?.startsWith('/api/')) {
    return
  }

  // Detect language from various sources
  const locale = detectLanguage(event)
  
  // Set context for database queries
  event.context.locale = locale
  
  // Set response headers
  setHeader(event, 'Content-Language', locale)
  setHeader(event, 'Vary', 'Accept-Language')
})

function detectLanguage(event: any): string {
  // 1. Query parameter has highest priority
  const queryLang = getQuery(event).lang as string
  if (queryLang && SUPPORTED_LOCALES.includes(queryLang)) {
    return queryLang === 'kz' ? 'kk' : queryLang
  }

  // 2. Accept-Language header
  const acceptLang = getHeader(event, 'Accept-Language')
  if (acceptLang) {
    const preferred = parseAcceptLanguageSimple(acceptLang)
    for (const lang of preferred) {
      // Check both full code and base language
      const baseCode = lang.split('-')[0]
      if (SUPPORTED_LOCALES.includes(lang)) {
        return lang === 'kz' ? 'kk' : lang
      }
      if (SUPPORTED_LOCALES.includes(baseCode)) {
        return baseCode === 'kz' ? 'kk' : baseCode
      }
    }
  }

  // 3. Default fallback
  return DEFAULT_LOCALE
}

function parseAcceptLanguageSimple(acceptLang: string): string[] {
  return acceptLang
    .split(',')
    .map(lang => {
      const [code] = lang.trim().split(';')
      return code.toLowerCase()
    })
    .filter(Boolean)
}