import { describe, it, expect } from 'vitest'
import { useCdn } from '~/composables/useCdn'

// useRuntimeConfig is mocked globally in tests/setup.ts with cdnUrl

describe('useCdn', () => {
  describe('Composable Structure', () => {
    it('provides cdnUrl function', () => {
      const { cdnUrl } = useCdn()
      expect(cdnUrl).toBeDefined()
      expect(typeof cdnUrl).toBe('function')
    })
  })

  describe('Runtime Config Integration', () => {
    it('uses runtime config CDN URL', () => {
      const { cdnUrl } = useCdn()
      const result = cdnUrl('/images/logo.png')
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png')
    })

    it('transforms paths correctly', () => {
      const { cdnUrl } = useCdn()
      
      expect(cdnUrl('/images/logo.png')).toBe('https://cdn.edu-turkish.com/images/logo.png')
      expect(cdnUrl('images/logo.png')).toBe('https://cdn.edu-turkish.com/images/logo.png')
      expect(cdnUrl('/public/images/logo.png')).toBe('https://cdn.edu-turkish.com/images/logo.png')
    })

    it('preserves query parameters', () => {
      const { cdnUrl } = useCdn()
      const result = cdnUrl('/images/logo.png?v=123')
      expect(result).toBe('https://cdn.edu-turkish.com/images/logo.png?v=123')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty paths', () => {
      const { cdnUrl } = useCdn()
      const result = cdnUrl('')
      expect(result).toBe('')
    })

    it('handles already absolute URLs', () => {
      const { cdnUrl } = useCdn()
      const absoluteUrl = 'https://other-cdn.com/image.png'
      const result = cdnUrl(absoluteUrl)
      expect(result).toBe(absoluteUrl)
    })
  })

  describe('SSR Context Compatibility', () => {
    it('works in SSR context (uses useRuntimeConfig)', () => {
      // This test verifies that the composable can be called
      // in an SSR context without errors
      expect(() => {
        const { cdnUrl } = useCdn()
        cdnUrl('/images/logo.png')
      }).not.toThrow()
    })

    it('returns consistent results', () => {
      const { cdnUrl } = useCdn()
      const path = '/images/logo.png'
      const result1 = cdnUrl(path)
      const result2 = cdnUrl(path)
      expect(result1).toBe(result2)
    })
  })
})
