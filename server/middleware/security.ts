/**
 * Security middleware - minimal version since security headers are handled by Caddy
 * Only handles application-specific security logic if needed
 */
export default defineEventHandler(async (event) => {
  
  if (event.node.req.method === 'GET') {
    const url = getRequestURL(event)
    
    if (url.pathname.startsWith('/api/') || url.pathname.includes('dynamic')) {
      setHeader(event, 'Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com *.yandex.ru *.yandex.net; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: *.directus.app *.amazonaws.com *.yandex.net; connect-src 'self' *.google-analytics.com *.yandex.ru *.yandex.net; frame-src 'self' *.youtube.com *.vimeo.com")
    }
  }
})
