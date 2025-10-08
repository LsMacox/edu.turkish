/**
 * Contract Test: CDN URL Transformation
 * 
 * Validates the contract between asset paths and CDN URLs
 * This is a client-side transformation contract, not an API contract
 */

import { describe, it, expect } from 'vitest'
import { toCdnUrl } from '~/utils/cdn'

describe('CDN Transformation Contract', () => {
  const CDN_BASE = 'https://cdn.edu-turkish.com'

  describe('Path Normalization Contract', () => {
    it('MUST remove leading slash from absolute paths', () => {
      const result = toCdnUrl('/images/logo.png', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png')
    })

    it('MUST handle relative paths without leading slash', () => {
      const result = toCdnUrl('images/logo.png', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png')
    })

    it('MUST remove /public/ prefix if present', () => {
      const result = toCdnUrl('/public/images/logo.png', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png')
    })

    it('MUST NOT create double slashes', () => {
      const result = toCdnUrl('/images/logo.png', CDN_BASE)
      expect(result).not.toContain('//')
      expect(result).toContain('https://')
    })
  })

  describe('Query Parameters Contract', () => {
    it('MUST preserve query parameters', () => {
      const result = toCdnUrl('/images/logo.png?v=123', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png?v=123')
    })

    it('MUST preserve multiple query parameters', () => {
      const result = toCdnUrl('/images/logo.png?v=123&size=large', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png?v=123&size=large')
    })

    it('MUST preserve hash fragments', () => {
      const result = toCdnUrl('/images/logo.png#section', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png#section')
    })

    it('MUST preserve query params and hash together', () => {
      const result = toCdnUrl('/images/logo.png?v=123#section', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png?v=123#section')
    })
  })

  describe('CDN Disabled Contract', () => {
    it('MUST return original path when CDN URL is empty', () => {
      const result = toCdnUrl('/images/logo.png', '')
      expect(result).toBe('/images/logo.png')
    })

    it('MUST return original relative path when CDN URL is empty', () => {
      const result = toCdnUrl('images/logo.png', '')
      expect(result).toBe('images/logo.png')
    })
  })

  describe('Already Absolute URL Contract', () => {
    it('MUST NOT transform already absolute HTTP URLs', () => {
      const absoluteUrl = 'http://other-cdn.com/image.png'
      const result = toCdnUrl(absoluteUrl, CDN_BASE)
      expect(result).toBe(absoluteUrl)
    })

    it('MUST NOT transform already absolute HTTPS URLs', () => {
      const absoluteUrl = 'https://other-cdn.com/image.png'
      const result = toCdnUrl(absoluteUrl, CDN_BASE)
      expect(result).toBe(absoluteUrl)
    })

    it('MUST NOT transform data URLs', () => {
      const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANS'
      const result = toCdnUrl(dataUrl, CDN_BASE)
      expect(result).toBe(dataUrl)
    })
  })

  describe('Edge Cases Contract', () => {
    it('MUST handle empty path', () => {
      const result = toCdnUrl('', CDN_BASE)
      expect(result).toBe('')
    })

    it('MUST handle path with special characters', () => {
      const result = toCdnUrl('/images/файл.png', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/файл.png')
    })

    it('MUST handle path with spaces (preserved)', () => {
      const result = toCdnUrl('/images/my logo.png', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/my logo.png')
    })

    it('MUST handle CDN URL with trailing slash', () => {
      const result = toCdnUrl('/images/logo.png', 'https://cdn.edu-turkish.com/')
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png')
    })
  })

  describe('Real-World Paths Contract', () => {
    it('MUST transform university images correctly', () => {
      const result = toCdnUrl('/images/universities/istanbul-university.jpg', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/universities/istanbul-university.jpg')
    })

    it('MUST transform review images correctly', () => {
      const result = toCdnUrl('/images/reviews/student-photo.jpg', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/images/reviews/student-photo.jpg')
    })

    it('MUST transform review videos correctly', () => {
      const result = toCdnUrl('/videos/reviews/campus-tour.mp4', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/videos/reviews/campus-tour.mp4')
    })

    it('MUST transform any public asset correctly', () => {
      const result = toCdnUrl('/documents/brochure.pdf', CDN_BASE)
      expect(result).toBe('https://cdn.edu-turkish.com/documents/brochure.pdf')
    })
  })

  describe('Idempotency Contract', () => {
    it('MUST be idempotent - same input produces same output', () => {
      const path = '/images/logo.png'
      const result1 = toCdnUrl(path, CDN_BASE)
      const result2 = toCdnUrl(path, CDN_BASE)
      expect(result1).toBe(result2)
    })

    it('MUST NOT double-transform CDN URLs', () => {
      const cdnUrl = 'https://cdn.edu-turkish.com/images/logo.png'
      const result = toCdnUrl(cdnUrl, CDN_BASE)
      expect(result).toBe(cdnUrl)
      expect(result).not.toContain('cdn.edu-turkish.com/cdn.edu-turkish.com')
    })
  })

  describe('Type Safety Contract', () => {
    it('MUST accept string paths', () => {
      const result = toCdnUrl('/images/logo.png', CDN_BASE)
      expect(typeof result).toBe('string')
    })

    it('MUST return string URLs', () => {
      const result = toCdnUrl('/images/logo.png', CDN_BASE)
      expect(typeof result).toBe('string')
    })
  })
})
