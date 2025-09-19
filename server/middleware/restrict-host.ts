import { defineEventHandler, getRequestHeader, createError } from 'h3'

const envHosts = (process.env.ALLOWED_HOSTS || '').split(',').map(h => h.trim().toLowerCase()).filter(Boolean);
const ALLOWED_HOSTS = new Set<string>([
  'localhost:3000',
  '127.0.0.1:3000',
  '0.0.0.0:3000',
  'edu-turkish.com',
  'www.edu-turkish.com',
  ...envHosts,
])

export default defineEventHandler((event) => {
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  const forwardedHost = getRequestHeader(event, 'x-forwarded-host')
  const host = (forwardedHost || getRequestHeader(event, 'host') || '').toLowerCase()

  if (!ALLOWED_HOSTS.has(host)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden host' })
  }
})
