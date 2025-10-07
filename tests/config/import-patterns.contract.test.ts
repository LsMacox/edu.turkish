import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join, relative } from 'path'

const TEST_ROOT = join(process.cwd(), 'tests')

function listFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) listFiles(full, acc)
    else if (full.endsWith('.ts') || full.endsWith('.vue')) acc.push(full)
  }
  return acc
}

describe('Test Import Patterns Contract (T016)', () => {
  it('uses aliases (~, ~~) and avoids deep relative imports in tests/**', () => {
    const files = listFiles(TEST_ROOT)

    const deprecatedAliasRe = /from\s+['"](@@\/|\^\/|@\/)/
    const deepRelativeRe = /from\s+['"][.]{2}\/[.]{2}\//

    const violations: { file: string; reason: string; line: string }[] = []

    for (const file of files) {
      const content = readFileSync(file, 'utf-8')
      const rel = relative(process.cwd(), file)

      if (deprecatedAliasRe.test(content)) {
        violations.push({
          file: rel,
          reason: 'deprecated alias (@, @@, ^)',
          line: content.match(deprecatedAliasRe)![0],
        })
      }
      if (deepRelativeRe.test(content)) {
        violations.push({
          file: rel,
          reason: 'deep relative import ../../',
          line: content.match(deepRelativeRe)![0],
        })
      }
    }

    if (violations.length) {
      const msg = violations.map((v) => `- ${v.file}: ${v.reason} -> ${v.line}`).join('\n')
      throw new Error(`Import pattern violations found in tests:\n${msg}`)
    }

    expect(violations.length).toBe(0)
  })
})
