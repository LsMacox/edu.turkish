/**
 * Transform asset path to CDN URL
 * 
 * @param path - Asset path (absolute or relative, e.g., '/images/logo.png' or 'images/logo.png')
 * @param cdnBaseUrl - CDN base URL from runtime config (e.g., 'https://cdn.edu-turkish.com')
 * @returns CDN URL or original path if CDN is disabled
 * 
 * @example
 * ```ts
 * toCdnUrl('/images/logo.png', 'https://cdn.edu-turkish.com')
 * // Returns: 'https://cdn.edu-turkish.com/images/logo.png'
 * 
 * toCdnUrl('/images/logo.png', '')
 * // Returns: '/images/logo.png' (CDN disabled)
 * ```
 */
export function toCdnUrl(path: string, cdnBaseUrl: string): string {
  // Return empty string if path is empty
  if (!path) {
    return ''
  }

  // Return original path if CDN is disabled (empty base URL)
  if (!cdnBaseUrl) {
    return path
  }

  // Return as-is if already an absolute URL (http://, https://, data:)
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path
  }

  // Normalize the path
  let normalizedPath = path

  // Remove /public/ prefix if present
  if (normalizedPath.startsWith('/public/')) {
    normalizedPath = normalizedPath.substring('/public/'.length)
  } else if (normalizedPath.startsWith('public/')) {
    normalizedPath = normalizedPath.substring('public/'.length)
  }

  // Remove leading slash if present
  if (normalizedPath.startsWith('/')) {
    normalizedPath = normalizedPath.substring(1)
  }

  // Normalize CDN base URL (remove trailing slash if present)
  let normalizedCdnBase = cdnBaseUrl
  if (normalizedCdnBase.endsWith('/')) {
    normalizedCdnBase = normalizedCdnBase.substring(0, normalizedCdnBase.length - 1)
  }

  // Construct CDN URL
  return `${normalizedCdnBase}/${normalizedPath}`
}
