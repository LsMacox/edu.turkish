import { describe, it, expect } from 'vitest'
import { toCdnUrl } from '~/utils/cdn'

describe('toCdnUrl', () => {
  const CDN_BASE = 'https://cdn.edu-turkish.com'

  describe('Basic Transformation', () => {
    it('transforms absolute path to CDN URL', () => {
      const result = toCdnUrl('/images/logo.png', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png')
    })

    it('transforms relative path to CDN URL', () => {
      const result = toCdnUrl('images/logo.png', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png')
    })

    it('removes /public/ prefix', () => {
      const result = toCdnUrl('/public/images/logo.png', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png')
    })
  })

  describe('Query Parameters and Hash', () => {
    it('preserves query parameters', () => {
      const result = toCdnUrl('/images/logo.png?v=123', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png?v=123')
    })

    it('preserves hash fragment', () => {
      const result = toCdnUrl('/images/logo.png#section', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png#section')
    })

    it('preserves both query and hash', () => {
      const result = toCdnUrl('/images/logo.png?v=123#section', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png?v=123#section')
    })
  })

  describe('CDN Disabled', () => {
    it('returns original path when CDN URL is empty', () => {
      const result = toCdnUrl('/images/logo.png', '')
      expect(result).toBe('/images/logo.png')
    })

    it('returns original relative path when CDN URL is empty', () => {
      const result = toCdnUrl('images/logo.png', '')
      expect(result).toBe('images/logo.png')
    })
  })

  describe('Already Absolute URLs', () => {
    it('returns HTTP URLs as-is', () => {
      const url = 'http://other-cdn.com/image.png'
      const result = toCdnUrl(url, CDN_BASE)
      expect(result).toBe(url)
    })

    it('returns HTTPS URLs as-is', () => {
      const url = 'https://other-cdn.com/image.png'
      const result = toCdnUrl(url, CDN_BASE)
      expect(result).toBe(url)
    })

    it('returns data URLs as-is', () => {
      const url = 'data:image/png;base64,iVBORw0KGgoAAAANS'
      const result = toCdnUrl(url, CDN_BASE)
      expect(result).toBe(url)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty path', () => {
      const result = toCdnUrl('', CDN_BASE)
      expect(result).toBe('')
    })

    it('handles special characters', () => {
      const result = toCdnUrl('/images/файл.png', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/файл.png')
    })

    it('handles spaces in path', () => {
      const result = toCdnUrl('/images/my logo.png', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/my logo.png')
    })

    it('handles CDN URL with trailing slash', () => {
      const result = toCdnUrl('/images/logo.png', 'https://cdn.edu-turkish.com/')
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png')
    })

    it('prevents double slashes', () => {
      const result = toCdnUrl('/images/logo.png', CDN_BASE)
      expect(result).not.toMatch(/[^:]\/\//)
    })
  })

  describe('Idempotency', () => {
    it('is idempotent', () => {
      const path = '/images/logo.png'
      const result1 = toCdnUrl(path, CDN_BASE)
      const result2 = toCdnUrl(path, CDN_BASE)
      expect(result1).toBe(result2)
    })

    it('does not double-transform CDN URLs', () => {
      const cdnUrl = 'https://cdn.edu-turkish.com/images/logo.png'
      const result = toCdnUrl(cdnUrl, CDN_BASE)
      expect(result).toBe(cdnUrl)
    })
  })

  describe('Type Safety', () => {
    it('accepts string inputs', () => {
      const result = toCdnUrl('/images/logo.png', CDN_BASE)
      expect(typeof result).toBe('string')
    })

    it('returns string output', () => {
      const result = toCdnUrl('/images/logo.png', CDN_BASE)
      expect(typeof result).toBe('string')
    })
  })
})
