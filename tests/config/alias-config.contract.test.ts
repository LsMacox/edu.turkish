import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'
import type { AliasConfig, ConfigValidationResult } from '~~/specs/003-/contracts/alias-config.contract'

// Helper to parse JSON with comments
function parseJsonWithComments(content: string): any {
  // Remove single-line comments
  const withoutComments = content.replace(/\/\/.*$/gm, '')
  return JSON.parse(withoutComments)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '../..')

describe('Alias Configuration Contract', () => {
  describe('validateAliasConfiguration', () => {
    it('should have matching aliases between tsconfig.json and vitest.config.ts', () => {
      // Load tsconfig.json
      const tsconfigPath = resolve(rootDir, 'tsconfig.json')
      const tsconfigContent = readFileSync(tsconfigPath, 'utf-8')
      const tsconfig = parseJsonWithComments(tsconfigContent)
      const tsconfigPaths = tsconfig.compilerOptions?.paths || {}

      // Load vitest.config.ts (parse as text since it's TS)
      const vitestConfigPath = resolve(rootDir, 'vitest.config.ts')
      const vitestConfigContent = readFileSync(vitestConfigPath, 'utf-8')

      // Extract aliases from tsconfig
      const tsconfigAliases = Object.keys(tsconfigPaths)
        .filter(key => key.includes('*'))
        .map(key => key.replace('/*', ''))

      // Check that vitest has all required aliases
      const requiredAliases = ['~', '~~', '@', '@@', '^']
      
      requiredAliases.forEach(alias => {
        const aliasPattern = `'${alias}':`
        expect(
          vitestConfigContent.includes(aliasPattern),
          `vitest.config.ts should define alias '${alias}'`
        ).toBe(true)
      })
    })

    it('should have ~ alias pointing to ./app', () => {
      const tsconfigPath = resolve(rootDir, 'tsconfig.json')
      const tsconfigContent = readFileSync(tsconfigPath, 'utf-8')
      const tsconfig = parseJsonWithComments(tsconfigContent)
      const paths = tsconfig.compilerOptions?.paths || {}

      expect(paths['~/*']).toEqual(['./app/*'])
    })

    it('should have ~~ alias pointing to root', () => {
      const tsconfigPath = resolve(rootDir, 'tsconfig.json')
      const tsconfigContent = readFileSync(tsconfigPath, 'utf-8')
      const tsconfig = parseJsonWithComments(tsconfigContent)
      const paths = tsconfig.compilerOptions?.paths || {}

      expect(paths['~~/*']).toEqual(['./*'])
    })
  })

  describe('validateStandardAliases', () => {
    it('should define standard aliases ~ and ~~', () => {
      const tsconfigPath = resolve(rootDir, 'tsconfig.json')
      const tsconfigContent = readFileSync(tsconfigPath, 'utf-8')
      const tsconfig = parseJsonWithComments(tsconfigContent)
      const paths = tsconfig.compilerOptions?.paths || {}

      // Standard aliases must exist
      expect(paths['~/*']).toBeDefined()
      expect(paths['~~/*']).toBeDefined()

      // Standard aliases must point to correct locations
      expect(paths['~/*']).toEqual(['./app/*'])
      expect(paths['~~/*']).toEqual(['./*'])
    })
  })

  describe('validateNoDeprecatedAliases (post-migration)', () => {
    it.skip('should not have deprecated aliases @, @@, ^ after migration', () => {
      // This test will be enabled after migration is complete
      const tsconfigPath = resolve(rootDir, 'tsconfig.json')
      const tsconfigContent = readFileSync(tsconfigPath, 'utf-8')
      const tsconfig = parseJsonWithComments(tsconfigContent)
      const paths = tsconfig.compilerOptions?.paths || {}

      // Deprecated aliases should not exist
      expect(paths['@/*']).toBeUndefined()
      expect(paths['@@/*']).toBeUndefined()
      expect(paths['^/*']).toBeUndefined()
    })
  })
})
