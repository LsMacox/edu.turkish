/**
 * Debug middleware to log all webhook requests
 * Remove after debugging!
 */
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  
  // Only log webhook requests
  if (url.pathname.includes('/webhooks/espocrm')) {
    const method = getMethod(event)
    const headers = getHeaders(event)
    const query = getQuery(event)
    
    console.log('=== WEBHOOK DEBUG ===')
    console.log('Time:', new Date().toISOString())
    console.log('Method:', method)
    console.log('URL:', url.toString())
    console.log('Headers:', JSON.stringify(headers, null, 2))
    console.log('Query:', JSON.stringify(query, null, 2))
    
    if (method === 'POST') {
      try {
        const body = await readBody(event)
        console.log('Body:', JSON.stringify(body, null, 2))
      } catch (e) {
        console.log('Body read error:', e)
      }
    }
    console.log('==================')
  }
})
