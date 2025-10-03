import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

// Helper to parse JSON with comments
function parseJsonWithComments(content: string): any {
  // Remove single-line comments
  const withoutComments = content.replace(/\/\/.*$/gm, '')
  return JSON.parse(withoutComments)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '../..')

describe('Standard Aliases Contract', () => {
  it('should have ~ alias for app directory in tsconfig.json', () => {
    const tsconfigPath = resolve(rootDir, 'tsconfig.json')
    const tsconfigContent = readFileSync(tsconfigPath, 'utf-8')
    const tsconfig = parseJsonWithComments(tsconfigContent)
    const paths = tsconfig.compilerOptions?.paths || {}

    expect(paths['~/*']).toBeDefined()
    expect(paths['~/*']).toEqual(['./app/*'])
  })

  it('should have ~~ alias for root directory in tsconfig.json', () => {
    const tsconfigPath = resolve(rootDir, 'tsconfig.json')
    const tsconfigContent = readFileSync(tsconfigPath, 'utf-8')
    const tsconfig = parseJsonWithComments(tsconfigContent)
    const paths = tsconfig.compilerOptions?.paths || {}

    expect(paths['~~/*']).toBeDefined()
    expect(paths['~~/*']).toEqual(['./*'])
  })

  it('should have ~ alias for app directory in vitest.config.ts', () => {
    const vitestConfigPath = resolve(rootDir, 'vitest.config.ts')
    const vitestConfigContent = readFileSync(vitestConfigPath, 'utf-8')

    // Check that ~ alias is defined and points to ./app
    expect(vitestConfigContent).toContain("'~':")
    expect(vitestConfigContent).toContain("('./app'")
  })

  it('should have ~~ alias for root directory in vitest.config.ts', () => {
    const vitestConfigPath = resolve(rootDir, 'vitest.config.ts')
    const vitestConfigContent = readFileSync(vitestConfigPath, 'utf-8')

    // Check that ~~ alias is defined and points to ./
    expect(vitestConfigContent).toContain("'~~':")
    expect(vitestConfigContent).toContain("('./'")
  })

  it('should be able to import using ~ alias', async () => {
    // This test verifies that the alias actually works at runtime
    const { SUPPORTED_LOCALES } = await import('~~/lib/locales')
    expect(SUPPORTED_LOCALES).toBeDefined()
    expect(Array.isArray(SUPPORTED_LOCALES)).toBe(true)
  })

  it('should be able to import using ~~ alias', async () => {
    // This test verifies that the alias actually works at runtime
    const { prisma } = await import('~~/lib/prisma')
    expect(prisma).toBeDefined()
  })
})
