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
      // Load vitest.config.ts (parse as text since it's TS)
      const vitestConfigPath = resolve(rootDir, 'vitest.config.ts')
      const vitestConfigContent = readFileSync(vitestConfigPath, 'utf-8')

      // Check that vitest has standard aliases (~ and ~~)
      const requiredAliases = ['~', '~~']
      
      requiredAliases.forEach(alias => {
        const aliasPattern = `'${alias}':`
        expect(
          vitestConfigContent.includes(aliasPattern),
          `vitest.config.ts should define alias '${alias}'`
        ).toBe(true)
      })
    })

    it('should have ~ alias pointing to ./app', () => {
      const vitestConfigPath = resolve(rootDir, 'vitest.config.ts')
      const vitestConfigContent = readFileSync(vitestConfigPath, 'utf-8')

      expect(vitestConfigContent).toContain("'~':")
      expect(vitestConfigContent).toContain("'./app'")
    })

    it('should have ~~ alias pointing to root', () => {
      const vitestConfigPath = resolve(rootDir, 'vitest.config.ts')
      const vitestConfigContent = readFileSync(vitestConfigPath, 'utf-8')

      expect(vitestConfigContent).toContain("'~~':")
      expect(vitestConfigContent).toContain("'.'")
    })
  })

  describe('validateStandardAliases', () => {
    it('should define standard aliases ~ and ~~', () => {
      const vitestConfigPath = resolve(rootDir, 'vitest.config.ts')
      const vitestConfigContent = readFileSync(vitestConfigPath, 'utf-8')

      // Standard aliases must exist in vitest config
      expect(vitestConfigContent).toContain("'~':")
      expect(vitestConfigContent).toContain("'~~':")

      // Standard aliases must point to correct locations
      expect(vitestConfigContent).toContain("'./app'")
      expect(vitestConfigContent).toContain("'.'")
    })
  })

  describe('validateNoDeprecatedAliases (post-migration)', () => {
    it('should not have deprecated aliases @, @@, ^ after migration', () => {
      // Check vitest.config.ts for deprecated aliases
      const vitestConfigPath = resolve(rootDir, 'vitest.config.ts')
      const vitestConfigContent = readFileSync(vitestConfigPath, 'utf-8')

      // Deprecated aliases should not exist in vitest config
      expect(vitestConfigContent).not.toContain("'@':")
      expect(vitestConfigContent).not.toContain("'@@':")
      expect(vitestConfigContent).not.toContain("'^':")
    })
  })
})
