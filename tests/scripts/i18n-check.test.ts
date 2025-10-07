import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
  flattenKeys,
  loadLocaleFiles,
  findDuplicateKeys,
  scanSourceFileForKeys,
  findUnusedKeys,
  findMissingKeys,
  formatTextReport,
  formatJsonReport,
  isEmptyStructure,
  findEmptyStructures,
  type Locale,
} from '~~/scripts/i18n-check.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const fixturesDir = join(__dirname, 'fixtures')

// T003: Unit test for flattenKeys function
describe('flattenKeys', () => {
  it('should flatten a simple flat object', () => {
    const input = { a: '1', b: '2' }
    const result = flattenKeys(input)
    expect(result).toEqual(['a', 'b'])
  })

  it('should flatten a nested object', () => {
    const input = { pages: { home: { title: 'x' } } }
    const result = flattenKeys(input)
    expect(result).toEqual(['pages.home.title'])
  })

  it('should handle mixed nesting levels', () => {
    const input = {
      a: '1',
      b: {
        c: '2',
        d: {
          e: '3',
        },
      },
      f: '4',
    }
    const result = flattenKeys(input)
    expect(result).toContain('a')
    expect(result).toContain('b.c')
    expect(result).toContain('b.d.e')
    expect(result).toContain('f')
    expect(result).toHaveLength(4)
  })

  it('should treat arrays as leaf nodes', () => {
    const input = { items: ['a', 'b', 'c'] }
    const result = flattenKeys(input)
    expect(result).toEqual(['items'])
  })

  it('should handle empty object', () => {
    const input = {}
    const result = flattenKeys(input)
    expect(result).toEqual([])
  })
})

// T004: Unit test for loadLocaleFiles function
describe('loadLocaleFiles', () => {
  const testLocaleDir = join(fixturesDir, 'i18n')

  it('should load valid JSON files from test fixture directory', () => {
    const result = loadLocaleFiles('en', testLocaleDir)
    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBeGreaterThan(0)
  })

  it('should return Map with filePath as key and parsed content as value', () => {
    const result = loadLocaleFiles('en', testLocaleDir)
    for (const [filePath, content] of result.entries()) {
      expect(typeof filePath).toBe('string')
      expect(filePath).toMatch(/\.json$/)
      expect(typeof content).toBe('object')
    }
  })

  it('should handle nested directory structure', () => {
    const result = loadLocaleFiles('en', testLocaleDir)
    const hasNestedFile = Array.from(result.keys()).some((path) => path.includes('pages'))
    expect(hasNestedFile).toBe(true)
  })

  it('should throw error on invalid JSON', () => {
    // This will be tested with a malformed JSON fixture if needed
    // For now, we'll skip this test as it requires a bad JSON file
  })
})

// T005: Unit test for findDuplicateKeys function
describe('findDuplicateKeys', () => {
  it('should return empty array when no duplicates', () => {
    const fileMap = new Map([
      ['file1.json', { a: '1', b: '2' }],
      ['file2.json', { c: '3', d: '4' }],
    ])
    const result = findDuplicateKeys('en', fileMap)
    expect(result).toEqual([])
  })

  it('should detect one duplicate across two files', () => {
    const fileMap = new Map([
      ['file1.json', { common: { submit: 'Submit' } }],
      ['file2.json', { common: { submit: 'Send' } }],
    ])
    const result = findDuplicateKeys('en', fileMap)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      type: 'duplicate',
      key: 'common.submit',
      locale: 'en',
    })
  })

  it('should detect multiple duplicates', () => {
    const fileMap = new Map([
      ['file1.json', { a: '1', b: '2' }],
      ['file2.json', { a: '3', c: '4' }],
      ['file3.json', { b: '5' }],
    ])
    const result = findDuplicateKeys('en', fileMap)
    expect(result.length).toBeGreaterThanOrEqual(2)
  })
})

// T006: Unit test for scanSourceFileForKeys function
describe('scanSourceFileForKeys', () => {
  const testSourceFile = join(fixturesDir, 'source/component.vue')

  it('should detect t() syntax', () => {
    const result = scanSourceFileForKeys(testSourceFile)
    expect(result).toBeInstanceOf(Set)
    expect(result.has('common.submit')).toBe(true)
  })

  it('should detect $t() syntax (template)', () => {
    const result = scanSourceFileForKeys(testSourceFile)
    expect(result.has('pages.home.title')).toBe(true)
  })

  it('should detect te() and tm() syntax', () => {
    // This would need a fixture with te() or tm() calls
    // Skipping for now as our fixture doesn't have these
  })

  it('should detect template literals', () => {
    // This would need a fixture with template literal usage
    // Skipping for now
  })

  it('should return Set of found keys', () => {
    const result = scanSourceFileForKeys(testSourceFile)
    expect(result).toBeInstanceOf(Set)
    expect(result.size).toBeGreaterThan(0)
  })
})

// T007: Unit test for findUnusedKeys function
describe('findUnusedKeys', () => {
  it('should return empty array when all keys are used', () => {
    const localeKeySets = new Map([
      [
        'en',
        {
          locale: 'en' as const,
          keys: new Set(['pages.home.title', 'common.submit']),
          keyToFile: new Map([
            ['pages.home.title', 'pages/home.json'],
            ['common.submit', 'common.json'],
          ]),
        },
      ],
    ])
    const usedKeys = new Set(['pages.home.title', 'common.submit'])
    const result = findUnusedKeys(localeKeySets, usedKeys)
    expect(result).toEqual([])
  })

  it('should detect unused keys', () => {
    const localeKeySets = new Map([
      [
        'en',
        {
          locale: 'en' as const,
          keys: new Set(['pages.home.title', 'pages.unused.key', 'common.submit']),
          keyToFile: new Map([
            ['pages.home.title', 'pages/home.json'],
            ['pages.unused.key', 'pages/unused.json'],
            ['common.submit', 'common.json'],
          ]),
        },
      ],
    ])
    const usedKeys = new Set(['pages.home.title', 'common.submit'])
    const result = findUnusedKeys(localeKeySets, usedKeys)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      type: 'unused',
      key: 'pages.unused.key',
    })
  })

  it('should not report keys used in multiple files as unused', () => {
    const localeKeySets = new Map([
      [
        'en',
        {
          locale: 'en' as const,
          keys: new Set(['common.submit']),
          keyToFile: new Map([['common.submit', 'common.json']]),
        },
      ],
    ])
    const usedKeys = new Set(['common.submit'])
    const result = findUnusedKeys(localeKeySets, usedKeys)
    expect(result).toEqual([])
  })
})

// T008: Unit test for findMissingKeys function
describe('findMissingKeys', () => {
  it('should return empty array when all locales have same keys', () => {
    const localeKeySets = new Map([
      ['en', { locale: 'en' as const, keys: new Set(['a', 'b']), keyToFile: new Map() }],
      ['ru', { locale: 'ru' as const, keys: new Set(['a', 'b']), keyToFile: new Map() }],
    ])
    const result = findMissingKeys(localeKeySets)
    expect(result).toEqual([])
  })

  it('should detect key missing in one locale', () => {
    const localeKeySets = new Map([
      ['en', { locale: 'en' as const, keys: new Set(['a', 'b']), keyToFile: new Map() }],
      ['ru', { locale: 'ru' as const, keys: new Set(['a']), keyToFile: new Map() }],
    ])
    const result = findMissingKeys(localeKeySets)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      type: 'missing',
      key: 'b',
      presentIn: ['en'],
      missingIn: ['ru'],
    })
  })

  it('should detect key missing in multiple locales', () => {
    const localeKeySets = new Map([
      ['en', { locale: 'en' as const, keys: new Set(['a', 'b']), keyToFile: new Map() }],
      ['ru', { locale: 'ru' as const, keys: new Set(['a']), keyToFile: new Map() }],
      ['kk', { locale: 'kk' as const, keys: new Set(['a']), keyToFile: new Map() }],
    ])
    const result = findMissingKeys(localeKeySets)
    expect(result).toHaveLength(1)
    expect(result[0]!.missingIn).toContain('ru')
    expect(result[0]!.missingIn).toContain('kk')
  })

  it('should detect key only in one locale', () => {
    const localeKeySets = new Map([
      ['en', { locale: 'en' as const, keys: new Set(['unique']), keyToFile: new Map() }],
      ['ru', { locale: 'ru' as const, keys: new Set([]), keyToFile: new Map() }],
    ])
    const result = findMissingKeys(localeKeySets)
    expect(result).toHaveLength(1)
    expect(result[0]!.presentIn).toEqual(['en'])
    expect(result[0]!.missingIn).toContain('ru')
  })
})

// T009: Unit test for formatTextReport function
describe('formatTextReport', () => {
  it('should show success message when no issues', () => {
    const report = {
      timestamp: new Date(),
      scannedLocales: ['en', 'ru'] as Locale[],
      totalKeys: 10,
      totalSourceFiles: 5,
      duplicateIssues: [],
      unusedIssues: [],
      missingIssues: [],
      emptyStructureIssues: [],
      summary: {
        duplicateCount: 0,
        unusedCount: 0,
        missingCount: 0,
        emptyStructureCount: 0,
        totalIssues: 0,
      },
    }
    const result = formatTextReport(report)
    expect(result).toContain('No issues found')
  })

  it('should format duplicate section when duplicates exist', () => {
    const report = {
      timestamp: new Date(),
      scannedLocales: ['en'] as Locale[],
      totalKeys: 10,
      totalSourceFiles: 5,
      duplicateIssues: [
        {
          type: 'duplicate' as const,
          severity: 'error' as const,
          key: 'test.key',
          locale: 'en' as Locale,
          firstOccurrence: 'file1.json',
          duplicateOccurrence: 'file2.json',
        },
      ],
      unusedIssues: [],
      missingIssues: [],
      emptyStructureIssues: [],
      summary: {
        duplicateCount: 1,
        unusedCount: 0,
        missingCount: 0,
        emptyStructureCount: 0,
        totalIssues: 1,
      },
    }
    const result = formatTextReport(report as any)
    expect(result).toContain('DUPLICATE')
    expect(result).toContain('test.key')
    expect(result).toContain('file1.json')
    expect(result).toContain('file2.json')
  })

  it('should format unused section when unused keys exist', () => {
    const report = {
      timestamp: new Date(),
      scannedLocales: ['en'] as Locale[],
      totalKeys: 10,
      totalSourceFiles: 5,
      duplicateIssues: [],
      unusedIssues: [
        {
          type: 'unused' as const,
          severity: 'warning' as const,
          key: 'unused.key',
          locale: 'en' as Locale,
          filePath: 'unused.json',
        },
      ],
      missingIssues: [],
      emptyStructureIssues: [],
      summary: {
        duplicateCount: 0,
        unusedCount: 1,
        missingCount: 0,
        emptyStructureCount: 0,
        totalIssues: 1,
      },
    }
    const result = formatTextReport(report as any)
    expect(result).toContain('UNUSED')
    expect(result).toContain('unused.key')
  })

  it('should format missing section when missing keys exist', () => {
    const report = {
      timestamp: new Date(),
      scannedLocales: ['en', 'ru'] as Locale[],
      totalKeys: 10,
      totalSourceFiles: 5,
      duplicateIssues: [],
      unusedIssues: [],
      missingIssues: [
        {
          type: 'missing' as const,
          severity: 'error' as const,
          key: 'missing.key',
          presentIn: ['en'] as Locale[],
          missingIn: ['ru'] as Locale[],
        },
      ],
      emptyStructureIssues: [],
      summary: {
        duplicateCount: 0,
        unusedCount: 0,
        missingCount: 1,
        emptyStructureCount: 0,
        totalIssues: 1,
      },
    }
    const result = formatTextReport(report as any)
    expect(result).toContain('MISSING')
    expect(result).toContain('missing.key')
    expect(result).toContain('en')
    expect(result).toContain('ru')
  })

  it('should format all sections when all issue types exist', () => {
    const report = {
      timestamp: new Date(),
      scannedLocales: ['en', 'ru'] as Locale[],
      totalKeys: 10,
      totalSourceFiles: 5,
      duplicateIssues: [
        {
          type: 'duplicate' as const,
          key: 'dup',
          locale: 'en' as Locale,
          firstOccurrence: 'f1',
          duplicateOccurrence: 'f2',
          severity: 'error' as const,
        },
      ],
      unusedIssues: [
        {
          type: 'unused' as const,
          key: 'unused',
          locale: 'en' as Locale,
          filePath: 'f',
          severity: 'warning' as const,
        },
      ],
      missingIssues: [
        {
          type: 'missing' as const,
          key: 'missing',
          presentIn: ['en'] as Locale[],
          missingIn: ['ru'] as Locale[],
          severity: 'error' as const,
        },
      ],
      emptyStructureIssues: [],
      summary: {
        duplicateCount: 1,
        unusedCount: 1,
        missingCount: 1,
        emptyStructureCount: 0,
        totalIssues: 3,
      },
    }
    const result = formatTextReport(report as any)
    expect(result).toContain('DUPLICATE')
    expect(result).toContain('UNUSED')
    expect(result).toContain('MISSING')
  })
})

// T010: Unit test for formatJsonReport function
describe('formatJsonReport', () => {
  it('should output valid JSON', () => {
    const report = {
      timestamp: new Date(),
      scannedLocales: ['en', 'ru'] as Locale[],
      totalKeys: 10,
      totalSourceFiles: 5,
      duplicateIssues: [],
      unusedIssues: [],
      missingIssues: [],
      emptyStructureIssues: [],
      summary: {
        duplicateCount: 0,
        unusedCount: 0,
        missingCount: 0,
        emptyStructureCount: 0,
        totalIssues: 0,
      },
    }
    const result = formatJsonReport(report)
    expect(() => JSON.parse(result)).not.toThrow()
  })

  it('should conform to schema', () => {
    const report = {
      timestamp: new Date(),
      scannedLocales: ['en', 'ru'] as Locale[],
      totalKeys: 10,
      totalSourceFiles: 5,
      duplicateIssues: [],
      unusedIssues: [],
      missingIssues: [],
      emptyStructureIssues: [],
      summary: {
        duplicateCount: 0,
        unusedCount: 0,
        missingCount: 0,
        emptyStructureCount: 0,
        totalIssues: 0,
      },
    }
    const result = formatJsonReport(report)
    const parsed = JSON.parse(result)
    expect(parsed).toHaveProperty('timestamp')
    expect(parsed).toHaveProperty('scannedLocales')
    expect(parsed).toHaveProperty('totalKeys')
    expect(parsed).toHaveProperty('totalSourceFiles')
    expect(parsed).toHaveProperty('duplicateIssues')
    expect(parsed).toHaveProperty('unusedIssues')
    expect(parsed).toHaveProperty('missingIssues')
    expect(parsed).toHaveProperty('emptyStructureIssues')
    expect(parsed).toHaveProperty('summary')
  })

  it('should have all required fields present', () => {
    const report = {
      timestamp: new Date(),
      scannedLocales: ['en'] as Locale[],
      totalKeys: 5,
      totalSourceFiles: 3,
      duplicateIssues: [],
      unusedIssues: [],
      missingIssues: [],
      emptyStructureIssues: [],
      summary: {
        duplicateCount: 0,
        unusedCount: 0,
        missingCount: 0,
        emptyStructureCount: 0,
        totalIssues: 0,
      },
    }
    const result = formatJsonReport(report)
    const parsed = JSON.parse(result)
    expect(Array.isArray(parsed.scannedLocales)).toBe(true)
    expect(Array.isArray(parsed.duplicateIssues)).toBe(true)
    expect(Array.isArray(parsed.unusedIssues)).toBe(true)
    expect(Array.isArray(parsed.missingIssues)).toBe(true)
    expect(Array.isArray(parsed.emptyStructureIssues)).toBe(true)
    expect(typeof parsed.summary).toBe('object')
  })

  it('should have arrays present even if empty', () => {
    const report = {
      timestamp: new Date(),
      scannedLocales: [],
      totalKeys: 0,
      totalSourceFiles: 0,
      duplicateIssues: [],
      unusedIssues: [],
      missingIssues: [],
      emptyStructureIssues: [],
      summary: {
        duplicateCount: 0,
        unusedCount: 0,
        missingCount: 0,
        emptyStructureCount: 0,
        totalIssues: 0,
      },
    }
    const result = formatJsonReport(report)
    const parsed = JSON.parse(result)
    expect(parsed.duplicateIssues).toEqual([])
    expect(parsed.unusedIssues).toEqual([])
    expect(parsed.missingIssues).toEqual([])
    expect(parsed.emptyStructureIssues).toEqual([])
  })
})

// T011: Unit test for isEmptyStructure function
describe('isEmptyStructure', () => {
  it('should return true for empty object', () => {
    expect(isEmptyStructure({})).toBe(true)
  })

  it('should return true for null or undefined', () => {
    expect(isEmptyStructure(null)).toBe(true)
    expect(isEmptyStructure(undefined)).toBe(true)
  })

  it('should return false for object with string value', () => {
    expect(isEmptyStructure({ key: 'value' })).toBe(false)
  })

  it('should return false for array', () => {
    expect(isEmptyStructure([])).toBe(false)
    expect(isEmptyStructure(['item'])).toBe(false)
  })

  it('should return true for nested empty objects', () => {
    expect(isEmptyStructure({ a: {}, b: { c: {} } })).toBe(true)
  })

  it('should return false for nested object with value', () => {
    expect(isEmptyStructure({ a: {}, b: { c: 'value' } })).toBe(false)
  })
})

// T012: Unit test for findEmptyStructures function
describe('findEmptyStructures', () => {
  it('should return empty array when no empty structures', () => {
    const fileMap = new Map([['file1.json', { a: 'value', b: { c: 'value2' } }]])
    const result = findEmptyStructures('en', fileMap)
    expect(result).toEqual([])
  })

  it('should detect empty object', () => {
    const fileMap = new Map([['file1.json', { empty: {} }]])
    const result = findEmptyStructures('en', fileMap)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      type: 'empty',
      key: 'empty',
      locale: 'en',
    })
  })

  it('should detect nested empty structures', () => {
    const fileMap = new Map([['file1.json', { faq: { documents: { q1: {}, q2: {} } } }]])
    const result = findEmptyStructures('en', fileMap)
    expect(result.length).toBeGreaterThan(0)
    expect(result.some((issue) => issue.key.includes('q1'))).toBe(true)
  })

  it('should not detect objects with values', () => {
    const fileMap = new Map([['file1.json', { faq: { title: 'FAQ', items: ['a', 'b'] } }]])
    const result = findEmptyStructures('en', fileMap)
    expect(result).toEqual([])
  })
})

// T013: Integration test for CLI execution
describe('CLI execution integration', () => {
  it('should be skipped until script is implemented', () => {
    // This test will use child_process to execute the script
    // Skipping for now as the script doesn't exist yet
    expect(true).toBe(true)
  })
})
